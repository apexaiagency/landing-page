import type { Site } from "@/content";
import { SectionShell, SectionHeading } from "./section";
import { Reveal } from "./reveal";

export function Faq({ faq }: { faq: Site["faq"] }) {
  return (
    <SectionShell id="faq" className="border-t border-line-soft py-20 sm:py-28">
      <SectionHeading eyebrow="FAQ" heading={faq.heading} />

      <div className="mx-auto mt-12 max-w-3xl divide-y divide-line-soft border-y border-line-soft">
        {faq.items.map((item, i) => (
          <Reveal key={item.question} delay={Math.min(i, 6) * 40}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[15px] font-medium text-fg transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="shrink-0 text-fg-3 transition-transform duration-base ease-move group-open:rotate-45 group-open:text-accent"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-5 text-sm leading-relaxed text-fg-2">{item.answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
