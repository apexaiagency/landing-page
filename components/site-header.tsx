import type { Site } from "@/content";
import { CtaButton } from "./cta-button";

export function SiteHeader({ site }: { site: Site }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-column items-center justify-between px-6 py-3.5">
        <a href="#top" className="flex items-center gap-2.5">
          <span aria-hidden className="inline-flex h-5 w-5 items-center justify-center rounded-[5px] bg-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-fg" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-fg">
            {site.brand.name}
          </span>
        </a>
        <CtaButton
          cta={site.ctas.pricing}
          position="header"
          variant="secondary"
          className="px-4 py-2"
        />
      </div>
    </header>
  );
}
