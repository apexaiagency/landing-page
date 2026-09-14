import type { Landing } from "@/content/landing";
import type { Cta } from "@/content";
import { SectionShell, Tag, RuledGrid } from "./section";
import { Reveal } from "./reveal";
import { CtaButton } from "./cta-button";
import { Constellation } from "./constellation";
import { BuildSheet } from "./build-sheet";

/**
 * Illustrations from the 14 Sep Figma Make export, mapped to sections here rather than
 * in the content file. An icon is a design decision, and landing-content.json is for
 * strings the claim scanner has to read.
 *
 * Mapped by position, and the arrays are the same length as the content they decorate,
 * which the schema fixes at four steps and five use cases. All of them are decorative:
 * every one repeats something the adjacent text already says, so they carry empty alt
 * text rather than a description a screen reader would have to sit through twice.
 */
const STEP_ART = ["cursor-click", "terminal", "person-waving", "arrow-launch"];
const USE_CASE_ART = [
  "cloud-computer",
  "person-laptop",
  "person-walking",
  "connect-nodes",
  "people-pair",
];

function Art({ name, className = "h-10 w-10" }: { name: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/art/${name}.svg`} alt="" aria-hidden className={`${className} object-contain`} />;
}

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
      <div className="grid gap-12 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <Reveal
            as="h1"
            className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold leading-[1.08] tracking-tight"
          >
            <span id="hero-heading">{hero.h1}</span>
          </Reveal>
          <div className="mt-8 max-w-measure space-y-5">
            {hero.body.map((para, i) => (
              <Reveal key={para} as="p" delay={80 + i * 60} className="text-lg leading-relaxed text-fg-2">
                {para}
              </Reveal>
            ))}
          </div>
          <Reveal delay={240} className="mt-10">
            <CtaButton cta={cta} position="hero" variant="primary" />
          </Reveal>
        </div>

        <Reveal delay={160} duration={600} className="hidden justify-center md:col-span-5 md:flex">
          <Constellation />
        </Reveal>
      </div>
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
        <div className="max-w-measure space-y-4 md:col-span-7">
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
      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <RuledGrid className="lg:col-span-7 md:grid-cols-2">
          {howItWorks.steps.map((step, i) => (
            <Reveal
              key={step.n}
              delay={i * 70}
              className="bg-surface p-7 transition-colors duration-base hover:bg-raised"
            >
              <div className="flex items-center justify-between">
                <Tag tone="accent">{String(step.n).padStart(2, "0")}</Tag>
                <Art name={STEP_ART[i] ?? "cursor-click"} className="h-9 w-9 opacity-80" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-2">{step.body}</p>
            </Reveal>
          ))}
        </RuledGrid>

        {/*
          Sits beside step 02, which describes this sequence in words. The picture adds
          the one thing the sentence cannot carry: the order, and that it finishes
          without anyone present.
        */}
        <Reveal delay={200} duration={600} className="lg:col-span-5 lg:self-start">
          <BuildSheet />
        </Reveal>
      </div>
    </SectionShell>
  );
}

/**
 * A ruled LIST, not a card grid.
 *
 * Five items in three columns leaves a sixth cell empty, and five in two columns
 * leaves one. Any fixed column count has that failure mode, and the item count lives
 * in landing-content.json where someone else will change it. A list cannot have a
 * hole at any count, which is the whole reason for the shape.
 *
 * Each row is icon, title, body across twelve columns, so the titles align down the
 * page and read as a set. It also gives the page a third rhythm: two columns in how
 * it works, three in the roadmap, one here.
 */
export function UseCases({ useCases }: { useCases: Landing["useCases"] }) {
  return (
    <SectionShell id="use-cases" className="border-t border-line py-24">
      <Reveal
        as="h2"
        className="max-w-3xl font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
      >
        {useCases.h2}
      </Reveal>
      <RuledGrid className="mt-12">
        {useCases.items.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 60}
            className="grid items-start gap-x-6 gap-y-3 bg-surface p-7 transition-colors duration-base hover:bg-raised md:grid-cols-12 md:px-8 md:py-7"
          >
            <div className="md:col-span-1">
              <Art name={USE_CASE_ART[i] ?? "cloud-computer"} className="h-9 w-9" />
            </div>
            <h3 className="font-display text-base font-semibold tracking-tight md:col-span-4 md:pt-1">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-fg-2 md:col-span-7 md:pt-1">{item.body}</p>
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
          <div className="max-w-measure space-y-5">
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
 * Labelled by real status, never by date.
 *
 * It used to sit under Trust and turn that section's "Not built yet" panel from a list
 * of absences into a list of things being worked on. With Trust removed this is the
 * only place the page says what is missing, so its first column carries more weight
 * than it was designed to.
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
    <section id="sustainability" className="border-t border-line bg-paper py-24 text-paper-ink">
      <div className="mx-auto max-w-column px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              {/*
                The shipped sun is white-stroked and disappears on light, so the paper
                act gets its own variant rather than a filter that would also flip the
                amber centre.
              */}
              <Art name="sun-rays-on-paper" className="mb-6 h-12 w-12" />
            </Reveal>
            <Reveal
              as="h2"
              delay={60}
              className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
            >
              {sustainability.h2}
            </Reveal>
          </div>
          <div className="max-w-measure space-y-5 md:col-span-7">
            {sustainability.body.map((para, i) => (
              <Reveal
                key={para}
                as="p"
                delay={60 + i * 60}
                className="text-lg leading-relaxed text-paper-ink-2"
              >
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
          <Reveal delay={120} className="mt-14 max-w-measure border-l-2 border-accent pl-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper-ink-2">
              {note.heading}
            </span>
            <div className="mt-5 space-y-4">
              {note.body.map((para) => (
                <p key={para} className="text-lg leading-relaxed text-paper-ink">
                  {para}
                </p>
              ))}
            </div>
            <p className="mt-5 text-sm text-paper-ink-2">{note.attribution}</p>
          </Reveal>
        )}
      </div>
    </section>
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
      <div className="mt-6 max-w-measure space-y-4">
        {close.body.map((para) => (
          <p key={para} className="text-lg leading-relaxed text-fg-2">
            {para}
          </p>
        ))}
      </div>
      {close.optionalPricingLine.include && (
        <p className="mt-6 max-w-measure text-lg leading-relaxed text-fg">
          {close.optionalPricingLine.text}
        </p>
      )}
      <div className="mt-10">
        <CtaButton cta={cta} position="close" variant="primary" />
      </div>
    </SectionShell>
  );
}
