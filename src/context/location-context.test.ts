/**
 * Unit tests for the location context primitives.
 * These cover the three independently-testable pieces:
 *   1. detectSuggestedCountry() — pure function, no mocks needed
 *   2. locationReducer()        — pure function, no mocks needed
 *   3. persistence layer        — uses happy-dom's localStorage
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  detectSuggestedCountry,
  locationReducer,
  loadPersistedState,
  persistState,
  INITIAL_STATE,
  STORAGE_KEY,
  type LocationState,
} from "./location-context";

// ── localStorage mock ─────────────────────────────────────────────────────────
// Some test environments ship an incomplete localStorage (missing .clear).
// We stub a full in-memory implementation so storage tests are environment-agnostic.

function makeLocalStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, val: string) => { store[key] = val; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
}

const localStorageMock = makeLocalStorageMock();
vi.stubGlobal("localStorage", localStorageMock);

// ── detectSuggestedCountry ────────────────────────────────────────────────────

describe("detectSuggestedCountry", () => {
  it("matches exact IANA timezone entries", () => {
    expect(detectSuggestedCountry("Europe/Amsterdam", "en")).toBe("nl");
    expect(detectSuggestedCountry("Europe/Paris", "en")).toBe("fr");
    expect(detectSuggestedCountry("Europe/Berlin", "en")).toBe("de");
    expect(detectSuggestedCountry("Europe/Rome", "en")).toBe("it");
    expect(detectSuggestedCountry("Europe/Budapest", "en")).toBe("hu");
    expect(detectSuggestedCountry("Europe/Madrid", "en")).toBe("es");
    expect(detectSuggestedCountry("Europe/Brussels", "en")).toBe("be");
    expect(detectSuggestedCountry("Europe/Zurich", "en")).toBe("ch");
    expect(detectSuggestedCountry("Europe/Vienna", "en")).toBe("at");
    expect(detectSuggestedCountry("Europe/Lisbon", "en")).toBe("pt");
    expect(detectSuggestedCountry("Europe/Copenhagen", "en")).toBe("dk");
    expect(detectSuggestedCountry("Europe/Stockholm", "en")).toBe("se");
  });

  it("falls back to language tag when timezone has no match", () => {
    expect(detectSuggestedCountry("America/New_York", "nl-NL")).toBe("nl");
    expect(detectSuggestedCountry("America/New_York", "fr-CA")).toBe("fr");
    expect(detectSuggestedCountry("America/Chicago", "de")).toBe("de");
    expect(detectSuggestedCountry("America/Chicago", "hu")).toBe("hu");
    expect(detectSuggestedCountry("Asia/Calcutta", "pt-BR")).toBe("pt");
    expect(detectSuggestedCountry("", "da-DK")).toBe("dk");
    expect(detectSuggestedCountry("", "sv")).toBe("se");
  });

  it("returns null when neither timezone nor language matches", () => {
    expect(detectSuggestedCountry("America/New_York", "en-US")).toBeNull();
    expect(detectSuggestedCountry("Asia/Tokyo", "ja")).toBeNull();
    expect(detectSuggestedCountry("", "")).toBeNull();
    expect(detectSuggestedCountry("UTC", "en")).toBeNull();
  });

  it("prefers timezone over language tag when both match different countries", () => {
    // Timezone says NL, language says FR — timezone wins
    expect(detectSuggestedCountry("Europe/Amsterdam", "fr-FR")).toBe("nl");
    // Timezone says DE, language says IT
    expect(detectSuggestedCountry("Europe/Berlin", "it")).toBe("de");
  });

  it("handles underscore locale separators (e.g. fr_BE)", () => {
    expect(detectSuggestedCountry("", "fr_BE")).toBe("fr");
    expect(detectSuggestedCountry("", "nl_BE")).toBe("nl");
  });

  it("handles uppercase language tags gracefully", () => {
    expect(detectSuggestedCountry("", "NL")).toBe("nl");
    expect(detectSuggestedCountry("", "FR-FR")).toBe("fr");
  });
});

// ── locationReducer ───────────────────────────────────────────────────────────

describe("locationReducer", () => {
  it("SET stores countryId, cityId, and a numeric confirmedAt timestamp", () => {
    const before = Date.now();
    const next = locationReducer(INITIAL_STATE, {
      type: "SET",
      countryId: "nl",
      cityId: "amsterdam",
    });
    const after = Date.now();

    expect(next.countryId).toBe("nl");
    expect(next.cityId).toBe("amsterdam");
    expect(next.confirmedAt).toBeTypeOf("number");
    expect(next.confirmedAt).toBeGreaterThanOrEqual(before);
    expect(next.confirmedAt).toBeLessThanOrEqual(after);
    expect(next.dismissed).toBe(false);
  });

  it("SET resets dismissed to false even when previously true", () => {
    const withDismissed: LocationState = { ...INITIAL_STATE, dismissed: true };
    const next = locationReducer(withDismissed, {
      type: "SET",
      countryId: "fr",
      cityId: "paris",
    });
    expect(next.dismissed).toBe(false);
  });

  it("CLEAR resets all fields to INITIAL_STATE", () => {
    const populated: LocationState = {
      countryId: "de",
      cityId: "berlin",
      confirmedAt: 9999,
      dismissed: true,
    };
    expect(locationReducer(populated, { type: "CLEAR" })).toEqual(INITIAL_STATE);
  });

  it("DISMISS_BANNER sets dismissed without touching selection", () => {
    const base: LocationState = {
      countryId: "fr",
      cityId: "paris",
      confirmedAt: 42,
      dismissed: false,
    };
    const next = locationReducer(base, { type: "DISMISS_BANNER" });
    expect(next.dismissed).toBe(true);
    expect(next.countryId).toBe("fr");
    expect(next.cityId).toBe("paris");
    expect(next.confirmedAt).toBe(42);
  });

  it("RESTORE replaces the entire state with the payload", () => {
    const payload: LocationState = {
      countryId: "it",
      cityId: "rome",
      confirmedAt: 12345,
      dismissed: false,
    };
    expect(locationReducer(INITIAL_STATE, { type: "RESTORE", payload })).toEqual(payload);
  });

  it("is referentially stable on a no-op (unknown action type)", () => {
    // TypeScript would complain about an unknown type, so cast to test safety
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next = locationReducer(INITIAL_STATE, { type: "UNKNOWN" } as any);
    expect(next).toBe(INITIAL_STATE);
  });
});

// ── persistence layer ─────────────────────────────────────────────────────────

describe("persistState / loadPersistedState", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("round-trips a full valid state", () => {
    const state: LocationState = {
      countryId: "nl",
      cityId: "amsterdam",
      confirmedAt: 1_700_000_000,
      dismissed: false,
    };
    persistState(state);
    expect(loadPersistedState()).toEqual(state);
  });

  it("stores under the canonical STORAGE_KEY", () => {
    persistState(INITIAL_STATE);
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
  });

  it("returns null when storage is empty", () => {
    expect(loadPersistedState()).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{{not-valid-json}}");
    expect(loadPersistedState()).toBeNull();
  });

  it("returns null for a JSON primitive", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(42));
    expect(loadPersistedState()).toBeNull();
  });

  it("returns null for a JSON array", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
    expect(loadPersistedState()).toBeNull();
  });

  it("returns null for an object missing required fields", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: "bar" }));
    expect(loadPersistedState()).toBeNull();
  });

  it("returns null when dismissed field is missing (partial schema)", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ countryId: "nl", cityId: "amsterdam", confirmedAt: 1 }),
    );
    expect(loadPersistedState()).toBeNull();
  });

  it("round-trips the null-selection initial state", () => {
    persistState(INITIAL_STATE);
    expect(loadPersistedState()).toEqual(INITIAL_STATE);
  });
});
