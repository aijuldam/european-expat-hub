export interface Country {
  id: string;
  name: string;
  slug: string;
  summary: string;
  flagEmoji: string;
  salaryCalculatorType: "dutch" | "french" | "none";
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
      "Maritime climate with mild summers (17-22°C) and cool winters (2-6°C). Expect around 1,600 hours of sunshine per year and frequent rain throughout the year.",
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
      "Varied climate ranging from oceanic in the north to Mediterranean in the south. Paris averages 1,660 sunshine hours per year, while the south enjoys over 2,500 hours.",
    safetyContext:
      "France is generally safe with well-funded public services. Urban areas may experience higher rates of petty crime. The country maintains robust emergency services and healthcare access.",
    costOfLivingPositioning:
      "Cost of living varies significantly by region. Paris is among Europe's most expensive cities, while regional cities offer substantially lower costs, particularly for housing.",
    familyFriendliness:
      "Excellent public childcare (crèches), generous family allowances, long parental leave, and free public education. France is widely regarded as one of the best countries in Europe for raising a family.",
    expatFriendliness:
      "France has a large international community, especially in Paris and major cities. French language ability is important for daily life and integration. Bureaucracy can be challenging but is improving with digitalization.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "de",
    name: "Germany",
    slug: "germany",
    summary:
      "Germany is Europe's largest economy and a powerhouse of engineering, technology, and innovation. It offers a high standard of living, robust social security, excellent infrastructure, and a strong job market. With a federal system, each state has its own character — from cosmopolitan Berlin to prosperous Bavaria.",
    flagEmoji: "DE",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Germany has a progressive income tax from 14% to 45%, plus a solidarity surcharge and church tax where applicable. Social insurance contributions (health, pension, unemployment, care) add approximately 20% of gross salary split between employer and employee.",
    methodologyNotes:
      "Net salary estimates are approximations based on typical effective rates. Germany's tax system depends on marital status, tax class, and church membership. Use a dedicated German salary calculator for precise figures.",
    avgWeatherSummary:
      "Temperate continental climate with cold winters (-1 to 4°C) and warm summers (18-24°C). The south and east tend to have more sunshine and colder winters; the north and west are milder and rainier.",
    safetyContext:
      "Germany is one of the safest countries in Europe. Crime rates are low and the rule of law is strong. Major cities have some petty crime hotspots, but violent crime is rare.",
    costOfLivingPositioning:
      "Generally moderate by Western European standards. Munich and Frankfurt are more expensive; Berlin remains relatively affordable for a capital city. Housing markets in major cities are tightening.",
    familyFriendliness:
      "Strong family support via Kindergeld (child benefit), Elterngeld (parental allowance), and excellent public schooling. Childcare availability has improved but can still be limited in major cities.",
    expatFriendliness:
      "Growing international communities in all major cities. English is widely spoken in business contexts. German language skills are important for daily life, bureaucracy, and social integration. The Blue Card facilitates skilled-worker immigration.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "it",
    name: "Italy",
    slug: "italy",
    summary:
      "Italy offers an unmatched combination of history, culture, cuisine, and natural beauty. From the fashion capital of Milan to eternal Rome and the Alps of Torino, Italy provides a deeply rewarding lifestyle. The pace of life is slower and quality of living high, though bureaucracy and economic challenges persist in some regions.",
    flagEmoji: "IT",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Italy has a progressive IRPEF income tax (23% to 43%), plus regional and municipal surcharges (0.7-3.3%). Social contributions for employees total around 9-10% of gross. Salaries tend to be lower than Northern Europe but cost of living in many cities is also lower.",
    methodologyNotes:
      "Net salary estimates account for approximate IRPEF and social contributions. Italy has an attractive flat-tax regime for new residents (impatriati) that can reduce taxable income by 50% for up to 5 years — a significant benefit for skilled expats.",
    avgWeatherSummary:
      "Mediterranean climate in the south (hot, dry summers; mild winters) to temperate continental in the north (cold winters; warm summers). Rome averages 2,500 sunshine hours per year; Milan around 2,000.",
    safetyContext:
      "Italy is generally safe. Petty crime such as pickpocketing can be common in tourist areas of Rome and Naples. The north is typically perceived as safer than the south. Major cities have efficient police presence in central areas.",
    costOfLivingPositioning:
      "Moderate cost of living overall, with wide regional variation. Milan is the most expensive city; Rome is moderately priced; Torino is affordable. Food and dining out are generally excellent value.",
    familyFriendliness:
      "Strong family culture with close community ties. Public schooling is well-regarded. Child benefit support exists but is less generous than Northern Europe. Maternity leave is excellent; paternity leave is improving.",
    expatFriendliness:
      "Italy has a growing expat community, particularly in Milan. English is less widely spoken outside tourist and business contexts — learning Italian greatly improves the experience. The impatriati tax regime attracts skilled internationals.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "hu",
    name: "Hungary",
    slug: "hungary",
    summary:
      "Hungary offers one of the most affordable lifestyles in the EU, centred around its stunning capital Budapest. With a flat income tax rate, low cost of living, and a growing tech and startup scene, it attracts expats looking for European city life on a budget. EU membership means freedom of movement within the bloc.",
    flagEmoji: "HU",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Hungary has a flat personal income tax rate of 15%. Social contributions for employees total approximately 18.5% (pension, health, labour market). Employer contributions are around 13%. Net salaries are higher in percentage terms than many Western European countries.",
    methodologyNotes:
      "Net salary estimates apply the flat 15% income tax and 18.5% employee social contributions. Salaries are denominated in HUF but professionals often negotiate in EUR. All city data is converted to EUR for consistency.",
    avgWeatherSummary:
      "Continental climate with hot summers (22-28°C) and cold winters (-1 to 4°C). Budapest averages around 2,000 sunshine hours per year. Autumn and spring are mild and pleasant.",
    safetyContext:
      "Hungary is generally safe with low violent crime rates. Budapest is considered one of the safer Eastern European capitals. Standard precautions apply in crowded tourist areas.",
    costOfLivingPositioning:
      "One of the most affordable EU countries. Budapest offers excellent value — quality restaurants, transport, and housing are significantly cheaper than Western European equivalents. Expats from higher-wage countries often enjoy a premium lifestyle.",
    familyFriendliness:
      "Strong pro-family government policies including generous child benefits, interest-free loans for young families, and housing subsidies. Public schooling is good; international schools exist in Budapest.",
    expatFriendliness:
      "Growing expat community, particularly in Budapest. English is widely spoken in tech and business. Hungarian is a notoriously difficult language, but many daily activities can be managed in English. EU citizens have easy residency rights.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "es",
    name: "Spain",
    slug: "spain",
    summary:
      "Spain combines a Mediterranean lifestyle with modern European infrastructure. Known for its warm climate, vibrant culture, world-class gastronomy, and strong work-life balance, it consistently ranks among the most popular expat destinations. Major cities offer strong job markets in tech, tourism, and international business.",
    flagEmoji: "ES",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Spain has a progressive income tax (IRPF) ranging from 19% to 47%, split between state and regional rates. Social contributions total approximately 6.35% for employees. Spain also offers the Beckham Law (Régimen especial para trabajadores desplazados) which taxes non-resident income at a flat 24% for qualifying expats in the first 6 years.",
    methodologyNotes:
      "Net salary estimates apply approximate effective IRPF and social contribution rates. The Beckham Law can significantly reduce tax burden for qualifying international hires — a major draw for highly paid professionals.",
    avgWeatherSummary:
      "Mediterranean climate dominates the coast with hot, dry summers and mild winters. Madrid has a semi-arid continental climate with more extreme temperatures. Spain averages 2,500-3,000 sunshine hours per year.",
    safetyContext:
      "Spain is generally safe and ranks well in global safety indices. Tourist areas in Barcelona and Madrid can experience pickpocketing. The overall crime rate is moderate, and violent crime is relatively rare.",
    costOfLivingPositioning:
      "Moderate cost of living by Western European standards. Spain is significantly cheaper than Northern Europe. Madrid and Barcelona are the most expensive cities; Valencia and other regional cities offer excellent value.",
    familyFriendliness:
      "Strong family culture with extended family networks. Public schooling is well-regarded. Spain offers universal healthcare and generous maternity leave (16 weeks, shared parental leave available). Work-life balance is improving.",
    expatFriendliness:
      "Spain has one of the largest expat communities in Europe. English is more widely spoken in international business contexts. Spanish language learning is strongly recommended. The Digital Nomad Visa has made Spain increasingly attractive to remote workers.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "be",
    name: "Belgium",
    slug: "belgium",
    summary:
      "Belgium punches above its weight as a small country with outsized influence — home to NATO, the EU headquarters, and a high standard of living. With excellent healthcare, strong social protection, and a central location in Western Europe, it's a popular base for international professionals and diplomats.",
    flagEmoji: "BE",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Belgium has some of Europe's highest income tax rates, progressive from 25% to 50%. Social contributions for employees total approximately 13.07% of gross salary. The overall tax wedge is among the highest in the OECD, though gross salaries tend to reflect this.",
    methodologyNotes:
      "Net salary estimates account for progressive income tax and employee social contributions. Belgium offers expat tax regimes (the new expat regime from 2022) that can exempt 30% of remuneration from tax for qualifying employees, capped at €90,000.",
    avgWeatherSummary:
      "Maritime temperate climate similar to the Netherlands — mild, wet, and often cloudy. Summers are warm (18-22°C), winters cool (1-6°C). About 1,650 sunshine hours per year.",
    safetyContext:
      "Belgium is generally safe. Brussels has some areas with higher crime rates, but the city is overall safe for daily life. Antwerp and Ghent are considered safe cities with low violent crime.",
    costOfLivingPositioning:
      "Higher cost of living than Eastern Europe but moderate within Western Europe. Brussels and Antwerp are the most expensive cities. Food, dining, and cultural activities offer good value. Housing has become more expensive in major cities.",
    familyFriendliness:
      "Excellent family support including generous child allowances (kinderbijslag), quality public schools in both French and Dutch, and strong healthcare. Work-life balance is valued and part-time work is common.",
    expatFriendliness:
      "Belgium is extremely international, especially Brussels with its EU and NATO communities. English is widely spoken in professional and international circles. The country is officially trilingual (Dutch, French, German), which can complicate daily life depending on region.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "ch",
    name: "Switzerland",
    slug: "switzerland",
    summary:
      "Switzerland is synonymous with high quality of life, political stability, and precision. With some of Europe's highest salaries, pristine natural landscapes, excellent infrastructure, and a tradition of neutrality, it attracts top international talent. The cost of living is equally high, but purchasing power often remains strong.",
    flagEmoji: "CH",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Switzerland has a unique three-tier tax system: federal, cantonal, and communal. Federal income tax is progressive from 0% to 11.5%. Cantonal rates vary widely — Zug is the lowest, Geneva among the higher ones. Total effective rates range from 20% to 40% depending on income and canton. Social contributions total approximately 12.5% for employees.",
    methodologyNotes:
      "Net salary estimates use approximate effective federal and cantonal rates for the respective cities (Geneva and Zurich). Switzerland's tax system rewards careful canton selection. Salaries are among Europe's highest.",
    avgWeatherSummary:
      "Varied by altitude and region. Lowland cities (Geneva, Zurich) have temperate climates with warm summers (20-26°C) and cold winters (0-5°C). The Alps experience heavy snowfall and colder temperatures. Switzerland averages 1,700-2,000 sunshine hours depending on location.",
    safetyContext:
      "Switzerland consistently ranks among the world's safest countries. Crime rates are very low, and the rule of law is strong. Both Geneva and Zurich are considered extremely safe cities.",
    costOfLivingPositioning:
      "Switzerland has the highest cost of living in Europe. Groceries, dining, housing, and healthcare are significantly more expensive than EU countries. However, salaries are proportionally much higher, and purchasing power is generally strong.",
    familyFriendliness:
      "High-quality childcare and education. However, childcare costs are very high and formal childcare availability can be limited. International schools are excellent. Strong emphasis on outdoor lifestyle and community.",
    expatFriendliness:
      "Switzerland has a very large international community — approximately 25% of residents are foreign nationals. English, German, French, and Italian are all used. Zurich is predominantly German-speaking; Geneva is francophone. Integration can be slow, but professional environments are highly international.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "at",
    name: "Austria",
    slug: "austria",
    summary:
      "Austria offers a remarkable combination of cultural richness, natural beauty, and high living standards. Vienna consistently ranks as the world's most liveable city. With strong social welfare, universal healthcare, and a central European location, Austria is an increasingly popular expat destination.",
    flagEmoji: "AT",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Austria has a progressive income tax from 0% to 55% for very high incomes, with effective rates typically 30-45% for middle to high earners. Social contributions for employees total approximately 18% of gross salary (health, pension, unemployment, accident).",
    methodologyNotes:
      "Net salary estimates apply approximate progressive tax rates and employee social contributions. Austria's tax system is relatively straightforward. The Rot-Weiß-Rot card facilitates skilled worker immigration.",
    avgWeatherSummary:
      "Continental climate with cold winters (-1 to 4°C in Vienna) and warm summers (22-26°C). Austria averages around 1,900 sunshine hours per year. Mountainous regions receive significant snowfall in winter.",
    safetyContext:
      "Austria is one of the safest countries in Europe. Vienna consistently scores highly in global safety rankings. Crime rates are very low and the rule of law is strong.",
    costOfLivingPositioning:
      "Moderate to high cost of living. Vienna is expensive by regional standards but more affordable than Zurich, London, or Paris. The rest of Austria is significantly cheaper than the capital.",
    familyFriendliness:
      "Excellent family support including generous Kinderbetreuungsgeld (child benefit), quality public schooling, and universal healthcare. Work-life balance is strongly culturally valued.",
    expatFriendliness:
      "Vienna has a sizeable and growing international community. English is widely spoken in business. German language skills become important for daily life and deeper social integration. The bureaucratic process can be challenging.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "pt",
    name: "Portugal",
    slug: "portugal",
    summary:
      "Portugal has emerged as one of Europe's most sought-after expat destinations — combining Atlantic charm, a warm climate, affordable living, and growing tech hubs in Lisbon and Porto. The country offers excellent quality of life at a fraction of Northern European costs, with a welcoming culture and impressive safety record.",
    flagEmoji: "PT",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Portugal has a progressive IRS income tax from 14.5% to 48%. Social contributions for employees total 11% of gross salary. Portugal's Non-Habitual Resident (NHR) regime historically offered a flat 20% tax rate for qualifying professions for 10 years, now replaced by IFICI incentives for high-value activities.",
    methodologyNotes:
      "Net salary estimates apply approximate IRS and social contribution rates. Portugal's tax incentive regimes for new residents can significantly reduce the tax burden. Salaries are lower than Northern Europe but the cost of living is proportionally lower.",
    avgWeatherSummary:
      "Mediterranean and Atlantic climate with warm, sunny summers (25-30°C) and mild winters (10-15°C). Lisbon averages 2,800 sunshine hours per year — one of the sunniest capitals in Europe. Porto is slightly cooler and rainier.",
    safetyContext:
      "Portugal consistently ranks among the world's safest countries. Both Lisbon and Porto are considered very safe cities with low crime rates. It ranks in the Global Peace Index top 10.",
    costOfLivingPositioning:
      "One of the most affordable Western European countries. Lisbon has become pricier due to expat demand and tourism, but remains cheaper than Amsterdam, Paris, or Zurich. Porto is noticeably more affordable than Lisbon.",
    familyFriendliness:
      "Strong family culture with good public schools and universal healthcare. Child benefit support exists. The relaxed lifestyle and outdoor living make Portugal excellent for families. International schools in Lisbon are well-regarded.",
    expatFriendliness:
      "Portugal is exceptionally expat-friendly. English is widely spoken, especially in cities. The culture is warm and welcoming to foreigners. Large communities of international residents have established themselves in Lisbon and Porto.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "dk",
    name: "Denmark",
    slug: "denmark",
    summary:
      "Denmark is the birthplace of hygge — the art of cosy, contented living. It consistently tops global rankings for happiness, quality of life, and work-life balance. With one of Europe's most egalitarian societies, strong public services, and a booming life-science and tech sector, Denmark is a compelling destination for skilled expats.",
    flagEmoji: "DK",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Denmark has one of the world's highest income tax rates, with effective rates of 35-50% for middle to high earners. The top marginal rate including municipal tax exceeds 55%. However, Denmark offers expats a flat 27% tax rate on gross salary for the first 7 years (the researcher/expat scheme), which can be highly advantageous.",
    methodologyNotes:
      "Net salary estimates apply approximate Danish effective tax rates. The expat 27% flat-rate scheme is available for qualifying employees (subject to minimum salary thresholds). Salaries are among the highest in Europe, and the public services funded by taxes are exceptional.",
    avgWeatherSummary:
      "Maritime climate with mild, overcast summers (18-22°C) and cold, dark winters (0-4°C). Copenhagen averages around 1,800 sunshine hours per year. Winters can feel long and grey but spring and summer are delightful.",
    safetyContext:
      "Denmark is one of the world's safest countries. Copenhagen has very low crime rates and the rule of law is exemplary. Trust in institutions is very high.",
    costOfLivingPositioning:
      "High cost of living — among the highest in Europe. Alcohol, food, and dining out are especially expensive. However, high salaries and excellent free public services (education, healthcare) partially offset the costs.",
    familyFriendliness:
      "Outstanding family support. Subsidised childcare from 6 months, generous shared parental leave (52 weeks total), free schooling through university, and universal healthcare. Denmark is consistently rated one of the world's best places to raise a family.",
    expatFriendliness:
      "High English proficiency — virtually everyone in Copenhagen speaks excellent English. The international community is welcoming, particularly in Copenhagen. Danish language learning is recommended for deeper integration but is not strictly required in professional contexts.",
    lastUpdated: "2024-12-01",
  },
  {
    id: "se",
    name: "Sweden",
    slug: "sweden",
    summary:
      "Sweden combines Scandinavian design sensibility with a world-class social system, strong innovation economy, and a deep commitment to sustainability and equality. Stockholm is a leading European tech and startup hub, and the country offers an exceptionally high quality of life across all regions.",
    flagEmoji: "SE",
    salaryCalculatorType: "none",
    nationalTaxNotes:
      "Sweden has a progressive income tax with a national tax of 20-25% plus a municipal tax of approximately 32% (varies by municipality). Effective total rates for middle to high earners range from 32-57%. Social contributions for employees are approximately 7% of gross salary. Sweden also has an expert tax relief scheme offering a 25% exemption on income for qualifying experts for the first 7 years.",
    methodologyNotes:
      "Net salary estimates apply approximate effective Swedish tax rates including municipal tax. The expert tax relief scheme can significantly reduce the tax burden for qualifying international hires (typically threshold-based).",
    avgWeatherSummary:
      "Temperate to subarctic climate with long, cold winters and short but pleasant summers. Stockholm averages 1,900 sunshine hours per year. Summers (June-August) can be warm (20-25°C); winters bring darkness and temperatures of -2 to 2°C.",
    safetyContext:
      "Sweden is generally safe with strong rule of law and high trust in institutions. Stockholm is considered a safe European capital. Some suburban areas have experienced higher crime rates in recent years, but the overall safety picture remains positive.",
    costOfLivingPositioning:
      "High cost of living, comparable to Denmark and Norway. Alcohol is expensive (due to the Systembolaget monopoly). Housing in Stockholm is tight and expensive. However, Sweden's universal public services (healthcare, education, childcare) provide significant value.",
    familyFriendliness:
      "Sweden is among the world's most family-friendly countries. It pioneered shared parental leave (480 days, generously paid), offers highly subsidised childcare, free schooling through university, and universal healthcare. The work-life balance culture is exceptional.",
    expatFriendliness:
      "Swedish English proficiency is extremely high. Stockholm has a large and active international community. The expert tax relief makes Sweden attractive for highly skilled workers. Swedish is important for full social integration, but English suffices in professional settings.",
    lastUpdated: "2024-12-01",
  },
];

export function getCountryById(id: string): Country | undefined {
  return countries.find((c) => c.id === id);
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}
