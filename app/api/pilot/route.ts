import { NextResponse } from "next/server";
import { z } from "zod";
import { getSite } from "@/content";
import { checkRateLimit, clientKeyFromHeaders } from "@/lib/rate-limit";
import { persistLead, notifyNewLead, type Lead } from "@/lib/leads";

export const runtime = "nodejs";

const site = getSite();
const HONEYPOT = site.form.honeypotField;

const BodySchema = z
  .object({
    intent: z.enum(["pilot", "pricing"]),
    position: z.string().max(64).optional().default("unknown"),
    email: z.string().email().max(320),
    mspName: z.string().min(1).max(200),
    clientSeats: z.string().max(12).optional().default(""),
    currentPlatform: z.enum(["workspaces", "avd", "citrix", "physical", "other"]),
    // honeypot is validated dynamically below
  })
  .passthrough();

export async function POST(req: Request) {
  // 1) Rate limit (server-side, no CAPTCHA in front of the primary conversion).
  const key = clientKeyFromHeaders(req.headers);
  const rl = checkRateLimit(key);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Give it a moment and try again." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  // 2) Parse JSON.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // 3) Honeypot: if the hidden field is filled, silently accept (200) so bots get no
  //    signal, but drop the record.
  const honeypotValue = (raw as Record<string, unknown>)?.[HONEYPOT];
  if (typeof honeypotValue === "string" && honeypotValue.trim() !== "") {
    return NextResponse.json({ ok: true, handoffUrl: null });
  }

  // 4) Validate the real payload.
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 422 }
    );
  }
  const data = parsed.data;

  const seatsNum = data.clientSeats.trim() === "" ? null : Number(data.clientSeats);
  const clientSeats =
    seatsNum != null && Number.isFinite(seatsNum) && seatsNum >= 0 ? Math.floor(seatsNum) : null;

  const lead: Lead = {
    email: data.email.trim(),
    mspName: data.mspName.trim(),
    clientSeats,
    currentPlatform: data.currentPlatform,
    intent: data.intent,
    source: data.position,
    userAgent: req.headers.get("user-agent"),
    createdAt: new Date().toISOString(),
  };

  // 5) Persist (Supabase if configured; dev no-op otherwise — never blocks).
  const result = await persistLead(lead);
  if (!result.ok) {
    return NextResponse.json(
      { error: "We couldn't save that just now. Try again in a moment." },
      { status: 502 }
    );
  }

  // 6) Notify (best-effort, non-blocking).
  void notifyNewLead(lead, result.id);

  // 7) Hand off cleanly to the platform sign-up with the lead id so nothing is re-typed.
  const base = process.env.NEXT_PUBLIC_SIGNUP_HANDOFF_URL;
  const handoffUrl = base
    ? `${base}${base.includes("?") ? "&" : "?"}lead=${encodeURIComponent(result.id)}&intent=${lead.intent}`
    : null;

  return NextResponse.json({ ok: true, id: result.id, handoffUrl });
}
