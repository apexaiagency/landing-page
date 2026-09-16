import Image from "next/image";
import logoOnDark from "@/public/logo-on-dark.png";
import mark from "@/public/mark.png";

/**
 * The brand in the header: the mark alone on narrow screens, the full lockup from the
 * small breakpoint up.
 *
 * The lockup is about 5.6:1, so at a legible height it eats roughly a quarter of a
 * 375px header, and the header also has to carry sign-in and the call to action. The
 * mark is the half of the lockup that survives being shrunk, because it is also the
 * favicon and the app icon, so it is already the form people meet the brand in at
 * small sizes.
 *
 * The mark and the wordmark are ONE asset in the lockup: the amber mark doubles as the
 * O of Offsite. Swapping the whole lockup for the whole mark is the sanctioned move.
 * Cropping the O out of the lockup, or setting the wordmark beside a re-spaced mark,
 * is not.
 *
 * This is the ON-DARK artwork; the wordmark is white and disappears on a light
 * background. `public/logo-on-light.png` is the black-wordmark counterpart for any
 * light surface (an OG card, a PDF, an email). The site is dark-only today.
 *
 * Both images carry empty alt: the header wraps this in a link that already names the
 * brand, and alt text here would have a screen reader announce it twice.
 *
 * The brand amber sampled from the artwork is #f09b0d, within a hair of the site's
 * accent token (#f59e0b). Not reconciled on purpose: the token drives interactive
 * state and the logo is a fixed asset. If they ever must match, change the token.
 */
export function Logo({
  variant = "responsive",
  className = "h-8 w-auto sm:h-9",
  // 40px. The header is 64 tall, so the mark can carry this without crowding the row.
  markClassName = "h-10 w-10",
}: {
  /**
   * "responsive" swaps the lockup for the mark below the small breakpoint, which is
   * what the header wants. "lockup" always renders the full lockup, for surfaces with
   * a column to themselves. Visibility is a variant rather than something a caller
   * patches through className, because the classes that do it live on two different
   * elements and a caller cannot reach both.
   */
  variant?: "responsive" | "lockup";
  className?: string;
  markClassName?: string;
}) {
  if (variant === "lockup") {
    return (
      <Image src={logoOnDark} alt="" priority className={className} sizes="220px" />
    );
  }

  return (
    <>
      <Image
        src={mark}
        alt=""
        priority
        className={`${markClassName} object-contain sm:hidden`}
        sizes="32px"
      />
      <Image
        src={logoOnDark}
        alt=""
        priority
        // The source artwork carries generous internal padding; height is what reads,
        // so it is set in CSS and the intrinsic size only prevents layout shift.
        className={`hidden sm:block ${className}`}
        sizes="220px"
      />
    </>
  );
}
