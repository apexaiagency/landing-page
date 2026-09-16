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
  const base =
    "inline-flex items-center justify-center rounded-control border px-5 py-2 text-sm font-medium transition-colors duration-fast";

  if (!connected) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        title="Sign-in is not connected yet"
        className={`${base} cursor-not-allowed border-line text-fg-3 ${className}`}
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
      className={`${base} border-line text-fg hover:border-line-strong ${className}`}
    >
      {login.label}
    </a>
  );
}
