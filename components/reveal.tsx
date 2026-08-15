"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * First-view staggered fade-up. Fires ONCE per mount (never replays on re-render),
 * respects prefers-reduced-motion (CSS handles the reduced case — element shows
 * instantly). Motion tokens follow the redesign spec: ~500ms distance move on the
 * shared cubic-bezier(.2,.8,.2,1) curve, with a small per-item stagger.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  duration = 500,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-shown={shown ? "true" : "false"}
      className={`reveal ${className}`}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--dur": `${duration}ms`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
