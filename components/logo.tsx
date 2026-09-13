import Image from "next/image";
import logoOnDark from "@/public/logo-on-dark.png";

/**
 * The horizontal lockup: the amber mark doubles as the O of Offsite, so the mark and
 * the wordmark are one asset and must not be separated or re-spaced.
 *
 * This is the ON-DARK artwork — the wordmark is white and disappears on a light
 * background. `public/logo-on-light.png` is the black-wordmark counterpart for any
 * light surface (an OG card, a PDF, an email). The site is dark-only today, so only
 * the on-dark file is imported here.
 *
 * `public/mark.png` is the mark alone, square, cropped from the same artwork — it is
 * what `app/icon.png` is built from. Use it anywhere the lockup is too wide to read.
 *
 * The brand amber sampled from the artwork is #f09b0d, which is within a hair of the
 * site's accent token (#f59e0b). They are not reconciled on purpose: the token drives
 * interactive state and the logo is a fixed asset. If they ever need to match exactly,
 * change the token, not the logo.
 */
export function Logo({ className = "h-8 w-auto sm:h-9" }: { className?: string }) {
  return (
    <Image
      src={logoOnDark}
      alt="Offsite Labs"
      priority
      className={className}
      // The source artwork carries generous internal padding; height is what reads,
      // so it is set in CSS and the intrinsic size only prevents layout shift.
      sizes="220px"
    />
  );
}
