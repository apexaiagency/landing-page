import type { Site } from "@/content";
import { SectionShell, SectionHeading, RuledGrid, Tag } from "./section";
import { Reveal } from "./reveal";

/** Four numbered steps as one ruled object. No infrastructure diagram, by design. */
export function HowItWorks({ howItWorks }: { howItWorks: Site["howItWorks"] }) {
  return (
    <SectionShell id="how-it-works" className="border-t border-line py-24">
      <SectionHeading
        eyebrow={howItWorks.eyebrow}
        heading={howItWorks.heading}
        intro={howItWorks.intro}
      />
      <RuledGrid className="mt-14 md:grid-cols-2">
        {howItWorks.steps.map((step, i) => (
          <Reveal
            key={step.title}
            delay={i * 70}
            className="bg-surface p-8 transition-colors duration-base hover:bg-raised"
          >
            <Tag tone="accent">{String(i + 1).padStart(2, "0")}</Tag>
            <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">{step.body}</p>
            {step.caveat && (
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-fg-3">
                {step.caveat}
              </p>
            )}
          </Reveal>
        ))}
      </RuledGrid>
    </SectionShell>
  );
}
