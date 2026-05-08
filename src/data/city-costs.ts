/**
 * City cost-of-living data for the 11 launch cities.
 * Each city has a corresponding JSON file at src/data/cities/[slug].json.
 * All monetary values are in EUR (or EUR-equivalent for non-eurozone cities).
 */

import amsterdam from "./cities/amsterdam.json";
import lisbon from "./cities/lisbon.json";
import barcelona from "./cities/barcelona.json";
import berlin from "./cities/berlin.json";
import paris from "./cities/paris.json";
import vienna from "./cities/vienna.json";
import munich from "./cities/munich.json";
import brussels from "./cities/brussels.json";
import budapest from "./cities/budapest.json";
import copenhagen from "./cities/copenhagen.json";
import hamburg from "./cities/hamburg.json";

// ── Source provenance types ───────────────────────────────────────────────────

export type SourceType =
  | "official_statistical"  // e.g. Eurostat, CBS, INSEE, Statistisches Bundesamt
  | "official_operator"     // e.g. GVB, RATP, BVG, HVV — transit authority fare schedules
  | "market_report"         // e.g. property portal aggregates, employer surveys
  | "crowdsourced";         // e.g. Numbeo — perception/crowd-reported, use with care

export type ConfidenceLevel = "high" | "medium" | "low";

export type CrimeMetricType =
  | "perception_index"       // Numbeo-style survey-based index (0–100)
  | "official_rate_per_100k"; // Police/government recorded incidents per 100k residents

export interface MetricSource {
  label: string;
  url: string;
  source_type: SourceType;
  source_date: string;       // "YYYY-QN" or "YYYY-MM-DD"
  confidence: ConfidenceLevel;
  metric_keys: string[];     // which metrics this source covers, e.g. ["transport.monthlyPass"]
  notes?: string;
}

// ── City metrics schema ───────────────────────────────────────────────────────

export interface CityMetrics {
  cityId: string;
  lastReviewed: string;      // ISO date — CI warns if > 180 days old
  sources: MetricSource[];
  rent: {
    oneBrCityCenter: number;   // €/month
    oneBrOutside: number;      // €/month
    threeBrCityCenter: number; // €/month
    perM2CityCenter: number;   // €/m² city-centre residential
  };
  grocery: {
    monthlyEur2Adults: number; // estimated monthly grocery spend, 2 adults
  };
  /** @deprecated display only — use grocery.monthlyEur2Adults for household model */
  groceriesIndex: number;      // Numbeo-style 0–100 index (lower = cheaper)
  eatingOut: {
    dinnerForTwo: number;  // € mid-range restaurant
    latte: number;         // €
    domesticBeer: number;  // € (0.5 L draught)
  };
  transport: {
    monthlyPass: number; // € monthly public transit pass
    taxiStart: number;   // € start fare
    fuelLiter: number;   // € per litre
  };
  safety: {
    safetyIndex: number;                           // perception-based, 0–100 higher = safer
    crimeIndex: number;                            // perception-based, 0–100 lower = safer
    propertyCrimeIndex: number | null;             // null if unavailable
    violentCrimeIndex: number | null;              // null if unavailable
    propertyCrimeMetricType: CrimeMetricType;
    violentCrimeMetricType: CrimeMetricType;
  };
  utilities: {
    basic85m2: number; // €/month all-inclusive for 85m² apartment
  };
  internet: {
    monthly: number; // €/month 60 Mbps+
  };
  salary: {
    grossRef: number;     // reference gross (70 000)
    netEstimate: number;  // estimated net take-home
    currency: string;
    note: string;
  };
  healthcare: {
    monthlyEstimate: number; // €/month additional cost (0 if bundled in salary)
    note: string;
  };
  climate: {
    avgHighByMonth: number[]; // °C, Jan–Dec
    avgLowByMonth: number[];  // °C, Jan–Dec
    sunshineHoursPerYear: number;
  };
}

// ── Launch city registry ──────────────────────────────────────────────────────

/** The 11 launch cities, in display order. */
export const LAUNCH_CITY_SLUGS = [
  "amsterdam",
  "lisbon",
  "barcelona",
  "berlin",
  "paris",
  "vienna",
  "munich",
  "brussels",
  "budapest",
  "copenhagen",
  "hamburg",
] as const;

export type LaunchCitySlug = (typeof LAUNCH_CITY_SLUGS)[number];

const METRICS_MAP: Record<LaunchCitySlug, CityMetrics> = {
  amsterdam:  amsterdam  as CityMetrics,
  lisbon:     lisbon     as CityMetrics,
  barcelona:  barcelona  as CityMetrics,
  berlin:     berlin     as CityMetrics,
  paris:      paris      as CityMetrics,
  vienna:     vienna     as CityMetrics,
  munich:     munich     as CityMetrics,
  brussels:   brussels   as CityMetrics,
  budapest:   budapest   as CityMetrics,
  copenhagen: copenhagen as CityMetrics,
  hamburg:    hamburg    as CityMetrics,
};

export function getCityMetrics(slug: string): CityMetrics | null {
  return METRICS_MAP[slug as LaunchCitySlug] ?? null;
}

export function getAllCityMetrics(): CityMetrics[] {
  return LAUNCH_CITY_SLUGS.map((s) => METRICS_MAP[s]);
}

/** Summer = avg of Jun/Jul/Aug highs. Winter = avg of Dec/Jan/Feb lows. */
export function climateSummary(c: CityMetrics["climate"]): {
  summerHigh: number;
  winterLow: number;
  sunshine: number;
} {
  const summerHigh = Math.round(
    (c.avgHighByMonth[5] + c.avgHighByMonth[6] + c.avgHighByMonth[7]) / 3
  );
  const winterLow = Math.round(
    (c.avgLowByMonth[11] + c.avgLowByMonth[0] + c.avgLowByMonth[1]) / 3
  );
  return { summerHigh, winterLow, sunshine: c.sunshineHoursPerYear };
}
