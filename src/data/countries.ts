export interface Country {
  id: string;
  name: string;
  slug: string;
  summary: string;
  flagEmoji: string;
  salaryCalculatorType: "dutch" | "french";
  nationalTaxNotes: string;
  methodologyNotes: string;
  avgWeatherSummary: string;
  safetyContext: string;
  costOfLivingPositioning: string;
  familyFriendliness: string;
  expatFriendliness: string;
  lastUpdated: string;
}

export const countries: Country[] = [
  {
    id: "nl",
    name: "Netherlands",
    slug: "netherlands",
    summary:
      "The Netherlands is a small, densely populated country known for its flat landscape, cycling culture, and progressive policies. It ranks consistently high in quality of life, safety, and work-life balance. English proficiency is among the highest in Europe, making it a popular destination for international professionals.",
    flagEmoji: "NL",
    salaryCalculatorType: "dutch",
    nationalTaxNotes:
      "The Netherlands uses a progressive income tax system with brackets at approximately 36.97% (up to ~73,000 EUR) and 49.50% above that. Social security contributions are included in the first bracket. The 30% ruling for expats can reduce taxable income significantly for qualifying employees.",
    methodologyNotes:
      "Tax calculations follow the 2024 Dutch income tax structure. Salary figures represent gross annual compensation. The 30% ruling option is available for qualifying knowledge workers.",
    avgWeatherSummary:
      "Maritime climate with mild summers (17-22C) and cool winters (2-6C). Expect around 1,600 hours of sunshine per year and frequent rain throughout the year.",
    safetyContext:
      "The Netherlands is considered one of the safest countries in Europe, with low rates of violent crime. Petty crime such as bicycle theft and pickpocketing can occur in major cities.",
    costOfLivingPositioning:
      "Moderate to high cost of living by European standards. Housing costs are the largest expense, particularly in Amsterdam. Groceries and transport are comparable to other Western European countries.",
    familyFriendliness:
      "Excellent childcare infrastructure, generous parental leave policies, and a strong emphasis on work-life balance. International schools are available in major cities.",
    expatFriendliness:
      "Very expat-friendly with high English proficiency, international communities, and the 30% tax ruling for qualifying workers. The Dutch directness can be surprising but is culturally valued.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "fr",
    name: "France",
    slug: "france",
    summary:
      "France is Western Europe's largest country, renowned for its culture, cuisine, and quality of life. It offers world-class healthcare, excellent public infrastructure, and a diverse range of living environments from cosmopolitan Paris to charming regional cities. The 35-hour workweek reflects the importance placed on leisure and family time.",
    flagEmoji: "FR",
    salaryCalculatorType: "french",
    nationalTaxNotes:
      "France uses a progressive income tax system with rates from 0% to 45%. Social contributions (cotisations sociales) are deducted from gross salary before income tax, typically around 22-25% for non-cadre and 23-26% for cadre employees. Income tax is calculated on net social salary.",
    methodologyNotes:
      "Calculations follow the 2024 French tax and social contribution structure. The distinction between cadre and non-cadre status affects social contribution rates. Net salary estimates account for both social contributions and income tax.",
    avgWeatherSummary:
      "Varied climate ranging from oceanic in the north to Mediterranean in the south. Paris averages 1,660 sunshine hours per year, while Lyon enjoys approximately 2,000 hours.",
    safetyContext:
      "France is generally safe with well-funded public services. Urban areas may experience higher rates of petty crime. The country maintains robust emergency services and healthcare access.",
    costOfLivingPositioning:
      "Cost of living varies significantly by region. Paris is among Europe's most expensive cities, while regional cities like Lyon offer substantially lower costs, particularly for housing.",
    familyFriendliness:
      "Excellent public childcare (creches), generous family allowances, long parental leave, and free public education. France is widely regarded as one of the best countries in Europe for raising a family.",
    expatFriendliness:
      "France has a large international community, especially in Paris and major cities. French language ability is important for daily life and integration. Bureaucracy can be challenging but is improving with digitalization.",
    lastUpdated: "2024-12-01",
  },
];

export function getCountryById(id: string): Country | undefined {
  return countries.find((c) => c.id === id);
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}
