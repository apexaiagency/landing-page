import type { Site, Cta } from "@/content";
import { CtaButton } from "./cta-button";
import { Logo } from "./logo";

export function SiteFooter({ site, cta }: { site: Site; cta: Cta }) {
  const { footer, brand } = site;
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-column px-6 py-16">
        {/* Final CTA band */}
        <div className="flex flex-col gap-6 rounded-card border border-line bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <p className="font-display text-xl font-semibold tracking-tight text-fg">
              {footer.ctaHeading}
            </p>
            </div>
          <div className="flex flex-wrap gap-3">
            <CtaButton cta={cta} position="footer" variant="primary" />
          </div>
        </div>

        {/* Nav + brand */}
        <div className="mt-12 grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-xs">
            {/* The footer has a column to itself, so the lockup stays at every width. */}
            <Logo variant="lockup" className="h-9 w-auto" />
            <p className="mt-3 text-sm text-fg-2">{footer.tagline}</p>
          </div>
          {footer.columns.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
                {col.title}
              </div>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {/*
                      Footer links are mostly in-page anchors, but the booking link is
                      not, so an external one opens in a new tab like every other
                      outbound link on the page.
                    */}
                    <a
                      href={link.href}
                      {...(/^https?:\/\//.test(link.href)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm text-fg-2 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line-soft pt-6 text-xs text-fg-3">
          {footer.legalLine}
        </div>
      </div>
    </footer>
  );
}
