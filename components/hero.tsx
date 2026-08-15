import type { Site } from "@/content";
import { CtaButton } from "./cta-button";
import { ControlPlaneArtifact } from "./control-plane-artifact";
import { Reveal } from "./reveal";

export function Hero({ site }: { site: Site }) {
  const { hero, ctas, brand } = site;
  const showProvisioning = hero.provisioningTime.fact.known;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mx-auto grid max-w-column gap-12 px-6 pb-20 pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16 lg:pb-28 lg:pt-24"
    >
      {/* Subtle top glow — single, faint, non-decorative-of-amber (uses neutral light). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(245,158,11,0.05),transparent_70%)]"
      />

      <div>
        <Reveal as="p" delay={0} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-2">
          {hero.eyebrow}
        </Reveal>

        <Reveal
          as="h1"
          delay={60}
          className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl"
        >
          <span id="hero-heading">{hero.headline}</span>
        </Reveal>

        <Reveal as="p" delay={120} className="mt-5 max-w-xl text-lg leading-relaxed text-fg-2">
          {hero.subhead}
        </Reveal>

        {/* Channel-only trust line — amber indicator bar (not a fill), loud, above the fold. */}
        <Reveal
          as="p"
          delay={180}
          className="mt-6 flex items-start gap-3 rounded-card border border-line border-l-2 border-l-accent bg-surface px-4 py-3 text-[15px] text-fg"
        >
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-glow-sm" aria-hidden />
          <span>
            <span className="font-semibold">{brand.channelLine}</span>
          </span>
        </Reveal>

        <Reveal delay={240} className="mt-8 flex flex-wrap items-center gap-3">
          <CtaButton cta={ctas.pilot} position="hero" variant="primary" />
          <CtaButton cta={ctas.pricing} position="hero" variant="secondary" />
        </Reveal>

        {/* Provisioning number: rendered ONLY when it's a real, measured fact. */}
        {showProvisioning && (
          <div className="mt-8 flex items-baseline gap-3 border-t border-line-soft pt-6">
            <span className="font-display text-3xl font-bold tabular-nums text-fg">
              {hero.provisioningTime.fact.value}
            </span>
            <span className="text-sm text-fg-2">{hero.provisioningTime.caption}</span>
          </div>
        )}
      </div>

      <Reveal delay={160} duration={600} className="lg:pl-4">
        <ControlPlaneArtifact artifact={hero.artifact} />
        <p className="mt-3 px-1 text-xs leading-relaxed text-fg-3">{hero.artifact.caption}</p>
      </Reveal>
    </section>
  );
}
