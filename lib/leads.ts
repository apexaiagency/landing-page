import "server-only";

/**
 * Lead persistence. Today: Supabase REST insert if configured, else a dev no-op that
 * still returns success so local work isn't blocked (brief: "unknowns don't block").
 *
 * Swap boundary: this is the ONLY module that knows where leads go. Point it at a
 * different store without touching the API route or the form.
 */

export type Lead = {
  email: string;
  mspName: string;
  clientSeats: number | null;
  currentPlatform: string;
  intent: "pilot" | "pricing";
  source: string;
  userAgent: string | null;
  createdAt: string;
};

export type PersistResult =
  | { ok: true; id: string; persisted: boolean }
  | { ok: false; error: string };

export async function persistLead(lead: Lead): Promise<PersistResult> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Not configured (local/dev): don't block. Return a synthetic id, mark not persisted.
  if (!url || !key) {
    return { ok: true, id: `dev-${Date.now()}`, persisted: false };
  }

  try {
    // Supabase REST insert. Table `pilot_leads` — see TODO.md for the migration SQL.
    const res = await fetch(`${url}/rest/v1/pilot_leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        email: lead.email,
        msp_name: lead.mspName,
        client_seats: lead.clientSeats,
        current_platform: lead.currentPlatform,
        intent: lead.intent,
        source: lead.source,
        user_agent: lead.userAgent,
        created_at: lead.createdAt,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `supabase ${res.status}: ${text.slice(0, 200)}` };
    }

    const rows = (await res.json()) as Array<{ id?: string | number }>;
    const id = rows[0]?.id != null ? String(rows[0].id) : `row-${Date.now()}`;
    return { ok: true, id, persisted: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

/**
 * Fire-and-forget founder notification. Never blocks or fails the submission.
 * Sends an email via Resend (if configured) and/or posts to a webhook (if configured).
 * Both are optional and independent — the lead is already persisted before this runs.
 */
export async function notifyNewLead(lead: Lead, id: string): Promise<void> {
  await Promise.allSettled([emailLead(lead, id), webhookLead(lead, id)]);
}

const PLATFORM_LABELS: Record<string, string> = {
  workspaces: "AWS WorkSpaces",
  avd: "Azure Virtual Desktop",
  citrix: "Citrix",
  physical: "Physical machines",
  other: "Something else",
};

/** Email the lead via Resend's REST API — no SDK dependency, just fetch. */
async function emailLead(lead: Lead, id: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!apiKey || !to || !from) return;

  const platform = PLATFORM_LABELS[lead.currentPlatform] ?? lead.currentPlatform;
  const kind = lead.intent === "pricing" ? "Partner pricing request" : "Pilot tenant request";
  const seats = lead.clientSeats ?? "not given";

  const subject = `${kind} — ${lead.mspName} (${seats} seats)`;
  const text = [
    kind,
    "",
    `MSP:            ${lead.mspName}`,
    `Work email:     ${lead.email}`,
    `Client seats:   ${seats}`,
    `Runs today:     ${platform}`,
    `From:           ${lead.source}`,
    `Lead id:        ${id}`,
    `Received:       ${lead.createdAt}`,
  ].join("\n");

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email, // reply goes straight to the MSP
        subject,
        text,
      }),
    });
  } catch {
    // Best-effort by design.
  }
}

/** Optional secondary notification (Slack/Teams/Make/Zapier incoming webhook). */
async function webhookLead(lead: Lead, id: string): Promise<void> {
  const hook = process.env.LEAD_NOTIFY_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `New ${lead.intent} lead — ${lead.mspName} (${lead.email}), ~${
          lead.clientSeats ?? "?"
        } seats on ${lead.currentPlatform}. id=${id}`,
      }),
    });
  } catch {
    // Best-effort by design.
  }
}
