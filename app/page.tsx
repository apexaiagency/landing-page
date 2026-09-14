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
  Industries,
  Management,
  Roadmap,
  Sustainability,
  Affiliation,
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
      <SiteHeader site={site} cta={cta} login={landing.login} />
      <main>
        <Hero hero={landing.hero} cta={cta} />
        <PositioningBand band={landing.band} />
        <PathSelector selector={landing.selector} paths={landing.paths} cta={cta} />
        <HowItWorks howItWorks={landing.howItWorks} />
        <UseCases useCases={landing.useCases} />
        <Industries industries={landing.industries} />
        <Management management={landing.management} />
        {/*
          Trust is deliberately NOT rendered, by decision on 14 Sep 2026. SPEC.md still
          describes it and landing-content.json still holds its copy, checked and ready,
          so restoring it is re-adding this one line. Note what goes with it: the
          "Not built yet" panel was the only place the page named the missing
          multi-factor authentication, certifications and service level agreement, and
          the roadmap below now carries the whole of that disclosure.
        */}
        <Roadmap roadmap={landing.roadmap} />
        <Sustainability sustainability={landing.sustainability} />
        <Affiliation affiliation={landing.affiliation} />
        <Close close={landing.close} cta={cta} />
      </main>
      <SiteFooter site={site} cta={cta} />
    </LeadFormProvider>
  );
}
