"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The one deliberately un-hurried moment (redesign spec §4): a sequential step reveal,
 * each ~450ms apart, checkmark fills on completion. Plays ONCE when scrolled into view.
 * prefers-reduced-motion → all steps show complete instantly (no sequence).
 */
const STEPS = [
  "Isolated client account",
  "Network + directory",
  "Desktop image",
  "Access policy",
  "Desktops live",
];

export function ProvisioningChecklist() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [done, setDone] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDone(STEPS.length);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            io.disconnect();
            let n = 0;
            const tick = () => {
              n += 1;
              setDone(n);
              if (n < STEPS.length) window.setTimeout(tick, 450);
            };
            window.setTimeout(tick, 300);
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-card border border-line bg-surface p-5"
      role="img"
      aria-label="Provisioning a new client tenant, step by step, to desktops live."
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
          Provisioning
        </span>
        <span className="font-mono text-[11px] text-fg-3">
          {Math.min(done, STEPS.length)}/{STEPS.length}
        </span>
      </div>
      <ul className="space-y-2.5">
        {STEPS.map((step, i) => {
          const complete = i < done;
          const current = i === done;
          return (
            <li key={step} className="flex items-center gap-3">
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] transition-all duration-base ease-move ${
                  complete
                    ? "border-accent bg-accent text-accent-fg shadow-glow-sm"
                    : current
                      ? "border-accent text-accent"
                      : "border-line text-transparent"
                }`}
              >
                {complete ? "✓" : current ? "•" : ""}
              </span>
              <span
                className={`text-sm transition-colors duration-base ${
                  complete ? "text-fg" : current ? "text-fg-2" : "text-fg-3"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
