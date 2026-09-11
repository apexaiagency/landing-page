import type { Site } from "@/content";
import { SectionShell, SectionHeading } from "./section";
import { Reveal } from "./reveal";

/**
 * Two columns, deliberately side by side rather than the gaps hidden below a fold.
 * The `notYet` list carries no accent colour and no apology — it is stated, not sold.
 * Nothing here may become a certification, an audit, an uptime figure or a logo until
 * one actually exists; this section is where that proof lands when it does.
 */
export function Trust({ trust }: { trust: Site["trust"] }) {
  return (
    <SectionShell id="trust" className="border-t border-line-soft py-20 sm:py-28">
      <SectionHeading eyebrow={trust.eyebrow} heading={trust.heading} intro={trust.intro} />

      <div className="mt-12 grid gap-4 sm:mt-14 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        <div className="space-y-3">
          {trust.have.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 60}
              className="rounded-card border border-line-soft bg-surface p-5"
            >
              <div className="flex items-start gap-2.5">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <h3 className="font-display text-[15px] font-semibold tracking-tight text-fg">
                  {item.title}
                </h3>
              </div>
              <p className="mt-2.5 pl-4 text-sm leading-relaxed text-fg-2">{item.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="rounded-card border border-line bg-raised p-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
            {trust.notYet.heading}
          </div>
          <ul className="mt-4 space-y-2.5">
            {trust.notYet.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-fg-2">
                <span
                  aria-hidden
                  className="mt-2 h-px w-2.5 shrink-0 bg-line-strong"
                />
                {item}
              </li>
            ))}
          </ul>
          {trust.notYet.note && (
            <p className="mt-5 border-t border-line-soft pt-4 text-sm leading-relaxed text-fg">
              {trust.notYet.note}
            </p>
          )}
        </Reveal>
      </div>
    </SectionShell>
  );
}
