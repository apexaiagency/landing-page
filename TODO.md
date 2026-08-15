# TODO — Off-Site Desktops landing page

Every unknown is listed here with the section it affects and the honest fallback that
ships until it's answered. **Filling any of these is a one-line edit in `content/site.ts`
(or a `.env` value) — never a code change.** That's the architecture test; if a fill ever
needs a component edit, flag it.

---

## Open `[FILL]`s (each renders an honest fallback today)

| # | Section | What we need | How it renders now | Where to fill |
|---|---------|--------------|--------------------|---------------|
| 1 | Hero | **Provisioning time** — real click-to-usable-desktop number, measured not estimated | Hero shows **no number** (silence beats a figure an MSP disproves in the pilot) | `content/site.ts → hero.provisioningTime.fact`: set `known:true`, add `value` |
| 2 | Meta/SEO | **Canonical production domain** | Placeholder `https://www.offsitedesktops.com` used for canonical/OG/sitemap | `content/site.ts → meta.url` |
| 3 | Footer | **Real contact address** | `partners@offsitedesktops.com` placeholder | `content/site.ts → footer.contactEmail` |
| 4 | OG image | **Social share image** at `/public/og.png` (1200×630) | Referenced but file not yet added | drop `public/og.png` |
| 5 | Form → sign-up | **Platform sign-up handoff URL** so nobody re-types | Success state shows copy but no handoff button until set | `.env → NEXT_PUBLIC_SIGNUP_HANDOFF_URL` |
| 6 | Form persistence | **Supabase project URL + service role key + `pilot_leads` table** | Form submits and shows success; record is a dev no-op until configured | `.env → SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (SQL below) |
| 7 | Notifications | **Resend** email on each lead: `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL` (your inbox — a custom address, TBC), `LEAD_FROM_EMAIL` (verified sender) | Skipped silently until set; lead still stored | `.env` (see `DEPLOY.md §3`) |
| 7b | Notifications | Optional **Slack/Teams webhook** (secondary) | Skipped unless set | `.env → LEAD_NOTIFY_WEBHOOK_URL` |
| 8 | Analytics | **Analytics endpoint** | Events no-op cleanly (debug-logged in dev only) | `.env → NEXT_PUBLIC_ANALYTICS_ENDPOINT` |

### v1 FAQ — facts referenced honestly, to confirm/tighten later

These are answered on the page **without inventing numbers** (the copy points to "in the partner
agreement" / "ask and we'll tell you where it stands"). When the real facts exist, tighten the
answer in `content/site.ts → faq.items` — a content edit:

- **Support SLA + escalation** — response-time commitments (FAQ: "What's the support escalation path and SLA?")
- **Contract / minimum commitment** — terms + any minimum (FAQ: "Is there a contract or minimum commitment?")
- **GPU / heavy workloads** — what GPU desktop options ship today (FAQ: "What about GPU or heavy workloads?")

### Deferred to v2 (`[FILL]`s that gate a whole section — sections stay OFF until answered)

These are **defined in the schema and content, toggled `enabled:false`** so the page reads
complete without them. Flip `enabled:true` in `content/site.ts` once the answer is real.

- **Commercial model** — per-seat wholesale? volume tiers? minimum commitment? setup fee?
  billing granularity (per seat / per month, prorated?)? partner margin structure? (`commercialModel`)
- **White-label** — do you white-label, and how far: branding, custom domain, support routing? (`whiteLabel`)
- **Migration** — the real steps + the painful parts of moving a client off WorkSpaces/AVD/Citrix. (`migration`)
- **Security & compliance** — isolation model, data residency, encryption, **SOC 2 status**
  ("Not yet, targeting X" beats silence). (`security`)
- **Proof** — MSP logos, seats under management, a named design partner. If none yet, we build an
  **honest early-partner block**, never fabricated social proof. (`proof`)
- **FAQ** — the pricing answer is written and ready; the rest of the objection set to be drafted
  before flipping on. (`faq`)

---

## Content migration trigger (MDX/Supabase read layer)

Content today is a **typed, zod-validated in-repo object** (`content/site.ts`), read through a
single boundary (`content/index.ts`). Editing copy = edit that file + redeploy; on Vercel a deploy
per edit costs nothing while the site changes weekly.

**Move the read layer to Supabase when edits become more frequent than deploys** — i.e. when a
non-engineer needs to change copy/FAQ/commercial-model wording without a PR. At that point:
replace the body of `getSite()` in `content/index.ts` with a Supabase read returning the **same
shape** — components never change. The zod schema (`content/schema.ts`) becomes the table contract.

---

## Supabase `pilot_leads` table (run when wiring #6)

```sql
create table if not exists pilot_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  msp_name text not null,
  client_seats integer,
  current_platform text not null,
  intent text not null check (intent in ('pilot','pricing')),
  source text,
  user_agent text,
  created_at timestamptz not null default now()
);
-- Inserts use the service role key from the server route only; no public RLS policy needed.
```

---

## Analytics events instrumented (day one)

`page_view`, `hero_view`, `hero_artifact_engage`, `scroll_depth` (per section, wired as sections
come online), `cta_click` (with `position` + `intent`), `form_open`, `form_start`,
`form_field_blur` (captures the seat counts people enter — free market research), `form_submit`,
`form_abandon`. **pilot vs pricing is split via the `intent` prop** on every CTA/form event — so if
pricing requests outrun pilot requests, the data says so.

---

## Decisions made without you (reversible, noted per your instruction)

- **Visual system = dark-first premium (amber accent)**, adapted from the platform's Premium
  Frontend Redesign spec (`docs/superpowers/specs/2026-08-13-premium-frontend-redesign-design.md`).
  Palette + principles taken (not the app screens): near-black surfaces, amber `#f59e0b` used ONLY
  on interactive elements + status-ready dots, 1px hairline borders (no shadows), tight radii,
  restrained motion on one shared `cubic-bezier(.2,.8,.2,1)` curve. Tokens in `tailwind.config.ts`
  + `app/globals.css`. This replaced the earlier light editorial look so the marketing site matches
  the product's new identity. To retune the accent or surfaces later, edit those two token files.
- **Content = typed TS + zod**, not MDX files. The copy is structured data (headlines, CTA labels,
  FAQ arrays, section toggles), which validates and swaps to Supabase more cleanly than MDX. Rich
  prose bodies (migration/security narrative) can carry a markdown string field through the same
  read layer if needed. Migration path above is unchanged.
- **Next.js 14 (App Router) + React 18**, Tailwind 3.4, zod. Stable, well-supported on Vercel.
- **Type system:** Inter (self-hosted, 400–700) for body + display (tight tracking on headings);
  JetBrains Mono for eyebrow labels + control-plane data. Justification in `app/layout.tsx`.
- **Motion:** CSS-only (reveal-on-scroll, hover lift, provisioning step-checklist) — no animation
  library added, keeping the page fully static at ~93 kB First Load JS. All motion is
  `prefers-reduced-motion` aware (`components/reveal.tsx`, `provisioning-checklist.tsx`).
- **In-memory rate limiter** (per-instance). Move to Supabase/Upstash for cross-instance limits when
  traffic warrants; interface is unchanged (`lib/rate-limit.ts`).
