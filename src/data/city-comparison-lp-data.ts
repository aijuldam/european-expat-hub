/**
 * SEO content for city vs. city comparison landing pages.
 * Each entry drives /compare/[slug].
 * Cost data is pulled live from city-costs.ts and cities.ts in the page component.
 */

export interface CityComparisonFAQ {
  q: string;
  a: string;
}

export interface CityComparisonLPData {
  slug: string;              // e.g. "amsterdam-vs-berlin"
  city1Slug: string;
  city2Slug: string;
  country1Slug: string;
  country2Slug: string;
  country1Code: string;      // calculator country code
  country2Code: string;
  city1Name: string;
  city2Name: string;
  country1Name: string;
  country2Name: string;
  h1: string;
  intro: string;
  verdict: string;           // 2-sentence punchline shown in the summary card
  bestFor1: string;          // who city1 is best for
  bestFor2: string;          // who city2 is best for
  keyDifference: string;     // one-line differentiator shown in the comparison header
  faq: CityComparisonFAQ[];
  relatedSlugs: string[];    // other city comparison slugs to link to
  seoTitle: string;
  seoDescription: string;
}

export const cityComparisonData: CityComparisonLPData[] = [
  // ── Amsterdam vs Berlin ────────────────────────────────────────────────
  {
    slug: "amsterdam-vs-berlin",
    city1Slug: "amsterdam",
    city2Slug: "berlin",
    country1Slug: "netherlands",
    country2Slug: "germany",
    country1Code: "NL",
    country2Code: "DE",
    city1Name: "Amsterdam",
    city2Name: "Berlin",
    country1Name: "Netherlands",
    country2Name: "Germany",
    h1: "Amsterdam vs Berlin: Salary, Tax & Cost of Living for Expats (2025)",
    intro:
      "Amsterdam pays more and taxes less (especially with the 30% ruling). Berlin costs less and offers more space per euro. These two cities attract similar talent — tech workers, creatives, international hires — but the financial reality is strikingly different. Here's what the same salary actually gets you in each city.",
    verdict:
      "Amsterdam nets more on paper and wins on take-home for 30% ruling holders; Berlin wins on rent, lifestyle cost, and monthly surplus for most income levels without the ruling.",
    bestFor1: "Expats qualifying for the 30% ruling, finance and tech hires, those prioritising net income",
    bestFor2: "Remote workers, creatives, families needing more space, those prioritising lifestyle value",
    keyDifference: "Amsterdam rents run €500–650/mo higher; Berlin nets €3,500 less per year before rent",
    faq: [
      {
        q: "Which city actually gives me more money at the end of the month?",
        a: "Without the 30% ruling: Berlin wins. At €70k gross, Berlin nets ~€40,500 vs Amsterdam's ~€44,000. After subtracting median 1-bed rent (Amsterdam €1,900, Berlin €1,400), Berlin leaves €700–800 more per month. With the 30% ruling, Amsterdam nets ~€52,000 — a clear win regardless of rent.",
      },
      {
        q: "Is the 30% ruling guaranteed if I move to Amsterdam?",
        a: "No. It requires employer application, a salary above €46,107 gross (2025), proof of foreign recruitment, and specific expertise criteria. Approval typically takes 2–3 months. Not all expats qualify, and the 2024 reforms reduced its duration to 5 years.",
      },
      {
        q: "How different are living costs beyond rent?",
        a: "Rent is the biggest gap. Beyond that, Amsterdam is more expensive for dining out (€65 vs €55 for two) and transport (€102/mo pass vs €86). Groceries are slightly pricier in Amsterdam. The total cost gap beyond rent is roughly €200–300/month.",
      },
      {
        q: "Which city is better for families?",
        a: "Berlin offers significantly more space per euro — a 3-bedroom in Berlin runs ~€2,500/mo vs ~€3,200 in Amsterdam. Berlin also has a large expat community, good international schools (some free or low-cost), and a slower pace. Amsterdam is smaller but has excellent infrastructure and is English-friendly.",
      },
      {
        q: "Can I compare other city pairs on Expatlix?",
        a: "Yes — see Amsterdam vs Paris, Berlin vs Lisbon, Barcelona vs Amsterdam, and more in the Compare section.",
      },
    ],
    relatedSlugs: ["amsterdam-vs-paris", "berlin-vs-lisbon", "barcelona-vs-amsterdam"],
    seoTitle: "Amsterdam vs Berlin: Salary, Tax & Cost of Living for Expats 2025 | Expatlix",
    seoDescription:
      "Same gross salary, two very different outcomes. Compare Amsterdam and Berlin take-home pay, rent, and monthly surplus before you decide where to relocate.",
  },

  // ── Amsterdam vs Paris ─────────────────────────────────────────────────
  {
    slug: "amsterdam-vs-paris",
    city1Slug: "amsterdam",
    city2Slug: "paris",
    country1Slug: "netherlands",
    country2Slug: "france",
    country1Code: "NL",
    country2Code: "FR",
    city1Name: "Amsterdam",
    city2Name: "Paris",
    country1Name: "Netherlands",
    country2Name: "France",
    h1: "Amsterdam vs Paris: Salary, Tax & Cost of Living for Expats (2025)",
    intro:
      "Amsterdam and Paris are both premium European cities with premium prices — but the tax systems diverge sharply. The Dutch 30% ruling can push Amsterdam's effective rate below 25% for qualifying expats, while Paris applies French cotisations at around 22% before income tax. Both cities have high rents; Amsterdam's are rising faster.",
    verdict:
      "Amsterdam nets significantly more with the 30% ruling; without it, Paris and Amsterdam are closer — but Paris rents and dining run higher, reducing monthly surplus.",
    bestFor1: "Expats with 30% ruling, English-speaking professionals, those preferring a smaller city",
    bestFor2: "French speakers, fashion/luxury/finance sector, those who prioritise cultural richness",
    keyDifference: "Paris rents exceed Amsterdam's at the top end; Amsterdam wins on net salary without the language barrier",
    faq: [
      {
        q: "Which city has higher rent — Amsterdam or Paris?",
        a: "Paris city-centre 1-beds average €1,800–2,200/month, comparable to Amsterdam's €1,900. Paris 3-beds run higher (€3,500 vs €3,200). Outside the centre, Paris is slightly cheaper. Both cities have tight rental markets with significant demand from international workers.",
      },
      {
        q: "How do French and Dutch taxes compare at €70k gross?",
        a: "France nets approximately €42,000 on €70k gross. The Netherlands nets €44,000 (standard) or ~€52,000 with the 30% ruling. The standard Dutch rate is already favourable; the ruling makes it substantially better.",
      },
      {
        q: "Is English enough in Amsterdam vs Paris?",
        a: "Amsterdam is one of the most English-friendly cities in Europe — over 90% of Dutch people speak English fluently. Paris requires French for most non-corporate interactions; while expat communities are large, daily life and administration are significantly easier in Dutch.",
      },
      {
        q: "Which city is better for fintech or tech roles?",
        a: "Both cities are strong. Amsterdam has Adyen, Booking.com, and a dense fintech ecosystem. Paris has Station F, BNP's tech hub, and LVMH's digital ventures. Salaries in both cities are high by EU standards, though London and Zurich still lead for senior finance roles.",
      },
    ],
    relatedSlugs: ["amsterdam-vs-berlin", "paris-vs-brussels", "berlin-vs-lisbon"],
    seoTitle: "Amsterdam vs Paris: Salary, Tax & Cost of Living for Expats 2025 | Expatlix",
    seoDescription:
      "Compare Amsterdam and Paris take-home pay, rent costs, and monthly surplus for expats. See how Dutch and French taxes diverge on the same gross salary.",
  },

  // ── Barcelona vs Amsterdam ─────────────────────────────────────────────
  {
    slug: "barcelona-vs-amsterdam",
    city1Slug: "barcelona",
    city2Slug: "amsterdam",
    country1Slug: "spain",
    country2Slug: "netherlands",
    country1Code: "ES",
    country2Code: "NL",
    city1Name: "Barcelona",
    city2Name: "Amsterdam",
    country1Name: "Spain",
    country2Name: "Netherlands",
    h1: "Barcelona vs Amsterdam: Salary, Tax & Expat Life (2025)",
    intro:
      "Two leading expat destinations with two very different tax systems. Spain's Beckham Law (24% flat rate) and the Dutch 30% ruling are both designed to attract international talent — but they work differently and suit different profiles. Barcelona also costs substantially less than Amsterdam, which changes the monthly surplus picture.",
    verdict:
      "Barcelona wins on living costs and lifestyle; Amsterdam wins on standard net salary. Under special regimes (Beckham vs 30% ruling), both cities are competitive — depending on your gross and eligibility.",
    bestFor1: "Lifestyle-driven movers, Beckham Law eligible expats, those seeking Mediterranean quality of life",
    bestFor2: "High earners qualifying for the 30% ruling, English-language workplaces, those in financial services",
    keyDifference: "Barcelona rent averages €600 less per month; Amsterdam standard net salary runs €5,000+ higher annually",
    faq: [
      {
        q: "Does the Beckham Law make Barcelona more competitive than Amsterdam?",
        a: "On a €70k salary: Beckham Law (24% flat + 6.35% SS) yields approximately €51k net. Dutch 30% ruling yields approximately €52k. They're nearly equal at this level — the living cost advantage tilts Barcelona ahead on monthly surplus. At €100k, both regimes remain close; the Beckham Law holds its 24% flat rate much higher.",
      },
      {
        q: "Is Barcelona significantly cheaper than Amsterdam?",
        a: "Yes. 1-bed rent in Barcelona city centre averages €1,300 vs €1,900 in Amsterdam. Dining, transport, and groceries are all materially cheaper — a monthly transit pass is €40 vs €102. Total monthly savings outside rent are €300–500.",
      },
      {
        q: "Which city has a better English-language work environment?",
        a: "Amsterdam. English is the working language at most international companies, and many Dutch companies operate in English at the corporate level. In Barcelona, Spanish and Catalan dominate outside multinational offices — progressing in some roles without Spanish is harder.",
      },
      {
        q: "Which is better for tech or startup roles?",
        a: "Both are strong. Amsterdam hosts Booking.com, Adyen, and Stripe's EU hub. Barcelona has a thriving startup scene (Glovo, Wallapop), strong design and creative industries, and a growing deep-tech cluster. Barcelona tech salaries tend to run 10–15% below Amsterdam at equivalent seniority levels.",
      },
    ],
    relatedSlugs: ["amsterdam-vs-berlin", "barcelona-vs-lisbon", "amsterdam-vs-paris"],
    seoTitle: "Barcelona vs Amsterdam: Salary, Tax & Expat Life 2025 | Expatlix",
    seoDescription:
      "Beckham Law vs 30% ruling. Barcelona vs Amsterdam — compare take-home pay, rent, and monthly surplus for expats choosing between Spain and the Netherlands.",
  },

  // ── Berlin vs Lisbon ──────────────────────────────────────────────────
  {
    slug: "berlin-vs-lisbon",
    city1Slug: "berlin",
    city2Slug: "lisbon",
    country1Slug: "germany",
    country2Slug: "portugal",
    country1Code: "DE",
    country2Code: "PT",
    city1Name: "Berlin",
    city2Name: "Lisbon",
    country1Name: "Germany",
    country2Name: "Portugal",
    h1: "Berlin vs Lisbon: Salary, Tax & Cost of Living for Expats (2025)",
    intro:
      "Berlin and Lisbon are the top two European cities for digital nomads, remote workers, and internationally mobile professionals on mid-range incomes. Berlin pays substantially more — German salaries run 40–60% above Portuguese equivalents — but Lisbon costs far less to live in and Portugal's IFICI regime can reduce the tax burden. The right answer depends on whether you're earning locally or bringing a remote income.",
    verdict:
      "Berlin wins on local salary levels; Lisbon wins on cost of living, sunshine, and lifestyle value — especially for remote workers bringing a foreign income.",
    bestFor1: "Local employment in tech or media, those needing Berlin's scale, professionals with German job offers",
    bestFor2: "Remote workers, IFICI-eligible professionals, those prioritising cost and lifestyle over salary",
    keyDifference: "Lisbon rent is €450/mo cheaper; Berlin local salaries are 40–60% higher for equivalent roles",
    faq: [
      {
        q: "Should a remote worker choose Berlin or Lisbon?",
        a: "Lisbon almost always wins for remote workers with a non-Portuguese income. Lower rent (€1,300 vs €1,400 1-bed, but outside the centre the gap is larger), dramatically cheaper dining, better weather, and IFICI potentially capping Portuguese tax at 20%. Berlin is better if you're working for a German company at German salary levels.",
      },
      {
        q: "How do German and Portuguese taxes compare?",
        a: "Germany taxes €70k gross at an effective rate of approximately 42-44% (including social contributions). Portugal taxes the same at approximately 45% under standard IRS. With IFICI, Portuguese tax on qualifying income drops to 20% — a 20-25 percentage point advantage over Germany.",
      },
      {
        q: "Is Lisbon cheaper than Berlin?",
        a: "Yes, overall. 1-bed city centre rent averages €1,300 in Lisbon vs €1,400 in Berlin — a smaller gap than expected due to Lisbon's recent price surge. But dining is dramatically cheaper (dinner for two: €40 vs €55) and a transit pass costs €40 vs €86.",
      },
      {
        q: "What is the job market like in each city?",
        a: "Berlin has a deep job market across tech, media, startups, and corporate roles. Lisbon's market is growing rapidly in tech (Farfetch, Feedzai, OutSystems) and has become a hub for EU headquartering. However, local Portuguese salaries are significantly lower — Lisbon is most attractive when paired with a remote or internationally benchmarked income.",
      },
    ],
    relatedSlugs: ["amsterdam-vs-berlin", "lisbon-vs-madrid", "barcelona-vs-lisbon"],
    seoTitle: "Berlin vs Lisbon: Salary, Tax & Cost of Living for Expats 2025 | Expatlix",
    seoDescription:
      "Berlin or Lisbon? Compare take-home pay, rent costs, and monthly surplus. Includes IFICI vs German tax analysis for remote workers and digital nomads.",
  },

  // ── Paris vs Brussels ─────────────────────────────────────────────────
  {
    slug: "paris-vs-brussels",
    city1Slug: "paris",
    city2Slug: "brussels",
    country1Slug: "france",
    country2Slug: "belgium",
    country1Code: "FR",
    country2Code: "BE",
    city1Name: "Paris",
    city2Name: "Brussels",
    country1Name: "France",
    country2Name: "Belgium",
    h1: "Paris vs Brussels: Salary, Tax & Expat Life (2025)",
    intro:
      "Paris and Brussels are natural competitors for Francophone professionals: both are major European capitals, both have high tax rates, and both offer EU institution roles, finance, and consulting careers. Brussels has one powerful advantage: significantly lower rent and a dense EU/international sector. Paris has the prestige, larger economy, and broader private-sector depth.",
    verdict:
      "Brussels wins on housing costs and the Belgian special expat tax regime for qualifying earners; Paris wins on salary levels, economy breadth, and global profile.",
    bestFor1: "Senior private-sector roles, luxury/fashion/media, those who value Paris's global brand",
    bestFor2: "EU institutions, NGOs, international corporates, families needing value for money in a capital",
    keyDifference: "Brussels 1-bed rent runs €600 less per month than Paris city centre",
    faq: [
      {
        q: "Which city has a lower effective tax rate — Paris or Brussels?",
        a: "Both are high. France effective rate on €70k: approximately 38–40%. Belgium on €70k: approximately 43–44% including municipal tax. Brussels is technically higher, but Belgium's expat special tax status (for those earning ≥€75k gross) significantly cuts the burden.",
      },
      {
        q: "How much cheaper is Brussels than Paris?",
        a: "Meaningfully cheaper. Brussels 1-bed city centre averages €1,200 vs Paris's €1,800–2,200. Dining and groceries are similar or slightly cheaper. Total monthly cost of living in Brussels runs €600–900 below Paris.",
      },
      {
        q: "Which city is better for EU institution careers?",
        a: "Brussels, unambiguously. The European Commission, Council, Parliament, and dozens of EU agencies are headquartered there. EU civil servant and contract agent salaries benefit from privileged EU staff tax (a flat ~25% on EU source income). This makes Brussels particularly attractive for international policy professionals.",
      },
      {
        q: "Is French required in both cities?",
        a: "French helps substantially in both. In Brussels, Dutch (Flemish) is also widely spoken, and English is common in EU and international circles. In Paris, French is near-essential for navigating daily life, administration, and non-corporate work environments.",
      },
    ],
    relatedSlugs: ["amsterdam-vs-paris", "brussels-vs-amsterdam", "berlin-vs-lisbon"],
    seoTitle: "Paris vs Brussels: Salary, Tax & Expat Life 2025 | Expatlix",
    seoDescription:
      "Compare Paris and Brussels for expats — take-home pay, rent costs, and career opportunities. Includes EU institution context and Belgian expat tax regime.",
  },

  // ── Barcelona vs Lisbon ───────────────────────────────────────────────
  {
    slug: "barcelona-vs-lisbon",
    city1Slug: "barcelona",
    city2Slug: "lisbon",
    country1Slug: "spain",
    country2Slug: "portugal",
    country1Code: "ES",
    country2Code: "PT",
    city1Name: "Barcelona",
    city2Name: "Lisbon",
    country1Name: "Spain",
    country2Name: "Portugal",
    h1: "Barcelona vs Lisbon: Salary, Tax & Expat Life (2025)",
    intro:
      "Two Mediterranean cities with very different price points and two of Europe's most compelling expat tax regimes. Barcelona is the larger, better-paid city — Spanish salaries run significantly above Portuguese equivalents. Lisbon is cheaper, sunnier, and for remote workers or IFICI-qualifying professionals, potentially more tax-efficient.",
    verdict:
      "Barcelona wins on local salary and city scale; Lisbon wins on cost of living, sunshine, and tax efficiency for remote earners under IFICI.",
    bestFor1: "Those with Spanish job offers, Beckham Law eligible expats, those wanting a larger city",
    bestFor2: "Remote workers, IFICI-eligible professionals, lifestyle-driven movers on mid-range incomes",
    keyDifference: "Similar rent levels; Lisbon wins on dining, transport, and tax for remote earners",
    faq: [
      {
        q: "Are Barcelona and Lisbon similar in cost?",
        a: "Rent is similar (both ~€1,300 1-bed city centre). Lisbon is materially cheaper for dining (dinner for two: €40 vs €50), transport (€40 vs €40 monthly pass — equal), and utilities (€140 vs €130). The gap is real but modest outside rent.",
      },
      {
        q: "Which city is better for remote workers?",
        a: "Lisbon has a slight edge: lower daily costs, Portugal's IFICI regime potentially capping tax at 20%, and a well-established nomad infrastructure. Barcelona is also excellent but Spanish bureaucracy and the Gestoria system can be slower for freelancers.",
      },
      {
        q: "What's the job market like in each city?",
        a: "Barcelona has a larger corporate and startup ecosystem — Glovo, Wallapop, and many EU hubs. Lisbon is growing rapidly in tech (Feedzai, Outsystems, Web Summit). Local salaries in both cities are below Northern European equivalents, though Barcelona runs higher.",
      },
      {
        q: "Which city has better weather?",
        a: "Both are excellent, but Lisbon edges ahead: 2,806 sunshine hours per year vs Barcelona's 2,591. Lisbon is also slightly warmer in winter. Barcelona has a longer and warmer summer with little rain.",
      },
    ],
    relatedSlugs: ["berlin-vs-lisbon", "barcelona-vs-amsterdam", "lisbon-vs-madrid"],
    seoTitle: "Barcelona vs Lisbon: Salary, Tax & Expat Life 2025 | Expatlix",
    seoDescription:
      "Barcelona or Lisbon? Compare take-home pay, rent, and tax regimes (Beckham Law vs IFICI). The essential guide for expats choosing between Spain and Portugal.",
  },

  // ── Lisbon vs Madrid ──────────────────────────────────────────────────
  {
    slug: "lisbon-vs-madrid",
    city1Slug: "lisbon",
    city2Slug: "barcelona",  // Using Barcelona as proxy for Madrid (closest data)
    country1Slug: "portugal",
    country2Slug: "spain",
    country1Code: "PT",
    country2Code: "ES",
    city1Name: "Lisbon",
    city2Name: "Madrid",
    country1Name: "Portugal",
    country2Name: "Spain",
    h1: "Lisbon vs Madrid: Salary, Tax & Expat Life (2025)",
    intro:
      "Lisbon and Madrid share a peninsula but diverge significantly on salary levels, tax regimes, and living costs. Madrid salaries are notably higher — Spanish GDP per capita leads Portugal's by roughly 40%. But Lisbon is cheaper and Portugal's IFICI regime offers a compelling tax angle, especially for remote workers and internationally-sourced incomes.",
    verdict:
      "Madrid wins on local salary levels and Spain's larger economy; Lisbon wins on living costs and tax efficiency for remote or internationally-mobile earners.",
    bestFor1: "Local employment seekers, those with Portuguese/IFICI-eligible income, lifestyle movers",
    bestFor2: "Those with Spanish job offers, Beckham Law candidates, larger-city career ambitions",
    keyDifference: "Madrid local salaries run 25–35% higher; Lisbon costs 15–20% less to live in",
    faq: [
      {
        q: "Are Madrid and Lisbon far from each other?",
        a: "About 650km apart. Madrid to Lisbon by plane is under 1.5 hours; by high-speed rail (when completed) will be around 3 hours. Many Iberian professionals and families straddle both cities.",
      },
      {
        q: "Which tax regime is more beneficial — Beckham Law or IFICI?",
        a: "Both offer flat/reduced rates: Beckham (24% flat on Spanish income) and IFICI (20% flat on Portuguese income for qualifying categories). IFICI's 20% rate is lower, but Beckham Law has broader eligibility. For equivalent salaries, IFICI gives a slight edge; the key constraint is which categories qualify.",
      },
      {
        q: "Which city is better for families?",
        a: "Madrid's larger size offers more international school options across a wider range. Lisbon has strong schools but a smaller overall offering. Both cities have good public healthcare and services. Cost of family life in Lisbon runs 10–15% below Madrid.",
      },
      {
        q: "Is real estate more accessible in Lisbon or Madrid?",
        a: "Both markets have tightened significantly since 2020. Lisbon purchase prices are lower in absolute terms but have risen faster in percentage terms. Madrid offers more options across price points. Both cities are challenging for first-time buyers on local salaries.",
      },
    ],
    relatedSlugs: ["barcelona-vs-lisbon", "berlin-vs-lisbon", "barcelona-vs-amsterdam"],
    seoTitle: "Lisbon vs Madrid: Salary, Tax & Expat Life 2025 | Expatlix",
    seoDescription:
      "Lisbon or Madrid? Compare Portuguese and Spanish take-home pay, IFICI vs Beckham Law regimes, and cost of living for expats making the Iberian choice.",
  },

  // ── Brussels vs Amsterdam ─────────────────────────────────────────────
  {
    slug: "brussels-vs-amsterdam",
    city1Slug: "brussels",
    city2Slug: "amsterdam",
    country1Slug: "belgium",
    country2Slug: "netherlands",
    country1Code: "BE",
    country2Code: "NL",
    city1Name: "Brussels",
    city2Name: "Amsterdam",
    country1Name: "Belgium",
    country2Name: "Netherlands",
    h1: "Brussels vs Amsterdam: Salary, Tax & Expat Life (2025)",
    intro:
      "Brussels and Amsterdam are natural comparators: both are small Northern European capitals with large expat communities, English-friendly environments, and high-paying international sectors. The differences lie in tax (Belgium taxes significantly more), rent (Amsterdam significantly more expensive), and career ecosystem (Brussels = EU/policy, Amsterdam = tech/finance).",
    verdict:
      "Amsterdam wins on net salary for most income levels; Brussels wins on housing costs, EU career opportunities, and the Belgian special expat status for qualifying earners above €75k.",
    bestFor1: "EU institutions, international NGOs, policy roles, those seeking lower rents than Amsterdam",
    bestFor2: "Tech, finance, and scale-ups, 30% ruling eligibility, those comfortable with Amsterdam rents",
    keyDifference: "Amsterdam 1-bed rent runs €700 more; Belgium effective tax rate is 3–5 points higher than Dutch standard rate",
    faq: [
      {
        q: "Is Amsterdam or Brussels easier to get into as an expat?",
        a: "Both have straightforward EU freedom of movement entry. For non-EU nationals, the Netherlands' Highly Skilled Migrant (Kennismigrant) route is well-regarded and processes relatively quickly. Belgium's immigration pathways for international workers are robust but sometimes slower. Both offer strong relocation support ecosystems.",
      },
      {
        q: "Which city has better English-language infrastructure?",
        a: "Roughly equal, but for different reasons. Amsterdam's population is natively fluent in English. Brussels has English as a working lingua franca due to EU institutions — you can function fully in English, but navigating Flemish and French administrative layers adds complexity.",
      },
      {
        q: "How does Belgian tax compare to Dutch?",
        a: "Belgium is significantly heavier. On €70k gross, Belgium nets approximately €39,000 vs Amsterdam's €44,000 (standard) or €52,000 (with 30% ruling). Belgium's special expat status (≥€75k gross) partially offsets this for senior hires.",
      },
      {
        q: "Which city has more affordable housing?",
        a: "Brussels, clearly. A 1-bed city centre in Brussels averages €1,200 vs €1,900 in Amsterdam. The €700/month difference more than offsets the salary gap for most professionals not qualifying for the 30% ruling.",
      },
    ],
    relatedSlugs: ["amsterdam-vs-paris", "paris-vs-brussels", "amsterdam-vs-berlin"],
    seoTitle: "Brussels vs Amsterdam: Salary, Tax & Expat Life 2025 | Expatlix",
    seoDescription:
      "Compare Brussels and Amsterdam for expats — take-home pay, rent, Belgian vs Dutch taxes, and career ecosystems side by side.",
  },

  // ── Munich vs Vienna ──────────────────────────────────────────────────
  {
    slug: "munich-vs-vienna",
    city1Slug: "munich",
    city2Slug: "vienna",
    country1Slug: "germany",
    country2Slug: "austria",
    country1Code: "DE",
    country2Code: "AT",
    city1Name: "Munich",
    city2Name: "Vienna",
    country1Name: "Germany",
    country2Name: "Austria",
    h1: "Munich vs Vienna: Salary, Tax & Expat Life (2025)",
    intro:
      "Munich and Vienna are both German-speaking cities with high quality of life rankings, strong job markets, and similar cultural profiles. Munich salaries are higher — Bavaria's economy and concentration of automotive, tech, and financial firms commands a premium. Vienna is cheaper and offers strong public services, but Austria's tax rates are comparable to Germany's.",
    verdict:
      "Munich wins on salary levels; Vienna wins on cost of living, rental prices, and overall quality of life per euro spent.",
    bestFor1: "Engineering, automotive, fintech, and Munich's corporate sector with German job offers",
    bestFor2: "Quality of life seekers, medical/scientific professionals, those seeking Vienna's cultural depth at lower cost",
    keyDifference: "Munich salaries run 15–20% higher; Vienna 1-bed rents average €400 lower per month",
    faq: [
      {
        q: "Is Vienna or Munich more affordable?",
        a: "Vienna is more affordable. Munich has some of Germany's highest rents — a 1-bed in the centre averages €1,800–2,200/month. Vienna averages €1,200–1,600. Both cities have high overall costs versus the EU average, but Vienna offers more value.",
      },
      {
        q: "Are Austrian and German taxes similar?",
        a: "Broadly yes. Austria's income tax rates are similar to Germany's, and social contributions are roughly equivalent. Both countries have high overall tax wedges — effective rates of 42–46% on €70k gross.",
      },
      {
        q: "Which city has more English-language jobs?",
        a: "Munich has a larger international corporate sector (BMW, Siemens, Allianz, MAN) with many English-language roles. Vienna has international roles in tourism, tech, and diplomatic circles. German language proficiency significantly expands opportunities in both cities.",
      },
      {
        q: "Which city is better for families?",
        a: "Vienna consistently tops quality of life rankings for families — excellent public healthcare, strong public schools, and a very liveable city at reasonable cost. Munich is also excellent but housing costs create real pressure for families renting in the private market.",
      },
    ],
    relatedSlugs: ["amsterdam-vs-berlin", "berlin-vs-lisbon", "amsterdam-vs-paris"],
    seoTitle: "Munich vs Vienna: Salary, Tax & Expat Life 2025 | Expatlix",
    seoDescription:
      "Munich or Vienna? Compare German and Austrian salaries, take-home pay, rent costs, and quality of life for expats choosing between two German-speaking capitals.",
  },

  // ── Amsterdam vs Brussels (already have Brussels vs Amsterdam, add reverse)
  // ── Copenhagen vs Amsterdam ───────────────────────────────────────────
  {
    slug: "copenhagen-vs-amsterdam",
    city1Slug: "copenhagen",
    city2Slug: "amsterdam",
    country1Slug: "denmark",
    country2Slug: "netherlands",
    country1Code: "DK",
    country2Code: "NL",
    city1Name: "Copenhagen",
    city2Name: "Amsterdam",
    country1Name: "Denmark",
    country2Name: "Netherlands",
    h1: "Copenhagen vs Amsterdam: Salary, Tax & Expat Life (2025)",
    intro:
      "Copenhagen and Amsterdam are both elite small-capital expat destinations with English-speaking populations, strong tech scenes, and enviable quality of life. Copenhagen salaries are high and Danish income tax is famously steep — effective rates can exceed 50%. Amsterdam's 30% ruling, by contrast, can cut effective rates well below the Danish burden. The salary-to-cost ratio is the core comparison here.",
    verdict:
      "Amsterdam with the 30% ruling is substantially more tax-efficient; Copenhagen wins on urban design, work-life balance culture, and slightly lower rents than central Amsterdam.",
    bestFor1: "Expats qualifying for the 30% ruling, finance and tech hires, those prioritising net income",
    bestFor2: "Scandinavian lifestyle seekers, design/architecture professionals, sustainability-sector careers",
    keyDifference: "Danish effective tax rate can reach 50%+; Amsterdam 30% ruling brings effective rate below 30%",
    faq: [
      {
        q: "How high is Danish income tax really?",
        a: "Very high. Denmark levies state tax (12.09%), municipal tax (~25% average), labour market contribution (AM-bidrag: 8%), and church tax (optional, ~0.7%). Combined effective rate on a DKK 700,000 salary (~€93k) approaches 55%. The trade-off is one of the world's best public welfare systems.",
      },
      {
        q: "Is Amsterdam significantly cheaper than Copenhagen?",
        a: "Broadly similar. Copenhagen 1-bed centre averages €1,500–2,000 (in DKK); Amsterdam averages €1,900 EUR. After currency conversion, they're comparable. Both cities are among Europe's most expensive. Dining is slightly cheaper in Copenhagen outside the tourist areas.",
      },
      {
        q: "Which city has a better tech job market?",
        a: "Amsterdam has more scale-ups and international tech companies (Booking.com, TomTom, Adyen, Stripe EU). Copenhagen has a strong startup ecosystem and gaming sector (Unity Technologies HQ), plus strong shipping and pharmaceutical industries (Maersk, Novo Nordisk).",
      },
      {
        q: "Does Denmark have an expat tax regime?",
        a: "Yes. Denmark's Expat Tax Scheme allows qualifying foreign employees to pay a flat 27% rate on gross salary for 7 years, with no deductions. To qualify, you must earn above a monthly threshold (~DKK 75,100 in 2025) and have not been a Danish tax resident in the past 10 years. It's a significant benefit for high earners.",
      },
    ],
    relatedSlugs: ["amsterdam-vs-berlin", "amsterdam-vs-paris", "brussels-vs-amsterdam"],
    seoTitle: "Copenhagen vs Amsterdam: Salary, Tax & Expat Life 2025 | Expatlix",
    seoDescription:
      "Compare Copenhagen and Amsterdam for expats — Danish vs Dutch taxes, take-home pay, and monthly surplus. Includes Denmark's expat flat tax regime.",
  },

  // ── Budapest vs Berlin ────────────────────────────────────────────────
  {
    slug: "budapest-vs-berlin",
    city1Slug: "budapest",
    city2Slug: "berlin",
    country1Slug: "hungary",
    country2Slug: "germany",
    country1Code: "HU",
    country2Code: "DE",
    city1Name: "Budapest",
    city2Name: "Berlin",
    country1Name: "Hungary",
    country2Name: "Germany",
    h1: "Budapest vs Berlin: Salary, Tax & Cost of Living for Expats (2025)",
    intro:
      "Budapest and Berlin attract similar profiles: creatives, digital nomads, and professionals seeking a large European city at reasonable cost. Budapest is dramatically cheaper — rents can be one-third of Berlin's — and Hungary's flat 15% income tax is among Europe's lowest. The trade-off: Budapest local salaries are a fraction of Berlin's, making it most compelling for remote workers.",
    verdict:
      "Budapest wins decisively on cost of living and tax rate; Berlin wins on local salary levels, infrastructure, and broader career opportunities.",
    bestFor1: "Remote workers, digital nomads, those on Western salaries seeking Central European costs",
    bestFor2: "Local employment, EU career proximity, those needing Berlin's corporate and startup depth",
    keyDifference: "Budapest costs 50–60% less to live in; Berlin local salaries run 3–4x higher than Budapest equivalents",
    faq: [
      {
        q: "How low is Hungarian income tax?",
        a: "Hungary has a flat 15% personal income tax rate — one of the lowest in Europe. Social contributions add 18.5% (employee side), giving a combined effective rate of approximately 30–32% on gross income. On a gross HUF 8,000,000 salary (~€20k), the net in EUR terms is modest — but costs are proportionally very low.",
      },
      {
        q: "Is Budapest genuinely cheap compared to Berlin?",
        a: "Yes, dramatically. A 1-bedroom city-centre apartment in Budapest averages €500–700/month versus €1,400 in Berlin. Dining, transport, and groceries are 40–60% cheaper. For a remote worker earning a Berlin-level salary, Budapest offers exceptional purchasing power.",
      },
      {
        q: "What is Budapest like for English-speaking expats?",
        a: "Budapest has a large and growing expat community. English is widely spoken in tech and international companies. Hungarian is complex to learn, but most urban services can be navigated in English. The bureaucracy can be challenging and occasionally requires a local helper.",
      },
      {
        q: "What are the visa options for non-EU citizens in Hungary?",
        a: "Hungary introduced a 'White Card' (Guest Worker White Card) for remote workers and a startup visa. EU citizens move freely. Non-EU professionals need a work permit or the specific remote worker visa. Hungary's immigration office (OIF) handles applications.",
      },
    ],
    relatedSlugs: ["amsterdam-vs-berlin", "berlin-vs-lisbon", "barcelona-vs-lisbon"],
    seoTitle: "Budapest vs Berlin: Salary, Tax & Cost of Living for Expats 2025 | Expatlix",
    seoDescription:
      "Budapest or Berlin? Compare Hungary's 15% flat tax with Germany's rates. Take-home pay, rent, and monthly surplus for expats considering Central Europe.",
  },
];

export function getCityComparisonData(slug: string): CityComparisonLPData | undefined {
  return cityComparisonData.find((c) => c.slug === slug);
}
