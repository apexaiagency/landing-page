import type { Landing } from "@/content/landing";
import type { Cta } from "@/content";
import { SectionShell, Tag, RuledGrid } from "./section";
import { Reveal } from "./reveal";
import { CtaButton } from "./cta-button";
import { Constellation } from "./constellation";
import { BuildSheet } from "./build-sheet";
import { CyclingHeadline } from "./cycling-headline";

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

/**
 * Renders a paragraph, underlining any word wrapped in square brackets.
 *
 * The convention exists so one word can be stressed from the content file without
 * either putting HTML in the copy or adding a parallel field that would drift from the
 * sentence it belongs to. Deliberately the only markup the content layer understands:
 * anything more and the copy stops being copy.
 */
function Emphasised({ text }: { text: string }) {
  const parts = text.split(/\[([^\]]+)\]/g);
  return (
    <>
      {parts.map((part, i) =>
        // Odd indices are the captured groups, so they are the bracketed words.
        i % 2 === 1 ? (
          <span key={i} className="underline decoration-accent decoration-2 underline-offset-4">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

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
            <span id="hero-heading">
              {hero.h1Cycle ? (
                <CyclingHeadline lead={hero.h1Lead} prefix={hero.h1} words={hero.h1Cycle} />
              ) : (
                hero.h1
              )}
            </span>
          </Reveal>
          <div className="mt-8 max-w-measure space-y-5">
            {hero.body.map((para, i) => (
              <Reveal key={para} as="p" delay={80 + i * 60} className="text-lg leading-relaxed text-fg-2">
                <Emphasised text={para} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={240} className="mt-10">
            <CtaButton cta={cta} position="hero" variant="primary" />
          </Reveal>

          {/*
            Below the button on purpose. The paragraphs above it are what the product is;
            this is the argument for choosing it, and it reads better to someone who has
            got as far as the button than as another thing to wade through before it.
          */}
          {hero.postCta && (
            <Reveal delay={300} className="mt-10 flex max-w-measure gap-4 border-t border-line pt-8">
              {/*
                The bulb marks this as an aside rather than another claim in the stack
                above. Drawn to match the rest of the set: same 96 box, same white
                stroke at 4, same amber centre as the sun, so it reads as one family.
                Decorative, so it carries no alt text: the paragraph says everything.
              */}
              <Art name="lightbulb" className="mt-1 h-6 w-6 shrink-0" />
              <div className="space-y-4">
                {hero.postCta.map((para) => (
                  <p key={para} className="text-lg leading-relaxed text-fg-2">
                    <Emphasised text={para} />
                  </p>
                ))}
              </div>
            </Reveal>
          )}
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
        {/*
          whitespace-pre-line so the newline in the content file is honoured. The break
          after "AI" is part of the line rather than something left to wrapping: it
          separates the observation from the answer, and without it the two halves run
          together at whatever width the column happens to be.
        */}
        <Reveal
          as="h2"
          /*
           * The break after "AI" only pays off if each half then fits on one line.
           * At the 5/7 split the heading column is 293px at around 800px wide, which
           * wrapped both halves and made four ragged lines. It takes half the row until
           * lg, and the larger size waits for lg too.
           */
          className="whitespace-pre-line font-display text-xl font-semibold leading-snug tracking-tight md:col-span-6 lg:col-span-5 lg:text-2xl"
        >
          {band.heading}
        </Reveal>
        <div className="max-w-measure space-y-4 md:col-span-6 lg:col-span-7">
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
 * The two machine shapes, side by side so the difference is read rather than inferred.
 *
 * Each carries its caveat in the same panel, at the same size as the body. On the
 * shared machine those limits decide whether it fits at all, and a reader finding them
 * after buying is the bad outcome, so they are not small print.
 */
export function MachineTypes({ machineTypes }: { machineTypes: Landing["machineTypes"] }) {
  return (
    <SectionShell id="machines" className="border-t border-line py-24">
      <Reveal
        as="h2"
        className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
      >
        {machineTypes.h2}
      </Reveal>
      <Reveal as="p" delay={80} className="mt-5 max-w-measure text-lg leading-relaxed text-fg-2">
        {machineTypes.intro}
      </Reveal>

      <RuledGrid className="mt-12 md:grid-cols-2">
        {machineTypes.items.map((item, i) => (
          <Reveal
            key={item.name}
            delay={i * 80}
            className="bg-surface p-8 transition-colors duration-base hover:bg-raised"
          >
            <Art name={i === 0 ? "person-laptop" : "people-pair"} className="mb-6 h-10 w-10" />
            <h3 className="font-display text-xl font-semibold tracking-tight">{item.name}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-2">{item.body}</p>
            {/*
              No mt-auto here. Pushing the last block to the bottom of a stretched cell
              left the shorter panel with a hole in its middle and put the two dividers
              at different heights, which read as a mistake rather than as a pair.
              Content now simply follows content, and the ruled grid keeps the outer
              edges aligned.
            */}
            <ul className="mt-6 space-y-3 border-t border-line pt-6">
              {item.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-fg-2">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </RuledGrid>
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
        className="max-w-3xl whitespace-pre-line font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
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

/**
 * Industries, as a grid whose column count is derived from the item count so it can
 * never leave a hole. Six items sit three up; change the list to four and it goes two
 * up; an odd count falls back to a single column. The count lives in the content file
 * where it will be edited, and the use-cases grid already had to be rebuilt once for
 * exactly this reason.
 *
 * The intro line is load-bearing, not throat-clearing. Without it a reader takes this
 * for a client list, which it is not.
 */
export function Industries({ industries }: { industries: Landing["industries"] }) {
  const n = industries.items.length;
  const cols = n % 3 === 0 ? "md:grid-cols-3" : n % 2 === 0 ? "md:grid-cols-2" : "";

  return (
    <SectionShell id="industries" className="border-t border-line py-24">
      <Reveal
        as="h2"
        className="max-w-3xl whitespace-pre-line font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
      >
        {industries.h2}
      </Reveal>
      <Reveal as="p" delay={80} className="mt-5 max-w-measure text-lg leading-relaxed text-fg-2">
        {industries.intro}
      </Reveal>

      <RuledGrid className={`mt-12 ${cols}`}>
        {industries.items.map((item, i) => (
          <Reveal
            key={item.name}
            delay={i * 50}
            className="bg-surface p-7 transition-colors duration-base hover:bg-raised"
          >
            <div className="mb-5 h-px w-6 bg-accent" />
            <h3 className="font-display text-base font-semibold tracking-tight">{item.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-2">{item.body}</p>
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

/**
 * The affiliation band, directly above the close.
 *
 * Placed here rather than in the footer on purpose: it is the only outside voice on
 * the page, and it does the most work immediately before the decision. Deliberately
 * quiet, one row, no card, no accent. It is a fact being stated, not a badge being
 * worn, and dressing it up would undercut it.
 *
 * Not a logo wall. constraints.doNotBuild rules that out and is right to: a wall
 * implies customers, and there are none. One programme the company takes part in is a
 * different thing, and it says so in words as well as in the mark.
 */
export function Affiliation({ affiliation }: { affiliation: Landing["affiliation"] }) {
  return (
    <section className="border-t border-line bg-surface py-16">
      <div className="mx-auto flex max-w-column flex-col gap-8 px-6 sm:flex-row sm:items-center sm:justify-between sm:gap-12">
        <div>
          <Tag>{affiliation.eyebrow}</Tag>
          <p className="mt-4 max-w-measure text-lg leading-relaxed text-fg">{affiliation.text}</p>
        </div>
        {/*
          Opens in a new tab: someone following the affiliation is checking us, not
          leaving, so the page they were reading should still be there when they come
          back. `noreferrer` goes with `noopener` as the usual pair for an outbound
          link. The image alt names the destination, so the link has an accessible name
          without a redundant aria-label reading it out twice.

          The supplied artwork is a white horizontal lockup, which is why it only works
          on this ground. Put anything light behind it and it disappears.
        */}
        <a
          href={affiliation.logoHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 self-start rounded-control opacity-90 transition-opacity duration-fast hover:opacity-100 sm:self-auto"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/*
            The lockup is very wide, about 5.6:1, so height moves the width a long way:
            at 56px it runs to roughly 315px. That still clears the 65 character
            measure beside it inside the column.
          */}
          <img
            src="/league-of-innovators.png"
            alt={affiliation.logoAlt}
            className="h-12 w-auto sm:h-14"
          />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
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
