import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { hasSubmittedEmail, saveEmailLead, MARKETING_CONSENT_TEXT } from "@/lib/leads";
import { trackEmailCapture } from "@/lib/analytics";

export function FooterLeadForm() {
  // Initialise from persisted flag — if already submitted, render nothing immediately
  const [submitted, setSubmitted] = useState(() => hasSubmittedEmail());
  const [email, setEmail] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (submitted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    // Since this form has no purpose other than marketing emails,
    // explicit consent is required before the email is stored.
    if (!marketingOptIn) {
      setError("Please tick the checkbox to confirm you want to receive emails from us.");
      return;
    }
    setError("");
    setLoading(true);
    trackEmailCapture(marketingOptIn);
    await saveEmailLead(trimmed, marketingOptIn);
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="border-t border-border/60 bg-muted/40 py-10">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <h3 className="font-serif font-bold text-lg text-foreground mb-1">
          Stay informed about your move
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          City comparisons, salary data, and relocation tips. Tick the box below to opt in — no spam, unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div className="max-w-md mx-auto mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              aria-label="Email address"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Marketing opt-in — must be ticked before submit is enabled */}
          <label className="inline-flex items-start gap-2 text-left cursor-pointer max-w-md mx-auto mb-4">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => { setMarketingOptIn(e.target.checked); setError(""); }}
              className="mt-0.5 accent-accent"
            />
            <span className="text-xs text-muted-foreground">{MARKETING_CONSENT_TEXT}</span>
          </label>

          {error && (
            <p className="mb-3 text-xs text-destructive" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !marketingOptIn}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "…" : "Sign me up"}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            No spam. Unsubscribe anytime.
          </div>
        </form>
      </div>
    </div>
  );
}
