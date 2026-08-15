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
    <section id={id} className={`mx-auto max-w-column px-6 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      <Reveal as="p" className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
        {eyebrow}
      </Reveal>
      <Reveal
        as="h2"
        delay={60}
        className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-fg sm:text-4xl"
      >
        {heading}
      </Reveal>
      {intro && (
        <Reveal as="p" delay={120} className="mt-4 text-lg leading-relaxed text-fg-2">
          {intro}
        </Reveal>
      )}
    </div>
  );
}
