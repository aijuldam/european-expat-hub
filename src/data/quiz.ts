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

export interface QuizOption {
  label: string;
  value: string;
  scores: Partial<Record<QuizDimension, number>>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "family_status",
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
    id: "language",
    question: "How open are you to learning a new language?",
    description:
      "Some cities are easier to navigate in English than others.",
    options: [
      {
        label: "I prefer English-friendly environments",
        value: "english",
        scores: { expatFit: 3, internationalVibe: 1 },
      },
      {
        label: "I am willing to learn the local language over time",
        value: "willing",
        scores: { expatFit: 1 },
      },
      {
        label: "I already speak French or Dutch",
        value: "speaks",
        scores: {},
      },
    ],
  },
  {
    id: "lifestyle",
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
  answers: Record<string, string>
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
    const option = question.options.find((o) => o.value === answers[questionId]);
    if (!option) continue;
    for (const [dim, score] of Object.entries(option.scores)) {
      userDimensionScores[dim as QuizDimension] += score;
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
