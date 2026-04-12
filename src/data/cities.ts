export interface City {
  id: string;
  name: string;
  slug: string;
  countryId: string;
  shortSummary: string;
  bestFor: string;
  sunnyDaysPerYear: number;
  avgTempByMonth: number[];
  safetyIndex: number;
  medianSalaryGross: number;
  estimatedMedianSalaryNet: number;
  costOfLivingIndex: number;
  rentIndex: number;
  groceriesIndex: number;
  transportIndex: number;
  diningIndex: number;
  familyFitSummary: string;
  expatFitSummary: string;
  population: string;
  language: string;
  currency: string;
  lastUpdated: string;
}

export const cities: City[] = [
  {
    id: "amsterdam",
    name: "Amsterdam",
    slug: "amsterdam",
    countryId: "nl",
    shortSummary:
      "The Dutch capital is a vibrant, cosmopolitan city known for its canals, cycling culture, and thriving international job market. Amsterdam offers a unique blend of historic charm and modern innovation, with a strong tech and creative sector.",
    bestFor:
      "International professionals, tech workers, and couples seeking a vibrant, English-friendly European city with excellent work-life balance and cultural richness.",
    sunnyDaysPerYear: 165,
    avgTempByMonth: [3, 4, 7, 10, 14, 17, 19, 19, 16, 12, 7, 4],
    safetyIndex: 73,
    medianSalaryGross: 52000,
    estimatedMedianSalaryNet: 36400,
    costOfLivingIndex: 82,
    rentIndex: 85,
    groceriesIndex: 65,
    transportIndex: 70,
    diningIndex: 75,
    familyFitSummary:
      "Good for families with older children who enjoy an active, outdoor lifestyle. International schools are available but expensive. Childcare is well-organized but in high demand. Housing for families can be challenging to find in the city center.",
    expatFitSummary:
      "Excellent for expats. English is widely spoken, and the international community is large and active. The 30% ruling can provide significant tax benefits. Many companies operate in English. The main challenge is housing availability and cost.",
    population: "905,000",
    language: "Dutch (English widely spoken)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "rotterdam",
    name: "Rotterdam",
    slug: "rotterdam",
    countryId: "nl",
    shortSummary:
      "Europe's largest port city has reinvented itself as a hub of modern architecture, innovation, and cultural diversity. Rotterdam offers a grittier, more affordable alternative to Amsterdam with a strong sense of identity and ambitious urban development.",
    bestFor:
      "Young professionals and families looking for an affordable, modern Dutch city with strong career opportunities in logistics, engineering, and architecture.",
    sunnyDaysPerYear: 160,
    avgTempByMonth: [3, 4, 7, 10, 14, 17, 19, 19, 16, 12, 7, 4],
    safetyIndex: 70,
    medianSalaryGross: 48000,
    estimatedMedianSalaryNet: 34200,
    costOfLivingIndex: 72,
    rentIndex: 65,
    groceriesIndex: 63,
    transportIndex: 68,
    diningIndex: 68,
    familyFitSummary:
      "Increasingly family-friendly with new parks, family housing developments, and good schools. More spacious and affordable housing options compared to Amsterdam. Growing number of international schools.",
    expatFitSummary:
      "Growing expat community with a welcoming, multicultural atmosphere. English is commonly spoken in professional environments. Lower cost of living than Amsterdam while maintaining good international connectivity. The 30% ruling applies here too.",
    population: "655,000",
    language: "Dutch (English widely spoken)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "paris",
    name: "Paris",
    slug: "paris",
    countryId: "fr",
    shortSummary:
      "The City of Light needs little introduction. Paris is a global center of art, fashion, gastronomy, and culture. It offers world-class museums, Michelin-starred dining, and an unparalleled urban experience, though at a premium cost of living.",
    bestFor:
      "Culture enthusiasts, luxury and fashion professionals, and those who want to live in one of the world's most iconic cities and are comfortable with a higher cost of living.",
    sunnyDaysPerYear: 170,
    avgTempByMonth: [5, 6, 9, 12, 16, 19, 22, 21, 18, 13, 8, 5],
    safetyIndex: 65,
    medianSalaryGross: 45000,
    estimatedMedianSalaryNet: 28800,
    costOfLivingIndex: 88,
    rentIndex: 90,
    groceriesIndex: 72,
    transportIndex: 60,
    diningIndex: 80,
    familyFitSummary:
      "Excellent for families thanks to France's generous family policies, public creches, and free public schools. The city has many parks and family-oriented activities. Housing space can be limited and expensive, pushing some families to the suburbs.",
    expatFitSummary:
      "Large international community, especially in certain arrondissements. French language ability is strongly recommended for daily life and social integration. Bureaucracy can be complex but the city offers unmatched cultural experiences.",
    population: "2,160,000",
    language: "French",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "lyon",
    name: "Lyon",
    slug: "lyon",
    countryId: "fr",
    shortSummary:
      "France's gastronomic capital and third-largest city, Lyon offers an exceptional quality of life with a lower cost of living than Paris. Known for its UNESCO-listed old town, vibrant food scene, and growing tech sector, it's increasingly popular with both French and international professionals.",
    bestFor:
      "Families and professionals seeking high quality of life, excellent food culture, warmer weather, and significantly lower costs than Paris while still living in a major French city.",
    sunnyDaysPerYear: 200,
    avgTempByMonth: [4, 5, 10, 13, 17, 21, 24, 23, 19, 14, 8, 4],
    safetyIndex: 68,
    medianSalaryGross: 38000,
    estimatedMedianSalaryNet: 25100,
    costOfLivingIndex: 65,
    rentIndex: 52,
    groceriesIndex: 68,
    transportIndex: 55,
    diningIndex: 62,
    familyFitSummary:
      "Excellent family city with good public schools, affordable housing, and a relaxed pace of life. Strong community feel and safer neighborhoods. Good public transport and walkable city center.",
    expatFitSummary:
      "Growing expat community, though smaller than Paris. French language is more important here than in Amsterdam or Rotterdam. The city is welcoming and the quality of life often surprises newcomers. Lower costs make it easier to enjoy a comfortable lifestyle.",
    population: "522,000",
    language: "French",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
];

export function getCityById(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getCitiesByCountryId(countryId: string): City[] {
  return cities.filter((c) => c.countryId === countryId);
}
