import { type City, getCityById } from "./cities";
import { type Country, getCountryById } from "./countries";
import { getCostOfLiving, REFERENCE_CITY_NAME } from "./cost-of-living";
import { getCityMetrics } from "./city-costs";

export interface ComparisonDimension {
  label: string;
  key: string;
  getValue: (city: City) => string | number;
  format: (value: string | number) => string;
  higherIsBetter: boolean;
  description: string;
}

export const comparisonDimensions: ComparisonDimension[] = [
  {
    label: "Sunny Days / Year",
    key: "sunnyDaysPerYear",
    getValue: (city) => city.sunnyDaysPerYear,
    format: (v) => `${v} days`,
    higherIsBetter: true,
    description: "Average number of sunny days per year",
  },
  {
    label: "Safety Index",
    key: "safetyIndex",
    getValue: (city) => {
      const m = getCityMetrics(city.slug);
      return m?.safety.safetyIndex ?? city.safetyIndex;
    },
    format: (v) => `${v}/100`,
    higherIsBetter: true,
    description: "Perception-based safety index (Numbeo, 0–100). Higher = safer. Not an official crime rate.",
  },
  {
    label: "Median Gross Salary",
    key: "medianSalaryGross",
    getValue: (city) => city.medianSalaryGross,
    format: (v) => `${Number(v).toLocaleString()} EUR`,
    higherIsBetter: true,
    description: "Median annual gross salary for professionals",
  },
  {
    label: "Estimated Net Salary",
    key: "estimatedMedianSalaryNet",
    getValue: (city) => city.estimatedMedianSalaryNet,
    format: (v) => `${Number(v).toLocaleString()} EUR`,
    higherIsBetter: true,
    description: "Estimated annual net salary after tax and contributions",
  },
  {
    label: `Cost of Living Score`,
    key: "costScore",
    getValue: (city) => getCostOfLiving(city).totalScore,
    format: (v) => `${v} (${REFERENCE_CITY_NAME}=100)`,
    higherIsBetter: false,
    description: `Monthly cost score for a 2-adult household, 1BR city centre. ${REFERENCE_CITY_NAME} = 100 (median of all supported cities). Lower = more affordable.`,
  },
  {
    label: "Rent (€/m² city centre)",
    key: "rentPerM2",
    getValue: (city) => getCityMetrics(city.slug)?.rent.perM2CityCenter ?? 0,
    format: (v) => v ? `€${v}/m²` : "—",
    higherIsBetter: false,
    description: "City-centre residential rent per square metre. Source: Numbeo crowd-reported data.",
  },
  {
    label: "Groceries (€/mo · 2 adults)",
    key: "groceryMonthly",
    getValue: (city) => getCityMetrics(city.slug)?.grocery.monthlyEur2Adults ?? 0,
    format: (v) => v ? `€${v}/mo` : "—",
    higherIsBetter: false,
    description: "Estimated monthly grocery spend for 2 adults.",
  },
  {
    label: "Transport (monthly pass)",
    key: "transportPass",
    getValue: (city) => getCityMetrics(city.slug)?.transport.monthlyPass ?? 0,
    format: (v) => v ? `€${v}/mo` : "—",
    higherIsBetter: false,
    description: "Monthly public transport subscription. Sourced from official transit operator.",
  },
  {
    label: "Dining (dinner for 2)",
    key: "diningDinner",
    getValue: (city) => getCityMetrics(city.slug)?.eatingOut.dinnerForTwo ?? 0,
    format: (v) => v ? `€${v}` : "—",
    higherIsBetter: false,
    description: "Mid-range restaurant dinner for 2 adults including drinks.",
  },
];

export interface ComparisonResult {
  city1: City;
  city2: City;
  country1: Country;
  country2: Country;
  dimensions: {
    dimension: ComparisonDimension;
    value1: string | number;
    value2: string | number;
    formatted1: string;
    formatted2: string;
    winner: "city1" | "city2" | "tie";
    difference: string;
  }[];
}

export function compareCities(
  cityId1: string,
  cityId2: string
): ComparisonResult | null {
  const city1 = getCityById(cityId1);
  const city2 = getCityById(cityId2);
  if (!city1 || !city2) return null;

  const country1 = getCountryById(city1.countryId);
  const country2 = getCountryById(city2.countryId);
  if (!country1 || !country2) return null;

  const dimensions = comparisonDimensions.map((dimension) => {
    const value1 = dimension.getValue(city1);
    const value2 = dimension.getValue(city2);
    const num1 = typeof value1 === "number" ? value1 : parseFloat(String(value1));
    const num2 = typeof value2 === "number" ? value2 : parseFloat(String(value2));

    let winner: "city1" | "city2" | "tie" = "tie";
    if (num1 !== num2) {
      if (dimension.higherIsBetter) {
        winner = num1 > num2 ? "city1" : "city2";
      } else {
        winner = num1 < num2 ? "city1" : "city2";
      }
    }

    const diff = Math.abs(num1 - num2);
    const pctDiff =
      num2 !== 0 ? Math.round((diff / Math.min(num1, num2)) * 100) : 0;

    return {
      dimension,
      value1,
      value2,
      formatted1: dimension.format(value1),
      formatted2: dimension.format(value2),
      winner,
      difference: pctDiff > 0 ? `${pctDiff}% difference` : "Equal",
    };
  });

  return { city1, city2, country1, country2, dimensions };
}
