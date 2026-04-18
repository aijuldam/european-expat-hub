/**
 * FirstVisitBanner — dismissible suggestion strip shown once per session.
 *
 * Appears when:
 *  - The user has not yet confirmed a destination (confirmedAt === null)
 *  - The user has not dismissed it (dismissed === false)
 *  - The heuristic found a matching country from timezone/language
 *
 * Tapping "Personalise" applies the suggested country's first city immediately.
 * The × button dismisses permanently (persisted via localStorage).
 */
import { X } from "lucide-react";
import { countries } from "@/data/countries";
import { cities } from "@/data/cities";
import { useCityLocation } from "@/context/location-context";

const FLAG: Record<string, string> = {
  nl: "🇳🇱", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹", hu: "🇭🇺",
  es: "🇪🇸", be: "🇧🇪", ch: "🇨🇭", at: "🇦🇹", pt: "🇵🇹",
  dk: "🇩🇰", se: "🇸🇪",
};

export function FirstVisitBanner() {
  const { state, setLocation, dismissBanner, suggestedCountryId } =
    useCityLocation();

  // Only render when there's no confirmed selection, user hasn't dismissed,
  // and the heuristic produced a result.
  if (state.confirmedAt !== null || state.dismissed || !suggestedCountryId)
    return null;

  const country = countries.find((c) => c.id === suggestedCountryId);
  // Pick the "capital" / most-prominent city (first entry for that country).
  const city = cities.find((c) => c.countryId === suggestedCountryId);
  if (!country || !city) return null;

  const flag = FLAG[suggestedCountryId] ?? "";

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-accent/5 border-b border-accent/20 text-foreground"
    >
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <p className="text-sm">
          <span className="mr-1" aria-hidden>
            {flag}
          </span>
          Moving to <strong>{city.name}</strong>?{" "}
          <button
            onClick={() => setLocation(suggestedCountryId, city.id)}
            className="font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            Tap to personalise
          </button>
        </p>
        <button
          onClick={dismissBanner}
          aria-label="Dismiss location suggestion"
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
