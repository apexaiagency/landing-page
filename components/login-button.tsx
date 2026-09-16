import type { Landing } from "@/content/landing";

/** Set in the content file until a real sign-in URL is decided. */
export const LOGIN_PLACEHOLDER = "PLACEHOLDER_NOT_CONNECTED";

/**
 * Sign-in for people who already have an account.
 *
 * Navigation rather than conversion, so it is a bordered control beside the amber CTA
 * and never repeats down the page. The spec's one-call-to-action rule is about the
 * walkthrough; an existing customer looking for the front door is not a competing
 * offer.
 *
 * While the href is still the placeholder it renders as a DISABLED button, not a link:
 * visible, clearly inert, and impossible to click through to nowhere. A dead link that
 * looks live is worse than a button that plainly is not ready, and the honest state is
 * the one that makes somebody fix it.
 */
export function LoginButton({ login, className = "" }: { login: Landing["login"]; className?: string }) {
  const connected = login.href !== LOGIN_PLACEHOLDER;
  /*
   * Below the small breakpoint this is a plain text link with no border and no padding.
   * The header at 375px has room for a wordmark and one button, and sign-in is the
   * lesser of the two: giving it a box made both labels wrap and pushed the row off
   * the screen. From sm up it is the bordered control it was.
   */
  const base =
    "inline-flex min-h-11 items-center justify-center whitespace-nowrap px-1 text-[13px] font-medium transition-colors duration-fast sm:min-h-0 sm:rounded-control sm:border sm:px-5 sm:py-2 sm:text-sm";

  if (!connected) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="Sign-in is not connected yet"
        className={`${base} cursor-not-allowed text-fg-3 sm:border-line ${className}`}
      >
        {login.label}
      </button>
    );
  }

  return (
    <a
      href={login.href}
      target="_blank"
      rel="noreferrer"
      className={`${base} text-fg-2 hover:text-fg sm:border-line sm:text-fg sm:hover:border-line-strong ${className}`}
    >
      {login.label}
    </a>
  );
}
