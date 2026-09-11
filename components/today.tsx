import type { Site } from "@/content";
import { Tag, RuledGrid } from "./section";
import { Reveal } from "./reveal";

/**
 * The light act. Inverting one section to paper is the Figma design's structural move:
 * it breaks a long dark page in two and gives the capability list — the densest reading
 * on the page — a surface that carries small type better than the dark ground does.
 *
 * Current capabilities only. `notIncluded` closes the section at full size rather than
 * as small print, because naming the gaps first is the posture of the whole page.
 */
export function Today({ today }: { today: Site["today"] }) {
  return (
    <section id="today" className="border-t border-line bg-paper py-24 text-[#0D0D0D]">
      <div className="mx-auto max-w-column px-6">
        <Reveal as="div" className="mb-6">
          <Tag>{today.eyebrow}</Tag>
        </Reveal>
        <Reveal
          as="h2"
          delay={60}
          className="max-w-xl font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
        >
          {today.heading}
        </Reveal>
        {today.intro && (
          <Reveal as="p" delay={120} className="mt-5 max-w-lg text-[#6B6B6B]">
            {today.intro}
          </Reveal>
        )}

        <div className="mt-14 space-y-10">
          {today.groups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 60}>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6B6B6B]">
                {group.title}
              </div>
              <RuledGrid tone="paper" className="mt-4 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <div
                    key={item.title}
                    className="bg-paper p-7 transition-colors duration-base hover:bg-paper-2"
                  >
                    <div className="mb-5 h-px w-6 bg-accent" />
                    <h3 className="font-display text-sm font-semibold leading-snug">{item.title}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-[#6B6B6B]">{item.body}</p>
                  </div>
                ))}
              </RuledGrid>
            </Reveal>
          ))}
        </div>

        {today.notIncluded && (
          <Reveal delay={80} className="mt-10 border-l-2 border-accent bg-paper-2 p-8">
            <Tag>Not in it</Tag>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#3A3A3A]">
              {today.notIncluded}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
