import type { Site } from "./schema";

/**
 * ALL user-facing copy for the site. Edit here; nothing lives in components.
 *
 * SOURCE OF TRUTH: "offsiteLABS Product and Marketing Documentation" v1.0 and
 * "offsiteLABS Technical Product Documentation" v1.0, both 10 September 2026.
 * Every claim below is traceable to a capability marked **Current** in those documents.
 * The page structure follows marketing doc §8 (Landing Page Strategy).
 *
 * The rule those documents put above all others, repeated here because this file is
 * where it gets broken: never market a future feature as though it exists. If a
 * capability is In Progress, Planned, Exploring or Needs Confirmation, it does not
 * belong on this page — not softened, not implied, not foreshadowed in a mockup.
 *
 * Conventions:
 *  - `[FILL]` facts use `known:false` + an honest `fallback`. See TODO.md for the list.
 *  - Flip a section on by setting `enabled: true` once it has real substance.
 *  - Proof/logos live in their own section and stay off until they are real.
 */
export const site: Site = {
  meta: {
    title: "Offsite Labs — every client in their own cloud account",
    description:
      "Cloud desktops where every customer gets their own cloud account, network and encryption key. Environments build themselves in about twenty to forty minutes with no engineer involved. Built for managed service providers, and for businesses who want work computers without hardware.",
    url: "https://www.offsitelabs.io",
    ogImage: "/og.png",
    keywords: [
      "cloud desktops for MSPs",
      "per-client cloud account isolation",
      "managed cloud desktop platform",
      "MSP desktop provisioning",
      "Canadian data residency cloud desktops",
    ],
  },

  brand: {
    name: "Offsite Labs",
    /**
     * Replaces the previous channel-only line. That line said we sell only through
     * providers and never direct — which is false: self-service registration is open
     * in the product, and any provider can disprove it in thirty seconds (marketing
     * doc §8, "three strings to fix before launch").
     *
     * What ships instead is the half of the client-protection commitment that has
     * actually been decided. The third commitment in marketing doc §7 — direct price
     * set at or above the partner price — is marked Needs Confirmation and is
     * deliberately NOT on this page until it is settled and in a partner agreement.
     */
    channelLine:
      "We never approach a partner's clients. A client registered to you is contractually off limits to us.",
  },

  ctas: {
    /**
     * One call to action, repeated (marketing doc §8). The pricing CTA is defined but
     * NOT rendered anywhere: it promised a wholesale rate card within a business day
     * and that document does not exist. Re-render it the day the rate card is real —
     * see TODO.md. Until then a second CTA would end in a promise we cannot keep.
     */
    pilot: { label: "Book a walkthrough", intent: "pilot", href: "#pilot" },
    pricing: { label: "Talk to us about your book of clients", intent: "pricing", href: "#pilot" },
  },

  hero: {
    enabled: true,
    eyebrow: "Cloud desktops for managed service providers",
    headline: "Every client in their own cloud account.",
    subhead:
      "Offsite Labs runs Windows desktops in the cloud, and gives every one of your clients their own separate cloud account, network, encryption key and directory. The whole environment builds itself, with nobody in the room.",
    provisioningTime: {
      /**
       * Twenty to forty minutes for a BRAND NEW client, from a small number of runs.
       * Two things this number is not, per marketing doc §2 and §11: it is not the
       * time to add a desktop to an existing customer (never measured — do not quote
       * one), and it is not the headline claim. Sell it as unattended, not as fast.
       */
      fact: { known: true, value: "20–40 min", fallback: "" },
      caption: "unattended, from one action to a working desktop for a brand-new client",
    },
    /**
     * Artifact still omitted. A hero image has to show what the product actually
     * shows (marketing doc §8), and the "every client on one screen" provider view
     * does not exist yet — the provider endpoints are live but have no interface.
     * A real screenshot set of the product is on the proof list (§12) and does not
     * exist either. Re-add when one of those is true, not before.
     */
  },

  form: {
    honeypotField: "company_website",
    fields: [
      {
        name: "email",
        label: "Work email",
        type: "email",
        placeholder: "you@yourcompany.com",
        required: true,
      },
      {
        name: "mspName",
        label: "Company name",
        type: "text",
        placeholder: "Your company",
        required: true,
      },
      {
        name: "clientSeats",
        label: "Desktops you'd start with",
        type: "number",
        placeholder: "e.g. 25",
        required: true,
        helper: "Rough is fine — across every client, if you run desktops for others.",
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
      heading: "Book a walkthrough",
      blurb:
        "We'll show you a client environment being built from nothing — the account, the network, the encryption key, the directory, the first desktop — and you can ask what happens when any of it goes wrong.",
      submitLabel: "Book a walkthrough",
      successHeading: "Got it.",
      successBody:
        "A real person on our side has your details and will come back to you within one business day to find a time. No drip campaign, no sales sequence.",
      handoffLabel: "Continue to set up your account",
    },
    /**
     * Kept for the `pricing` intent the API and analytics already understand, but no
     * CTA routes here today. The previous copy promised a wholesale rate card by end
     * of the next business day. There is no rate card (marketing doc §10, §13).
     */
    pricing: {
      heading: "Talk to us about your book of clients",
      blurb:
        "What you'd pay, and what you'd make on it, is a conversation with a person right now rather than a document we can send you. We'd rather say that than send you a page of numbers we haven't settled.",
      submitLabel: "Start the conversation",
      successHeading: "Got it.",
      successBody:
        "Someone will come back to you within one business day. You'll get a straight answer on where the commercial terms actually stand, including the parts that aren't settled yet.",
      handoffLabel: "Continue to set up your account",
    },
  },

  problem: {
    enabled: true,
    eyebrow: "The problem",
    heading: "Safe or scalable. Nearly everyone picks scalable and stops talking about it.",
    intro:
      "Cloud desktops are not hard to buy. They are hard to deliver properly to more than one customer — and you have already made this trade-off once.",
    blocks: [
      {
        marker: "one shared account",
        title: "Separation that lives in software",
        body: "Put every client in one cloud account and keep them apart with rules in code. It is quick to build and permanently risky. One bug, one misconfiguration or one mistaken click puts one client's data in front of another — and you find out from the client, not from a report.",
      },
      {
        marker: "hours per client",
        title: "Separation that doesn't scale",
        body: "Give every client their own account and the separation is genuinely real. It also takes an engineer who knows AWS several hours per client, every time. That is why almost nobody does it by hand past the first few.",
      },
      {
        marker: "one number",
        title: "A bill you take apart yourself",
        body: "Shared infrastructure arrives as one figure with no per-client split. Part of every month goes to working out who owes what, in a spreadsheet, by hand.",
      },
    ],
  },

  controlPlane: {
    enabled: true,
    eyebrow: "The solution",
    heading: "We took the safe option and automated it.",
    intro:
      "The separation between two of your clients is an account boundary, not a rule in our software. A software rule is only as good as the code that enforces it. An account boundary holds even when the code is wrong.",
    ctaLine: "See it built from nothing, end to end.",
    capabilities: [
      {
        key: "isolation",
        title: "Isolation you can point at",
        body: "Every client is a separate cloud account with its own directory, network and encryption key. There is no shared network and no cross-connection between them — which removes the category of mistake where a permission or a query returns the wrong client's data, because there is no shared place for that mistake to happen.",
        points: [
          "Own account, own directory, own network, own encryption key",
          "Volumes encrypted with that client's key, not optionally",
          "Our own platform cannot reach two clients in one request",
        ],
      },
      /**
       * "fleet" still omitted. The provider endpoints (add a client, switch between
       * clients, cost rollup) have been live since 4 September and have no interface
       * at all — a design spec landed 10 September 2026 and is In Progress. This is
       * the largest gap between what the product does and what it shows. Re-add the
       * capability the day the screens ship, not the day the design is approved.
       */
      {
        key: "provisioning",
        title: "Onboarding without an engineer",
        body: "The whole environment builds itself, in order, with retries: the cloud account, the network, the encryption key, the directory, then the first desktop. Nobody watches it. Onboarding a client stops being a project and becomes something a service desk person starts and walks away from.",
        points: [
          "A brand-new client environment from one action",
          "About 20–40 minutes, unattended",
          "Later desktops for that client skip the build entirely",
        ],
      },
      {
        key: "billing",
        title: "Costs already separate",
        body: "Because every client is already in their own account, spend is already split. The platform shows a live estimate per desktop, per client, and across every client you manage — while the month is running, rather than after it.",
        points: [
          "Per-desktop and per-client spend, live",
          "A split that falls out of the architecture, not a spreadsheet",
          "An estimate of the current month — not an invoice",
        ],
      },
    ],
  },

  howItWorks: {
    enabled: true,
    eyebrow: "How it works",
    heading: "Four steps, and you are only present for two of them.",
    steps: [
      {
        title: "Add a client",
        body: "One client, one record. Everything that follows for them is built inside their own boundary.",
        caveat: "Today this is an API call. The screen for it is being built.",
      },
      {
        title: "Create their first desktop",
        body: "Pick a size and a location. That single action is what starts the build.",
      },
      {
        title: "The environment builds itself",
        body: "The cloud account, the private network, the encryption key, the directory and the machine, in order, with retries. About twenty to forty minutes. Nobody has to be in the room.",
      },
      {
        title: "Add people and more desktops",
        body: "Invite by email address. The person sets their own password — no administrator, and nobody here, ever sees it. Later desktops join the environment that now exists.",
      },
    ],
  },

  today: {
    enabled: true,
    eyebrow: "What it does today",
    heading: "Working now, in production.",
    intro:
      "Not a roadmap. Every line below is something the platform does today, with the benefit rather than the feature.",
    groups: [
      {
        title: "Separation",
        items: [
          {
            title: "A separate cloud account for every client",
            body: "One client's data cannot reach another, because there is no shared place for it to go.",
          },
          {
            title: "Passwords the platform sets but never sees",
            body: "Every desktop has its own sign-in and the assigned person sets their own password. A strong access story with no password sharing anywhere in it.",
          },
          {
            title: "Access that ends everywhere at once",
            body: "Suspending someone shuts platform access first, then sweeps every machine they hold and stops it. Live sessions end.",
          },
        ],
      },
      {
        title: "Running it",
        items: [
          {
            title: "No cloud vocabulary anywhere",
            body: "The product never says account, network, instance or image — it says computers, people and categories. Anyone on your service desk can run the daily work.",
          },
          {
            title: "Windows desktops in three sizes",
            body: "Two processors and 4GB, two and 8GB, or four and 16GB. Match the machine to the work without a hardware order. Desktops arrive as blank Windows machines with no software pre-installed.",
          },
          {
            title: "Browser or desktop client",
            body: "A stopped desktop starts itself when someone connects. Nothing to install if you'd rather not, and no start button to remember.",
          },
          {
            title: "Everyday controls",
            body: "Turn off, restart, rename, transfer to another person, group into categories, remove. The daily work is self-service.",
          },
          {
            title: "Shared desktops",
            body: "One machine several people can use at once, with a cap you set and access granted per person. A shared workstation without a machine per person.",
          },
        ],
      },
      {
        title: "Keeping it running",
        items: [
          {
            title: "It checks itself every six hours",
            body: "The platform compares its records against what is actually running, removes what is stranded, and can rebuild a broken desktop while keeping the user's data drive. Problems get fixed before they become tickets.",
          },
          {
            title: "Nothing left billing quietly",
            body: "The same check finds cloud resources with no matching record and removes them. When a client leaves, teardown is complete — nothing lingers unless someone chose to keep it, and the cost of keeping it is shown at the moment they choose.",
          },
          {
            title: "Careful removal",
            body: "Every destructive action carries friction matched to what it destroys. Closing an account means re-entering your password and typing an exact phrase after seeing what will go. Removal is permanent: no snapshot, no undo.",
          },
        ],
      },
      {
        title: "Where it runs",
        items: [
          {
            title: "Four locations, including Canada",
            body: "Virginia, Ohio, Oregon or central Canada, chosen when the client's first desktop is created. Canadian data residency is a deal most of this segment cannot win. The choice is locked once made, with no migration path.",
          },
          {
            title: "A fixed outbound address, on request",
            body: "All of a client's desktops can share one stable internet address, for vendors that require one on an allowlist. We set it up at onboarding, it must be chosen before the first desktop exists, and it is paid.",
          },
          {
            title: "Internet access on every desktop",
            body: "It works like a normal computer.",
          },
        ],
      },
    ],
    notIncluded:
      "Not in the product today, and we would rather you heard it here: multi-factor authentication, password reset for the platform login, invoicing or payment of any kind, an audit log you can read, data export before deletion, changing someone's role after they are invited, resizing a desktop after it is created, and any location outside North America.",
  },

  useCases: {
    enabled: true,
    eyebrow: "Who uses it",
    heading: "Two ways this gets bought.",
    cases: [
      {
        audience: "A provider onboards a new client",
        situation: "You sign a fifteen-person accounting firm and need desktops running.",
        problem:
          "On your current platform that means either putting the firm into shared infrastructure you would rather not explain, or booking an engineer for most of a day.",
        howWeHelp:
          "You add the client and create the first desktop. The platform builds a separate cloud account, network, encryption key and directory, and launches the machine. Nobody watches it. Around twenty to forty minutes later it is ready, and the remaining fourteen desktops go into the environment that now exists.",
        benefit:
          "A client that used to be a project becomes a task, and the firm's data sits in its own account from the first minute.",
        caveat:
          "Adding the client itself is an API call today, not a screen. Until those screens ship we work alongside you for setup.",
      },
      {
        audience: "A business hires someone remote",
        situation: "Someone starts Monday, two time zones away.",
        problem:
          "Ordering, imaging and shipping a laptop takes longer than that — and then the company owns a machine it cannot see.",
        howWeHelp:
          "An administrator creates a desktop, assigns it, and invites the person by email address. They set their own password, sign in from a browser, and start work.",
        benefit:
          "No hardware. The work stays on a machine the company controls rather than a personal laptop. And when that person leaves, one action ends their access everywhere.",
      },
    ],
  },

  trust: {
    enabled: true,
    eyebrow: "Trust",
    heading: "What is true, and what isn't yet.",
    intro:
      "This section is short on purpose. A buyer in this market checks, and one invented figure discredits the twenty real ones next to it.",
    have: [
      {
        title: "No long-lived credentials anywhere",
        body: "Creating them is denied by policy in every client account, and a policy of that kind cannot be granted around. Access is temporary, and every request into a client account is tagged with which client it is for. An untagged request is refused.",
      },
      {
        title: "Our platform cannot run arbitrary code in your clients' accounts",
        body: "It can deploy our own approved templates and nothing else. If our control plane were compromised, that is the limit of what an attacker could do there.",
      },
      {
        title: "Encryption with each client's own key",
        body: "Root and user volumes are encrypted at creation with that client's key. It is not optional, key deletion is denied for everyone, and rotation is on.",
      },
      {
        title: "Activity logging you cannot reach and neither can we",
        body: "Organisation-level logging runs to a separate account, with log file validation on, and policy denies stopping, deleting or altering that trail.",
      },
      {
        title: "A recovery process that has actually been tested",
        body: "Thirty-five days of point-in-time recovery on the system of record. A restore drill on 21 July 2026 completed in about eleven minutes with verification passing. That drill ran at small data volume, so treat eleven minutes as tested, not as proven at scale.",
      },
    ],
    notYet: {
      heading: "Not true yet, and you would find out anyway",
      items: [
        "No multi-factor authentication",
        "No certifications, no third-party audit, no penetration test",
        "No audit log a customer can read",
        "No published service level agreement or uptime figure",
        "No threat detection monitoring",
        "No reference customers we can name — the first provider is onboarding now",
      ],
      note: "If any of those is a hard requirement for you today, we are the wrong choice today. We would rather tell you now than in the second meeting.",
    },
  },

  // ── v2 / v3 sections: defined so filling them later is a content edit, not code. ──
  commercialModel: { enabled: false, heading: "How the commercial model works" },
  whiteLabel: { enabled: false, heading: "White-label" },
  migration: { enabled: false, heading: "Moving a client over" },
  // Superseded by the `trust` section above; kept so the stub list stays stable.
  security: { enabled: false, heading: "Security and compliance" },
  proof: { enabled: false, note: "Off until a named customer has agreed in writing." },
  pricingRequest: { enabled: false, heading: "Partner pricing" },
  changelog: { enabled: false, heading: "What we shipped" },

  faq: {
    enabled: true,
    heading: "Questions people actually ask",
    items: [
      {
        question: "How is one client's data separated from another's?",
        answer:
          "Each client is a separate cloud account with its own directory, network and encryption key. The isolation is the account boundary itself, not a filter in software we wrote, so a bug in one client's environment has no path to another. Two facts worth knowing that are not ours: Microsoft's own guidance for Azure Virtual Desktop recommends a separate tenant and subscription per customer for commercial delivery, and Citrix's own partner documentation states that its partner console does not automatically enforce scopes.",
      },
      {
        question: "What does it cost?",
        answer:
          "There is no published rate card yet, and we are not going to pretend otherwise by sending you to a form. Ask and you will get a straight conversation about where the commercial terms stand, including the parts that are not settled. That is the honest state of it today.",
      },
      {
        question: "Is it secure?",
        answer:
          "Here is what is true. Every client has their own cloud account, network, encryption key and directory. Volumes are encrypted with that client's key and that is not optional. There are no long-lived credentials anywhere in the platform, because creating them is denied by policy in every client account. Every internal request into a client account is tagged with which client it is for and the account rejects anything untagged, so our own platform cannot touch two clients in one request. Our control plane can only deploy our approved templates — it cannot run arbitrary commands. Here is what is not true yet: there is no multi-factor authentication, we hold no certifications, there has been no third-party audit and no penetration test, there is no audit log you can read, and there is no published service level agreement.",
      },
      {
        question: "Why not just use what I already resell?",
        answer:
          "You probably resell something that puts all of your clients in one shared environment. That is fine until it is not, and the moment it is not is the moment you have to explain it to a client. The other difference is operational: onboarding a client here does not need an engineer and does not need a day.",
      },
      {
        question: "Why not build it internally?",
        answer:
          "You can. The architecture is documented and none of it is secret. What takes the time is everything after the first working desktop: reliable automated account creation, the permission model that stops your own platform reaching two clients at once, teardown that actually leaves nothing behind, the self-checking, and hiding all of it behind language your service desk can use. That is where the year goes.",
      },
      {
        question: "Does it work with our existing systems?",
        answer:
          "A desktop is a full Windows machine with internet access, so anything that runs on Windows runs on it. Desktops ship blank, with no software pre-installed, so you install what you need. If a vendor requires a fixed internet address, we can set a client up so all their desktops share one — that has to be arranged before their first desktop is created. What we do not have is a connection to your office network: no VPN, no private link. That is a separate managed engagement, not a feature.",
      },
      {
        question: "Can I trust the AI?",
        answer:
          "There is no AI in this product. Nothing in it is decided by a model. Provisioning, self-repair and cost estimation are ordinary deterministic code that does the same thing every time. If that is a relief, good. If you were hoping for AI, you are not getting it here.",
      },
      {
        question: "What happens when something breaks?",
        answer:
          "The platform checks every environment every six hours and repairs what it can, including rebuilding a broken desktop while preserving the user's files. There is also a reset button. The honest gap: those repairs are invisible to you today, so a machine can still show a problem on screen after it has been fixed. Making that visible is work we have planned.",
      },
      {
        question: "Where is my data?",
        answer:
          "In whichever of the four locations you chose when the first desktop was created: Virginia, Ohio, Oregon or central Canada. It stays there, and the choice cannot be changed afterwards, so it has to be right the first time. There is nothing outside North America.",
      },
      {
        question: "What if you go away?",
        answer:
          "Everything runs in cloud accounts under your own client's structure, using cloud services directly, with no proprietary runtime sitting in that environment. That is a better answer than most platforms can give you. It is not a formal continuity commitment, and we are not going to present it as one.",
      },
      {
        question: "Who does my client call when a desktop breaks?",
        answer:
          "You. We never approach a partner's clients, and a client registered to you is contractually off limits to us. Support today is email — there is no ticketing system — and the support link carries the account, the machine and what happened, so nobody starts by explaining it from scratch.",
      },
    ],
  },

  footer: {
    enabled: true,
    ctaHeading: "See a client environment built from nothing.",
    tagline: "Windows desktops in the cloud. Every client in their own account.",
    // [FILL] confirm the real contact address once email is live on the new domain — see TODO.md
    contactEmail: "partners@offsitelabs.io",
    columns: [
      {
        title: "Platform",
        links: [
          { label: "The problem it solves", href: "#problem" },
          { label: "How it works", href: "#how-it-works" },
          { label: "What it does today", href: "#today" },
          { label: "Trust", href: "#trust" },
          { label: "Questions", href: "#faq" },
        ],
      },
      {
        title: "Get in touch",
        links: [{ label: "partners@offsitelabs.io", href: "mailto:partners@offsitelabs.io" }],
      },
    ],
    legalLine: "Offsite Labs. Windows desktops in the cloud, one customer at a time.",
  },
};
