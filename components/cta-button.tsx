"use client";

import type { Cta } from "@/content";
import { useLeadForm } from "./form-context";
import { track } from "@/lib/analytics";

/**
 * The single CTA component. Every placement passes the SAME `cta` object from content,
 * so the label is identical everywhere by construction. `position` is analytics-only.
 *
 * Motion (redesign spec): 1px lift + brightness on hover, scale-down on press — plain
 * CSS transitions on the shared move curve. Amber fill is reserved for the primary CTA.
 */
export function CtaButton({
  cta,
  position,
  variant = "primary",
  className = "",
}: {
  cta: Cta;
  position: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const { open } = useLeadForm();

  const base =
    "group inline-flex items-center justify-center gap-2 rounded-control px-5 py-3 text-sm font-medium transition duration-fast ease-move will-change-transform hover:-translate-y-px active:translate-y-0 active:scale-[.98]";
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-fg hover:bg-accent-hover"
      : "border border-line text-fg-2 hover:border-line-strong hover:text-fg";

  return (
    <a
      href={cta.href}
      className={`${base} ${styles} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        track({ name: "cta_click", props: { position, intent: cta.intent } });
        open({ intent: cta.intent, position });
      }}
    >
      {cta.label}
      {variant === "primary" && (
        <span
          aria-hidden
          className="transition-transform duration-fast ease-move group-hover:translate-x-0.5"
        >
          →
        </span>
      )}
    </a>
  );
}
