import { z } from "zod";

/**
 * CONTENT SCHEMA — the single source of truth for every user-facing string.
 *
 * Rules this schema enforces:
 *  - No hardcoded copy in components. Everything a visitor reads is typed here.
 *  - Every section is individually toggleable (`enabled`). A section with no real
 *    substance yet is switched off and the page reads as complete without it.
 *  - Unknown facts use the `Fact` shape: an honest fallback, never a guessed value.
 *  - Validated at read time (content/index.ts) so a bad edit fails the build LOUDLY
 *    instead of rendering an empty section or a wrong claim.
 *
 * Migration note: this is the ONLY module that defines the shape. A later move to a
 * Supabase-backed table is a swap of the read layer (content/index.ts), not a
 * rewrite of components. See TODO.md → "Content migration trigger".
 */

/**
 * A Fact is a value we may or may not know yet.
 *  - known:false  → the UI renders the `fallback` (an honest "not yet" string) OR,
 *                   where a missing number would be worse than silence, renders nothing.
 *  - known:true   → the UI renders `value`.
 * Filling it in later = flip `known` to true and add `value`. One-line content edit.
 */
export const FactSchema = z
  .object({
    known: z.boolean(),
    value: z.string().optional(),
    /** Honest "not yet" text. Shown when known:false and the section still renders. */
    fallback: z.string(),
  })
  .refine((f) => !f.known || (f.value !== undefined && f.value.length > 0), {
    message: "A known Fact must have a non-empty `value`.",
  });
export type Fact = z.infer<typeof FactSchema>;

const CtaSchema = z.object({
  /** Same label must appear at every placement — enforced by referencing one object. */
  label: z.string().min(1),
  intent: z.enum(["pilot", "pricing"]),
  href: z.string().min(1),
});
export type Cta = z.infer<typeof CtaSchema>;

const MetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  ogImage: z.string().min(1),
  keywords: z.array(z.string()).default([]),
});

const BrandSchema = z.object({
  name: z.string().min(1),
  /** The channel-only trust line. Belongs above the fold — say it loudly. */
  channelLine: z.string().min(1),
});

/** One tenant row in the control-plane artifact. Realistic, never fabricated as proof. */
const TenantRowSchema = z.object({
  client: z.string().min(1),
  region: z.string().min(1),
  seats: z.number().int().nonnegative(),
  /** Monthly spend attributed to this tenant, pre-formatted string (no live price claim). */
  spend: z.string().min(1),
  status: z.enum(["active", "provisioning", "error", "stopped"]),
  statusLabel: z.string().min(1),
  /** Optional detail revealed on hover/focus. */
  detail: z.string().optional(),
});
export type TenantRow = z.infer<typeof TenantRowSchema>;

const HeroSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  /**
   * The one phrase in the headline set in accent. Must appear verbatim in `headline`
   * or it is ignored — a mismatch silently drops the emphasis rather than breaking.
   */
  headlineAccent: z.string().min(1).optional(),
  subhead: z.string().min(1),
  /**
   * The hero's right-hand panel. It exists because the honest alternative to a product
   * screenshot is not an empty column — it is the claims themselves, set as an object.
   * Every line must be a Current capability.
   */
  checklist: z.object({ label: z.string().min(1), items: z.array(z.string().min(1)).min(3) }),
  /** In-page anchor beside the CTA. Not a second conversion path. */
  secondaryLink: z.object({ label: z.string().min(1), href: z.string().min(1) }),
  /** Provisioning time, as a Fact. If known:false the number is omitted entirely. */
  provisioningTime: z.object({
    fact: FactSchema,
    caption: z.string().min(1),
  }),
  /**
   * The interactive control-plane mockup. Optional — it depicts an "all tenants, one
   * screen" MSP view that doesn't exist yet (the MSP capability shipped is backend-only).
   * Leave unset until that frontend view ships; re-add once it's a real screen.
   */
  artifact: z
    .object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      columns: z.object({
        client: z.string(),
        region: z.string(),
        seats: z.string(),
        spend: z.string(),
        status: z.string(),
      }),
      tenants: z.array(TenantRowSchema).min(1),
      /** Aggregate footer row for the artifact. */
      summary: z.object({
        tenantsLabel: z.string(),
        seatsLabel: z.string(),
        spendLabel: z.string(),
      }),
      caption: z.string().min(1),
    })
    .optional(),
});

const FormFieldSchema = z.object({
  name: z.enum(["email", "mspName", "clientSeats", "currentPlatform"]),
  label: z.string().min(1),
  type: z.enum(["email", "text", "number", "select"]),
  placeholder: z.string().optional(),
  required: z.boolean().default(true),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  helper: z.string().optional(),
});

const FormSchema = z.object({
  fields: z.array(FormFieldSchema).length(4),
  /** Distinct headings per intent so the same form serves pilot and pricing. */
  pilot: z.object({
    heading: z.string().min(1),
    blurb: z.string().min(1),
    submitLabel: z.string().min(1),
    /** Success copy in language a human wrote — names exactly what happens next and when. */
    successHeading: z.string().min(1),
    successBody: z.string().min(1),
    handoffLabel: z.string().min(1),
  }),
  pricing: z.object({
    heading: z.string().min(1),
    blurb: z.string().min(1),
    submitLabel: z.string().min(1),
    successHeading: z.string().min(1),
    successBody: z.string().min(1),
    handoffLabel: z.string().min(1),
  }),
  /** Honeypot field name — must stay empty; server rejects if filled. */
  honeypotField: z.string().min(1),
});

/** Generic toggleable section wrapper for v2/v3 blocks defined but not yet enabled. */
const SectionStubSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  note: z.string().optional(),
});

/** The problem section — three tight blocks in MSP terms. */
const ProblemSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().optional(),
  blocks: z
    .array(
      z.object({
        /** Short metric/label rendered in mono above the title (e.g. "days per client"). */
        marker: z.string().min(1),
        title: z.string().min(1),
        body: z.string().min(1),
      })
    )
    .min(1),
  /** The turn: what we did about it, set against the accent rule. */
  answer: z.string().min(1),
  /** Them vs us, as one ruled object. The comparison is the argument. */
  comparison: z.object({
    theirs: z.object({ label: z.string().min(1), body: z.string().min(1) }),
    ours: z.object({ label: z.string().min(1), body: z.string().min(1) }),
  }),
});

/** Control plane in depth — capability panels, each with a bespoke real-UI treatment. */
const ControlPlaneSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().min(1),
  capabilities: z
    .array(
      z.object({
        /** Drives which mini-UI renders. */
        key: z.enum(["isolation", "fleet", "provisioning", "billing"]),
        title: z.string().min(1),
        body: z.string().min(1),
        points: z.array(z.string().min(1)).min(1),
      })
    )
    .min(1),
  /** CTA row heading under the section. */
  ctaLine: z.string().min(1),
});

/** How it works — four plain-language steps. No infrastructure diagrams (marketing doc §8). */
const HowItWorksSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().optional(),
  steps: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1),
        /** Optional honest aside — e.g. "this is an API call today, not a screen". */
        caveat: z.string().optional(),
      })
    )
    .min(3)
    .max(4),
});

/**
 * What it does today — CURRENT capabilities only, grouped so a reader can scan.
 * Anything In Progress / Planned / Exploring belongs on the roadmap, not here.
 * Each item carries its benefit, so "why it matters" doesn't need its own section.
 */
const TodaySchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().optional(),
  groups: z
    .array(
      z.object({
        title: z.string().min(1),
        items: z
          .array(
            z.object({
              title: z.string().min(1),
              /** The benefit, not a restatement of the capability. */
              body: z.string().min(1),
            })
          )
          .min(1),
      })
    )
    .min(1),
  /** Rendered under the grid — what we deliberately do not claim. Honesty is the point. */
  notIncluded: z.string().optional(),
});

/** Who uses it — two use cases. Two, not six (marketing doc §8). */
const UseCasesSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().optional(),
  cases: z
    .array(
      z.object({
        audience: z.string().min(1),
        situation: z.string().min(1),
        problem: z.string().min(1),
        howWeHelp: z.string().min(1),
        benefit: z.string().min(1),
        /** The honest rough edge, if there is one. Shown, not buried. */
        caveat: z.string().optional(),
      })
    )
    .min(1)
    .max(2),
});

/**
 * Trust — architecture and commitments only. Thin on purpose.
 * `notYet` is not a disclaimer we were forced into: naming a gap before the buyer
 * finds it is worth more than the objection it prevents (marketing doc §11).
 * Nothing goes in `have` that isn't checkable today. No certifications, no audits,
 * no pen tests, no uptime figures, no SLA — those do not exist.
 */
const TrustSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().optional(),
  have: z
    .array(z.object({ title: z.string().min(1), body: z.string().min(1) }))
    .min(1),
  notYet: z.object({
    heading: z.string().min(1),
    items: z.array(z.string().min(1)).min(1),
    note: z.string().optional(),
  }),
  /** On-the-record facts from other vendors. Quote accurately or remove. */
  worthKnowing: z.object({ label: z.string().min(1), body: z.string().min(1) }),
});

/**
 * Founder — lifted from off-sitelabs.com, which is the one section of that site that
 * earns its place here. With no customers to name, no certifications and no audit, a
 * named person with a checkable track record is the only proof this page actually has.
 * Everything in it must stay verifiable: no certifications, no client counts.
 */
const FounderSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  /** Paragraphs, in order. */
  body: z.array(z.string().min(1)).min(1),
});

/**
 * Who it is for — the two audiences side by side. Both are live in the product today:
 * self-service registration is open, and the provider motion is the primary one.
 * Neither column may promise the other's capabilities, and the honest limits of each
 * (the provider screens, the directory cost floor on small direct accounts) belong in
 * the column they apply to rather than in a footnote nobody reads.
 */
const AudiencesSchema = z.object({
  enabled: z.boolean(),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().optional(),
  columns: z
    .array(
      z.object({
        label: z.string().min(1),
        who: z.string().min(1),
        /** The concrete story. Rendered as "the situation". */
        scenario: z.string().min(1),
        /** What changes because of it. Rendered as "the outcome". */
        outcome: z.string().min(1),
        gains: z.array(z.string().min(1)).min(1),
        /** The honest limit for this audience. Rendered, not hidden. */
        note: z.string().optional(),
      })
    )
    .length(2),
});

const FaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const FaqSchema = z.object({
  enabled: z.boolean(),
  heading: z.string(),
  items: z.array(FaqItemSchema),
});

const FooterSchema = z.object({
  enabled: z.boolean(),
  ctaHeading: z.string().min(1),
  tagline: z.string(),
  contactEmail: z.string().email(),
  columns: z.array(
    z.object({
      title: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string() })),
    })
  ),
  legalLine: z.string(),
});

export const SiteSchema = z.object({
  meta: MetaSchema,
  brand: BrandSchema,
  ctas: z.object({ pilot: CtaSchema, pricing: CtaSchema }),
  hero: HeroSchema,
  form: FormSchema,
  problem: ProblemSchema,
  controlPlane: ControlPlaneSchema,
  audiences: AudiencesSchema,
  howItWorks: HowItWorksSchema,
  today: TodaySchema,
  useCases: UseCasesSchema,
  trust: TrustSchema,
  founder: FounderSchema,
  // v2/v3 sections — defined so filling them later is a content edit, not code.
  commercialModel: SectionStubSchema,
  whiteLabel: SectionStubSchema,
  migration: SectionStubSchema,
  security: SectionStubSchema,
  proof: SectionStubSchema,
  pricingRequest: SectionStubSchema,
  faq: FaqSchema,
  changelog: SectionStubSchema,
  footer: FooterSchema,
});

export type Site = z.infer<typeof SiteSchema>;
