/**
 * Location context — stores the user's chosen destination city/country.
 *
 * Architecture:
 *   - useReducer + React context (no external state library)
 *   - localStorage key "eeh:location:v1" for persistence
 *   - Heuristic: timezone + navigator.language → suggested country, never auto-applied
 *   - SSR-safe: all browser APIs live inside useEffect / try-catch
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LocationState {
  countryId: string | null;
  cityId: string | null;
  confirmedAt: number | null; // Date.now() when the user confirmed
  dismissed: boolean;         // user dismissed the suggestion banner
}

export type LocationAction =
  | { type: "SET"; countryId: string; cityId: string }
  | { type: "CLEAR" }
  | { type: "DISMISS_BANNER" }
  | { type: "RESTORE"; payload: LocationState };

// ── Persistence ───────────────────────────────────────────────────────────────

export const STORAGE_KEY = "eeh:location:v1";

function isValidState(x: unknown): x is LocationState {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;
  const o = x as Record<string, unknown>;
  return (
    (o.countryId === null || typeof o.countryId === "string") &&
    (o.cityId === null || typeof o.cityId === "string") &&
    (o.confirmedAt === null || typeof o.confirmedAt === "number") &&
    typeof o.dismissed === "boolean"
  );
}

export function loadPersistedState(): LocationState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function persistState(state: LocationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing, quota exceeded — fail silently.
  }
}

// ── Heuristic ─────────────────────────────────────────────────────────────────

/** Maps IANA timezone identifiers to country ids in our dataset. */
const TZ_TO_COUNTRY: Record<string, string> = {
  "Europe/Amsterdam": "nl",
  "Europe/Paris": "fr",
  "Europe/Berlin": "de",
  "Europe/Busingen": "de",
  "Europe/Rome": "it",
  "Europe/Budapest": "hu",
  "Europe/Madrid": "es",
  "Europe/Ceuta": "es",
  "Europe/Canary": "es",
  "Europe/Brussels": "be",
  "Europe/Zurich": "ch",
  "Europe/Vienna": "at",
  "Europe/Lisbon": "pt",
  "Atlantic/Azores": "pt",
  "Atlantic/Madeira": "pt",
  "Europe/Copenhagen": "dk",
  "Europe/Stockholm": "se",
};

/** Maps BCP-47 primary language subtags to country ids. */
const LANG_TO_COUNTRY: Record<string, string> = {
  nl: "nl",
  fr: "fr",
  de: "de",
  it: "it",
  hu: "hu",
  es: "es",
  pt: "pt",
  da: "dk",
  sv: "se",
};

/**
 * Geolocation-free heuristic: derive a likely destination country from the
 * browser timezone (higher signal) then the language tag (fallback).
 *
 * Accepts parameters so it can be unit-tested without mocking browser globals.
 * Returns a country id (e.g. "nl") or null if nothing in our dataset matches.
 */
export function detectSuggestedCountry(
  timezone: string,
  languageTag: string,
): string | null {
  if (TZ_TO_COUNTRY[timezone]) return TZ_TO_COUNTRY[timezone];
  const baseLang = languageTag.split(/[-_]/)[0].toLowerCase();
  return LANG_TO_COUNTRY[baseLang] ?? null;
}

// ── Reducer ───────────────────────────────────────────────────────────────────

export const INITIAL_STATE: LocationState = {
  countryId: null,
  cityId: null,
  confirmedAt: null,
  dismissed: false,
};

export function locationReducer(
  state: LocationState,
  action: LocationAction,
): LocationState {
  switch (action.type) {
    case "SET":
      return {
        ...state,
        countryId: action.countryId,
        cityId: action.cityId,
        confirmedAt: Date.now(),
        dismissed: false,
      };
    case "CLEAR":
      return INITIAL_STATE;
    case "DISMISS_BANNER":
      return { ...state, dismissed: true };
    case "RESTORE":
      return action.payload;
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

export interface LocationContextValue {
  state: LocationState;
  setLocation: (countryId: string, cityId: string) => void;
  clearLocation: () => void;
  dismissBanner: () => void;
  /** Country inferred from timezone/language — never auto-applied. */
  suggestedCountryId: string | null;
}

const Ctx = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(locationReducer, INITIAL_STATE);
  // `hydrated` becomes true only after we've read localStorage on the client.
  // This gates the persist effect so we never overwrite good data with
  // INITIAL_STATE during the first render + localStorage restore cycle.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadPersistedState();
    if (saved) dispatch({ type: "RESTORE", payload: saved });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistState(state);
  }, [state, hydrated]);

  // Computed once on mount — SSR-safe (try/catch swallows missing navigator/Intl)
  const suggestedCountryId = useMemo<string | null>(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const lang = navigator.language ?? "";
      return detectSuggestedCountry(tz, lang);
    } catch {
      return null;
    }
  }, []);

  const setLocation = useCallback(
    (countryId: string, cityId: string) =>
      dispatch({ type: "SET", countryId, cityId }),
    [],
  );
  const clearLocation = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const dismissBanner = useCallback(
    () => dispatch({ type: "DISMISS_BANNER" }),
    [],
  );

  return (
    <Ctx.Provider
      value={{ state, setLocation, clearLocation, dismissBanner, suggestedCountryId }}
    >
      {children}
    </Ctx.Provider>
  );
}

/**
 * Access the user's saved destination and the location actions.
 * Must be rendered inside <LocationProvider>.
 */
export function useCityLocation(): LocationContextValue {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useCityLocation must be used inside <LocationProvider>");
  return ctx;
}
