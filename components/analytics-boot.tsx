"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires page_view once, and hero_view when the hero enters the viewport.
 * Section scroll_depth events attach here too as sections come online (v2+).
 */
export function AnalyticsBoot() {
  useEffect(() => {
    track({ name: "page_view" });
    if (typeof IntersectionObserver === "undefined") return;

    const disconnectors: Array<() => void> = [];

    // hero_view
    const hero = document.getElementById("hero-heading");
    if (hero) {
      let fired = false;
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !fired) {
              fired = true;
              track({ name: "hero_view" });
              io.disconnect();
            }
          }
        },
        { threshold: 0.4 }
      );
      io.observe(hero);
      disconnectors.push(() => io.disconnect());
    }

    // scroll_depth per section (fires once each)
    const seen = new Set<string>();
    const sections = ["problem", "control-plane", "faq"];
    const sio = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            track({ name: "scroll_depth", props: { section: id } });
          }
        }
      },
      { threshold: 0.3 }
    );
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) sio.observe(el);
    }
    disconnectors.push(() => sio.disconnect());

    return () => disconnectors.forEach((d) => d());
  }, []);

  return null;
}
