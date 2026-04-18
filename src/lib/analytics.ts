/**
 * Thin analytics wrapper.
 * Fires window.gtag if available; silently no-ops otherwise.
 * Drop-in ready for Google Analytics 4 or any gtag-compatible provider.
 */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

export type AnalyticsEvent =
  | "compare_view"
  | "compare_share"
  | "compare_embed_copy";

export function trackEvent(
  name: AnalyticsEvent,
  params?: Record<string, string>
): void {
  try {
    window.gtag?.("event", name, params ?? {});
  } catch {
    // Never let analytics errors surface to users
  }
}
