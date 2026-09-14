/**
 * The hero visual. Replaces the orbit rig.
 *
 * Three machines pinned at fixed angles on a ruled circle, with the mark at the
 * centre. Nothing rotates. The two defects of the orbit it replaces were structural:
 * two independent rotations let both tiles drift into the same quadrant, and the rings
 * sat at 6-10% white, below where a hairline reads on this ground. Fixed geometry
 * cannot look accidental, and the ring is drawn at the same #2E2E2E hairline the rest
 * of the page rules with.
 *
 * The only motion is a slow travel along the dashed connectors, which reads as a live
 * schematic rather than an animated logo. Amber is on the connectors and the centre
 * ring only: it marks the relationship, it does not decorate the picture.
 *
 * Still not a product shot, so hero.imageRule is satisfied: a mark, a circle, three
 * window glyphs. It claims nothing about what a screen looks like.
 */

const BOX = 340; // the coordinate space everything below is expressed in
const TILE = 48; // the three satellites
/**
 * The centre disc carrying the mark. Sized independently of the satellites so the mark
 * reads as the subject rather than a fourth node. At 84 it still clears the inner ring
 * by a comfortable margin: the ring sits at radius 126, the disc reaches 42.
 */
const MARK = 84;
const C = BOX / 2;

/** Percentages of BOX, so the whole piece scales with its column instead of clipping. */
const pct = (n: number) => `${(n / BOX) * 100}%`;

/** Angles chosen so the three sit on the vertical axis and the lower thirds. */
const TILES = [
  { x: C - TILE / 2, y: 18 },
  { x: 255, y: 207 },
  { x: 37, y: 207 },
];

function WindowGlyph() {
  return (
    <svg
      viewBox="0 0 22 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="w-[46%]"
    >
      <rect x="1" y="1" width="20" height="16" rx="2" />
      <line x1="1" y1="6" x2="21" y2="6" />
    </svg>
  );
}

export function Constellation() {
  return (
    <div
      aria-hidden
      className="relative aspect-square w-full"
      style={{ maxWidth: BOX }}
    >
      <svg viewBox={`0 0 ${BOX} ${BOX}`} className="absolute inset-0 h-full w-full">
        <circle cx={C} cy={C} r={126} fill="none" stroke="#2E2E2E" strokeWidth="1" />
        <circle cx={C} cy={C} r={152} fill="none" stroke="#1F1F1F" strokeWidth="1" />
        <g stroke="#2E2E2E" strokeWidth="1">
          <line x1={C} y1={34} x2={C} y2={46} />
          <line x1={C} y1={294} x2={C} y2={306} />
          <line x1={34} y1={C} x2={46} y2={C} />
          <line x1={294} y1={C} x2={306} y2={C} />
        </g>
        <g
          className="constellation-trace"
          stroke="#F5A623"
          strokeWidth="1"
          strokeDasharray="3 9"
          opacity="0.85"
        >
          <line x1={C} y1={C} x2={C} y2={44} />
          <line x1={C} y1={C} x2={279} y2={233} />
          <line x1={C} y1={C} x2={61} y2={233} />
        </g>
      </svg>

      <div
        className="absolute flex items-center justify-center rounded-full border border-accent bg-surface"
        style={{
          left: pct(C - MARK / 2),
          top: pct(C - MARK / 2),
          width: pct(MARK),
          height: pct(MARK),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mark.png" alt="" className="w-[64%] object-contain" />
      </div>

      {TILES.map((t) => (
        <div
          key={`${t.x}-${t.y}`}
          className="absolute flex items-center justify-center rounded-control border border-line bg-surface text-fg"
          style={{ left: pct(t.x), top: pct(t.y), width: pct(TILE), height: pct(TILE) }}
        >
          <WindowGlyph />
        </div>
      ))}
    </div>
  );
}
