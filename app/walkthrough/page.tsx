import { getSite, type Cta } from "@/content";
import { getLanding } from "@/content/landing";
import { LeadFormProvider } from "@/components/form-context";
import { SiteHeader } from "@/components/site-header";
import { WalkthroughForm } from "@/components/walkthrough-form";

export const metadata = { title: "Book a walkthrough — Offsite Labs" };

/**
 * The CTA's real destination.
 *
 * Every CTA on the site points at /walkthrough, per the spec. With JS available the
 * button opens the form in place and never navigates; this page is what a middle-click,
 * a shared link, or a visitor with JS disabled gets. Same form, same fields, same
 * endpoint, so nobody reaches a dead end.
 */
export default function WalkthroughPage() {
  const site = getSite();
  const landing = getLanding();
  const signupHandoffUrl = process.env.NEXT_PUBLIC_SIGNUP_HANDOFF_URL ?? null;
  const cta: Cta = { ...landing._meta.cta, intent: "pilot" };

  return (
    <LeadFormProvider form={site.form} signupHandoffUrl={signupHandoffUrl}>
      <SiteHeader site={site} cta={cta} login={landing.login} />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32 sm:pt-40">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {landing.close.h2}
        </h1>
        {landing.close.body.map((para) => (
          <p key={para} className="mt-5 text-lg leading-relaxed text-fg-2">
            {para}
          </p>
        ))}
        <div className="mt-10 rounded-card border border-line bg-surface p-8">
          <WalkthroughForm form={site.form} signupHandoffUrl={signupHandoffUrl} />
        </div>
      </main>
    </LeadFormProvider>
  );
}
