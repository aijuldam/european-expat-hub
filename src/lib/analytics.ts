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
  | "compare_embed_copy"
  | "quiz_start"
  | "quiz_step"
  | "quiz_complete"
  | "email_capture"
  | "quiz_skip";

export function trackEvent(
  name: AnalyticsEvent,
  params?: Record<string, string | number | boolean>
): void {
  try {
    window.gtag?.("event", name, params ?? {});
  } catch {
    // Never let analytics errors surface to users
  }
}

// ── Quiz funnel helpers ────────────────────────────────────────────────────

/** Fired once when the quiz mounts (first question shown). */
export function trackQuizStart() {
  trackEvent("quiz_start");
}

/** Fired each time the user advances — step is 1-based. */
export function trackQuizStep(step: number, total: number) {
  trackEvent("quiz_step", { step, total });
}

/** Fired when all questions are answered and the email gate appears. */
export function trackQuizComplete() {
  trackEvent("quiz_complete");
}

/** Fired when the user submits their email. */
export function trackEmailCapture(marketing_opt_in: boolean) {
  trackEvent("email_capture", { marketing_opt_in });
}

/** Fired when the user clicks "Skip and view results online". */
export function trackQuizSkip() {
  trackEvent("quiz_skip");
}
