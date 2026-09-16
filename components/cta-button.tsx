"use client";

import type { Cta } from "@/content";
import { useLeadForm } from "./form-context";
import { track } from "@/lib/analytics";

/**
 * The single CTA component. Every placement passes the SAME `cta` object from content,
 * so the label is identical everywhere by construction. `position` is analytics-only.
 *
 * Two behaviours, chosen by the href rather than by a flag:
 *
 * An EXTERNAL href (the booking page) is followed as an ordinary link, in a new tab,
 * with the click tracked on the way out. Nothing is intercepted: a scheduling page is
 * the destination, so putting a form in front of it would be asking the same person
 * for the same details twice.
 *
 * An in-page or same-origin href opens the lead form in place, which is what shipped
 * while there was no booking link.
 *
 * Motion (redesign spec): 1px lift + brightness on hover, scale-down on press — plain
 * CSS transitions on the shared move curve. Amber fill is reserved for the primary CTA.
 */
export function CtaButton({
  cta,
  position,
  variant = "primary",
  compact = false,
  className = "",
}: {
  cta: Cta;
  position: string;
  variant?: "primary" | "secondary";
  /**
   * Header sizing: smaller type and padding on narrow screens, and the arrow dropped
   * there. At 375px the label is the widest thing in the header, and at full size it
   * wrapped to two lines and pushed the row past the edge.
   */
  compact?: boolean;
  className?: string;
}) {
  const { open } = useLeadForm();
  const external = /^https?:\/\//.test(cta.href);

  // min-h-11 is 44px, the floor for a touch target. The header's own height leaves
  // room for it, and without it the compact button came out at 36.
  const size = compact
    ? "min-h-11 px-3.5 text-[13px] sm:min-h-0 sm:px-5 sm:py-2 sm:text-sm"
    : "px-7 py-3.5 text-sm";

  // whitespace-nowrap everywhere: a wrapped call to action reads as a layout fault.
  const base = `group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-semibold transition-colors duration-fast ${size}`;
  const styles =
    variant === "primary"
      ? "bg-accent text-accent-fg hover:bg-accent-hover"
      : "border border-line text-fg hover:border-line-strong";

  return (
    <a
      href={cta.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} ${styles} ${className}`}
      onClick={(e) => {
        track({ name: "cta_click", props: { position, intent: cta.intent } });
        if (external) return;
        e.preventDefault();
        open({ intent: cta.intent, position });
      }}
    >
      {cta.label}
      {variant === "primary" && (
        <span
          aria-hidden
          className={`transition-transform duration-fast ease-move group-hover:translate-x-0.5 ${
            compact ? "hidden sm:inline" : ""
          }`}
        >
          →
        </span>
      )}
    </a>
  );
}
