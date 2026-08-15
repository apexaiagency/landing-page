"use client";

import { useId, useState } from "react";
import type { Site } from "@/content";
import { track } from "@/lib/analytics";

/**
 * Status treatment per the redesign spec: ready = amber dot + soft glow; in-progress =
 * amber, pulsing (no steady glow); off/idle = neutral gray, no color, no glow ("nothing
 * to see" reads as absence of color); attention = red family.
 */
const STATUS_DOT: Record<string, string> = {
  active: "bg-accent shadow-glow-sm",
  provisioning: "bg-accent animate-pulse-dot",
  stopped: "bg-status-off",
  error: "bg-status-attention",
};

/**
 * The hero artifact: the control plane itself, not a desktop screenshot. Dense, dark,
 * real. Hovering or focusing a tenant reveals its detail line — interaction that costs
 * no load time (all data is inline, no fetch). Fully keyboard-navigable; degrades to a
 * static, readable panel with no JS.
 */
export function ControlPlaneArtifact({ artifact }: { artifact: Site["hero"]["artifact"] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const engagedRef = useState({ fired: false })[0];
  const detailId = useId();

  function engage(idx: number, tenant: string) {
    setActiveIdx(idx);
    if (!engagedRef.fired) {
      engagedRef.fired = true;
      track({ name: "hero_artifact_engage", props: { tenant } });
    }
  }

  const active = activeIdx != null ? artifact.tenants[activeIdx] : null;

  return (
    <figure className="overflow-hidden rounded-card border border-line bg-surface font-mono text-fg shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-line-soft bg-raised px-4 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </span>
        <div className="ml-2 flex flex-1 items-baseline gap-2">
          <span className="font-sans text-sm font-medium text-fg">{artifact.title}</span>
          <span className="font-sans text-xs text-fg-3">{artifact.subtitle}</span>
        </div>
        <span className="flex items-center gap-1.5 font-sans text-[11px] text-fg-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow-sm" />
          live
        </span>
      </div>

      {/* Column header */}
      <div className="grid grid-cols-[1.6fr_0.8fr_0.5fr_0.7fr_0.9fr] gap-2 border-b border-line-soft px-4 py-2 text-[10px] uppercase tracking-wider text-fg-3">
        <span>{artifact.columns.client}</span>
        <span className="hidden sm:block">{artifact.columns.region}</span>
        <span className="text-right">{artifact.columns.seats}</span>
        <span className="text-right">{artifact.columns.spend}</span>
        <span className="text-right">{artifact.columns.status}</span>
      </div>

      {/* Tenant rows */}
      <ul className="divide-y divide-line-soft/70">
        {artifact.tenants.map((t, idx) => {
          const isActive = idx === activeIdx;
          return (
            <li key={t.client}>
              <button
                type="button"
                aria-expanded={isActive}
                aria-controls={isActive ? detailId : undefined}
                onMouseEnter={() => engage(idx, t.client)}
                onFocus={() => engage(idx, t.client)}
                onClick={() => engage(idx, t.client)}
                className={`grid w-full grid-cols-[1.6fr_0.8fr_0.5fr_0.7fr_0.9fr] items-center gap-2 px-4 py-2.5 text-left text-[13px] transition-colors duration-fast ${
                  isActive ? "bg-raised" : "hover:bg-raised/60"
                }`}
              >
                <span className="truncate font-sans font-medium text-fg">{t.client}</span>
                <span className="hidden text-fg-3 sm:block">{t.region}</span>
                <span className="text-right tabular-nums text-fg">{t.seats}</span>
                <span className="text-right tabular-nums text-fg-2">{t.spend}</span>
                <span className="flex items-center justify-end gap-1.5">
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[t.status]}`}
                  />
                  <span className="truncate font-sans text-[11px] text-fg-2">{t.statusLabel}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Detail reveal — fixed min-height, no layout shift */}
      <div
        id={detailId}
        className="min-h-[2.75rem] border-t border-line-soft bg-raised px-4 py-2.5 font-sans text-xs text-fg-2"
      >
        {active ? (
          <span>
            <span className="text-fg">{active.client}</span>
            {active.detail ? <span> — {active.detail}</span> : null}
          </span>
        ) : (
          <span className="text-fg-3">Hover or focus a client to inspect its fleet.</span>
        )}
      </div>

      {/* Summary footer */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-line-soft bg-surface px-4 py-3 font-sans text-xs text-fg-2">
        <span>
          <span className="text-fg">{artifact.summary.tenantsLabel}</span>
        </span>
        <span>
          <span className="text-fg">{artifact.summary.seatsLabel}</span> under management
        </span>
        <span className="ml-auto">
          <span className="text-fg">{artifact.summary.spendLabel}</span> billed
        </span>
      </div>

      <figcaption className="sr-only">{artifact.caption}</figcaption>
    </figure>
  );
}
