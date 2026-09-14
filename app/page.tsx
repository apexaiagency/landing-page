import { getSite, type Cta } from "@/content";
import { getLanding } from "@/content/landing";
import { LeadFormProvider } from "@/components/form-context";
import { AnalyticsBoot } from "@/components/analytics-boot";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PathSelector } from "@/components/path-selector";
import {
  Hero,
  PositioningBand,
  HowItWorks,
  UseCases,
  Management,
  Trust,
  Roadmap,
  Sustainability,
  Close,
} from "@/components/landing-sections";

/**
 * Section order is fixed by SPEC.md: shared hero, band and selector, then the branched
 * panels, then a shared tail. Everything below the selector renders regardless of
 * whether a path was chosen, which is what makes the selector soft rather than a gate.
 *
 * Sections in `constraints.doNotBuild` are not here and must not be added: logo wall,
 * metrics band, testimonials, long feature grid, pricing table.
 */
export default function Page() {
  const site = getSite();
  const landing = getLanding();
  const signupHandoffUrl = process.env.NEXT_PUBLIC_SIGNUP_HANDOFF_URL ?? null;
  /**
   * The JSON carries label and href only. `intent` is an analytics concern rather than
   * content, so it is attached here instead of being written into the content file.
   * One CTA, one intent, every placement: the label is identical everywhere by
   * construction because every placement is handed this same object.
   */
  const cta: Cta = { ...landing._meta.cta, intent: "pilot" };

  return (
    <LeadFormProvider form={site.form} signupHandoffUrl={signupHandoffUrl}>
      <AnalyticsBoot />
      <span id="top" />
      <SiteHeader site={site} cta={cta} />
      <main>
        <Hero hero={landing.hero} cta={cta} />
        <PositioningBand band={landing.band} />
        <PathSelector selector={landing.selector} paths={landing.paths} cta={cta} />
        <HowItWorks howItWorks={landing.howItWorks} />
        <UseCases useCases={landing.useCases} />
        <Management management={landing.management} />
        <Trust trust={landing.trust} />
        <Roadmap roadmap={landing.roadmap} />
        <Sustainability sustainability={landing.sustainability} />
        <Close close={landing.close} cta={cta} />
      </main>
      <SiteFooter site={site} cta={cta} />
    </LeadFormProvider>
  );
}
