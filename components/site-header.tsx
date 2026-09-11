import type { Site } from "@/content";
import { CtaButton } from "./cta-button";
import { Logo } from "./logo";

export function SiteHeader({ site }: { site: Site }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-column items-center justify-between px-6 py-3.5">
        <a href="#top" aria-label={`${site.brand.name} — back to top`} className="flex items-center">
          <Logo />
        </a>
        {/* One CTA, repeated everywhere (marketing doc §8). The pricing CTA is not
            rendered anywhere on the page: it promised a wholesale rate card within a
            business day and that document does not exist yet. */}
        <CtaButton
          cta={site.ctas.pilot}
          position="header"
          variant="secondary"
          className="px-4 py-2"
        />
      </div>
    </header>
  );
}
