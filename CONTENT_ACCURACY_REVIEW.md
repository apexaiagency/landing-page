> **Superseded — 11 September 2026.**
>
> This review was written on 2026-09-07 against the monorepo. It has been overtaken by two
> documents dated **10 September 2026**: *offsiteLABS Product and Marketing Documentation* v1.0
> and *offsiteLABS Technical Product Documentation* v1.0. Those are now the source of truth for
> every claim on this page.
>
> What changed since this review:
> - **§1 (regions)** is resolved. Four locations — Virginia, Ohio, Oregon and central Canada —
>   shipped on 10 September 2026. The page now states them. The choice is locked at first desktop
>   with no migration path, and that caveat ships with the claim.
> - **§2 (billing)** stands and was already fixed: per-client spend visibility is real, a
>   wholesale-to-partner markup engine is not.
> - **§3 (fleet view)** stands. The provider endpoints have been live since 4 September with no
>   interface at all; a design spec landed 10 September. The `fleet` capability and the hero
>   artifact both stay omitted until those screens ship.
> - **"Not flagged — checked and accurate" is now wrong on its first bullet.** Channel-only
>   positioning is **false**: self-service registration is open in the product, and any provider
>   can disprove the claim in thirty seconds. All three channel-only strings have been removed
>   from the page (see the launch-copy PR).

---

# Content accuracy review — what needs to change

Reviewed against the actual platform (`offsitelabs-AI` monorepo: `CLAUDE.md`, `DECISIONS.md`,
`docs/gtm/complete-feature-register.md` v2.0, and the current `packages/api`/`packages/frontend`
source) on 2026-09-07. The channel-only positioning, per-client account isolation claims, and the
honest "no number until it's measured" restraint all check out — this doc only covers what
doesn't.

---

## 1. Hero artifact — multi-region is shown as live. It isn't.

**Where:** `content/site.ts → hero.artifact.tenants`

**Current:** the control-plane dashboard shows six client tenants running across four regions —
`us-west-2`, `us-east-1`, `ca-central-1`, and `eu-west-2`.

**Reality:** the platform is **single-region (`us-east-1`) only** today. Multi-region support
exists only as an approved design spec (`docs/superpowers/specs/2026-09-05-multi-region-support-design.md`)
— not implemented, not scheduled yet. `eu-west-2` (London) isn't even in that spec's planned
scope, which is 4 North American regions (`us-east-1`/`us-east-2`/`us-west-2`/`ca-central-1`).

**Why it matters:** this is the hero — the first thing every visitor sees — and it depicts a
capability (multi-region) the product doesn't have.

**What needs to change:**
- Set every tenant's `region` to `us-east-1` until multi-region actually ships, **or**
- If the multi-region story is worth foreshadowing, say so explicitly in copy ("multi-region
  coming") rather than implying it's live via the mockup data, **or**
- Drop the `region` column from the artifact entirely until there's more than one real region to
  show.

---

## 2. Capability #4, "Per-client billing, already split" — describes an unbuilt feature.

**Where:** `content/site.ts → controlPlane.capabilities[3]` (key: `billing`)

**Current copy:**
> "Spend is attributed per tenant as it happens. The margin work that ate a week a month is just
> there when it's time to invoice."
> - Spend attributed per client automatically
> - Wholesale rate in, your rate out
> - Invoice-ready without the spreadsheet

**Reality:** what exists is **per-account cost visibility** (a spend/cost API scoped to one
tenant account at a time). A genuine cross-client rollup — consolidating spend across every
client an MSP manages, applying a wholesale-to-partner rate spread, producing something
invoice-ready — is recorded internally as a future idea, not a shipped feature. There is no
markup/margin calculation anywhere in the product today.

**Why it matters:** this is arguably the single most attractive MSP-specific promise on the page
(it's the exact "week a month reconciling by hand" pain point raised in the Problem section), and
it's the one capability that isn't real yet.

**What needs to change — pick one:**
- Rewrite the capability to describe what's actually true today: **per-tenant** spend visibility,
  not a cross-client rollup. E.g. "See exactly what each client's fleet costs, in real time" —
  true, still valuable, not overstated.
- If the full rollup/markup billing engine is close enough to commit to, reframe as a near-term
  roadmap item explicitly labeled as such (e.g. "coming: automatic per-client invoicing"), not as
  shipped.
- Otherwise, turn this capability off (`enabled` gating doesn't currently exist per-capability,
  so this would mean either removing the card or moving it into the `commercialModel` /
  `changelog` sections, which are already defined and toggled off until real).

---

## 3. Hero artifact + Capability #2, "one pane of glass across every client" — no such screen exists yet.

**Where:** `content/site.ts → hero.artifact` (the whole interactive dashboard) and
`controlPlane.capabilities[1]` (key: `fleet`)

**Current copy:**
> "One view of every desktop you run, for every client. See status and act without logging into
> anything downstream."
> - All tenants, all seats, one pane of glass
> - Live status: running, idle, needs attention
> - Act on a fleet without per-account logins

**Reality:** the MSP capability (multiple isolated client accounts under one login) shipped this
week, but it is **backend-only** — an API that lets one login switch between client accounts.
There is no MSP-facing frontend screen yet that shows "all tenants, all seats" in one view. That
UI is explicitly the next item on the roadmap, not built.

**Why it matters:** the hero's entire visual centerpiece — the interactive six-tenant dashboard —
is a mockup of a screen a partner cannot actually log in and see today. It's the platform's most
prominent single visual claim.

**What needs to change:**
- Reframe the hero artifact and this capability as a preview/vision of what's coming, not a
  depiction of the current product — or hold both back until the MSP frontend actually ships.
- Alternative: keep the artifact but adjust the surrounding copy so it's unambiguous this is a
  concept view ("here's what your fleet view will look like"), not "here's the product today."
  (Note: the code comment above `tenants` already disclaims these aren't real *customers* — it
  does not disclaim that the *screen itself* doesn't exist yet, which is the actual issue.)

---

## Not flagged — checked and accurate

- Channel-only positioning ("sold only through MSPs," no direct sales motion) — matches the
  actual go-to-market decision.
- Per-client tenant isolation (separate account, directory, network, encryption keys) — matches
  the real account-per-customer architecture.
- "Provisioning without the runbook" / one-action tenant creation — the actual API is genuinely a
  single call; underlying AWS provisioning time varies but the claim is about the interface, not
  a speed number (and the page correctly shows no speed number until one is measured).
- No public pricing shown, no fabricated proof/logos — consistent with what's actually available
  today.

---

## Suggested order of fixes

1. Hero region data (5-minute fix, highest visibility).
2. Billing capability copy (rewrite to per-tenant visibility, or gate behind a "coming" label).
3. Fleet-management framing (hero artifact + capability #2) — needs a decision on tone (preview
   vs. hide) before editing, since it affects the page's biggest visual element.
