import { countries } from "@/data/countries";

export type QuizDimension =
  | "affordability"
  | "safety"
  | "weather"
  | "salaryPotential"
  | "familyFit"
  | "expatFit"
  | "bigCityEnergy"
  | "internationalVibe"
  | "publicTransport";

export type QuizCategory =
  | "family"
  | "costOfLiving"
  | "salary"
  | "safety"
  | "weather"
  | "international"
  | "cityLife"
  | "transport"
  | "language"
  | "lifestyle";

export interface QuizOption {
  label: string;
  value: string;
  scores: Partial<Record<QuizDimension, number>>;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  description?: string;
  multiSelect?: boolean;
  options: QuizOption[];
}

export const categoryConfig: Record<QuizCategory, { label: string; colorClass: string }> = {
  safety:      { label: "Safety",         colorClass: "bg-blue-50 text-blue-700 border-blue-200" },
  costOfLiving:{ label: "Cost of Living", colorClass: "bg-teal-50 text-teal-700 border-teal-200" },
  weather:     { label: "Weather",        colorClass: "bg-amber-50 text-amber-700 border-amber-200" },
  salary:      { label: "Salary",         colorClass: "bg-violet-50 text-violet-700 border-violet-200" },
  family:      { label: "Family",         colorClass: "bg-rose-50 text-rose-700 border-rose-200" },
  language:    { label: "Language",        colorClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  international:{ label: "International", colorClass: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  cityLife:    { label: "City Life",      colorClass: "bg-orange-50 text-orange-700 border-orange-200" },
  transport:   { label: "Transport",      colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  lifestyle:   { label: "Lifestyle",      colorClass: "bg-pink-50 text-pink-700 border-pink-200" },
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "family_status",
    category: "family",
    question: "What is your current family situation?",
    description: "This helps us match you with cities that fit your lifestyle.",
    options: [
      {
        label: "Single",
        value: "single",
        scores: { bigCityEnergy: 2, internationalVibe: 1 },
      },
      {
        label: "Couple",
        value: "couple",
        scores: { bigCityEnergy: 1, affordability: 1 },
      },
      {
        label: "Family with children",
        value: "family",
        scores: { familyFit: 3, safety: 2, affordability: 1 },
      },
    ],
  },
  {
    id: "budget",
    category: "costOfLiving",
    question: "How important is affordability to you?",
    description: "Consider housing, groceries, transport, and daily expenses.",
    options: [
      {
        label: "Very important - I need to keep costs low",
        value: "very",
        scores: { affordability: 3 },
      },
      {
        label: "Somewhat important - I want good value",
        value: "somewhat",
        scores: { affordability: 1 },
      },
      {
        label: "Not a priority - I can afford premium living",
        value: "not",
        scores: { affordability: -1, bigCityEnergy: 1 },
      },
    ],
  },
  {
    id: "salary_expectations",
    category: "salary",
    question: "What matters more: higher salary or lower cost of living?",
    options: [
      {
        label: "Higher salary is more important",
        value: "salary",
        scores: { salaryPotential: 3 },
      },
      {
        label: "Lower cost of living is more important",
        value: "cost",
        scores: { affordability: 3 },
      },
      {
        label: "I want the best balance of both",
        value: "balance",
        scores: { salaryPotential: 1, affordability: 1 },
      },
    ],
  },
  {
    id: "safety",
    category: "safety",
    question: "How important is safety in your daily life?",
    options: [
      {
        label: "Very important - it is a top priority",
        value: "very",
        scores: { safety: 3 },
      },
      {
        label: "Important, but I am comfortable in most European cities",
        value: "moderate",
        scores: { safety: 1 },
      },
      {
        label: "Not a major concern for me",
        value: "low",
        scores: {},
      },
    ],
  },
  {
    id: "weather",
    category: "weather",
    question: "What kind of weather do you prefer?",
    description: "Think about sunshine, warmth, and seasonal variation.",
    options: [
      {
        label: "Warm and sunny - the more sun, the better",
        value: "warm",
        scores: { weather: 3 },
      },
      {
        label: "Mild with distinct seasons",
        value: "mild",
        scores: { weather: 1 },
      },
      {
        label: "Weather is not a deciding factor for me",
        value: "any",
        scores: {},
      },
    ],
  },
  {
    id: "international",
    category: "international",
    question: "How important is an international, cosmopolitan atmosphere?",
    options: [
      {
        label: "Essential - I want a diverse, multicultural environment",
        value: "essential",
        scores: { internationalVibe: 3, expatFit: 2 },
      },
      {
        label: "Nice to have, but not a must",
        value: "nice",
        scores: { internationalVibe: 1 },
      },
      {
        label: "I prefer to immerse in local culture",
        value: "local",
        scores: { internationalVibe: -1 },
      },
    ],
  },
  {
    id: "city_energy",
    category: "cityLife",
    question: "What kind of city energy do you prefer?",
    options: [
      {
        label: "Buzzing metropolis with endless things to do",
        value: "big",
        scores: { bigCityEnergy: 3 },
      },
      {
        label: "Lively but not overwhelming",
        value: "medium",
        scores: { bigCityEnergy: 1 },
      },
      {
        label: "Calm and manageable with a strong community feel",
        value: "calm",
        scores: { bigCityEnergy: -2, familyFit: 1 },
      },
    ],
  },
  {
    id: "transport",
    category: "transport",
    question: "How do you plan to get around?",
    options: [
      {
        label: "Public transport and cycling",
        value: "public",
        scores: { publicTransport: 3 },
      },
      {
        label: "Mix of transport options",
        value: "mix",
        scores: { publicTransport: 1 },
      },
      {
        label: "Mostly by car",
        value: "car",
        scores: { publicTransport: -1 },
      },
    ],
  },
  {
    id: "language_env",
    category: "language",
    question: "What kind of language environment works for you?",
    description: "Some cities are much easier to navigate in English than others.",
    options: [
      {
        label: "English-first — I need English at work and in daily life",
        value: "english_first",
        scores: { expatFit: 3, internationalVibe: 1 },
      },
      {
        label: "Mixed — I can manage with some local language alongside English",
        value: "mixed",
        scores: { expatFit: 1 },
      },
      {
        label: "Fully local — I'm happy to work and live in the local language",
        value: "local",
        scores: {},
      },
    ],
  },
  {
    id: "language_skills",
    category: "language",
    multiSelect: true,
    question: "Which local languages do you already speak or are willing to learn?",
    description: "Select all that apply.",
    options: [
      ...Array.from(
        new Set(countries.flatMap((c) => c.languages))
      )
        .sort()
        .map((lang) => ({
          label: lang,
          value: lang.toLowerCase(),
          scores: { expatFit: 1 } as Partial<Record<QuizDimension, number>>,
        })),
      {
        label: "None — I'd rather stay in English",
        value: "none",
        scores: { expatFit: 2, internationalVibe: 1 } as Partial<Record<QuizDimension, number>>,
      },
    ],
  },
  {
    id: "lifestyle",
    category: "lifestyle",
    question: "What lifestyle matters most to you?",
    options: [
      {
        label: "Arts, culture, and fine dining",
        value: "culture",
        scores: { bigCityEnergy: 2, internationalVibe: 1 },
      },
      {
        label: "Outdoor activities and nature access",
        value: "outdoor",
        scores: { weather: 1, familyFit: 1 },
      },
      {
        label: "Career growth and professional networking",
        value: "career",
        scores: { salaryPotential: 2, bigCityEnergy: 1 },
      },
      {
        label: "Family life and community",
        value: "family",
        scores: { familyFit: 3, safety: 1, affordability: 1 },
      },
    ],
  },
];

export interface CityScoreProfile {
  cityId: string;
  scores: Record<QuizDimension, number>;
}

export const cityScoreProfiles: CityScoreProfile[] = [
  // Netherlands
  { cityId: "amsterdam", scores: { affordability: 3, safety: 8, weather: 4, salaryPotential: 9, familyFit: 6, expatFit: 10, bigCityEnergy: 8, internationalVibe: 10, publicTransport: 9 } },
  { cityId: "rotterdam", scores: { affordability: 6, safety: 7, weather: 4, salaryPotential: 7, familyFit: 7, expatFit: 8, bigCityEnergy: 6, internationalVibe: 7, publicTransport: 8 } },
  { cityId: "the-hague", scores: { affordability: 5, safety: 8, weather: 4, salaryPotential: 8, familyFit: 9, expatFit: 10, bigCityEnergy: 5, internationalVibe: 10, publicTransport: 8 } },
  { cityId: "eindhoven", scores: { affordability: 7, safety: 8, weather: 4, salaryPotential: 9, familyFit: 8, expatFit: 8, bigCityEnergy: 4, internationalVibe: 7, publicTransport: 6 } },
  { cityId: "utrecht", scores: { affordability: 5, safety: 8, weather: 4, salaryPotential: 7, familyFit: 7, expatFit: 7, bigCityEnergy: 6, internationalVibe: 6, publicTransport: 8 } },
  // France
  { cityId: "paris", scores: { affordability: 2, safety: 6, weather: 6, salaryPotential: 8, familyFit: 7, expatFit: 6, bigCityEnergy: 10, internationalVibe: 9, publicTransport: 10 } },
  { cityId: "lyon", scores: { affordability: 8, safety: 7, weather: 8, salaryPotential: 5, familyFit: 9, expatFit: 5, bigCityEnergy: 5, internationalVibe: 5, publicTransport: 7 } },
  { cityId: "bordeaux", scores: { affordability: 7, safety: 6, weather: 7, salaryPotential: 5, familyFit: 8, expatFit: 5, bigCityEnergy: 5, internationalVibe: 5, publicTransport: 6 } },
  { cityId: "marseille", scores: { affordability: 7, safety: 4, weather: 10, salaryPotential: 4, familyFit: 5, expatFit: 4, bigCityEnergy: 7, internationalVibe: 5, publicTransport: 5 } },
  { cityId: "lille", scores: { affordability: 9, safety: 5, weather: 3, salaryPotential: 4, familyFit: 6, expatFit: 4, bigCityEnergy: 4, internationalVibe: 5, publicTransport: 7 } },
  { cityId: "nantes", scores: { affordability: 8, safety: 7, weather: 7, salaryPotential: 4, familyFit: 9, expatFit: 5, bigCityEnergy: 5, internationalVibe: 4, publicTransport: 7 } },
  { cityId: "nice", scores: { affordability: 5, safety: 6, weather: 10, salaryPotential: 4, familyFit: 6, expatFit: 7, bigCityEnergy: 6, internationalVibe: 7, publicTransport: 6 } },
  { cityId: "strasbourg", scores: { affordability: 8, safety: 7, weather: 5, salaryPotential: 5, familyFit: 8, expatFit: 8, bigCityEnergy: 4, internationalVibe: 8, publicTransport: 7 } },
  { cityId: "annecy",     scores: { affordability: 5, safety: 9, weather: 7, salaryPotential: 4, familyFit: 9, expatFit: 4, bigCityEnergy: 2, internationalVibe: 4, publicTransport: 4 } },
  // Germany
  { cityId: "berlin", scores: { affordability: 7, safety: 6, weather: 5, salaryPotential: 7, familyFit: 7, expatFit: 10, bigCityEnergy: 10, internationalVibe: 9, publicTransport: 9 } },
  { cityId: "munich", scores: { affordability: 4, safety: 9, weather: 6, salaryPotential: 9, familyFit: 9, expatFit: 8, bigCityEnergy: 8, internationalVibe: 8, publicTransport: 9 } },
  { cityId: "frankfurt", scores: { affordability: 4, safety: 6, weather: 5, salaryPotential: 10, familyFit: 6, expatFit: 8, bigCityEnergy: 7, internationalVibe: 9, publicTransport: 8 } },
  { cityId: "stuttgart", scores: { affordability: 5, safety: 8, weather: 6, salaryPotential: 9, familyFit: 8, expatFit: 7, bigCityEnergy: 5, internationalVibe: 6, publicTransport: 7 } },
  { cityId: "hamburg", scores: { affordability: 5, safety: 7, weather: 4, salaryPotential: 8, familyFit: 7, expatFit: 7, bigCityEnergy: 8, internationalVibe: 7, publicTransport: 8 } },
  // Italy
  { cityId: "rome", scores: { affordability: 6, safety: 5, weather: 9, salaryPotential: 4, familyFit: 6, expatFit: 5, bigCityEnergy: 8, internationalVibe: 7, publicTransport: 6 } },
  { cityId: "milan", scores: { affordability: 4, safety: 6, weather: 7, salaryPotential: 7, familyFit: 6, expatFit: 8, bigCityEnergy: 9, internationalVibe: 8, publicTransport: 8 } },
  { cityId: "torino", scores: { affordability: 8, safety: 6, weather: 7, salaryPotential: 4, familyFit: 7, expatFit: 5, bigCityEnergy: 5, internationalVibe: 4, publicTransport: 7 } },
  // Hungary
  { cityId: "budapest", scores: { affordability: 10, safety: 7, weather: 7, salaryPotential: 3, familyFit: 7, expatFit: 7, bigCityEnergy: 8, internationalVibe: 6, publicTransport: 8 } },
  // Spain
  { cityId: "madrid", scores: { affordability: 6, safety: 7, weather: 9, salaryPotential: 5, familyFit: 7, expatFit: 8, bigCityEnergy: 9, internationalVibe: 8, publicTransport: 8 } },
  { cityId: "barcelona", scores: { affordability: 5, safety: 6, weather: 9, salaryPotential: 5, familyFit: 7, expatFit: 9, bigCityEnergy: 9, internationalVibe: 9, publicTransport: 8 } },
  { cityId: "valencia", scores: { affordability: 8, safety: 7, weather: 10, salaryPotential: 4, familyFit: 8, expatFit: 8, bigCityEnergy: 6, internationalVibe: 6, publicTransport: 7 } },
  // Belgium
  { cityId: "brussels", scores: { affordability: 4, safety: 6, weather: 4, salaryPotential: 7, familyFit: 8, expatFit: 10, bigCityEnergy: 7, internationalVibe: 10, publicTransport: 8 } },
  { cityId: "antwerp", scores: { affordability: 5, safety: 6, weather: 4, salaryPotential: 6, familyFit: 7, expatFit: 7, bigCityEnergy: 6, internationalVibe: 7, publicTransport: 7 } },
  // Switzerland
  { cityId: "geneva", scores: { affordability: 1, safety: 9, weather: 6, salaryPotential: 10, familyFit: 8, expatFit: 10, bigCityEnergy: 5, internationalVibe: 10, publicTransport: 8 } },
  { cityId: "zurich", scores: { affordability: 1, safety: 10, weather: 6, salaryPotential: 10, familyFit: 8, expatFit: 9, bigCityEnergy: 6, internationalVibe: 9, publicTransport: 10 } },
  // Austria
  { cityId: "vienna", scores: { affordability: 5, safety: 9, weather: 6, salaryPotential: 6, familyFit: 9, expatFit: 7, bigCityEnergy: 8, internationalVibe: 7, publicTransport: 9 } },
  // Portugal
  { cityId: "lisbon", scores: { affordability: 6, safety: 8, weather: 10, salaryPotential: 4, familyFit: 7, expatFit: 9, bigCityEnergy: 7, internationalVibe: 9, publicTransport: 7 } },
  { cityId: "porto", scores: { affordability: 8, safety: 8, weather: 8, salaryPotential: 3, familyFit: 7, expatFit: 8, bigCityEnergy: 5, internationalVibe: 7, publicTransport: 6 } },
  // Denmark
  { cityId: "copenhagen", scores: { affordability: 2, safety: 9, weather: 4, salaryPotential: 9, familyFit: 10, expatFit: 9, bigCityEnergy: 7, internationalVibe: 8, publicTransport: 9 } },
  // Sweden
  { cityId: "stockholm", scores: { affordability: 3, safety: 7, weather: 4, salaryPotential: 9, familyFit: 10, expatFit: 8, bigCityEnergy: 8, internationalVibe: 8, publicTransport: 9 } },
];

export interface QuizResult {
  cityId: string;
  cityName: string;
  countryName: string;
  totalScore: number;
  matchPercentage: number;
  dimensionScores: Record<QuizDimension, number>;
  topReasons: string[];
}

const dimensionLabels: Record<QuizDimension, string> = {
  affordability: "Affordability",
  safety: "Safety",
  weather: "Weather & Climate",
  salaryPotential: "Salary Potential",
  familyFit: "Family Friendliness",
  expatFit: "Expat Friendliness",
  bigCityEnergy: "City Energy",
  internationalVibe: "International Atmosphere",
  publicTransport: "Public Transport",
};

const cityNames: Record<string, { city: string; country: string }> = {
  // Netherlands
  amsterdam: { city: "Amsterdam", country: "Netherlands" },
  rotterdam: { city: "Rotterdam", country: "Netherlands" },
  "the-hague": { city: "The Hague", country: "Netherlands" },
  eindhoven: { city: "Eindhoven", country: "Netherlands" },
  utrecht: { city: "Utrecht", country: "Netherlands" },
  // France
  paris: { city: "Paris", country: "France" },
  lyon: { city: "Lyon", country: "France" },
  bordeaux: { city: "Bordeaux", country: "France" },
  marseille: { city: "Marseille", country: "France" },
  lille: { city: "Lille", country: "France" },
  nantes: { city: "Nantes", country: "France" },
  nice: { city: "Nice", country: "France" },
  strasbourg: { city: "Strasbourg", country: "France" },
  // Germany
  berlin: { city: "Berlin", country: "Germany" },
  munich: { city: "Munich", country: "Germany" },
  frankfurt: { city: "Frankfurt", country: "Germany" },
  stuttgart: { city: "Stuttgart", country: "Germany" },
  hamburg: { city: "Hamburg", country: "Germany" },
  // Italy
  rome: { city: "Rome", country: "Italy" },
  milan: { city: "Milan", country: "Italy" },
  torino: { city: "Torino", country: "Italy" },
  // Hungary
  budapest: { city: "Budapest", country: "Hungary" },
  // Spain
  madrid: { city: "Madrid", country: "Spain" },
  barcelona: { city: "Barcelona", country: "Spain" },
  valencia: { city: "Valencia", country: "Spain" },
  // Belgium
  brussels: { city: "Brussels", country: "Belgium" },
  antwerp: { city: "Antwerp", country: "Belgium" },
  // Switzerland
  geneva: { city: "Geneva", country: "Switzerland" },
  zurich: { city: "Zurich", country: "Switzerland" },
  // Austria
  vienna: { city: "Vienna", country: "Austria" },
  // Portugal
  lisbon: { city: "Lisbon", country: "Portugal" },
  porto: { city: "Porto", country: "Portugal" },
  // Denmark
  copenhagen: { city: "Copenhagen", country: "Denmark" },
  // Sweden
  stockholm: { city: "Stockholm", country: "Sweden" },
};

export function calculateQuizResults(
  answers: Record<string, string | string[]>
): QuizResult[] {
  const userDimensionScores: Record<QuizDimension, number> = {
    affordability: 0,
    safety: 0,
    weather: 0,
    salaryPotential: 0,
    familyFit: 0,
    expatFit: 0,
    bigCityEnergy: 0,
    internationalVibe: 0,
    publicTransport: 0,
  };

  for (const questionId of Object.keys(answers)) {
    const question = quizQuestions.find((q) => q.id === questionId);
    if (!question) continue;
    const raw = answers[questionId];
    const values = Array.isArray(raw) ? raw : [raw];
    for (const val of values) {
      const option = question.options.find((o) => o.value === val);
      if (!option) continue;
      for (const [dim, score] of Object.entries(option.scores)) {
        userDimensionScores[dim as QuizDimension] += score;
      }
    }
  }

  const results: QuizResult[] = cityScoreProfiles.map((profile) => {
    let totalScore = 0;
    const dimensionScores: Record<QuizDimension, number> = {} as Record<
      QuizDimension,
      number
    >;

    const dimensions = Object.keys(userDimensionScores) as QuizDimension[];
    for (const dim of dimensions) {
      const userWeight = Math.max(0, userDimensionScores[dim]);
      const cityStrength = profile.scores[dim];
      const contribution = userWeight * cityStrength;
      dimensionScores[dim] = contribution;
      totalScore += contribution;
    }

    const topDimensions = dimensions
      .filter((dim) => dimensionScores[dim] > 0)
      .sort((a, b) => dimensionScores[b] - dimensionScores[a])
      .slice(0, 3);

    const topReasons = topDimensions.map((dim) => {
      const label = dimensionLabels[dim];
      const strength = profile.scores[dim];
      if (strength >= 9) return `Outstanding ${label.toLowerCase()}`;
      if (strength >= 7) return `Strong ${label.toLowerCase()}`;
      return `Good ${label.toLowerCase()}`;
    });

    const names = cityNames[profile.cityId];

    return {
      cityId: profile.cityId,
      cityName: names?.city ?? profile.cityId,
      countryName: names?.country ?? "",
      totalScore,
      matchPercentage: 0,
      dimensionScores,
      topReasons,
    };
  });

  results.sort((a, b) => b.totalScore - a.totalScore);

  const maxScore = results[0]?.totalScore || 1;
  for (const result of results) {
    result.matchPercentage = Math.round((result.totalScore / maxScore) * 100);
  }

  return results;
}

export { dimensionLabels };
