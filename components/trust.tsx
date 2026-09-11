import type { Site } from "@/content";
import { SectionShell, Tag } from "./section";
import { Reveal } from "./reveal";

/**
 * 5/7 split from the Figma design: the honest framing on the left, the architecture
 * on the right. The gaps are stated in the left column rather than hidden at the
 * bottom, which is the whole point — a buyer who finds the missing MFA themselves has
 * learned two things; a buyer who was told finds it much less interesting.
 *
 * `worthKnowing` closes the section because it is the strongest material on the page
 * and none of it is ours.
 */
export function Trust({ trust }: { trust: Site["trust"] }) {
  return (
    <SectionShell id="trust" className="border-t border-line bg-surface py-24">
      <Reveal as="div" className="mb-6">
        <Tag>{trust.eyebrow}</Tag>
      </Reveal>

      <div className="mb-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal
            as="h2"
            className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
          >
            {trust.heading}
          </Reveal>
          {trust.intro && (
            <Reveal as="p" delay={80} className="mt-6 text-sm leading-relaxed text-fg-2">
              {trust.intro}
            </Reveal>
          )}

          <Reveal delay={140} className="mt-8">
            <Tag>{trust.notYet.heading}</Tag>
            <ul className="mt-4 space-y-2.5">
              {trust.notYet.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-fg-2">
                  <span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-fg-3" />
                  {item}
                </li>
              ))}
            </ul>
            {trust.notYet.note && (
              <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-fg">
                {trust.notYet.note}
              </p>
            )}
          </Reveal>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:col-span-7">
          {trust.have.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 60}
              className="rounded-card border border-line bg-bg p-6"
            >
              <div className="mb-4 flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
                <div className="h-2 w-2 rounded-full bg-accent" />
              </div>
              <h3 className="font-display text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-fg-3">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal delay={80} className="rounded-card border border-line bg-bg p-8">
        <Tag>{trust.worthKnowing.label}</Tag>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-fg-2">{trust.worthKnowing.body}</p>
      </Reveal>
    </SectionShell>
  );
}
