import type { Landing } from "@/content/landing";
import type { Cta } from "@/content";
import { SectionShell, Tag, RuledGrid } from "./section";
import { Reveal } from "./reveal";
import { CtaButton } from "./cta-button";

/**
 * The shared sections, in page order. They hold no copy: every string arrives from
 * landing-content.json through content/landing.ts.
 *
 * Kept in one file because each is a thin layout over a content block, and splitting
 * eleven of them across eleven files would bury that fact.
 */

export function Hero({ hero, cta }: { hero: Landing["hero"]; cta: Cta }) {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto max-w-column px-6 pb-20 pt-32 sm:pt-40">
      <Reveal
        as="h1"
        className="max-w-4xl font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold leading-[1.08] tracking-tight"
      >
        <span id="hero-heading">{hero.h1}</span>
      </Reveal>
      <div className="mt-8 max-w-2xl space-y-5">
        {hero.body.map((para, i) => (
          <Reveal key={para} as="p" delay={80 + i * 60} className="text-lg leading-relaxed text-fg-2">
            {para}
          </Reveal>
        ))}
      </div>
      <Reveal delay={240} className="mt-10">
        <CtaButton cta={cta} position="hero" variant="primary" />
      </Reveal>
      {/*
        No product image. hero.imageRule requires any shot to show the product as it is
        today, and no screenshot set of the real product exists yet. An empty hero is
        the honest state; a mockup is the mistake the current site already made.
      */}
    </section>
  );
}

/** Quieter than the hero, louder than a footnote. */
export function PositioningBand({ band }: { band: Landing["band"] }) {
  return (
    <section className="border-y border-line bg-surface py-14">
      <div className="mx-auto grid max-w-column gap-8 px-6 md:grid-cols-12 md:items-start">
        <Reveal
          as="h2"
          className="font-display text-xl font-semibold leading-snug tracking-tight md:col-span-5 md:text-2xl"
        >
          {band.heading}
        </Reveal>
        <div className="space-y-4 md:col-span-7">
          {band.body.map((para, i) => (
            <Reveal key={para} as="p" delay={60 + i * 60} className="leading-relaxed text-fg-2">
              {para}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Real sequence, so the numerals stay. No infrastructure diagram. */
export function HowItWorks({ howItWorks }: { howItWorks: Landing["howItWorks"] }) {
  return (
    <SectionShell id="how-it-works" className="border-t border-line py-24">
      <Reveal
        as="h2"
        className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
      >
        {howItWorks.h2}
      </Reveal>
      <RuledGrid className="mt-12 md:grid-cols-2">
        {howItWorks.steps.map((step, i) => (
          <Reveal
            key={step.n}
            delay={i * 70}
            className="bg-surface p-8 transition-colors duration-base hover:bg-raised"
          >
            <Tag tone="accent">{String(step.n).padStart(2, "0")}</Tag>
            <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">{step.body}</p>
          </Reveal>
        ))}
      </RuledGrid>
    </SectionShell>
  );
}

export function UseCases({ useCases }: { useCases: Landing["useCases"] }) {
  return (
    <SectionShell id="use-cases" className="border-t border-line py-24">
      <Reveal
        as="h2"
        className="max-w-3xl font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
      >
        {useCases.h2}
      </Reveal>
      <RuledGrid className="mt-12 md:grid-cols-2 lg:grid-cols-3">
        {useCases.items.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 60}
            className="bg-surface p-7 transition-colors duration-base hover:bg-raised"
          >
            <div className="mb-5 h-px w-6 bg-accent" />
            <h3 className="font-display text-base font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">{item.body}</p>
          </Reveal>
        ))}
      </RuledGrid>
    </SectionShell>
  );
}

/** The caveat stays in the same block as the body. No tooltip, no accordion. */
export function Management({ management }: { management: Landing["management"] }) {
  return (
    <SectionShell id="management" className="border-t border-line py-24">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal
          as="h2"
          className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:col-span-5 md:text-4xl"
        >
          {management.h2}
        </Reveal>
        <div className="md:col-span-7">
          <div className="space-y-5">
            {management.body.map((para, i) => (
              <Reveal key={para} as="p" delay={60 + i * 60} className="text-lg leading-relaxed text-fg-2">
                {para}
              </Reveal>
            ))}
          </div>
          <Reveal delay={180} className="mt-8 border-l-2 border-accent pl-6">
            {management.caveat.map((para) => (
              <p key={para} className="text-lg leading-relaxed text-fg">
                {para}
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}

/**
 * Two panels, equal width and equal weight. "Not built yet" gets the same heading size,
 * the same surface and the same type as "True today" — it is the differentiator, not an
 * admission, and any muting of it would undo the point.
 */
export function Trust({ trust }: { trust: Landing["trust"] }) {
  const panels = [trust.trueToday, trust.notBuilt];
  return (
    <SectionShell id="trust" className="border-t border-line bg-surface py-24">
      <Reveal
        as="h2"
        className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
      >
        {trust.h2}
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {panels.map((panel, i) => (
          <Reveal key={panel.heading} delay={i * 80} className="rounded-card border border-line bg-bg p-8">
            <h3 className="font-display text-xl font-semibold tracking-tight">{panel.heading}</h3>
            <ul className="mt-6 space-y-4">
              {panel.items.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-relaxed text-fg-2">
                  <span
                    aria-hidden
                    className={
                      i === 0
                        ? "mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        : "mt-3 h-px w-3 shrink-0 bg-fg-3"
                    }
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

/**
 * Sits directly under Trust on purpose: it is what turns that second panel from a list
 * of absences into a list of things with dates attached to work, not to promises.
 * Labelled by status, never by date.
 */
export function Roadmap({ roadmap }: { roadmap: Landing["roadmap"] }) {
  return (
    <SectionShell id="roadmap" className="border-t border-line bg-surface py-24">
      <Reveal
        as="h2"
        className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
      >
        {roadmap.h2}
      </Reveal>
      <RuledGrid className="mt-12 md:grid-cols-3">
        {roadmap.columns.map((col, i) => (
          <Reveal key={col.status} delay={i * 70} className="bg-bg p-8">
            <Tag tone={i === 0 ? "accent" : "muted"}>{col.status}</Tag>
            <ul className="mt-5 space-y-4">
              {col.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-fg-2">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </RuledGrid>
    </SectionShell>
  );
}

export function Sustainability({
  sustainability,
}: {
  sustainability: Landing["sustainability"];
}) {
  const note = sustainability.founderNote;
  return (
    <SectionShell id="sustainability" className="border-t border-line py-24">
      <div className="grid gap-12 md:grid-cols-12">
        <Reveal
          as="h2"
          className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:col-span-5 md:text-4xl"
        >
          {sustainability.h2}
        </Reveal>
        <div className="space-y-5 md:col-span-7">
          {sustainability.body.map((para, i) => (
            <Reveal key={para} as="p" delay={60 + i * 60} className="text-lg leading-relaxed text-fg-2">
              {para}
            </Reveal>
          ))}
        </div>
      </div>

      {/*
        The founder note ships only once `draft` is cleared in the JSON. It is Jay's to
        write, and the spec says not to ship the placeholder. Nothing renders in its
        place: a section that is simply absent reads as complete, where a stub does not.
      */}
      {!note.draft && (
        <Reveal delay={120} className="mt-14 max-w-3xl border-l-2 border-accent pl-8">
          <Tag>{note.heading}</Tag>
          <div className="mt-5 space-y-4">
            {note.body.map((para) => (
              <p key={para} className="text-lg leading-relaxed text-fg">
                {para}
              </p>
            ))}
          </div>
          <p className="mt-5 text-sm text-fg-3">{note.attribution}</p>
        </Reveal>
      )}
    </SectionShell>
  );
}

/** One CTA, the hero's. No competing secondary action. */
export function Close({ close, cta }: { close: Landing["close"]; cta: Cta }) {
  return (
    <SectionShell id="close" className="border-t border-line py-28">
      <Reveal
        as="h2"
        className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-tight tracking-tight"
      >
        {close.h2}
      </Reveal>
      <div className="mt-6 max-w-2xl space-y-4">
        {close.body.map((para) => (
          <p key={para} className="text-lg leading-relaxed text-fg-2">
            {para}
          </p>
        ))}
      </div>
      {close.optionalPricingLine.include && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg">
          {close.optionalPricingLine.text}
        </p>
      )}
      <div className="mt-10">
        <CtaButton cta={cta} position="close" variant="primary" />
      </div>
    </SectionShell>
  );
}
