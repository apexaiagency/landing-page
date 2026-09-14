"use client";

import { useEffect, useRef, useState } from "react";
import type { Landing } from "@/content/landing";
import { SectionShell, Tag } from "./section";
import { Reveal } from "./reveal";
import { CtaButton } from "./cta-button";
import { track } from "@/lib/analytics";
import type { Cta } from "@/content";

type PathId = "msp" | "org" | "solo";
const IDS: PathId[] = ["msp", "org", "solo"];

function isPathId(v: string | null): v is PathId {
  return v === "msp" || v === "org" || v === "solo";
}

/**
 * A soft selector, not a gate. Everything this component does follows from that:
 *
 *  - Nothing is selected on load, and every shared section below stays readable. A
 *    visitor who never clicks still reads a complete page.
 *  - All three panels are always in the DOM and hidden with the `hidden` attribute
 *    rather than unmounted, so the copy is indexable and the page still reads with
 *    JS off. With JS off every panel is simply visible, which is the correct
 *    degradation for a selector that was never a gate.
 *  - The choice is written to the URL (`?for=msp`) so a path can be linked directly
 *    for outreach, and read back on load so those links land where they should.
 *
 * Accessibility follows the tabs pattern the spec asks for: roving tabindex, arrow
 * keys, Home/End, `aria-selected`, and each panel labelled by its tab.
 */
export function PathSelector({
  selector,
  paths,
  cta,
}: {
  selector: Landing["selector"];
  paths: Landing["paths"];
  cta: Cta;
}) {
  const [active, setActive] = useState<PathId | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelsRef = useRef<HTMLDivElement | null>(null);
  // Set once the component has mounted. Until then nothing is hidden, so the
  // server-rendered markup carries all three panels open.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const fromUrl = new URLSearchParams(window.location.search).get("for");
    if (isPathId(fromUrl)) setActive(fromUrl);
  }, []);

  function choose(id: PathId, { scroll = true } = {}) {
    setActive(id);
    track({ name: "cta_click", props: { position: `path-${id}`, intent: "pilot" } });

    const url = new URL(window.location.href);
    url.searchParams.set("for", id);
    window.history.replaceState(null, "", url);

    if (scroll) {
      requestAnimationFrame(() => {
        panelsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const last = IDS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    const id = IDS[next];
    if (!id) return;
    choose(id, { scroll: false });
    tabRefs.current[id]?.focus();
  }

  return (
    <>
      <SectionShell id="paths" className="border-t border-line py-24">
        <Reveal
          as="h2"
          className="max-w-2xl font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
        >
          {selector.heading}
        </Reveal>

        <div role="tablist" aria-label={selector.heading} className="mt-12 grid gap-4 md:grid-cols-3">
          {selector.options.map((opt, i) => {
            const selected = active === opt.id;
            return (
              <Reveal key={opt.id} delay={i * 80}>
                <button
                  ref={(el) => {
                    tabRefs.current[opt.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${opt.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${opt.id}`}
                  tabIndex={active === null ? (i === 0 ? 0 : -1) : selected ? 0 : -1}
                  onClick={() => choose(opt.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`h-full w-full rounded-card border p-7 text-left transition-colors duration-fast ${
                    selected
                      ? "border-accent bg-surface"
                      : "border-line bg-surface hover:border-line-strong"
                  }`}
                >
                  <span
                    className={`font-display text-lg font-semibold tracking-tight ${
                      selected ? "text-accent" : "text-fg"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="mt-3 block text-sm leading-relaxed text-fg-2">{opt.sub}</span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </SectionShell>

      <div ref={panelsRef}>
        {IDS.map((id) => (
          <PathPanel
            key={id}
            id={id}
            path={paths[id]}
            cta={cta}
            hidden={hydrated && active !== id}
          />
        ))}
      </div>
    </>
  );
}

/**
 * The caveat block is set at body size and body weight, never smaller. On the org path
 * it is the section a security-minded reader will study hardest, and putting it on the
 * page instead of saving it for the call is the whole point of the page.
 */
function PathPanel({
  id,
  path,
  cta,
  hidden,
}: {
  id: PathId;
  path: Landing["paths"]["msp"];
  cta: Cta;
  hidden: boolean;
}) {
  return (
    <section
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={hidden}
      className="border-t border-line bg-surface py-24"
    >
      <div className="mx-auto max-w-column px-6">
        <h2 className="max-w-4xl font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl">
          {path.h2}
        </h2>

        <div className="mt-8 max-w-measure space-y-5">
          {path.body.map((para) => (
            <p key={para} className="text-lg leading-relaxed text-fg-2">
              {para}
            </p>
          ))}
        </div>

        {path.proof && (
          <div className="mt-12 max-w-measure rounded-card border border-line bg-bg p-8">
            <Tag>{path.proof.heading}</Tag>
            <ul className="mt-5 space-y-4">
              {path.proof.items.map((item) => (
                <li key={item} className="flex items-start gap-3 leading-relaxed text-fg-2">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 max-w-measure border-l-2 border-accent pl-8">
          {path.caveat.heading && (
            <h3 className="font-display text-xl font-semibold tracking-tight">
              {path.caveat.heading}
            </h3>
          )}
          {path.caveat.intro && (
            <p className="mt-4 text-lg leading-relaxed text-fg-2">{path.caveat.intro}</p>
          )}
          {path.caveat.body?.map((para) => (
            <p key={para} className="mt-4 text-lg leading-relaxed text-fg-2">
              {para}
            </p>
          ))}
          {path.caveat.items && (
            <ul className="mt-5 space-y-3">
              {path.caveat.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg leading-relaxed text-fg">
                  <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-fg-3" />
                  {item}
                </li>
              ))}
            </ul>
          )}
          {path.caveat.outro && (
            <p className="mt-5 text-lg leading-relaxed text-fg-2">{path.caveat.outro}</p>
          )}
        </div>

        <div className="mt-12">
          <CtaButton cta={cta} position={`path-${id}`} variant="primary" />
        </div>
      </div>
    </section>
  );
}
