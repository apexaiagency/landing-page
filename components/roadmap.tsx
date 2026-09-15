"use client";

import { useRef, useState } from "react";
import type { Landing } from "@/content/landing";
import { SectionShell } from "./section";
import { Reveal } from "./reveal";

/**
 * The roadmap as a timeline you can step through.
 *
 * No dates, and none available to add: SPEC.md says labelled by real status, never by
 * date, and nothing enters a column without a build underway for that column's label.
 * So the axis here is COMMITMENT, not time. Left to right runs from work happening now
 * to work that has a design and no build, which is a true ordering and the only one
 * this content supports.
 *
 * The rail encodes that too. It is accent up to the selected stage and neutral after,
 * and the first node is filled where the later two are hollow, so the amount of colour
 * on the line says how far along the commitment runs rather than how far through a
 * schedule anything is.
 *
 * Tabs semantics, like the path selector: roving tabindex, arrow keys, Home and End,
 * aria-selected, each panel labelled by its node. Unlike the path selector this one
 * DOES default to the first stage, because it is a view of one thing rather than a
 * choice between three, and an empty panel on load would just be a puzzle.
 */
export function Roadmap({ roadmap }: { roadmap: Landing["roadmap"] }) {
  const [active, setActive] = useState(0);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const last = roadmap.columns.length - 1;

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    nodeRefs.current[next]?.focus();
  }

  return (
    <SectionShell id="roadmap" className="border-t border-line bg-surface py-24">
      <Reveal
        as="h2"
        className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
      >
        {roadmap.h2}
      </Reveal>

      <Reveal delay={80} className="mt-14">
        <div role="tablist" aria-label={roadmap.h2} className="grid gap-6 sm:grid-cols-3 sm:gap-0">
          {roadmap.columns.map((col, i) => {
            const selected = active === i;
            const reached = i <= active;
            return (
              <button
                key={col.status}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`stage-${i}`}
                aria-selected={selected}
                aria-controls={`stage-panel-${i}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group relative cursor-pointer text-left"
              >
                {/*
                  The rail runs from this node to the next one, so it is drawn from just
                  after the dot to the right edge of the cell. The dots sit at the START
                  of each cell rather than its centre, because the status label below is
                  left aligned under its own dot, so a centred rail would leave a gap
                  beside every node.

                  The last node draws none: a line running off the end would imply
                  something after "designed, not started", and there is nothing after it.
                */}
                {i !== last && (
                  <span
                    aria-hidden
                    className={`absolute top-[7px] hidden h-px transition-colors duration-base sm:block ${
                      i < active ? "bg-accent/60" : "bg-line"
                    }`}
                    style={{ left: 27, right: 12 }}
                  />
                )}

                <span
                  aria-hidden
                  className={`relative block h-[15px] w-[15px] rounded-full border-2 transition-colors duration-base ${
                    selected
                      ? "border-accent bg-accent"
                      : reached
                        ? "border-accent bg-bg"
                        : "border-line-strong bg-bg group-hover:border-fg-3"
                  }`}
                />

                <span
                  className={`mt-5 block font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-base ${
                    selected ? "text-accent" : "text-fg-3 group-hover:text-fg-2"
                  }`}
                >
                  {col.status}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          {roadmap.columns.map((col, i) => (
            <div
              key={col.status}
              id={`stage-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`stage-${i}`}
              hidden={active !== i}
              className="rounded-card border border-line bg-bg p-8"
            >
              <ul className="grid gap-5 md:grid-cols-2">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-fg-2"
                  >
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}
