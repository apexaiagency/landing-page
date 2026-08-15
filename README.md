# Off-Site Desktops — landing page

Public marketing site for **Off-Site Desktops**: a multi-tenant control plane for cloud
desktops, sold **exclusively through MSPs**. One audience, one page, one CTA — provision a
pilot tenant.

This app is fully self-contained and does **not** touch the rest of the `offsitelabs-AI`
monorepo (it lives outside the `packages/*` npm workspace and has its own dependencies).

## Stack

- Next.js 14 (App Router), TypeScript strict, Tailwind CSS
- Zod-validated content layer (`content/`) — all copy is editable without a code change
- Supabase for form capture (optional in dev; see `.env.example`)
- Deploys on Vercel

## Develop

```bash
cd landing-page
npm install
cp .env.example .env.local   # fill in what you have; nothing here blocks local dev
npm run dev                  # http://localhost:3000
```

Nothing is required in `.env.local` to run locally — the form falls back to a no-op
success and analytics no-op cleanly. See `.env.example` for what each variable unlocks.

## Verify

```bash
npm run typecheck
npm run lint
npm run build
```

## Editing content

All user-facing copy lives in `content/site.ts`, typed and validated by
`content/schema.ts`. A bad edit fails the build loudly instead of shipping an empty
section or a wrong claim. To turn a section on, set its `enabled: true`.

See **`TODO.md`** for every open blank, its honest fallback, and the content-migration
trigger.

## Visual system

Dark-first premium identity adapted from the platform's Premium Frontend Redesign spec:
near-black surfaces, a single amber accent used **only** on interactive elements and
status-ready dots, 1px hairline borders, tight radii, restrained motion on one shared
easing curve. Tokens live in `tailwind.config.ts` + `app/globals.css`.

## What's built (v1)

- **Hero** — positioning, subhead, channel-only trust line, dual CTAs, interactive
  control-plane artifact, provisioning-number slot (hidden until it's a measured fact)
- **Problem** — three MSP blocks (multi-tenancy, provisioning, billing)
- **Control plane in depth** — tenant isolation, fleet management, provisioning, per-client
  billing, each with a bespoke mini-UI (incl. the animated provisioning step-checklist)
- **FAQ** — the full MSP objection set, opening with "why isn't pricing here"
- **Conversion mechanic** — four-field lead form (pilot + partner-pricing intents),
  honeypot + server-side rate limiting, Supabase-ready persistence, clean sign-up handoff
- Repeated CTAs (hero, control-plane, footer), real footer
- SEO (metadata, OG, JSON-LD, sitemap, robots), full analytics instrumentation, a11y baseline

Sections still **defined and toggled off** (flip `enabled:true` in `content/site.ts` when
real): commercial model, white-label, migration, security, proof, pricing request, changelog.
