import { z } from "zod";
import raw from "./landing-content.json";

/**
 * THE LANDING CONTENT LAYER.
 *
 * `landing-content.json` is the source of truth for every string on the page, per the
 * build spec (SPEC.md). Components import from here and never hold copy of their own.
 * Editing the page is editing that JSON.
 *
 * This module does two jobs: it types the JSON, and it validates it at module load so
 * a bad edit fails the build LOUDLY rather than rendering an empty section or, worse,
 * a half-formed claim.
 *
 * The blocklist in `constraints.neverSay` is enforced separately, by
 * `scripts/check-claims.mjs`, which runs before the build. It cannot live here: the
 * check has to reason about which strings are assertions and which are denials, and a
 * schema cannot tell those apart.
 */

const Cta = z.object({ label: z.string().min(1), href: z.string().min(1) });

const Caveat = z.object({
  heading: z.string().min(1).optional(),
  intro: z.string().min(1).optional(),
  body: z.array(z.string().min(1)).optional(),
  items: z.array(z.string().min(1)).optional(),
  outro: z.string().min(1).optional(),
});

const Path = z.object({
  h2: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
  proof: z
    .object({ heading: z.string().min(1), items: z.array(z.string().min(1)).min(1) })
    .optional(),
  caveat: Caveat,
});

export const LandingSchema = z.object({
  _meta: z.object({
    site: z.string(),
    brand: z.string(),
    version: z.string(),
    date: z.string(),
    note: z.string(),
    voice: z.string(),
    cta: Cta,
  }),
  hero: z.object({
    h1: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
    cta: Cta,
    imageRule: z.string(),
  }),
  band: z.object({ heading: z.string().min(1), body: z.array(z.string().min(1)).min(1) }),
  selector: z.object({
    heading: z.string().min(1),
    behaviour: z.string(),
    options: z
      .array(
        z.object({
          id: z.enum(["msp", "org", "solo"]),
          label: z.string().min(1),
          sub: z.string().min(1),
        })
      )
      .length(3),
  }),
  paths: z.object({ msp: Path, org: Path, solo: Path }),
  howItWorks: z.object({
    h2: z.string().min(1),
    steps: z
      .array(z.object({ n: z.number().int(), title: z.string().min(1), body: z.string().min(1) }))
      .length(4),
  }),
  /**
   * The two machine shapes. Both are Current. The caveats are part of the offer here
   * rather than a footnote, because the shared machine's limits decide whether it fits
   * at all, and finding them out after buying is the bad outcome.
   */
  machineTypes: z.object({
    h2: z.string().min(1),
    intro: z.string().min(1),
    items: z
      .array(
        z.object({
          name: z.string().min(1),
          body: z.string().min(1),
          caveat: z.string().min(1),
        })
      )
      .min(2),
    note: z.string(),
  }),
  useCases: z.object({
    h2: z.string().min(1),
    items: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })).length(5),
  }),
  /**
   * Industries, framed as where Windows-only software lives rather than where the
   * product is deployed. The distinction is the whole section: there are no customers
   * to name, so a list of industries SERVED would be a customer claim wearing a
   * different hat. See the note in the content file.
   */
  industries: z.object({
    h2: z.string().min(1),
    intro: z.string().min(1),
    items: z.array(z.object({ name: z.string().min(1), body: z.string().min(1) })).min(2),
    note: z.string(),
  }),
  management: z.object({
    h2: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
    caveat: z.array(z.string().min(1)).min(1),
  }),
  trust: z.object({
    h2: z.string().min(1),
    trueToday: z.object({ heading: z.string().min(1), items: z.array(z.string().min(1)).min(1) }),
    notBuilt: z.object({ heading: z.string().min(1), items: z.array(z.string().min(1)).min(1) }),
    openIssue: z.string(),
  }),
  roadmap: z.object({
    h2: z.string().min(1),
    rule: z.string(),
    columns: z
      .array(z.object({ status: z.string().min(1), items: z.array(z.string().min(1)).min(1) }))
      .length(3),
  }),
  sustainability: z.object({
    h2: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
    founderNote: z.object({
      heading: z.string().min(1),
      attribution: z.string().min(1),
      /**
       * Ships only when false. The spec is explicit: the note is placeholder text
       * pending Jay's rewrite and must not go out while this flag stands. The renderer
       * checks it; nothing else needs to.
       */
      draft: z.boolean(),
      body: z.array(z.string().min(1)).min(1),
    }),
  }),
  /**
   * Sign-in for people who already have an account. Navigation, not conversion: it is
   * not a second call to action competing with the walkthrough, which is why it is
   * styled quietly and never repeated down the page.
   */
  login: z.object({
    label: z.string().min(1),
    /** The literal PLACEHOLDER_NOT_CONNECTED until a real URL is decided. */
    href: z.string().min(1),
    note: z.string(),
  }),
  /**
   * The one piece of outside credibility on the page. With the trust section removed,
   * everything else here is the company describing itself.
   */
  affiliation: z.object({
    eyebrow: z.string().min(1),
    text: z.string().min(1),
    logoAlt: z.string().min(1),
    logoHref: z.string().url(),
    note: z.string(),
  }),
  close: z.object({
    h2: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
    cta: Cta,
    optionalPricingLine: z.object({
      include: z.boolean(),
      text: z.string().min(1),
      note: z.string(),
    }),
  }),
  constraints: z.object({
    neverSay: z.array(z.string()),
    doNotBuild: z.array(z.string()),
    removeFromCurrentSite: z.array(z.object({ string: z.string(), why: z.string() })),
  }),
});

export type Landing = z.infer<typeof LandingSchema>;
export type LandingPath = z.infer<typeof Path>;

function load(): Landing {
  const parsed = LandingSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`landing-content.json failed validation:\n${issues}\n`);
  }
  return parsed.data;
}

const validated = load();

export function getLanding(): Landing {
  return validated;
}
