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
  // ── NETHERLANDS ─────────────────────────────────────────────────────────────
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
    id: "the-hague",
    name: "The Hague",
    slug: "the-hague",
    countryId: "nl",
    shortSummary:
      "The seat of the Dutch government and home to international courts and over 160 international organisations. The Hague has a distinctly cosmopolitan character, a beautiful city centre, and easy access to the North Sea beaches of Scheveningen.",
    bestFor:
      "International civil servants, diplomats, lawyers, and NGO workers looking for a sophisticated, internationally-minded city with excellent quality of life.",
    sunnyDaysPerYear: 168,
    avgTempByMonth: [4, 4, 7, 10, 14, 17, 19, 19, 17, 12, 8, 5],
    safetyIndex: 75,
    medianSalaryGross: 50000,
    estimatedMedianSalaryNet: 35100,
    costOfLivingIndex: 74,
    rentIndex: 68,
    groceriesIndex: 64,
    transportIndex: 65,
    diningIndex: 70,
    familyFitSummary:
      "Very family-friendly with excellent international schools (The Hague has one of the densest concentrations in Europe), spacious housing, and beaches nearby. A calmer pace than Amsterdam makes it popular with families.",
    expatFitSummary:
      "Arguably the most expat-friendly city in the Netherlands. International organisations, embassies, and courts create a ready-made expat community. English is universally spoken in professional circles. Lower housing costs than Amsterdam.",
    population: "548,000",
    language: "Dutch (English very widely spoken)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "eindhoven",
    name: "Eindhoven",
    slug: "eindhoven",
    countryId: "nl",
    shortSummary:
      "Once a Philips company town, Eindhoven has transformed into the design and tech capital of the Netherlands. Home to ASML, the Brainport innovation ecosystem, and the Design Academy, it offers a dynamic environment for engineers and creatives.",
    bestFor:
      "Engineers, tech professionals, and designers drawn to the high-tech manufacturing and innovation ecosystem, with lower costs than Randstad cities.",
    sunnyDaysPerYear: 163,
    avgTempByMonth: [3, 4, 7, 11, 14, 17, 19, 19, 16, 12, 7, 4],
    safetyIndex: 76,
    medianSalaryGross: 54000,
    estimatedMedianSalaryNet: 37600,
    costOfLivingIndex: 65,
    rentIndex: 58,
    groceriesIndex: 62,
    transportIndex: 60,
    diningIndex: 63,
    familyFitSummary:
      "Excellent for families. Affordable housing with gardens, good Dutch schools and some international options, and a safe, relaxed environment. Brainport companies often offer family-friendly work policies.",
    expatFitSummary:
      "Strong expat community built around Brainport industries. ASML alone employs thousands of international engineers. English is the working language at major tech firms. 30% ruling applies. Less culturally busy than Amsterdam but excellent quality of life.",
    population: "235,000",
    language: "Dutch (English widely spoken in tech sector)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "utrecht",
    name: "Utrecht",
    slug: "utrecht",
    countryId: "nl",
    shortSummary:
      "A historic university city at the geographic heart of the Netherlands, Utrecht combines medieval charm with a youthful, progressive atmosphere. Its compact size, canal-lined streets, and excellent rail connections make it one of the Netherlands' most liveable cities.",
    bestFor:
      "Young professionals and academics who want a walkable, lively Dutch city with lower costs than Amsterdam, excellent connectivity, and a strong community feel.",
    sunnyDaysPerYear: 165,
    avgTempByMonth: [3, 4, 8, 11, 15, 18, 20, 20, 17, 12, 7, 4],
    safetyIndex: 74,
    medianSalaryGross: 49000,
    estimatedMedianSalaryNet: 34700,
    costOfLivingIndex: 72,
    rentIndex: 70,
    groceriesIndex: 63,
    transportIndex: 62,
    diningIndex: 68,
    familyFitSummary:
      "Increasingly popular with young families who want city life without Amsterdam's costs. Good schools, parks, and a safe environment. Housing is competitive but more manageable than Amsterdam. International schools are accessible (The Hague/Amsterdam nearby).",
    expatFitSummary:
      "Utrecht University attracts significant international academic and student populations. English is widely spoken. Excellent train links mean Amsterdam, Rotterdam, and The Hague are all within 30 minutes. Growing number of tech and professional expats.",
    population: "370,000",
    language: "Dutch (English widely spoken)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },

  // ── FRANCE ───────────────────────────────────────────────────────────────────
  {
    id: "paris",
    name: "Paris",
    slug: "paris",
    countryId: "fr",
    shortSummary:
      "The City of Light needs little introduction. Paris is a global centre of art, fashion, gastronomy, and culture. It offers world-class museums, Michelin-starred dining, and an unparalleled urban experience, though at a premium cost of living.",
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
      "Excellent for families thanks to France's generous family policies, public crèches, and free public schools. The city has many parks and family-oriented activities. Housing space can be limited and expensive, pushing some families to the suburbs.",
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
      "Excellent family city with good public schools, affordable housing, and a relaxed pace of life. Strong community feel and safer neighbourhoods. Good public transport and walkable city centre.",
    expatFitSummary:
      "Growing expat community, though smaller than Paris. French language is more important here than in Amsterdam. The city is welcoming and the quality of life often surprises newcomers. Lower costs make it easier to enjoy a comfortable lifestyle.",
    population: "522,000",
    language: "French",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "bordeaux",
    name: "Bordeaux",
    slug: "bordeaux",
    countryId: "fr",
    shortSummary:
      "The world capital of wine sits on the Garonne River with a stunning UNESCO-listed 18th-century centre. Bordeaux has undergone a remarkable urban renaissance, attracting young professionals, creatives, and families who appreciate its blend of gastronomy, culture, and Atlantic charm.",
    bestFor:
      "Wine lovers, food enthusiasts, and professionals seeking an elegant, walkable French city with a warm climate, Atlantic beaches nearby, and high quality of life at moderate cost.",
    sunnyDaysPerYear: 205,
    avgTempByMonth: [6, 7, 10, 13, 17, 20, 23, 23, 19, 14, 9, 6],
    safetyIndex: 65,
    medianSalaryGross: 35000,
    estimatedMedianSalaryNet: 23400,
    costOfLivingIndex: 62,
    rentIndex: 55,
    groceriesIndex: 66,
    transportIndex: 52,
    diningIndex: 60,
    familyFitSummary:
      "Very family-friendly with excellent public schools, spacious housing at reasonable prices, and a relaxed Atlantic lifestyle. The new tram network makes the city very accessible. Atlantic beaches reachable in under an hour.",
    expatFitSummary:
      "Growing international community thanks to its reputation and TGV link to Paris (2 hours). French language is essential for daily life. The city is open and welcoming to newcomers. A favourite destination for lifestyle-driven relocations.",
    population: "259,000",
    language: "French",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "marseille",
    name: "Marseille",
    slug: "marseille",
    countryId: "fr",
    shortSummary:
      "France's oldest city and second-largest port is a vibrant, raw, and deeply Mediterranean metropolis. Marseille offers unbeatable sunshine, stunning calanques coastline, exceptional seafood, and a gritty multicultural energy unlike anywhere else in France.",
    bestFor:
      "Sun-seekers, maritime professionals, and those drawn to a vibrant, authentic Mediterranean lifestyle with access to spectacular natural landscapes and affordable living.",
    sunnyDaysPerYear: 300,
    avgTempByMonth: [8, 9, 12, 15, 18, 23, 26, 26, 22, 17, 12, 8],
    safetyIndex: 55,
    medianSalaryGross: 34000,
    estimatedMedianSalaryNet: 22800,
    costOfLivingIndex: 65,
    rentIndex: 50,
    groceriesIndex: 65,
    transportIndex: 54,
    diningIndex: 58,
    familyFitSummary:
      "The northern neighbourhoods can be challenging for families, but the south and near suburbs offer pleasant residential areas. Strong Provençal lifestyle and incredible natural access (calanques, sea). Schools vary significantly by district.",
    expatFitSummary:
      "Marseille has an incredibly diverse population but a smaller formal expat community than Paris or Lyon. French is essential. The city rewards those who embrace its unique, unfiltered character. Affordable housing and 300 sunny days are powerful draws.",
    population: "870,000",
    language: "French",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "lille",
    name: "Lille",
    slug: "lille",
    countryId: "fr",
    shortSummary:
      "The vibrant capital of France's Nord region sits at the crossroads of France, Belgium, and the UK. With its distinctive Flemish-influenced architecture, student energy, and extraordinary Eurostar connectivity (London in 80 minutes, Brussels in 35), Lille punches well above its weight.",
    bestFor:
      "Cross-border commuters, students, and professionals who value exceptional transport links to London, Brussels, and Paris, combined with low living costs and a rich cultural scene.",
    sunnyDaysPerYear: 145,
    avgTempByMonth: [3, 4, 7, 10, 13, 17, 19, 19, 16, 11, 7, 4],
    safetyIndex: 60,
    medianSalaryGross: 33000,
    estimatedMedianSalaryNet: 22100,
    costOfLivingIndex: 58,
    rentIndex: 42,
    groceriesIndex: 63,
    transportIndex: 50,
    diningIndex: 55,
    familyFitSummary:
      "Affordable family living with good public schools and a strong sense of community. The student-heavy population keeps the city lively. Weather is cooler than southern France. Good Belgian day trips for weekends.",
    expatFitSummary:
      "Unique location for expats working between London, Brussels, and Paris. Smaller expat community but friendly locals and an open, student-influenced culture. Very affordable rents. French language is important for daily integration.",
    population: "235,000",
    language: "French",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "nantes",
    name: "Nantes",
    slug: "nantes",
    countryId: "fr",
    shortSummary:
      "Regularly voted France's most liveable city, Nantes combines a rich maritime heritage with a thriving creative and tech ecosystem. The Loire river city is known for its whimsical street art, Machines de l'Île, and a quality of life that draws young professionals from across France.",
    bestFor:
      "Young professionals and families seeking a French city with a strong quality of life, growing tech sector, Atlantic proximity, and a relaxed, creative atmosphere.",
    sunnyDaysPerYear: 190,
    avgTempByMonth: [5, 6, 9, 12, 16, 20, 22, 22, 19, 14, 9, 5],
    safetyIndex: 68,
    medianSalaryGross: 34000,
    estimatedMedianSalaryNet: 22800,
    costOfLivingIndex: 58,
    rentIndex: 48,
    groceriesIndex: 64,
    transportIndex: 52,
    diningIndex: 57,
    familyFitSummary:
      "Consistently praised for family quality of life. Affordable housing, good schools, green spaces, and a safe environment. Atlantic coast beaches within 1 hour. Strong public transport including trams.",
    expatFitSummary:
      "A growing choice for lifestyle-motivated expats. Good digital nomad infrastructure and a welcoming tech community. French is essential but the city is open and progressive. Excellent value for quality of life.",
    population: "320,000",
    language: "French",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "nice",
    name: "Nice",
    slug: "nice",
    countryId: "fr",
    shortSummary:
      "The jewel of the Côte d'Azur offers an extraordinary Mediterranean lifestyle — the Promenade des Anglais, the old Italian quarter, year-round sunshine, and easy access to Monaco, Cannes, and the Alps. Nice blends French sophistication with Italian warmth.",
    bestFor:
      "Retirees, remote workers, and finance/luxury sector professionals who value a sun-drenched Mediterranean lifestyle, proximity to Monaco, and a beautiful city on the sea.",
    sunnyDaysPerYear: 300,
    avgTempByMonth: [9, 9, 12, 15, 18, 22, 25, 25, 22, 17, 12, 9],
    safetyIndex: 65,
    medianSalaryGross: 34000,
    estimatedMedianSalaryNet: 22800,
    costOfLivingIndex: 72,
    rentIndex: 65,
    groceriesIndex: 70,
    transportIndex: 55,
    diningIndex: 70,
    familyFitSummary:
      "Great for families who value outdoor living and Mediterranean quality of life. Good schools and international options available. Housing can be competitive near the seafront. The school of Nice attracts some international families.",
    expatFitSummary:
      "Large established expat community, especially British and Northern European. Proximity to Monaco (where many work) is a strong draw. English is widely understood. Cost of living is higher than most French cities but lifestyle quality is exceptional.",
    population: "342,000",
    language: "French (Italian influence)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "strasbourg",
    name: "Strasbourg",
    slug: "strasbourg",
    countryId: "fr",
    shortSummary:
      "The seat of the European Parliament and Council of Europe, Strasbourg is a uniquely bicultural city on the Rhine, blending French and German cultures in its stunning Alsatian architecture. It's the EU's parliamentary capital and a major centre for international institutions.",
    bestFor:
      "EU professionals, diplomats, and Europhiles seeking a culturally rich, safe, and beautiful city with exceptional wine, food, and cross-border German lifestyle access.",
    sunnyDaysPerYear: 170,
    avgTempByMonth: [2, 3, 8, 12, 16, 19, 21, 21, 17, 12, 6, 3],
    safetyIndex: 68,
    medianSalaryGross: 36000,
    estimatedMedianSalaryNet: 24100,
    costOfLivingIndex: 62,
    rentIndex: 50,
    groceriesIndex: 64,
    transportIndex: 52,
    diningIndex: 60,
    familyFitSummary:
      "Very family-friendly with excellent schools, safe streets, and a strong community feel. Alsatian culture places high value on family life. German language schools available. Excellent cross-border shopping and services.",
    expatFitSummary:
      "Natural fit for EU employees and international civil servants. Strong expat community centred around European institutions. Both French and German are used. Affordable cost of living compared to Paris or Brussels.",
    population: "284,000",
    language: "French (German widely understood)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },

  // ── GERMANY ──────────────────────────────────────────────────────────────────
  {
    id: "berlin",
    name: "Berlin",
    slug: "berlin",
    countryId: "de",
    shortSummary:
      "Germany's reunified capital is Europe's startup capital and cultural powerhouse. Berlin offers an extraordinary arts scene, diverse neighbourhoods, and a startup ecosystem second only to London. Famously affordable for a European capital (though costs are rising), it attracts creatives and tech workers from around the world.",
    bestFor:
      "Entrepreneurs, startup professionals, artists, and tech workers who value a diverse, affordable, English-friendly European capital with a legendary nightlife and cultural scene.",
    sunnyDaysPerYear: 175,
    avgTempByMonth: [1, 2, 6, 11, 16, 19, 22, 21, 17, 12, 6, 2],
    safetyIndex: 65,
    medianSalaryGross: 48000,
    estimatedMedianSalaryNet: 30000,
    costOfLivingIndex: 62,
    rentIndex: 62,
    groceriesIndex: 55,
    transportIndex: 52,
    diningIndex: 60,
    familyFitSummary:
      "Berlin is surprisingly family-friendly with extensive parks, subsidised childcare (Kita), and good public schools. International schools are plentiful. The city is spacious by capital standards. Some districts are noisier and better suited to single professionals.",
    expatFitSummary:
      "One of Europe's most expat-friendly cities. English is widely spoken across professional, social, and commercial contexts. A massive international community means you can build a social life without speaking German. The EU Blue Card and Berlin's tech sector create clear immigration pathways.",
    population: "3,770,000",
    language: "German (English widely spoken)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "munich",
    name: "Munich",
    slug: "munich",
    countryId: "de",
    shortSummary:
      "Bavaria's prosperous capital combines German efficiency with a uniquely relaxed, beer-garden lifestyle. Munich has Germany's highest salaries, a world-class tech and engineering ecosystem, the Alps at its doorstep, and a quality of life that consistently places it among Europe's top cities.",
    bestFor:
      "Engineers, tech workers, and finance professionals seeking top German salaries, Alpine access, and a high-quality, safe, family-oriented city with excellent international connectivity.",
    sunnyDaysPerYear: 188,
    avgTempByMonth: [0, 1, 6, 11, 15, 19, 22, 21, 17, 12, 5, 1],
    safetyIndex: 80,
    medianSalaryGross: 58000,
    estimatedMedianSalaryNet: 35600,
    costOfLivingIndex: 72,
    rentIndex: 82,
    groceriesIndex: 60,
    transportIndex: 60,
    diningIndex: 70,
    familyFitSummary:
      "Exceptional for families. Safe streets, excellent schools (including international options), subsidised childcare, and the Alps within an hour make Munich a favourite for expat families. Housing is expensive but quality is high.",
    expatFitSummary:
      "Large and well-established expat community. English is widely spoken in professional environments. Germany's Blue Card scheme facilitates immigration for skilled workers. The main challenge is housing cost, which rivals Amsterdam. Quality of life is consistently ranked among Europe's highest.",
    population: "1,540,000",
    language: "German (English widely spoken in business)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "frankfurt",
    name: "Frankfurt",
    slug: "frankfurt",
    countryId: "de",
    shortSummary:
      "Germany's financial capital and home to the European Central Bank is a compact, internationally-focused city with Europe's busiest airport. Frankfurt may lack Berlin's cool factor but compensates with exceptional career opportunities in finance, consulting, and professional services.",
    bestFor:
      "Finance, banking, consulting, and professional services workers who prioritise international career opportunities and connectivity over cultural nightlife.",
    sunnyDaysPerYear: 165,
    avgTempByMonth: [2, 3, 7, 12, 16, 20, 23, 22, 18, 12, 7, 3],
    safetyIndex: 68,
    medianSalaryGross: 60000,
    estimatedMedianSalaryNet: 36500,
    costOfLivingIndex: 70,
    rentIndex: 78,
    groceriesIndex: 58,
    transportIndex: 58,
    diningIndex: 68,
    familyFitSummary:
      "Good for families, with excellent public transport, parks, and proximity to the Taunus hills. International schools cater well to expat children. Housing is expensive in the city centre but more affordable suburbs are close.",
    expatFitSummary:
      "Highly international city with a large expat banking and finance community. English is the working language in most international firms. Post-Brexit, many financial institutions relocated from London to Frankfurt, bringing a surge of UK and international professionals.",
    population: "760,000",
    language: "German (English widely spoken in finance)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "stuttgart",
    name: "Stuttgart",
    slug: "stuttgart",
    countryId: "de",
    shortSummary:
      "The home of Mercedes-Benz and Porsche is Germany's automotive and engineering capital. Stuttgart sits in a unique valley surrounded by vine-covered hills and offers some of Germany's highest wages, a strong work ethic, and a surprising wine and food culture.",
    bestFor:
      "Automotive and mechanical engineers, manufacturing professionals, and those seeking Germany's top engineering salaries in a green, safe, family-oriented environment.",
    sunnyDaysPerYear: 178,
    avgTempByMonth: [2, 3, 8, 12, 16, 20, 23, 22, 18, 12, 7, 3],
    safetyIndex: 78,
    medianSalaryGross: 56000,
    estimatedMedianSalaryNet: 34200,
    costOfLivingIndex: 65,
    rentIndex: 72,
    groceriesIndex: 58,
    transportIndex: 56,
    diningIndex: 63,
    familyFitSummary:
      "Excellent for families. Safe, green, and well-organised. International schools serve the engineering expat community. The surrounding hills and vineyards provide fantastic outdoor activities. Housing is expensive but quality is high.",
    expatFitSummary:
      "A focused engineering expat community around the automotive sector. English is the working language at global firms like Bosch, Daimler, and Porsche. Smaller international social scene than Berlin or Munich but strong professional networks and excellent salaries.",
    population: "635,000",
    language: "German (English spoken in engineering firms)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "hamburg",
    name: "Hamburg",
    slug: "hamburg",
    countryId: "de",
    shortSummary:
      "Germany's second-largest city and greatest port is a maritime metropolis of waterways, red brick architecture, and world-class culture. Hamburg's HafenCity is one of Europe's largest urban regeneration projects, and the city has a strong media, logistics, and aerospace sector.",
    bestFor:
      "Media, maritime, and logistics professionals, and those seeking a cosmopolitan Northern European port city with cultural depth, high salaries, and great transport links.",
    sunnyDaysPerYear: 162,
    avgTempByMonth: [2, 2, 6, 10, 14, 17, 19, 19, 16, 11, 7, 3],
    safetyIndex: 70,
    medianSalaryGross: 52000,
    estimatedMedianSalaryNet: 32000,
    costOfLivingIndex: 68,
    rentIndex: 72,
    groceriesIndex: 57,
    transportIndex: 58,
    diningIndex: 66,
    familyFitSummary:
      "Family-friendly with beautiful parks, Alster lakes, and good schools. Elbphilharmonie and the Reeperbahn represent the city's cultural contrasts. International schools are available. Housing is competitive but manageable.",
    expatFitSummary:
      "Established international community, especially in media and logistics. English is commonly used in professional environments. Hamburg has a liberal, cosmopolitan culture open to international residents. Good air connections via Hamburg Airport.",
    population: "1,840,000",
    language: "German (English widely spoken in business)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },

  // ── ITALY ─────────────────────────────────────────────────────────────────────
  {
    id: "rome",
    name: "Rome",
    slug: "rome",
    countryId: "it",
    shortSummary:
      "The Eternal City offers an unparalleled immersion in history, culture, and dolce vita living. As Italy's capital and largest city, Rome provides a unique urban experience where ancient ruins coexist with modern life, exceptional cuisine, and a warm Mediterranean climate.",
    bestFor:
      "History and culture lovers, government and international organisation professionals, and those seeking a Mediterranean lifestyle in one of the world's most iconic cities.",
    sunnyDaysPerYear: 280,
    avgTempByMonth: [8, 9, 13, 16, 21, 25, 28, 28, 24, 18, 13, 9],
    safetyIndex: 62,
    medianSalaryGross: 35000,
    estimatedMedianSalaryNet: 22100,
    costOfLivingIndex: 65,
    rentIndex: 58,
    groceriesIndex: 60,
    transportIndex: 50,
    diningIndex: 62,
    familyFitSummary:
      "Strong family culture with close community ties. Good public schools in residential areas. International schools available but expensive. The pace of life is Mediterranean — children grow up with freedom and outdoor living. Bureaucracy can be challenging.",
    expatFitSummary:
      "Large and historic expat community in Rome, particularly diplomatic and international NGO workers. Italian is essential for daily life. The impatriati tax regime can halve taxable income for new residents. Romans are welcoming but integration takes effort.",
    population: "2,780,000",
    language: "Italian",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "milan",
    name: "Milan",
    slug: "milan",
    countryId: "it",
    shortSummary:
      "Italy's economic powerhouse and fashion capital is the most European of Italian cities — fast-paced, efficient, internationally-minded, and home to Italy's strongest job market. Milan leads in fashion, finance, design, and luxury goods, with an increasingly vibrant tech and startup scene.",
    bestFor:
      "Fashion, finance, design, and tech professionals seeking Italy's top salaries, an international business environment, and a stylish, efficient city with global connectivity.",
    sunnyDaysPerYear: 230,
    avgTempByMonth: [3, 5, 10, 14, 18, 23, 26, 25, 20, 14, 8, 4],
    safetyIndex: 65,
    medianSalaryGross: 42000,
    estimatedMedianSalaryNet: 26500,
    costOfLivingIndex: 72,
    rentIndex: 75,
    groceriesIndex: 62,
    transportIndex: 60,
    diningIndex: 70,
    familyFitSummary:
      "Good for families with access to parks, international schools, and excellent healthcare. The city's efficiency sets it apart from other Italian cities. Housing is Italy's most expensive. Summers can be hot and humid.",
    expatFitSummary:
      "Milan has Italy's most developed expat community and the strongest English-language professional environment in the country. The impatriati regime (50% income exemption for up to 5 years) is a significant financial draw. The EU Blue Card works well for non-EU professionals.",
    population: "1,370,000",
    language: "Italian (English widely spoken in business)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "torino",
    name: "Torino",
    slug: "torino",
    countryId: "it",
    shortSummary:
      "Once the industrial heart of Italy and home to Fiat, Torino has reinvented itself as a city of innovation, chocolate, cinema, and culture. With the Alps at its doorstep, a thriving university, and Italy's most affordable major-city lifestyle, it's an emerging destination for quality-conscious expats.",
    bestFor:
      "Engineers, automotive professionals, and lifestyle-seekers who want an authentic Italian city with alpine access, outstanding food culture, and low cost of living.",
    sunnyDaysPerYear: 210,
    avgTempByMonth: [2, 4, 9, 13, 17, 22, 25, 24, 19, 13, 7, 3],
    safetyIndex: 65,
    medianSalaryGross: 34000,
    estimatedMedianSalaryNet: 21500,
    costOfLivingIndex: 58,
    rentIndex: 45,
    groceriesIndex: 58,
    transportIndex: 48,
    diningIndex: 56,
    familyFitSummary:
      "Excellent for families seeking affordability and Italian lifestyle. Spacious apartments at modest cost, good public schools, and the Alps within an hour for skiing and hiking. A calmer, more residential feel than Milan or Rome.",
    expatFitSummary:
      "Small but growing expat community, particularly in tech and automotive sectors. Italian is important for daily life. The impatriati tax exemption applies here too. Torino's low cost of living and high quality of life make it an underrated gem.",
    population: "870,000",
    language: "Italian",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },

  // ── HUNGARY ──────────────────────────────────────────────────────────────────
  {
    id: "budapest",
    name: "Budapest",
    slug: "budapest",
    countryId: "hu",
    shortSummary:
      "One of Europe's most beautiful capitals straddles the Danube with a dramatic skyline of thermal baths, baroque palaces, and ruin bars. Budapest offers EU living at a fraction of Western European costs, with a growing tech scene, outstanding food and nightlife, and a richly layered culture.",
    bestFor:
      "Budget-conscious professionals, digital nomads, and entrepreneurs who want EU access, a vibrant capital city lifestyle, and extraordinary value for money.",
    sunnyDaysPerYear: 200,
    avgTempByMonth: [2, 4, 9, 14, 19, 23, 25, 25, 20, 14, 8, 3],
    safetyIndex: 72,
    medianSalaryGross: 25000,
    estimatedMedianSalaryNet: 18000,
    costOfLivingIndex: 48,
    rentIndex: 42,
    groceriesIndex: 42,
    transportIndex: 38,
    diningIndex: 40,
    familyFitSummary:
      "Good for families seeking affordable EU living. Excellent international schools for expat children. Public schools are good but primarily in Hungarian. Strong pro-family government policies including generous benefits and subsidies. Spacious, affordable housing.",
    expatFitSummary:
      "A well-established and growing expat community, particularly from Western Europe and North America. English is widely spoken in tech and business. The flat 15% income tax and very low cost of living are the primary draws. Cultural integration requires learning Hungarian over time.",
    population: "1,790,000",
    language: "Hungarian (English spoken in business/tech)",
    currency: "HUF (€ equivalent used)",
    lastUpdated: "2024-12-01",
  },

  // ── SPAIN ─────────────────────────────────────────────────────────────────────
  {
    id: "madrid",
    name: "Madrid",
    slug: "madrid",
    countryId: "es",
    shortSummary:
      "Spain's capital is a dynamic, sun-drenched metropolis with world-class art museums, electric nightlife, and a growing tech hub. Madrid offers southern European warmth with the infrastructure of a modern European capital — and has attracted major international investment and talent in recent years.",
    bestFor:
      "Tech professionals, finance workers, and those seeking a vibrant, sunny European capital with a strong job market, high quality of life, and an energetic cultural scene.",
    sunnyDaysPerYear: 280,
    avgTempByMonth: [7, 9, 12, 15, 20, 25, 30, 29, 24, 17, 11, 7],
    safetyIndex: 68,
    medianSalaryGross: 36000,
    estimatedMedianSalaryNet: 25000,
    costOfLivingIndex: 63,
    rentIndex: 62,
    groceriesIndex: 57,
    transportIndex: 50,
    diningIndex: 60,
    familyFitSummary:
      "Madrid is a great city for families. Wide avenues, parks, world-class museums, and a warm climate make it excellent for outdoor family life. Public schools are good; international schools are plentiful. Summers are very hot but most families escape to the coast.",
    expatFitSummary:
      "Madrid has Spain's largest and most established expat community. English is widely spoken in tech and international business. The Beckham Law offers a flat 24% tax rate for qualifying expats — a major financial incentive. The city is open, welcoming, and Spanish language immersion is rewarding.",
    population: "3,340,000",
    language: "Spanish",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    slug: "barcelona",
    countryId: "es",
    shortSummary:
      "The Catalan capital is one of Europe's most seductive cities — a perfect synthesis of beach, culture, architecture, and gastronomy. From Gaudí's surreal masterpieces to the vibrant Eixample grid and seafront, Barcelona draws international talent with a lifestyle that few cities can match.",
    bestFor:
      "Creative professionals, tech workers, and lifestyle-seekers who want a Mediterranean beach city with a world-class cultural scene, growing startup ecosystem, and a distinctive identity.",
    sunnyDaysPerYear: 255,
    avgTempByMonth: [10, 11, 13, 15, 19, 23, 26, 26, 23, 18, 13, 10],
    safetyIndex: 65,
    medianSalaryGross: 36000,
    estimatedMedianSalaryNet: 25000,
    costOfLivingIndex: 68,
    rentIndex: 72,
    groceriesIndex: 59,
    transportIndex: 52,
    diningIndex: 65,
    familyFitSummary:
      "Excellent for families who value outdoor living and Mediterranean culture. Good international schools, parks, and beaches. Summers are hot and long. Catalan and Spanish bilingual education is common. Housing near the beach is expensive.",
    expatFitSummary:
      "Barcelona has Europe's most vibrant expat community after London. English is common in tech and international business. The Beckham Law applies here too. Understanding both Spanish and Catalan improves integration. Housing costs have risen sharply in recent years.",
    population: "1,620,000",
    language: "Spanish & Catalan",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "valencia",
    name: "Valencia",
    slug: "valencia",
    countryId: "es",
    shortSummary:
      "The birthplace of paella sits on the Mediterranean with a stunning old town, futuristic City of Arts and Sciences, and some of Spain's best urban beaches. Valencia offers all the appeal of Barcelona or Madrid at significantly lower cost, making it one of Europe's fastest-growing expat destinations.",
    bestFor:
      "Lifestyle expats, remote workers, and families seeking Mediterranean living with sunny beaches, excellent food, and one of Spain's best quality-to-cost ratios.",
    sunnyDaysPerYear: 300,
    avgTempByMonth: [11, 12, 14, 16, 19, 23, 27, 27, 24, 19, 14, 11],
    safetyIndex: 68,
    medianSalaryGross: 30000,
    estimatedMedianSalaryNet: 21000,
    costOfLivingIndex: 55,
    rentIndex: 48,
    groceriesIndex: 54,
    transportIndex: 46,
    diningIndex: 52,
    familyFitSummary:
      "Outstanding for families. Safe, relaxed, with excellent beaches, parks, and a warm climate. Good public schools and some international options. Affordable family housing with outdoor space. A slower pace than Madrid or Barcelona.",
    expatFitSummary:
      "Valencia's expat community has grown rapidly, particularly among remote workers attracted by the new digital nomad visa and low costs. English is becoming more common in international circles. Spanish is important for deeper integration. Excellent value for Mediterranean living.",
    population: "790,000",
    language: "Spanish & Valencian",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },

  // ── BELGIUM ───────────────────────────────────────────────────────────────────
  {
    id: "brussels",
    name: "Brussels",
    slug: "brussels",
    countryId: "be",
    shortSummary:
      "The de facto capital of the European Union is a cosmopolitan city of bureaucrats, diplomats, chocolatiers, and brewers. Brussels has a complex linguistic identity (French/Dutch) but operates largely in English in international circles, making it uniquely accessible to expats.",
    bestFor:
      "EU professionals, diplomats, lobbyists, and international organisation employees seeking Europe's political epicentre with world-class food, beer, and cultural life.",
    sunnyDaysPerYear: 155,
    avgTempByMonth: [3, 4, 7, 10, 14, 17, 19, 19, 16, 12, 7, 4],
    safetyIndex: 62,
    medianSalaryGross: 45000,
    estimatedMedianSalaryNet: 27500,
    costOfLivingIndex: 72,
    rentIndex: 68,
    groceriesIndex: 64,
    transportIndex: 60,
    diningIndex: 70,
    familyFitSummary:
      "Very family-friendly with subsidised childcare, excellent schools in multiple languages, and generous child benefits. The EU community creates a ready-made expat family network. Leafy suburbs like Uccle and Woluwe are popular with expat families.",
    expatFitSummary:
      "Arguably the world's most international city per capita. EU institutions, NATO, and hundreds of international organisations create a massive English-speaking expat bubble. Belgium's expat tax regime can exempt up to 30% of salary. The bureaucracy is uniquely complex but manageable with guidance.",
    population: "1,220,000",
    language: "French, Dutch & English (EU context)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "antwerp",
    name: "Antwerp",
    slug: "antwerp",
    countryId: "be",
    shortSummary:
      "Belgium's second city and diamond capital is a stylish port city with one of Europe's finest fashion scenes, a stunning medieval old town, and the world's largest diamond trading hub. Antwerp combines Flemish character with a cosmopolitan edge and growing creative economy.",
    bestFor:
      "Fashion, diamond, and logistics professionals, and those seeking a characterful Belgian city with strong culture, Dutch-speaking environment, and proximity to the Netherlands.",
    sunnyDaysPerYear: 158,
    avgTempByMonth: [3, 4, 8, 11, 15, 18, 20, 20, 17, 12, 7, 4],
    safetyIndex: 65,
    medianSalaryGross: 43000,
    estimatedMedianSalaryNet: 26200,
    costOfLivingIndex: 68,
    rentIndex: 62,
    groceriesIndex: 62,
    transportIndex: 58,
    diningIndex: 66,
    familyFitSummary:
      "Antwerp is very family-friendly with good Dutch-language schools, museums, and a safe, walkable city centre. The port area has excellent family housing. Close proximity to the Netherlands extends options.",
    expatFitSummary:
      "Significant expat community in the diamond and fashion sectors. English is widely spoken in business. More Flemish (Dutch-speaking) than Brussels — language matters more here for daily integration. Lower cost than Brussels for similar quality of life.",
    population: "540,000",
    language: "Dutch (English spoken in business)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },

  // ── SWITZERLAND ───────────────────────────────────────────────────────────────
  {
    id: "geneva",
    name: "Geneva",
    slug: "geneva",
    countryId: "ch",
    shortSummary:
      "The home of the United Nations, Red Cross, and hundreds of international organisations, Geneva sits on its eponymous lake with the Alps as a backdrop. It's the quintessential international city — wealthy, pristine, and home to some of the world's highest salaries.",
    bestFor:
      "International civil servants, humanitarian workers, finance professionals, and those seeking Europe's most international city environment with Alpine access and Swiss precision.",
    sunnyDaysPerYear: 190,
    avgTempByMonth: [2, 3, 8, 12, 16, 20, 23, 22, 18, 12, 7, 3],
    safetyIndex: 85,
    medianSalaryGross: 90000,
    estimatedMedianSalaryNet: 65000,
    costOfLivingIndex: 115,
    rentIndex: 120,
    groceriesIndex: 110,
    transportIndex: 85,
    diningIndex: 115,
    familyFitSummary:
      "Outstanding for families with access to world-class international schools (many international organisations cover school fees), excellent healthcare, and safe streets. The Lake and Alps provide extraordinary weekend activities. Very expensive but salaries compensate.",
    expatFitSummary:
      "Geneva is arguably the world's most international city. English is a primary working language alongside French. The expat community is enormous and self-sustaining. The primary challenge is cost — rent and groceries are among Europe's highest. Salaries in international organisations are tax-exempt.",
    population: "200,000",
    language: "French (English widely spoken internationally)",
    currency: "CHF",
    lastUpdated: "2024-12-01",
  },
  {
    id: "zurich",
    name: "Zurich",
    slug: "zurich",
    countryId: "ch",
    shortSummary:
      "Switzerland's largest city and global financial hub consistently tops quality-of-life rankings. Zurich combines extraordinary prosperity with a compact, liveable urban form, pristine lake swimming in summer, and easy alpine skiing in winter. It's expensive but the purchasing power is real.",
    bestFor:
      "Finance, banking, tech, and pharma professionals seeking some of Europe's highest net salaries, exceptional quality of life, and a German-speaking environment with strong international networks.",
    sunnyDaysPerYear: 185,
    avgTempByMonth: [1, 2, 7, 11, 15, 19, 22, 21, 17, 11, 6, 2],
    safetyIndex: 88,
    medianSalaryGross: 95000,
    estimatedMedianSalaryNet: 68000,
    costOfLivingIndex: 120,
    rentIndex: 125,
    groceriesIndex: 115,
    transportIndex: 90,
    diningIndex: 120,
    familyFitSummary:
      "Excellent for families with top-quality childcare (expensive), excellent international schools, and the safest streets in Europe. Lake Zurich and the Alps make for an extraordinary family lifestyle. The city is clean, efficient, and very child-friendly.",
    expatFitSummary:
      "Approximately 32% of Zurich's residents are foreign nationals. English is widely spoken in banking, tech, and pharma. German language skills improve daily integration significantly. The lump-sum taxation (forfait) is available for non-working residents with high assets. Net purchasing power is among Europe's highest despite the costs.",
    population: "435,000",
    language: "German (English widely spoken in finance/tech)",
    currency: "CHF",
    lastUpdated: "2024-12-01",
  },

  // ── AUSTRIA ───────────────────────────────────────────────────────────────────
  {
    id: "vienna",
    name: "Vienna",
    slug: "vienna",
    countryId: "at",
    shortSummary:
      "The imperial capital of the Habsburg empire retains its grandeur through stunning architecture, world-class opera, café culture, and an extraordinary museum landscape. Vienna has been named the world's most liveable city multiple years running — a title it earns through a remarkable combination of culture, safety, infrastructure, and quality of life.",
    bestFor:
      "Culture lovers, academics, healthcare professionals, and those seeking a grand, safe, affordable-by-Western-standards European capital with exceptional public services.",
    sunnyDaysPerYear: 200,
    avgTempByMonth: [2, 3, 8, 13, 18, 21, 24, 23, 19, 13, 7, 3],
    safetyIndex: 82,
    medianSalaryGross: 42000,
    estimatedMedianSalaryNet: 26500,
    costOfLivingIndex: 75,
    rentIndex: 70,
    groceriesIndex: 65,
    transportIndex: 55,
    diningIndex: 68,
    familyFitSummary:
      "Outstanding for families. Subsidised childcare, excellent public schools, universal healthcare, and one of Europe's safest environments. Vienna's parks, museums, and cultural life provide exceptional quality of childhood. Housing is reasonably priced for a European capital.",
    expatFitSummary:
      "Growing international community, particularly from Eastern Europe and the broader DACH region. English is widely spoken in professional contexts. German is important for full integration. Vienna is increasingly attractive to digital nomads and remote workers thanks to its infrastructure and relative affordability.",
    population: "1,930,000",
    language: "German (English widely spoken in business)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },

  // ── PORTUGAL ─────────────────────────────────────────────────────────────────
  {
    id: "lisbon",
    name: "Lisbon",
    slug: "lisbon",
    countryId: "pt",
    shortSummary:
      "Portugal's sun-drenched capital has transformed into one of Europe's most exciting cities — a startup hub, cultural hotspot, and expat magnet all in one. Built on seven hills above the Tagus estuary, Lisbon offers Atlantic beaches, world-class food, and a warm, welcoming culture.",
    bestFor:
      "Startup founders, tech professionals, remote workers, and lifestyle-seekers drawn to a sunny, affordable (by Western standards), English-friendly European capital with a thriving international community.",
    sunnyDaysPerYear: 290,
    avgTempByMonth: [12, 13, 15, 17, 20, 24, 27, 27, 25, 20, 15, 12],
    safetyIndex: 72,
    medianSalaryGross: 28000,
    estimatedMedianSalaryNet: 20000,
    costOfLivingIndex: 62,
    rentIndex: 72,
    groceriesIndex: 54,
    transportIndex: 48,
    diningIndex: 58,
    familyFitSummary:
      "Good for families who value climate, culture, and safety. International schools are available and well-regarded. Local Portuguese schools are free and improving. Healthcare is good. Housing near the centre has become expensive but suburbs offer good value.",
    expatFitSummary:
      "Lisbon has one of Europe's fastest-growing and most welcoming expat communities. English is widely spoken. The IFICI (former NHR) tax regime offers significant incentives for high-value workers. The D8 digital nomad visa makes residency straightforward for remote workers.",
    population: "550,000",
    language: "Portuguese (English widely spoken)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },
  {
    id: "porto",
    name: "Porto",
    slug: "porto",
    countryId: "pt",
    shortSummary:
      "Portugal's second city sits above the Douro River with a dramatic landscape of port wine cellars, baroque churches, and colourful azulejo tiles. Porto has grown rapidly as a tech hub and expat destination, offering an authentic Portuguese character that Lisbon is increasingly losing to tourism.",
    bestFor:
      "Remote workers, tech professionals, and those seeking an authentic, affordable Portuguese city with Atlantic beaches, world-famous wine, and a tight-knit expat community.",
    sunnyDaysPerYear: 240,
    avgTempByMonth: [10, 11, 13, 15, 17, 21, 24, 24, 22, 17, 13, 10],
    safetyIndex: 75,
    medianSalaryGross: 24000,
    estimatedMedianSalaryNet: 17500,
    costOfLivingIndex: 52,
    rentIndex: 55,
    groceriesIndex: 50,
    transportIndex: 42,
    diningIndex: 50,
    familyFitSummary:
      "Very good for families seeking authentic Portuguese living at reasonable cost. Good public schools and some international options. Excellent beaches within 30 minutes. A slower, safer pace than Lisbon. Strong sense of community.",
    expatFitSummary:
      "Porto's expat community has grown significantly, particularly among remote workers and digital nomads. English is increasingly spoken. More authentic and affordable than Lisbon. The IFICI tax regime and digital nomad visa apply here too. A genuine, welcoming city.",
    population: "238,000",
    language: "Portuguese (English increasingly spoken)",
    currency: "EUR",
    lastUpdated: "2024-12-01",
  },

  // ── DENMARK ──────────────────────────────────────────────────────────────────
  {
    id: "copenhagen",
    name: "Copenhagen",
    slug: "copenhagen",
    countryId: "dk",
    shortSummary:
      "The Danish capital is a model of sustainable, human-centred urban design. Famous for its cycling infrastructure, New Nordic cuisine, and hygge culture, Copenhagen consistently ranks among the world's happiest and most liveable cities. It's also a leading hub for life sciences, cleantech, and design.",
    bestFor:
      "Life sciences, cleantech, design, and tech professionals seeking a world-class quality of life, exceptional work-life balance, and a sustainable, well-designed city with strong English proficiency.",
    sunnyDaysPerYear: 175,
    avgTempByMonth: [2, 2, 4, 8, 13, 16, 18, 18, 14, 10, 6, 3],
    safetyIndex: 82,
    medianSalaryGross: 62000,
    estimatedMedianSalaryNet: 38000,
    costOfLivingIndex: 95,
    rentIndex: 88,
    groceriesIndex: 90,
    transportIndex: 70,
    diningIndex: 95,
    familyFitSummary:
      "Copenhagen is exceptional for families. Heavily subsidised childcare from 6 months, 52 weeks of shared parental leave, free schools through university, and universal healthcare create an outstanding family safety net. The cycling infrastructure makes the city very child-friendly.",
    expatFitSummary:
      "Copenhagen has a very open, English-speaking expat community. Virtually everyone speaks excellent English. The expat/researcher flat 27% tax scheme is a major financial benefit for qualifying employees. Life sciences and tech companies actively recruit internationally. Danish language learning is a longer-term goal but not a day-one requirement.",
    population: "800,000",
    language: "Danish (English universally spoken)",
    currency: "DKK",
    lastUpdated: "2024-12-01",
  },

  // ── SWEDEN ────────────────────────────────────────────────────────────────────
  {
    id: "stockholm",
    name: "Stockholm",
    slug: "stockholm",
    countryId: "se",
    shortSummary:
      "Built across 14 islands where Lake Mälaren meets the Baltic Sea, Stockholm is Scandinavia's largest city and a global leader in tech and innovation. It has produced more billion-dollar startups per capita than any other region outside Silicon Valley, and offers a unique combination of natural beauty and urban excellence.",
    bestFor:
      "Tech entrepreneurs, startup professionals, and those seeking a world-class Scandinavian quality of life with exceptional work-life balance, strong English environment, and access to nature.",
    sunnyDaysPerYear: 180,
    avgTempByMonth: [-1, 0, 3, 8, 13, 17, 20, 19, 14, 9, 5, 1],
    safetyIndex: 72,
    medianSalaryGross: 58000,
    estimatedMedianSalaryNet: 37000,
    costOfLivingIndex: 90,
    rentIndex: 88,
    groceriesIndex: 85,
    transportIndex: 72,
    diningIndex: 90,
    familyFitSummary:
      "Sweden offers the world's most comprehensive family support system. 480 days of generously paid parental leave, heavily subsidised childcare (maxtaxa), free schools, and universal healthcare create an exceptional environment for raising children. Stockholm's archipelago provides unmatched outdoor family experiences.",
    expatFitSummary:
      "Stockholm has a large and well-integrated expat tech community. English is universally spoken in professional contexts — many Stockholm tech firms operate entirely in English. The expert tax relief offers 25% income exemption for qualifying specialists. Swedish language learning is encouraged but not essential for professional success.",
    population: "975,000",
    language: "Swedish (English universally spoken)",
    currency: "SEK",
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
