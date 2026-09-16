import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function SectionShell({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-column px-6">{children}</div>
    </section>
  );
}

/**
 * The mono eyebrow from the Figma design. It appears above every section heading and
 * is the page's only recurring ornament, so it stays identical everywhere.
 */
export function Tag({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "accent" }) {
  return (
    <span
      className={`inline-block font-mono text-[11px] uppercase tracking-[0.16em] ${
        tone === "accent" ? "text-accent" : "text-fg-3"
      }`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  className = "",
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <Reveal as="div" className="mb-6">
        <Tag>{eyebrow}</Tag>
      </Reveal>
      <Reveal
        as="h2"
        delay={60}
        className="whitespace-pre-line font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl"
      >
        {heading}
      </Reveal>
      {intro && (
        <Reveal as="p" delay={120} className="mt-5 text-lg leading-relaxed text-fg-2">
          {intro}
        </Reveal>
      )}
    </div>
  );
}

/**
 * A grid whose cell gaps ARE the rules: `gap-px` over a rule-coloured parent, with the
 * corners clipped. It is the single most characterful device in the Figma design —
 * a set of cards reads as one ruled object rather than a row of separate boxes — and
 * it is why almost nothing on this page needs a border of its own.
 */
export function RuledGrid({
  children,
  className = "",
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "paper";
}) {
  return (
    <div
      className={`grid gap-px overflow-hidden rounded-card ${
        tone === "paper" ? "bg-paper-rule" : "bg-line"
      } ${className}`}
    >
      {children}
    </div>
  );
}
