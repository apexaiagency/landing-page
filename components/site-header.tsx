import type { Site, Cta } from "@/content";
import { CtaButton } from "./cta-button";
import { Logo } from "./logo";

export function SiteHeader({ site, cta }: { site: Site; cta: Cta }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-column items-center justify-between px-6">
        <a href="#top" aria-label={`${site.brand.name} — back to top`} className="flex items-center">
          <Logo />
        </a>
        {/* One CTA, repeated everywhere (marketing doc §8). The pricing CTA is not
            rendered anywhere on the page: it promised a wholesale rate card within a
            business day and that document does not exist yet. */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "What it is for", href: "#use-cases" },
            { label: "Trust", href: "#trust" },
            { label: "What's next", href: "#roadmap" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-fg-3 transition-colors duration-fast hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <CtaButton cta={cta} position="header" variant="primary" className="px-5 py-2" />
      </div>
    </header>
  );
}
