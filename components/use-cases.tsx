import type { Site } from "@/content";
import { SectionShell, SectionHeading } from "./section";
import { Reveal } from "./reveal";

/** Two use cases, one per audience. Two, not six — a third dilutes both. */
export function UseCases({ useCases }: { useCases: Site["useCases"] }) {
  return (
    <SectionShell id="use-cases" className="border-t border-line-soft py-20 sm:py-28">
      <SectionHeading
        eyebrow={useCases.eyebrow}
        heading={useCases.heading}
        intro={useCases.intro}
      />

      <div className="mt-12 grid gap-4 sm:mt-14 lg:grid-cols-2">
        {useCases.cases.map((c, i) => (
          <Reveal
            key={c.audience}
            delay={i * 80}
            className="flex flex-col rounded-card border border-line-soft bg-surface p-6 sm:p-7"
          >
            <h3 className="font-display text-xl font-semibold tracking-tight text-fg">
              {c.audience}
            </h3>

            <dl className="mt-5 space-y-4">
              {[
                { label: "The situation", value: c.situation },
                { label: "The problem", value: c.problem },
                { label: "How we help", value: c.howWeHelp },
                { label: "The benefit", value: c.benefit },
              ].map((row) => (
                <div key={row.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
                    {row.label}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-fg-2">{row.value}</dd>
                </div>
              ))}
            </dl>

            {c.caveat && (
              <p className="mt-auto pt-5 text-xs leading-relaxed text-fg-3">
                <span className="text-accent">Worth saying: </span>
                {c.caveat}
              </p>
            )}
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
