import { z } from "zod";

/**
 * SITE CHROME SCHEMA.
 *
 * Everything a visitor reads in the page BODY now lives in `landing-content.json` and
 * is typed by `content/landing.ts`. What is left here is the chrome the spec does not
 * describe: document metadata, the brand name, the lead form, and the footer.
 *
 * The page-section schemas that used to live in this file were deleted when the
 * 14 Sep build spec replaced the page. They are not archived: they carried a complete
 * second set of marketing copy that the claim scanner does not read, which is precisely
 * how a superseded claim finds its way back onto a page.
 */

const CtaSchema = z.object({
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

const BrandSchema = z.object({ name: z.string().min(1) });

const FormFieldSchema = z.object({
  name: z.enum(["email", "mspName", "clientSeats", "currentPlatform"]),
  label: z.string().min(1),
  type: z.enum(["email", "text", "number", "select"]),
  placeholder: z.string().optional(),
  required: z.boolean().default(true),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  helper: z.string().optional(),
});

const FormCopySchema = z.object({
  heading: z.string().min(1),
  blurb: z.string().min(1),
  submitLabel: z.string().min(1),
  successHeading: z.string().min(1),
  successBody: z.string().min(1),
  handoffLabel: z.string().min(1),
});

const FormSchema = z.object({
  fields: z.array(FormFieldSchema).length(4),
  pilot: FormCopySchema,
  pricing: FormCopySchema,
  /** Honeypot field name. Must stay empty; the server rejects if filled. */
  honeypotField: z.string().min(1),
});

const FooterSchema = z.object({
  ctaHeading: z.string().min(1),
  tagline: z.string(),
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
  form: FormSchema,
  footer: FooterSchema,
});

export type Site = z.infer<typeof SiteSchema>;
