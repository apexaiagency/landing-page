"use client";

/**
 * Thin analytics wrapper. Instrumented from day one, but vendor-agnostic:
 * if NEXT_PUBLIC_ANALYTICS_ENDPOINT is unset, events no-op cleanly (no console noise).
 *
 * Events the page fires (see TODO.md → "Analytics events"):
 *   page_view, hero_view, hero_artifact_engage,
 *   scroll_depth (per section), cta_click (with position + intent),
 *   form_open, form_start, form_field_blur, form_submit, form_abandon.
 *
 * pricing-CTA vs pilot-CTA is split via the `intent` property on cta_click / form_*.
 */

export type AnalyticsIntent = "pilot" | "pricing";

export type AnalyticsEvent =
  | { name: "page_view"; props?: Record<string, unknown> }
  | { name: "hero_view"; props?: Record<string, unknown> }
  | { name: "hero_artifact_engage"; props: { tenant: string } }
  | { name: "scroll_depth"; props: { section: string } }
  | { name: "cta_click"; props: { position: string; intent: AnalyticsIntent } }
  | { name: "form_open"; props: { intent: AnalyticsIntent; position: string } }
  | { name: "form_start"; props: { intent: AnalyticsIntent } }
  | { name: "form_field_blur"; props: { intent: AnalyticsIntent; field: string; filled: boolean } }
  | { name: "form_submit"; props: { intent: AnalyticsIntent; clientSeats: number | null } }
  | { name: "form_abandon"; props: { intent: AnalyticsIntent; lastField: string } };

export function track(event: AnalyticsEvent): void {
  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  const payload = {
    event: event.name,
    props: "props" in event ? event.props : {},
    ts: Date.now(),
    path: typeof window !== "undefined" ? window.location.pathname : "/",
  };

  if (!endpoint) {
    // Dev/no-vendor: keep the signal visible without shipping noise to prod.
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", payload.event, payload.props);
    }
    return;
  }

  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon(endpoint, body);
    } else {
      void fetch(endpoint, { method: "POST", body, keepalive: true });
    }
  } catch {
    // Analytics must never break the page.
  }
}
