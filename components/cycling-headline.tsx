"use client";

import { useEffect, useRef, useState } from "react";

/** How long a word holds before the next one takes over. */
const INTERVAL_MS = 3000;
/** The crossfade itself. Long enough to read as a dissolve rather than a swap. */
const FADE_MS = 700;
/** How far a word travels as it arrives and leaves. Small on purpose. */
const TRAVEL = "0.28em";

/**
 * The headline's last word cycles; everything before it holds still.
 *
 * The LAST word in the list is the resting state, not just another entry. The cycle
 * runs while the headline is on screen, and the moment the reader scrolls past it the
 * rotation stops and settles there, emphasised. So anyone who scrolls back up finds the
 * sentence resolved rather than still spinning, and the word the page ends on is a
 * decision rather than wherever the timer happened to be.
 *
 * That resting word is also what a screen reader is read, and what shows under reduced
 * motion. Whoever never sees the animation gets the ending it was always heading for.
 *
 * Every word is in the DOM at once, stacked in the same slot, and only the active one
 * is opaque, which makes the change a real CROSSFADE: the outgoing word is still on
 * screen while the incoming one arrives, so the eye never passes through a gap.
 *
 * Two more things that are not decoration:
 *
 * The rotating words are aria-hidden, so the headline is not re-announced every few
 * seconds as they swap, which is what makes rotating text unusable with assistive tech.
 *
 * The slot is sized by the LONGEST word, laid out invisibly behind the stack. Without
 * it the headline reflows on every change and drags the paragraph below it up and down
 * for as long as the page is open.
 */
export function CyclingHeadline({ prefix, words }: { prefix: string; words: string[] }) {
  const restingIndex = Math.max(words.length - 1, 0);
  const resting = words[restingIndex] ?? "";

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [settled, setSettled] = useState(false);
  const slotRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAnimate(true);
  }, []);

  /*
   * Settle once the reader has scrolled past the headline.
   *
   * A scroll position check rather than an IntersectionObserver. The question here is
   * literally "is this above the top of the viewport now", which is one comparison, and
   * an observer adds a callback contract and lifecycle for no gain. It also has to work
   * on the first frame after mount, which an observer's initial callback does not
   * reliably give us.
   *
   * Listener is passive and removes itself the moment it has settled, so it costs one
   * comparison per scroll event and then nothing at all.
   */
  useEffect(() => {
    if (!animate || settled) return;
    const el = slotRef.current;
    if (!el) return;

    function check() {
      const node = slotRef.current;
      if (!node) return;
      const bottom = node.getBoundingClientRect().bottom;
      if (bottom < 0) {
        setSettled(true);
        setIndex(restingIndex);
      }
    }

    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, [animate, settled, restingIndex]);

  useEffect(() => {
    if (!animate || settled) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [animate, settled, words.length]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), resting);

  return (
    <>
      {/* The sentence a screen reader gets: the resting ending, announced once. */}
      <span className="sr-only">
        {prefix} {resting}
      </span>

      <span aria-hidden>
        {prefix}{" "}
        {animate ? (
          /*
             * A BLOCK, the width of its column, not an inline box sized to the longest
             * phrase. As an inline-block with nowrap it was as wide as the longest
             * ending set on one line, which at headline size overran the column and
             * ran under the artwork beside it.
             *
             * Being a block also puts the cycling phrase on its own line, which is
             * where it was already landing, so the sentence reads the same.
             */
          <span ref={slotRef} className="relative block w-full">
            {/*
              Reserves the HEIGHT of the longest ending, wrapped at this width, so the
              paragraph below never moves as the words change.
            */}
            <span className="invisible block">{longest}</span>
            {words.map((word, i) => {
              const active = i === index;
              // Where a word waits when it is not active: the one just gone has left
              // upward, everything else sits below.
              const parked = i === (index - 1 + words.length) % words.length;
              return (
                <span
                  key={word}
                  className="absolute inset-0 text-accent ease-move"
                  style={{
                    transitionProperty: "opacity, transform",
                    transitionDuration: `${FADE_MS}ms`,
                    opacity: active ? 1 : 0,
                    transform: active
                      ? "translateY(0)"
                      : `translateY(${parked ? `-${TRAVEL}` : TRAVEL})`,
                  }}
                >
                  {word}
                </span>
              );
            })}

            {/*
              The emphasis on the resting word: a hairline that draws in underneath it
              once the rotation has stopped. A rule rather than a heavier weight or a
              brighter colour, because the word is already the only accent-coloured
              thing in the headline and there is nowhere brighter for it to go.
            */}
            <span
              className="absolute -bottom-1 left-0 h-px origin-left bg-accent transition-transform ease-move"
              style={{
                width: "100%",
                transitionDuration: "900ms",
                transitionDelay: settled ? `${FADE_MS}ms` : "0ms",
                transform: `scaleX(${settled ? 1 : 0})`,
              }}
            />
          </span>
        ) : (
          <span className="text-accent">{resting}</span>
        )}
      </span>
    </>
  );
}
