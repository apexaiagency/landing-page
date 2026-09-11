import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getSite } from "@/content";

/**
 * Type system — justified in one line:
 * Montserrat 600/700 carries the headings, taken from off-sitelabs.com so the two web
 * properties read as one company; Inter (self-hosted, 400–700) carries body text, where
 * its larger x-height reads better at small sizes than Montserrat does; JetBrains Mono
 * carries eyebrow labels and the control-plane data, signaling a real console.
 *
 * Montserrat is the one piece of the old site's identity that survives the move to the
 * dark system — its palette and its light ground do not. If the pairing ever needs to go
 * colder, Space Grotesk is already sitting in app/fonts and is a one-token swap.
 *
 * Fonts are self-hosted (woff2 in app/fonts) rather than fetched from Google at build:
 * no build-time network dependency, faster LCP (no third-party connection), and no
 * third-party font request from a page MSPs forward to their own clients.
 */
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    { path: "./fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});
const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  src: [
    { path: "./fonts/montserrat-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/montserrat-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});
const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  display: "swap",
  src: [
    { path: "./fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
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
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable}`}>
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
