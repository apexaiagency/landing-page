import type { Site } from "@/content";
import { SectionShell, SectionHeading } from "./section";
import { Reveal } from "./reveal";

/**
 * Two columns, equal weight. The layout is the argument: this is not provider software
 * with a business tier bolted on, nor the reverse — it is one platform bought two ways,
 * and giving either column more space would say otherwise.
 *
 * Each column ends with its own limit. Those are the two facts most likely to waste a
 * reader's time if they find them later instead of here.
 */
export function Audiences({ audiences }: { audiences: Site["audiences"] }) {
  return (
    <SectionShell id="audiences" className="border-t border-line-soft py-20 sm:py-28">
      <SectionHeading
        eyebrow={audiences.eyebrow}
        heading={audiences.heading}
        intro={audiences.intro}
      />

      <div className="mt-12 grid gap-4 sm:mt-14 lg:grid-cols-2 lg:gap-6">
        {audiences.columns.map((col, i) => (
          <Reveal
            key={col.label}
            delay={i * 90}
            className="flex flex-col rounded-card border border-line-soft bg-surface p-6 sm:p-7"
          >
            <h3 className="font-display text-xl font-semibold tracking-tight text-fg">
              {col.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">{col.who}</p>

            <ul className="mt-6 space-y-3">
              {col.gains.map((gain) => (
                <li key={gain} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-fg">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {gain}
                </li>
              ))}
            </ul>

            {col.note && (
              <p className="mt-auto border-t border-line-soft pt-5 text-xs leading-relaxed text-fg-3">
                {col.note}
              </p>
            )}
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
