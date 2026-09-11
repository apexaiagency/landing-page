import type { Site } from "@/content";
import { SectionShell, SectionHeading } from "./section";
import { Reveal } from "./reveal";

/**
 * Current capabilities, grouped so the page can be scanned rather than read.
 * `notIncluded` is not small print: naming a gap before the buyer finds it is the
 * whole posture of this page, so it renders at full size in the section it qualifies.
 */
export function Today({ today }: { today: Site["today"] }) {
  return (
    <SectionShell id="today" className="border-t border-line-soft py-20 sm:py-28">
      <SectionHeading eyebrow={today.eyebrow} heading={today.heading} intro={today.intro} />

      <div className="mt-12 space-y-10 sm:mt-14">
        {today.groups.map((group, gi) => (
          <Reveal key={group.title} delay={gi * 60}>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
              {group.title}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-card border border-line-soft bg-surface p-5 transition duration-base ease-move hover:border-line"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <h3 className="font-display text-[15px] font-semibold tracking-tight text-fg">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-2">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      {today.notIncluded && (
        <Reveal
          delay={80}
          className="mt-10 rounded-card border border-line border-l-2 border-l-line-strong bg-raised p-6"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
            Not in it
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{today.notIncluded}</p>
        </Reveal>
      )}
    </SectionShell>
  );
}
