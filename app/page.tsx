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
  MachineTypes,
  UseCases,
  Industries,
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
        <MachineTypes machineTypes={landing.machineTypes} />
        <UseCases useCases={landing.useCases} />
        <Industries industries={landing.industries} />
        {/*
          Management is deliberately NOT rendered, by decision on 15 Sep 2026. SPEC.md
          still describes it and the copy is still in landing-content.json, so restoring
          it is re-adding this one line.

          It carried the detail of the six-hourly check and the line "Most platforms in
          this market sell you a better console. We do the management", which is second
          in the documentation's ranked differentiators. The capability itself survives
          in the hero, which still says the platform watches every machine every six
          hours and repairs what it can before anybody files a ticket.
        */}
        {/*
          Trust is deliberately NOT rendered, by decision on 14 Sep 2026. SPEC.md still
          describes it and landing-content.json still holds its copy, checked and ready,
          so restoring it is re-adding this one line. Note what goes with it: the
          "Not built yet" panel was the only place the page named the missing
          multi-factor authentication, certifications and service level agreement, and
          the roadmap below now carries the whole of that disclosure.
        */}
        {/*
          The roadmap timeline is deliberately NOT rendered, by decision on 15 Sep 2026.
          components/roadmap.tsx is kept intact and the copy is still in the content
          file, so restoring it is an import and one line.

          It was the last place the page named anything the product does not do. With
          the trust section, the management caveat and now this gone, the page no longer
          states that there is no multi-factor authentication, no password reset, no
          readable audit log, no invoicing, no data export, and no certification, audit,
          penetration test or service level agreement. Those absences are all still true.
        */}
        <Sustainability sustainability={landing.sustainability} />
        <Affiliation affiliation={landing.affiliation} />
        <Close close={landing.close} cta={cta} />
      </main>
      <SiteFooter site={site} cta={cta} />
    </LeadFormProvider>
  );
}
