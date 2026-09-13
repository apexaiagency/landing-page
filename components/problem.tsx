import type { Site } from "@/content";
import { SectionShell, Tag, RuledGrid } from "./section";
import { Reveal } from "./reveal";

/**
 * Two movements. First the three costs of the current arrangement, then the turn —
 * set against the accent rule, which is the only place on the page a paragraph gets
 * that treatment. Then the comparison, which is the actual argument: it is much
 * harder to argue with two descriptions side by side than with a claim.
 */
export function Problem({ problem }: { problem: Site["problem"] }) {
  return (
    <SectionShell id="problem" className="border-t border-line py-24">
      <div className="grid gap-12 md:grid-cols-2 md:items-start">
        <div>
          <Reveal as="div" className="mb-6">
            <Tag>{problem.eyebrow}</Tag>
          </Reveal>
          <Reveal
            as="h2"
            delay={60}
            className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
          >
            {problem.heading}
          </Reveal>
        </div>
        <div>
          {problem.intro && (
            <Reveal as="p" delay={80} className="text-lg leading-relaxed text-fg-2">
              {problem.intro}
            </Reveal>
          )}
          <Reveal delay={140} className="mt-8 border-l-2 border-accent pl-6">
            <p className="font-medium leading-relaxed text-fg">{problem.answer}</p>
          </Reveal>
        </div>
      </div>

      <RuledGrid className="mt-16 md:grid-cols-3">
        {problem.blocks.map((block, i) => (
          <Reveal
            key={block.title}
            delay={i * 80}
            className="bg-surface p-8 transition-colors duration-base hover:bg-raised"
          >
            <Tag>{block.marker}</Tag>
            <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{block.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">{block.body}</p>
          </Reveal>
        ))}
      </RuledGrid>

      <RuledGrid className="mt-4 md:grid-cols-2">
        <div className="bg-surface p-8">
          <Tag>{problem.comparison.theirs.label}</Tag>
          <p className="mt-4 text-sm leading-relaxed text-fg-2">{problem.comparison.theirs.body}</p>
        </div>
        <div className="bg-surface p-8">
          <Tag tone="accent">{problem.comparison.ours.label}</Tag>
          <p className="mt-4 text-sm leading-relaxed text-fg">{problem.comparison.ours.body}</p>
        </div>
      </RuledGrid>
    </SectionShell>
  );
}
