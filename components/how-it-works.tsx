import type { Site } from "@/content";
import { SectionShell, SectionHeading } from "./section";
import { Reveal } from "./reveal";

/**
 * Four numbered steps in plain language. Deliberately no infrastructure diagram —
 * the point of the product is that nobody has to think about that layer.
 * A step's `caveat` renders in place rather than as a footnote: the honest edges
 * belong next to the claim they qualify.
 */
export function HowItWorks({ howItWorks }: { howItWorks: Site["howItWorks"] }) {
  return (
    <SectionShell id="how-it-works" className="border-t border-line-soft py-20 sm:py-28">
      <SectionHeading
        eyebrow={howItWorks.eyebrow}
        heading={howItWorks.heading}
        intro={howItWorks.intro}
      />

      <ol className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-2">
        {howItWorks.steps.map((step, i) => (
          <Reveal
            as="li"
            key={step.title}
            delay={i * 80}
            className="relative rounded-card border border-line-soft bg-surface p-6"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              Step {i + 1}
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-fg">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">{step.body}</p>
            {step.caveat && (
              <p className="mt-4 border-t border-line-soft pt-3 text-xs leading-relaxed text-fg-3">
                {step.caveat}
              </p>
            )}
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}
