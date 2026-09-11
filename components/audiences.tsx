"use client";

import { useState } from "react";
import type { Site } from "@/content";
import { SectionShell, SectionHeading, Tag } from "./section";
import { Reveal } from "./reveal";
import { track } from "@/lib/analytics";

/**
 * Tabs rather than two columns, taken from the Figma design. Two reasons it is the
 * better shape here: each audience gets a full narrative instead of a truncated one,
 * and the tab a reader picks is a genuine signal — so the switch is tracked.
 *
 * Businesses sit first deliberately. A reader who suspects this is provider-only
 * software is answered before they can form the objection.
 */
export function Audiences({ audiences }: { audiences: Site["audiences"] }) {
  const [active, setActive] = useState(0);
  // The schema guarantees exactly two columns, but the index signature does not know
  // that — fall back to the first rather than widening the type.
  const col = audiences.columns[active] ?? audiences.columns[0];
  if (!col) return null;

  return (
    <SectionShell id="audiences" className="border-t border-line py-24">
      <SectionHeading
        eyebrow={audiences.eyebrow}
        heading={audiences.heading}
        intro={audiences.intro}
      />

      <Reveal delay={100} className="mt-10 flex w-fit gap-1 rounded-card border border-line p-1">
        {audiences.columns.map((c, i) => (
          <button
            key={c.label}
            type="button"
            aria-pressed={active === i}
            onClick={() => {
              setActive(i);
              track({ name: "cta_click", props: { position: "audiences-tab", intent: "pilot" } });
            }}
            className={`rounded-control px-5 py-2.5 text-sm font-medium transition-all duration-fast ${
              active === i ? "bg-accent text-accent-fg" : "text-fg-3 hover:text-fg"
            }`}
          >
            {c.label}
          </button>
        ))}
      </Reveal>

      <div className="mt-8 rounded-card border border-line bg-surface p-8 md:p-12">
        <p className="max-w-3xl text-[15px] leading-relaxed text-fg-2">{col.who}</p>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <div>
            <Tag>The situation</Tag>
            <p className="mt-4 text-sm leading-relaxed text-fg-2">{col.scenario}</p>

            <div className="mt-8">
              <Tag tone="accent">The outcome</Tag>
              <p className="mt-4 font-medium leading-relaxed text-fg">{col.outcome}</p>
            </div>
          </div>

          <div>
            <Tag>What you get</Tag>
            <ul className="mt-4 space-y-3">
              {col.gains.map((gain) => (
                <li key={gain} className="flex items-start gap-3 text-sm leading-relaxed text-fg">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {gain}
                </li>
              ))}
            </ul>
            {col.note && (
              <p className="mt-8 border-t border-line pt-5 text-xs leading-relaxed text-fg-3">
                {col.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
