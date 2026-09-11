import type { Site } from "@/content";
import { CtaButton } from "./cta-button";
import { Logo } from "./logo";

export function SiteFooter({ site }: { site: Site }) {
  const { footer, ctas, brand } = site;
  return (
    <footer className="border-t border-line-soft bg-surface">
      <div className="mx-auto max-w-column px-6 py-16">
        {/* Final CTA band */}
        <div className="flex flex-col gap-6 rounded-card border border-line bg-raised p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <p className="font-display text-xl font-semibold tracking-tight text-fg">
              {footer.ctaHeading}
            </p>
            <p className="mt-2 text-sm text-fg-2">{brand.channelLine}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CtaButton cta={ctas.pilot} position="footer" variant="primary" />
          </div>
        </div>

        {/* Nav + brand */}
        <div className="mt-12 grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo className="h-9 w-auto" />
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
                    <a
                      href={link.href}
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
