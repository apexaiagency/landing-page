/**
 * The hero artwork, from the 14 Sep Figma Make export: two rings, the mark at the
 * centre, two window tiles orbiting it.
 *
 * Why this is allowed where a product screenshot is not. `hero.imageRule` says any
 * product shot must show the product as it currently is, and forbids a mockup of
 * something unbuilt. This is not a product shot: it is a mark, two rings and two empty
 * window frames. It claims nothing about what a screen looks like, which is exactly why
 * it can ship before the real screenshots exist.
 *
 * Entirely decorative, so the whole rig is aria-hidden and no icon carries alt text.
 *
 * The export animates unconditionally; this version stops under prefers-reduced-motion,
 * where the rig settles into a static composition rather than disappearing.
 */
export function OrbitRig() {
  return (
    <div
      aria-hidden
      className="orbit-rig relative flex items-center justify-center"
      style={{ width: 380, height: 380 }}
    >
      <div
        className="orbit-ring absolute rounded-full border border-white/10"
        style={{ width: 280, height: 280 }}
      />
      <div
        className="orbit-ring absolute rounded-full border border-white/[0.06]"
        style={{ width: 370, height: 370, animationDelay: "2s" }}
      />

      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-accent/30 bg-[#1A1500] shadow-[0_0_40px_rgba(245,166,35,0.2)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mark.png" alt="" className="h-12 w-12 object-contain" />
      </div>

      <div className="orbit orbit-inner absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/[0.09] bg-surface shadow-[0_0_16px_rgba(245,166,35,0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art/window-amber.svg" alt="" className="h-10 w-10 object-contain" />
        </div>
      </div>

      <div className="orbit orbit-outer absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/[0.09] bg-surface shadow-[0_0_16px_rgba(245,166,35,0.15)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art/window-dark.svg" alt="" className="h-10 w-10 object-contain" />
        </div>
      </div>
    </div>
  );
}
