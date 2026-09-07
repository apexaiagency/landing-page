import type { Site } from "./schema";

/**
 * ALL user-facing copy for the site. Edit here; nothing lives in components.
 *
 * Conventions:
 *  - `[FILL]` facts use `known:false` + an honest `fallback`. See TODO.md for the list.
 *  - Flip a section on by setting `enabled: true` once it has real substance.
 *  - The control-plane `tenants` below are a REPRESENTATIVE product view (what the UI
 *    looks like), not a claim of real customers. Proof/logos live in their own section
 *    and stay off until they are real.
 */
export const site: Site = {
  meta: {
    // [FILL] canonical production domain — see TODO.md
    title: "Off-Site Desktops — cloud desktops, managed by you, sold only through you",
    description:
      "The multi-tenant control plane for cloud desktops. MSPs provision, manage, and bill desktop fleets across every client from one pane of glass. Channel-only — we never sell direct.",
    url: "https://www.offsitedesktops.com",
    ogImage: "/og.png",
    keywords: [
      "cloud desktops for MSPs",
      "multi-tenant WorkSpaces",
      "managed cloud desktop platform",
      "MSP desktop provisioning",
      "channel-only cloud desktops",
    ],
  },

  brand: {
    name: "Off-Site Desktops",
    channelLine:
      "We sell only through MSPs. We never sell direct, and we never compete with you for your clients.",
  },

  ctas: {
    pilot: { label: "Provision a pilot tenant", intent: "pilot", href: "#pilot" },
    pricing: { label: "Get partner pricing", intent: "pricing", href: "#pricing" },
  },

  hero: {
    enabled: true,
    eyebrow: "Cloud desktops for managed service providers",
    headline: "One control plane for every client's desktop fleet.",
    subhead:
      "Off-Site Desktops is the multi-tenant layer above AWS WorkSpaces. Provision, manage, and bill desktops across all of your clients from one pane of glass — instead of building that layer yourself and maintaining it forever.",
    provisioningTime: {
      // [FILL] real click-to-usable-desktop time. Until it's genuinely fast and
      // measured, known stays false and the hero shows NO number (silence beats a
      // figure an MSP disproves during the pilot). Flip known:true + set value to ship it.
      fact: {
        known: false,
        fallback: "Provisioning time shown here once it's measured, not estimated.",
      },
      caption: "from click to a usable desktop",
    },
    // artifact intentionally omitted: the "all tenants, one screen" MSP view it depicts
    // doesn't exist yet (the MSP capability shipped this week is backend-only — an API to
    // switch client accounts, no frontend fleet view). Re-add once that screen is real.
  },

  form: {
    honeypotField: "company_website",
    fields: [
      {
        name: "email",
        label: "Work email",
        type: "email",
        placeholder: "you@yourmsp.com",
        required: true,
      },
      {
        name: "mspName",
        label: "MSP name",
        type: "text",
        placeholder: "Your company",
        required: true,
      },
      {
        name: "clientSeats",
        label: "Client seats you manage today",
        type: "number",
        placeholder: "e.g. 250",
        required: true,
        helper: "Rough is fine — desktops across all your clients.",
      },
      {
        name: "currentPlatform",
        label: "What you run today",
        type: "select",
        required: true,
        options: [
          { value: "workspaces", label: "AWS WorkSpaces" },
          { value: "avd", label: "Azure Virtual Desktop" },
          { value: "citrix", label: "Citrix" },
          { value: "physical", label: "Physical machines" },
          { value: "other", label: "Something else" },
        ],
      },
    ],
    pilot: {
      heading: "Provision a pilot tenant",
      blurb:
        "Stand up one client tenant with a few seats. That's the whole evaluation — a real fleet, in your hands.",
      submitLabel: "Provision a pilot tenant",
      successHeading: "Your pilot tenant is reserved.",
      successBody:
        "A real person on our side gets your details now and will reach out within one business day to open the tenant and walk your first client through with you. No drip campaign, no sales sequence.",
      handoffLabel: "Continue to set up your tenant",
    },
    pricing: {
      heading: "Get partner pricing",
      blurb:
        "The full wholesale rate card and tier thresholds — the numbers you need to model margin before you commit to anything.",
      submitLabel: "Get partner pricing",
      successHeading: "Your rate card is on its way.",
      successBody:
        "You'll get the full wholesale rate card and tier thresholds by end of the next business day — a real document, not a 'let's book a call' reply. If anything needs a conversation, that's your call to make, not ours.",
      handoffLabel: "Continue to set up your tenant",
    },
  },

  problem: {
    enabled: true,
    eyebrow: "The problem",
    heading: "The layer above the desktop is the part you keep rebuilding.",
    intro:
      "WorkSpaces, AVD, and Citrix give you a desktop. Turning that into something you can run for many clients — profitably — is work none of them do for you.",
    blocks: [
      {
        marker: "built in-house",
        title: "Multi-tenancy you had to build yourself",
        body: "The desktop tools are single-tenant by default. Isolating one client from the next — separate identity, separate billing, separate blast radius — is a platform. You either built it or you're duct-taping it, and either way you maintain it forever.",
      },
      {
        marker: "days per client",
        title: "Provisioning that takes days, not minutes",
        body: "A new client means networks, directories, images, and policies — a runbook a senior engineer babysits. Every new logo is days of setup before the first desktop is usable, and it doesn't get faster with practice.",
      },
      {
        marker: "a week a month",
        title: "Billing you reconcile by hand",
        body: "Desktop spend lands in one bill with no per-client split. Someone spends a week a month pulling usage apart, attributing it, and marking it up — margin work done in a spreadsheet, by hand, every cycle.",
      },
    ],
  },

  controlPlane: {
    enabled: true,
    eyebrow: "The control plane",
    heading: "The desktop is table stakes. This is the product.",
    intro:
      "One place to isolate, provision, run, and bill desktop fleets across every client. Here's what each part actually does.",
    ctaLine: "See it against your own client list.",
    capabilities: [
      {
        key: "isolation",
        title: "Tenant isolation that's real, not a label",
        body: "Every client is a separate cloud account with its own identity directory, network, and encryption keys. One client can't see, reach, or affect another — and neither can a mistake.",
        points: [
          "Dedicated account and directory per client",
          "Separate networks and encryption keys",
          "A blast radius that stops at one tenant",
        ],
      },
      // "fleet" capability intentionally omitted: the MSP account-switching API shipped
      // this week, but there's no frontend screen yet showing all tenants/seats in one
      // view — that's the next roadmap item, not a shipped capability. Re-add once real.
      {
        key: "provisioning",
        title: "Provisioning without the runbook",
        body: "A new tenant and its desktops come up from one action — networks, directory, images, and policy handled underneath. No senior engineer babysitting a checklist.",
        points: [
          "A new client tenant from one action",
          "Networks, directory, and images handled underneath",
          "The tenth client is as fast as the first",
        ],
      },
      {
        key: "billing",
        title: "Per-client spend, visible in real time",
        body: "See exactly what each client's fleet is costing as it runs — not at the end of the month, and not by digging through a raw AWS bill.",
        points: [
          "Cost visibility scoped to each client account",
          "Live spend, not a monthly surprise",
          "No spreadsheet to reconcile after the fact",
        ],
      },
    ],
  },

  // ── v2 / v3 sections: defined so filling them later is a content edit, not code. ──
  commercialModel: { enabled: false, heading: "How the commercial model works" },
  whiteLabel: { enabled: false, heading: "White-label" },
  migration: { enabled: false, heading: "Moving a client over" },
  security: { enabled: false, heading: "Security and compliance" },
  proof: { enabled: false, note: "Off until logos/seats/design partners are real." },
  pricingRequest: { enabled: false, heading: "Partner pricing" },
  changelog: { enabled: false, heading: "What we shipped" },

  faq: {
    enabled: true,
    heading: "Questions MSPs actually ask",
    items: [
      {
        question: "Why isn't pricing on this page?",
        answer:
          "Because a public per-seat number with no context is one you'd rightly ignore. Ask for partner pricing and you get the full wholesale rate card and tier thresholds — same or next business day, as a document. No enterprise sales cycle, no minimum you have to pry out of us on a call.",
      },
      {
        question: "What happens to my clients if you shut down?",
        answer:
          "Your clients' desktops run in cloud accounts on cloud infrastructure — not on a server in our office. If we disappeared tomorrow, the desktops keep running; what you'd lose is the management layer, not the machines. Data export and account hand-back go in writing in the partner agreement, and that's a fair thing to hold us to.",
      },
      {
        question: "How is one client's data isolated from another's?",
        answer:
          "Each client is a separate cloud account with its own directory, network, and encryption keys. Isolation is the account boundary itself, not a filter in software we wrote — a bug in one tenant can't reach another.",
      },
      {
        question: "What's the support escalation path and SLA?",
        answer:
          "You get a named escalation path to our team. Response-time commitments are going into the partner agreement rather than onto a marketing page — ask and we'll tell you exactly where they stand today. We'd rather commit in writing than round up here.",
      },
      {
        question: "Who does my client call when a desktop breaks?",
        answer:
          "You. We're channel-only and never touch your client relationship. You hold the client; we hold the platform under you and back you on escalation. Your client never learns our name unless you want them to.",
      },
      {
        question: "Is there a contract or minimum commitment?",
        answer:
          "We won't bury a minimum you can't hit in a sales call. When you ask for partner pricing you get the tier thresholds and any minimum commitment in writing, up front — so you can model it before you talk to anyone.",
      },
      {
        question: "Can I get my data out if I leave?",
        answer:
          "Yes. Desktops and their data live in cloud accounts we can hand back or export; exit and export terms are in the partner agreement. We'd rather you stay because it works than because leaving is painful.",
      },
      {
        question: "What about GPU or heavy workloads?",
        answer:
          "Standard desktops cover most seats. If you have CAD, rendering, or other GPU-heavy users, ask — we'll tell you what's available today rather than promise a tier we don't ship yet.",
      },
      {
        question: "How do you stay channel-only as you grow?",
        answer:
          "It's the business model, not a phase. There's no direct sales motion to turn on — no end-customer pricing, no end-customer signup, no page for one. Every dollar we make comes through a partner, so competing with you would mean competing with our own revenue.",
      },
    ],
  },

  footer: {
    enabled: true,
    ctaHeading: "Stand up one client tenant. That's the whole evaluation.",
    tagline: "Cloud desktops, managed by you, sold only through you.",
    // [FILL] confirm the real contact address — see TODO.md
    contactEmail: "partners@offsitedesktops.com",
    columns: [
      {
        title: "Platform",
        links: [
          { label: "The control plane", href: "#control-plane" },
          { label: "The problem it solves", href: "#problem" },
          { label: "Questions", href: "#faq" },
        ],
      },
      {
        title: "Get in touch",
        links: [{ label: "partners@offsitedesktops.com", href: "mailto:partners@offsitedesktops.com" }],
      },
    ],
    legalLine: "Sold exclusively through managed service providers.",
  },
};
