import { getSite } from "@/content";
import { LeadFormProvider } from "@/components/form-context";
import { AnalyticsBoot } from "@/components/analytics-boot";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { ControlPlaneDeep } from "@/components/control-plane-deep";
import { Faq } from "@/components/faq";

export default function Page() {
  const site = getSite();
  const signupHandoffUrl = process.env.NEXT_PUBLIC_SIGNUP_HANDOFF_URL ?? null;

  return (
    <LeadFormProvider form={site.form} signupHandoffUrl={signupHandoffUrl}>
      <AnalyticsBoot />
      <span id="top" />
      <SiteHeader site={site} />
      <main>
        {/* Each section renders only when enabled in content; the page reads complete
            with any of them off. Sections below are toggled on as they gain substance. */}
        {site.hero.enabled && <Hero site={site} />}
        {site.problem.enabled && <Problem problem={site.problem} />}
        {site.controlPlane.enabled && (
          <ControlPlaneDeep controlPlane={site.controlPlane} ctas={site.ctas} />
        )}
        {site.faq.enabled && <Faq faq={site.faq} />}
      </main>
      {site.footer.enabled && <SiteFooter site={site} />}
    </LeadFormProvider>
  );
}
