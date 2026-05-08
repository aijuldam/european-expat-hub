/**
 * Cost of Living Score computation.
 *
 * Base-100 logic
 * ──────────────
 * The reference city is the median of ALL 35 supported cities when sorted
 * by costOfLivingIndex (cities.ts). That city is Hamburg (index 68,
 * position 18/35). Hamburg = 100. All others scale proportionally.
 *
 * Score formula:
 *   score = round(city.costOfLivingIndex / REFERENCE_CITY_INDEX × 100)
 *
 * This gives every supported city a score regardless of whether it has
 * detailed EUR data. For the 11 launch cities with JSON files, the EUR
 * breakdown (rent/m², groceries, transport, dining) is shown alongside the
 * score as "what's behind the number."
 *
 * Household model: 2 adults, 1-bedroom city-centre apartment.
 * Methodology version: 2026-v1
 */

import { getCityMetrics } from "./city-costs";
import { getRentPerM2 } from "./rent-per-m2";
import type { City } from "./cities";

export const REFERENCE_CITY_ID   = "hamburg";
export const REFERENCE_CITY_NAME = "Hamburg";
export const REFERENCE_CITY_INDEX = 68;  // Hamburg costOfLivingIndex — median of 35 cities
export const METHODOLOGY_VERSION  = "2026-v1";

export interface CityCostOfLiving {
  cityId: string;
  householdSize: 2;
  referenceCityId: string;
  referenceCityName: string;
  referenceScore: 100;
  totalScore: number;
  // EUR breakdown — null for cities without a detailed JSON file
  rentEurPerM2CityCenter: number | null;
  groceryMonthlyEur2Adults: number | null;
  transportMonthlyPassEur: number | null;
  diningMidrangeDinner2Eur: number | null;
  methodologyVersion: string;
  updatedAt: string;
}

/**
 * Compute the Cost of Living Score for a single city.
 * Works for all 35 supported cities.
 */
export function computeCityScore(costOfLivingIndex: number): number {
  return Math.round((costOfLivingIndex / REFERENCE_CITY_INDEX) * 100);
}

/**
 * Return the full CityCostOfLiving record for a city.
 * EUR breakdown fields are populated only for the 11 launch cities.
 */
export function getCostOfLiving(city: City): CityCostOfLiving {
  const metrics = getCityMetrics(city.slug);
  return {
    cityId: city.id,
    householdSize: 2,
    referenceCityId:   REFERENCE_CITY_ID,
    referenceCityName: REFERENCE_CITY_NAME,
    referenceScore:    100,
    totalScore: computeCityScore(city.costOfLivingIndex),
    rentEurPerM2CityCenter:   metrics?.rent.perM2CityCenter      ?? getRentPerM2(city.slug)?.perM2CityCenter ?? null,
    groceryMonthlyEur2Adults: metrics?.grocery.monthlyEur2Adults  ?? null,
    transportMonthlyPassEur:  metrics?.transport.monthlyPass      ?? null,
    diningMidrangeDinner2Eur: metrics?.eatingOut.dinnerForTwo     ?? null,
    methodologyVersion: METHODOLOGY_VERSION,
    updatedAt: metrics?.lastReviewed ?? city.lastUpdated,
  };
}
