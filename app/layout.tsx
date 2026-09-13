import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSite } from "@/content";

/**
 * Type system — taken from the Figma Make design, which is now the reference for
 * this page's visual system:
 *
 * DM Sans (variable, 300–700, self-hosted) carries everything a reader reads. It is a
 * geometric grotesque with open counters — warmer than Inter without tipping into the
 * softness the old off-sitelabs.com identity had, and it sits next to the logo's
 * wordmark as though they were chosen together.
 *
 * DM Mono carries eyebrow labels and status text, signalling a real console rather
 * than a mockup — the same job JetBrains Mono did before, in the same family voice.
 *
 * Self-hosted rather than fetched from Google at build: no build-time network
 * dependency, faster LCP, and no third-party font request from a page a provider may
 * forward to their own clients. (The Figma export imports both from Google at runtime;
 * that is the one thing from it deliberately not carried across.)
 */
const dmSans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [{ path: "./fonts/dm-sans-latin-variable.woff2", weight: "300 700", style: "normal" }],
});
const dmMono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "./fonts/dm-mono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/dm-mono-latin-500.woff2", weight: "500", style: "normal" },
  ],
});

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(site.meta.url),
  title: site.meta.title,
  description: site.meta.description,
  keywords: site.meta.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    url: site.meta.url,
    siteName: site.brand.name,
    images: [{ url: site.meta.ogImage, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
    images: [site.meta.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD: SoftwareApplication. Desktops only — no mention of anything else.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.brand.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: site.meta.description,
    url: site.meta.url,
    audience: {
      "@type": "Audience",
      audienceType: "Managed Service Providers",
    },
    offers: {
      "@type": "Offer",
      // No public price — partner pricing on request.
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Wholesale partner pricing available to MSPs on request.",
      },
    },
  };

  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
