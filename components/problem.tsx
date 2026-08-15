import type { Site } from "@/content";
import { SectionShell, SectionHeading } from "./section";
import { Reveal } from "./reveal";

export function Problem({ problem }: { problem: Site["problem"] }) {
  return (
    <SectionShell id="problem" className="border-t border-line-soft py-20 sm:py-28">
      <SectionHeading eyebrow={problem.eyebrow} heading={problem.heading} intro={problem.intro} />

      <div className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-3">
        {problem.blocks.map((block, i) => (
          <Reveal
            key={block.title}
            delay={i * 80}
            className="group rounded-card border border-line-soft bg-surface p-6 transition duration-base ease-move hover:-translate-y-0.5 hover:border-line"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
              {block.marker}
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-fg">
              {block.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">{block.body}</p>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
