import type { Site } from "@/content";
import { SectionShell, SectionHeading } from "./section";
import { Reveal } from "./reveal";

/**
 * Borrowed wholesale from off-sitelabs.com, which puts a named founder on the page and
 * is better for it. On a page with no logos, no certifications and no case study, this
 * is the only proof available — and unlike the rest of the trust story it costs nothing
 * to verify.
 *
 * Deliberately no photo: none exists in the brand assets, and a stock portrait would
 * undo the exact thing the section is for.
 */
export function Founder({ founder }: { founder: Site["founder"] }) {
  return (
    <SectionShell id="founder" className="border-t border-line-soft py-20 sm:py-28">
      <SectionHeading eyebrow={founder.eyebrow} heading={founder.heading} />

      <Reveal
        delay={80}
        className="mt-10 rounded-card border border-line-soft bg-surface p-6 sm:mt-12 sm:p-8 lg:flex lg:gap-12"
      >
        <div className="lg:w-56 lg:shrink-0">
          <div className="font-display text-xl font-semibold tracking-tight text-fg">
            {founder.name}
          </div>
          <div className="mt-1 text-sm text-fg-2">{founder.role}</div>
          <div className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            {founder.location}
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-line-soft pt-6 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          {founder.body.map((para) => (
            <p key={para} className="text-[15px] leading-relaxed text-fg-2">
              {para}
            </p>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}
