import type { Site } from "@/content";
import { CtaButton } from "./cta-button";
import { Tag } from "./section";
import { Reveal } from "./reveal";

/**
 * 8/4 split from the Figma design. The right column is where a product screenshot
 * would go if one existed; until it does, the claims themselves are set as an object.
 * That is the honest version of a hero visual and it is better than an empty column.
 */
export function Hero({ site }: { site: Site }) {
  const { hero, ctas, brand } = site;
  const showProvisioning = hero.provisioningTime.fact.known;

  // Split the headline on the accent phrase. A phrase that isn't present renders plain.
  const accent = hero.headlineAccent;
  const parts = accent && hero.headline.includes(accent)
    ? hero.headline.split(accent)
    : null;

  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto max-w-column px-6 pb-24 pt-32 sm:pt-40"
    >
      <div className="grid gap-12 md:grid-cols-12 md:items-start">
        <div className="md:col-span-7">
          <Reveal as="div" className="mb-6">
            <Tag>{hero.eyebrow}</Tag>
          </Reveal>

          <Reveal
            as="h1"
            delay={60}
            className="font-display text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold leading-[1.08] tracking-tight"
          >
            <span id="hero-heading">
              {parts ? (
                <>
                  {parts[0]}
                  <span className="text-accent">{accent}</span>
                  {parts.slice(1).join(accent)}
                </>
              ) : (
                hero.headline
              )}
            </span>
          </Reveal>

          <Reveal as="p" delay={120} className="mt-8 max-w-xl text-lg leading-relaxed text-fg-2">
            {hero.subhead}
          </Reveal>

          <Reveal delay={180} className="mt-8 border-l-2 border-accent pl-6">
            <p className="text-[15px] font-medium leading-relaxed text-fg">{brand.channelLine}</p>
          </Reveal>

          <Reveal delay={240} className="mt-10 flex flex-wrap gap-4">
            <CtaButton cta={ctas.pilot} position="hero" variant="primary" />
            <a
              href={hero.secondaryLink.href}
              className="inline-flex items-center gap-2 rounded-control border border-line px-7 py-3.5 text-sm text-fg transition-colors duration-fast hover:border-line-strong"
            >
              {hero.secondaryLink.label}
              <span aria-hidden>↓</span>
            </a>
          </Reveal>

          {showProvisioning && (
            <div className="mt-10 flex items-baseline gap-3 border-t border-line pt-6">
              <span className="font-display text-3xl font-bold tabular-nums">
                {hero.provisioningTime.fact.value}
              </span>
              <span className="text-sm text-fg-2">{hero.provisioningTime.caption}</span>
            </div>
          )}
        </div>

        <Reveal delay={160} duration={600} className="md:col-span-5 md:pt-3">
          <div className="space-y-4 rounded-card border border-line bg-surface p-6">
            <Tag>{hero.checklist.label}</Tag>
            <div className="space-y-4 pt-1">
              {hero.checklist.items.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span aria-hidden className="mt-0.5 shrink-0 text-sm text-accent">
                    ✓
                  </span>
                  <span className="text-sm leading-snug text-fg-2">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
