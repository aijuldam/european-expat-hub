/**
 * SEO content for country-specific salary calculator landing pages.
 * Each entry drives /salary-calculator/[slug].
 * Example calculations use calculateSalary() at module load so numbers
 * are always in sync with the tax engine.
 */

import { calculateSalary } from "./salary-calculator";
import type { CountryCode } from "./salary-calculator";

export interface SalaryExample {
  grossAnnual: number;
  netAnnual: number;
  effectiveTaxRate: number;
  note?: string;
}

export interface MedianSalary {
  gross: number;          // annual gross in local currency
  currency: string;       // EUR, CHF, GBP, SGD…
  grossEur?: number;      // EUR equivalent if non-EUR
  source: string;         // citation label
  year: number;
}

export interface CountrySalaryLPData {
  slug: string;                  // URL slug: /salary-calculator/[slug]
  countryCode: CountryCode | null;  // null = no calculator support yet (UK, UAE, SG)
  name: string;
  flagEmoji: string;
  h1: string;
  intro: string;                 // 60–80 words, unique angle
  taxHighlights: string[];       // 3 bullets shown in trust strip
  specialRegime: { name: string; description: string } | null;
  medianSalary?: MedianSalary;   // shown in the benchmark card; omitted for UAE/Singapore (no Eurostat data)
  examples: SalaryExample[];     // computed at module load
  faq: { q: string; a: string }[];
  relatedCountrySlugs: string[];
  relatedCities: { name: string; slug: string; countrySlug: string }[];
  seoTitle: string;
  seoDescription: string;
}

function examples(
  country: CountryCode,
  opts?: { thirtyPercentRuling?: boolean; cadreStatus?: boolean }
): SalaryExample[] {
  return [50_000, 70_000, 100_000].map((gross) => {
    const r = calculateSalary({ grossAnnual: gross, country, ...opts });
    return {
      grossAnnual: gross,
      netAnnual: Math.round(r.netAnnual),
      effectiveTaxRate: Math.round(r.effectiveTaxRate * 10) / 10,
    };
  });
}

export const countryLPData: CountrySalaryLPData[] = [
  // ── Netherlands ─────────────────────────────────────────────────────────
  {
    slug: "netherlands",
    countryCode: "nl",
    name: "Netherlands",
    flagEmoji: "🇳🇱",
    h1: "Net Salary Calculator Netherlands 2025",
    intro:
      "The Netherlands combines a progressive income tax with a uniquely valuable expat benefit: the 30% ruling. Qualifying international hires can receive 30% of their gross salary tax-free for up to five years. Without it, effective rates on a €70k salary sit around 37%. With it, take-home jumps by roughly €7–9k per year. Use this calculator to see both scenarios side by side.",
    taxHighlights: [
      "Progressive Box 1 tax: 36.97% up to €73,031, 49.5% above",
      "Employee social contributions (AOW, WLZ, WW): ~27.65% up to threshold",
      "30% ruling: 30% of salary becomes tax-free for qualifying expats (max 5 years)",
    ],
    specialRegime: {
      name: "Expat Scheme (30% Facility) — 2026 conditions",
      description:
        "The 30% facility lets employers pay up to 30% of salary tax-free as compensation for extraterritorial costs. 2026 conditions: (1) employed under a Dutch payroll; (2) gross salary excluding the allowance must exceed €48,013 (€36,497 for under-30s with a Dutch master's or equivalent); (3) recruited from abroad — you must have lived more than 150 km from the Dutch border for at least 16 of the 24 months before your first working day in the Netherlands (the exclusion zone covers Belgium, Luxembourg, and adjacent parts of Germany, France, and the UK); (4) maximum untaxed allowance is capped at €78,600 per year in 2026. Duration: up to 5 years. Apply within 4 months of your start date; your employer submits to the Belastingdienst.",
    },
    medianSalary: {
      gross: 54000,
      currency: "EUR",
      source: "Eurostat nama_10_fte, annual full-time adjusted salary",
      year: 2024,
    },
    examples: examples("nl"),
    faq: [
      {
        q: "Do I qualify for the 30% facility (Expat Scheme) in 2026?",
        a: "You qualify if: (1) you work in paid employment under a Dutch payroll; (2) your gross salary excluding the allowance exceeds €48,013 in 2026 (€36,497 for under-30s with a Dutch master's or equivalent); (3) you were recruited from outside the Netherlands and lived more than 150 km from the Dutch border for at least 16 of the 24 months before your start date — note that adjacent parts of Belgium, Luxembourg, Germany, France, and the UK fall within the exclusion zone; (4) your employer applies to the Belastingdienst within 4 months of your start date. The untaxed allowance is capped at €78,600/year in 2026.",
      },
      {
        q: "Are social contributions included in the calculation?",
        a: "Yes. Employee contributions for AOW (state pension), WLZ (long-term care), and WW (unemployment) are included in the gross-to-net calculation. Health insurance (ZVW) is paid separately — budget roughly €150/month.",
      },
      {
        q: "Is the tax rate the same across all Dutch cities?",
        a: "Yes. Dutch income tax is a national rate and doesn't vary by municipality. Your take-home pay is the same whether you're in Amsterdam, Rotterdam, or Eindhoven. Cost of living, however, varies significantly — Amsterdam rents run €500–700/mo higher than in cities like Eindhoven.",
      },
      {
        q: "What changes if I'm self-employed (ZZP)?",
        a: "ZZP contractors work under Box 1 but have different deductions: self-employed deduction (zelfstandigenaftrek), SME profit exemption, and no employer pension contributions. The tax liability can be similar, but cash flow differs. This calculator covers employment income only.",
      },
      {
        q: "How often do Dutch tax rates change?",
        a: "Brackets and thresholds update annually in the Prinsjesdag (Budget Day) package, typically announced in September for the following year. We update this calculator each January. Always verify final offers with a Dutch payroll provider.",
      },
    ],
    relatedCountrySlugs: ["germany", "belgium", "ireland"],
    relatedCities: [
      { name: "Amsterdam", slug: "amsterdam", countrySlug: "netherlands" },
      { name: "Rotterdam", slug: "rotterdam", countrySlug: "netherlands" },
      { name: "The Hague", slug: "the-hague", countrySlug: "netherlands" },
    ],
    seoTitle: "Net Salary Calculator Netherlands 2025 — 30% Ruling Included | Expatlix",
    seoDescription:
      "Calculate your Dutch take-home pay after income tax and social contributions. Includes the 30% ruling for expats. Updated for 2025 tax brackets.",
  },

  // ── Germany ──────────────────────────────────────────────────────────────
  {
    slug: "germany",
    countryCode: "de",
    name: "Germany",
    flagEmoji: "🇩🇪",
    h1: "Net Salary Calculator Germany 2025",
    intro:
      "Germany's tax burden often surprises expats: social contributions alone add up to roughly 20% of gross salary on top of progressive income tax. On a €70k salary, effective total deductions typically reach 42–44%. The upside is comprehensive statutory coverage — health, pension, unemployment, and nursing care insurance are all bundled in. Use this calculator to see your real German take-home.",
    taxHighlights: [
      "Progressive Einkommensteuer: starts at 14%, reaches 42% above €66,761 (2025)",
      "Solidarity surcharge (Soli): largely eliminated, remains only for highest earners",
      "Employee social contributions (KV + RV + AV + PV): ~19.65% of gross up to contribution ceilings",
    ],
    specialRegime: null,
    medianSalary: {
      gross: 50400,
      currency: "EUR",
      source: "Eurostat nama_10_fte, annual full-time adjusted salary (est.)",
      year: 2024,
    },
    examples: examples("de"),
    faq: [
      {
        q: "What is Steuerklasse (tax class) and which one applies to me?",
        a: "Germany assigns tax classes 1–6 based on marital status and employment situation. Single expats are typically Class 1. Married couples where one partner earns significantly more often benefit from Class 3/5 splitting. Class affects monthly withholding; final tax is settled in the annual return.",
      },
      {
        q: "Is health insurance included in the net salary figure?",
        a: "Yes. Statutory health insurance (GKV) — currently 7.3% employee share plus a supplemental contribution averaging 1.7% — is included. If you opt for private health insurance (PKV), your deductions may differ.",
      },
      {
        q: "What is the solidarity surcharge in 2025?",
        a: "The Soli was effectively abolished for most taxpayers from 2021. It now only applies above an income threshold of roughly €18,130 annual tax liability. Most employees earning under €120k gross will pay no Soli.",
      },
      {
        q: "Do German salaries include a 13th month or Christmas bonus?",
        a: "Many German employers pay a Weihnachtsgeld (Christmas bonus) of one additional monthly salary. It's not statutory but common in larger companies and public sector. This calculator shows annual gross excluding bonuses — add them separately.",
      },
      {
        q: "How does Germany compare to the Netherlands for expat take-home?",
        a: "At €70k gross, Germany nets roughly €40,500 vs €44,000 in the Netherlands (without 30% ruling). The Dutch 30% ruling closes this gap significantly in the other direction, pushing Dutch net to ~€52,000 for qualifying expats. See our Amsterdam vs Berlin comparison for a city-level breakdown.",
      },
    ],
    relatedCountrySlugs: ["netherlands", "switzerland", "belgium"],
    relatedCities: [
      { name: "Berlin", slug: "berlin", countrySlug: "germany" },
      { name: "Munich", slug: "munich", countrySlug: "germany" },
      { name: "Frankfurt", slug: "frankfurt", countrySlug: "germany" },
    ],
    seoTitle: "Net Salary Calculator Germany 2025 — After Tax & Social Charges | Expatlix",
    seoDescription:
      "See your German take-home pay after Einkommensteuer and all social contributions. Built for expats relocating to Germany. 2025 tax brackets.",
  },

  // ── Belgium ──────────────────────────────────────────────────────────────
  {
    slug: "belgium",
    countryCode: "be",
    name: "Belgium",
    flagEmoji: "🇧🇪",
    h1: "Net Salary Calculator Belgium 2025",
    intro:
      "Belgium has one of the highest marginal income tax rates in Europe — up to 53.5% including municipal taxes — but the headline number understates the full picture. Employers routinely supplement salaries with tax-efficient benefits: meal vouchers, company cars, eco-cheques, and hospitalisation insurance. This calculator shows your cash net; factor in those perks when comparing Belgian offers.",
    taxHighlights: [
      "Progressive IPP/PB: 25% on first €15,820, rising to 50% above €46,440",
      "Municipal tax surcharge: 0–9% of tax due (Brussels: 5.3%, Antwerp: 6.8%)",
      "Employee ONSS/RSZ: 13.07% of gross salary, no ceiling for most contributions",
    ],
    specialRegime: {
      name: "Expat Special Tax Status",
      description:
        "Belgium offers a special tax regime for qualifying foreign executives and specialists. From 2022, it applies to employees earning ≥€75,000 gross, granting a 30% flat expense allowance (capped at €90,000) plus reimbursement of certain relocation and school costs tax-free. Requires employer application within 3 months of arrival.",
    },
    medianSalary: {
      gross: 57900,
      currency: "EUR",
      source: "Eurostat nama_10_fte, annual full-time adjusted salary (est.)",
      year: 2024,
    },
    examples: examples("be"),
    faq: [
      {
        q: "Why does my Belgian net salary look so low compared to my gross?",
        a: "Belgium's combined burden (income tax + 13.07% ONSS + municipal surcharge) is among the steepest in the EU. On €70k gross, total deductions typically exceed 43%. Employer benefits (company car, meal vouchers) are taxed at lower rates and partly offset this.",
      },
      {
        q: "How does the municipal tax affect my net pay?",
        a: "Municipal taxes are levied as a percentage of your federal income tax — not on gross salary directly. They vary by commune: Brussels charges 5.3%, Ghent 7%, Antwerp 6.8%, Bruges 5.25%. Living just outside a high-tax commune can improve your net by €500–1,500/year.",
      },
      {
        q: "Is Belgium worth it financially for expats?",
        a: "It depends heavily on the package. Brussels is the EU capital and offers high-paying international roles. Expats negotiating a company car, hospitalisation insurance, and meal vouchers receive €5–10k of tax-efficient value on top of net salary. The cash net often understates total compensation.",
      },
      {
        q: "Does this calculator cover Flanders, Wallonia, and Brussels separately?",
        a: "The regional tax split (federal vs. regional) is reflected in the national calculation. Municipal surcharges vary — we apply the Brussels average (5.3%) as a default. If you're in Antwerp or Ghent, your net will differ slightly.",
      },
      {
        q: "What is the 'expat special tax status' introduced in 2022?",
        a: "Belgium replaced its old Circular 45 expat regime with a new statutory framework in 2022. Qualifying employees (≥€75k gross, recruited from abroad, specific skill requirements) receive a 30% lump-sum cost allowance and tax-free reimbursement of certain expat costs. Maximum benefit: €90,000 tax-free per year.",
      },
    ],
    relatedCountrySlugs: ["netherlands", "france", "germany"],
    relatedCities: [
      { name: "Brussels", slug: "brussels", countrySlug: "belgium" },
    ],
    seoTitle: "Net Salary Calculator Belgium 2025 — One of Europe's Highest Tax Rates | Expatlix",
    seoDescription:
      "Calculate your Belgian take-home pay after IPP, municipal taxes, and ONSS. Includes expat special tax status context. 2025 tax brackets.",
  },

  // ── France ───────────────────────────────────────────────────────────────
  {
    slug: "france",
    countryCode: "fr",
    name: "France",
    flagEmoji: "🇫🇷",
    h1: "Net Salary Calculator France 2025",
    intro:
      "French salaries look different from most European payslips: employer charges (charges patronales) are high, but employee charges (cotisations salariales) are more moderate than in Belgium or Germany. On a €70k gross salary, employees typically retain around €42k net. The cadre/non-cadre distinction — whether you're a senior executive — affects certain contribution rates and is included in this calculator.",
    taxHighlights: [
      "Progressive IR: 0% to 45% across 5 bands (up to 11% for first band, 30% mid, 41% upper)",
      "Employee social contributions (cotisations): ~22% of gross for health, pension, unemployment",
      "Cadre status: affects APEC and AGIRC supplementary pension contributions",
    ],
    specialRegime: {
      name: "Impatriates Regime (Article 155 B)",
      description:
        "Employees recruited abroad or seconded to France may qualify for a 30% salary exemption plus full exemption of foreign-sourced passive income. Available for 8 years, since the 2022 reform. Requires the employee to not have been a French tax resident in the 5 years prior to assignment.",
    },
    medianSalary: {
      gross: 44900,
      currency: "EUR",
      source: "Eurostat nama_10_fte, annual full-time adjusted salary (est.)",
      year: 2024,
    },
    examples: examples("fr"),
    faq: [
      {
        q: "What is cadre status in France and does it matter for tax?",
        a: "Cadre (executive/managerial) status is a professional classification defined by collective agreements (conventions collectives), not by tax law. It is typically granted to engineers, managers, and senior professionals based on their role and the applicable industry agreement. Practically: (1) cadres contribute to the AGIRC-ARRCO supplementary pension scheme at a higher rate on Tranche 2 earnings (above the Social Security ceiling of ~€46,368), generating better pension rights; (2) cadres pay a mandatory APEC contribution (0.024% employee, 0.036% employer) for their dedicated employment agency; (3) most cadres are on a 'forfait jours' working time arrangement — typically 218 days/year — rather than the 35-hour week, giving flexibility but removing overtime pay; (4) cadres benefit from longer statutory notice periods and stronger severance protections under labour law. The net cash impact on take-home pay is modest (a few hundred euros/year difference in contributions), but the structural benefits in pensions and working conditions are significant.",
      },
      {
        q: "What is the 'impatriates regime' for expats arriving in France?",
        a: "Since 2022 (Article 155 B CGI), employees hired from abroad or seconded to France benefit from a 30% salary exemption for 8 years, plus full exemption of their foreign-source passive income. It's one of France's more competitive expat regimes. Apply via your employer in year 1.",
      },
      {
        q: "Is Paris significantly more expensive than other French cities?",
        a: "Yes. A 1-bedroom apartment in Paris city centre costs €1,800–2,200/month vs €700–1,000 in Lyon or Bordeaux. After rent, the purchasing power advantage of a Paris salary largely disappears compared to a regional city with a lower gross.",
      },
      {
        q: "Does this calculator include the CSG and CRDS?",
        a: "Yes. The Contribution Sociale Généralisée (CSG) and Contribution au Remboursement de la Dette Sociale (CRDS) are applied at 9.7% on 98.25% of gross salary. They are included in the total social contributions shown in the breakdown.",
      },
      {
        q: "How accurate is this for a 13th-month salary or bonus?",
        a: "France has no statutory 13th month, but many companies pay one contractually. Bonuses are typically added to monthly gross and taxed at the same progressive rate. For accurate bonus modelling, add the bonus to your annual gross in the input.",
      },
    ],
    relatedCountrySlugs: ["belgium", "spain", "italy"],
    relatedCities: [
      { name: "Paris", slug: "paris", countrySlug: "france" },
      { name: "Lyon", slug: "lyon", countrySlug: "france" },
      { name: "Bordeaux", slug: "bordeaux", countrySlug: "france" },
    ],
    seoTitle: "Net Salary Calculator France 2025 — Gross to Net After Tax | Expatlix",
    seoDescription:
      "Calculate your French net salary after income tax and cotisations sociales. Includes cadre status toggle and impatriates regime context.",
  },

  // ── Spain ────────────────────────────────────────────────────────────────
  {
    slug: "spain",
    countryCode: "es",
    name: "Spain",
    flagEmoji: "🇪🇸",
    h1: "Net Salary Calculator Spain 2025",
    intro:
      "Spain offers one of Europe's most powerful expat tax regimes: the Beckham Law (Ley Beckham) caps income tax at a flat 24% on Spanish-sourced income up to €600k. Under standard IRPF, a €70k salary yields around €39k net. Under the Beckham Law, the same salary yields roughly €51k — a difference of €12k per year. This calculator lets you compare both scenarios.",
    taxHighlights: [
      "Standard IRPF: progressive rate from 19% to 47% (state + regional combined)",
      "Employee social security: 6.35% of gross (up to contribution base ceiling)",
      "Beckham Law: 24% flat rate on Spanish income up to €600k for qualifying expats",
    ],
    specialRegime: {
      name: "Beckham Law (Régimen de Impatriados)",
      description:
        "Officially the Special Tax Regime for Impatriates (Art. 93 LIRPF). Expats who move to Spain to work can opt for a flat 24% income tax rate on Spanish-sourced income up to €600k, regardless of general IRPF brackets. Must apply within 6 months of starting work in Spain. Available for the tax year of arrival plus the following 5 years.",
    },
    medianSalary: {
      gross: 31600,
      currency: "EUR",
      source: "Eurostat nama_10_fte, annual full-time adjusted salary (est.)",
      year: 2024,
    },
    examples: examples("es"),
    faq: [
      {
        q: "How does the Beckham Law affect my take-home pay?",
        a: "On €70k gross, standard IRPF yields roughly €39k net. Under the Beckham Law (24% flat on €70k minus 6.35% SS), you'd retain approximately €51k — a gain of around €12k/year. The higher the salary, the larger the benefit.",
      },
      {
        q: "Who qualifies for the Beckham Law?",
        a: "Expats who: (1) move to Spain because of a job contract or assignment; (2) have not been Spanish tax residents in the previous 5 years; and (3) apply within 6 months of registration. Self-employed (autónomos) have qualified since 2023 under the updated regime.",
      },
      {
        q: "Are regional taxes included in this calculation?",
        a: "Spanish IRPF combines a state tranche and a regional tranche. Regional rates differ — Madrid applies lower rates than Catalonia. This calculator uses blended national-average regional rates. For precise regional figures, consult a Spanish gestor.",
      },
      {
        q: "How does Barcelona compare to Madrid for take-home pay?",
        a: "Barcelona falls under Catalonia's regional rates, which are slightly higher than Madrid's. The difference for a €70k salary is approximately €1,000–1,500/year in favour of Madrid. Both cities have similar cost of living for expats.",
      },
      {
        q: "Is the Beckham Law worth it for everyone?",
        a: "Generally yes, for salaries above €50k. Below that threshold, the 24% flat rate may not beat the standard progressive rate for all income brackets. Run both scenarios in the calculator for your specific gross.",
      },
    ],
    relatedCountrySlugs: ["portugal", "france", "italy"],
    relatedCities: [
      { name: "Barcelona", slug: "barcelona", countrySlug: "spain" },
      { name: "Madrid", slug: "madrid", countrySlug: "spain" },
      { name: "Valencia", slug: "valencia", countrySlug: "spain" },
    ],
    seoTitle: "Net Salary Calculator Spain 2025 — Beckham Law & Standard Tax | Expatlix",
    seoDescription:
      "Compare your Spanish take-home pay under standard IRPF and the Beckham Law flat rate. Essential for expats evaluating job offers in Spain.",
  },

  // ── Portugal ─────────────────────────────────────────────────────────────
  {
    slug: "portugal",
    countryCode: "pt",
    name: "Portugal",
    flagEmoji: "🇵🇹",
    h1: "Net Salary Calculator Portugal 2025",
    intro:
      "Portugal's tax landscape for expats changed significantly in 2024. The NHR regime (Non-Habitual Resident) closed to new applicants and was replaced by the IFICI scheme — a 20% flat rate on Portuguese-source income for qualifying foreign professionals. For those outside IFICI, standard IRS applies. This calculator reflects both the standard regime and provides context on IFICI for planning purposes.",
    taxHighlights: [
      "Standard IRS: progressive from 13.25% to 48%, plus 2.5–5% solidarity surcharge above €80k",
      "Employee social security: 11% of gross",
      "IFICI (ex-NHR replacement, 2024): 20% flat rate for qualifying non-habitual residents",
    ],
    specialRegime: {
      name: "IFICI — Incentivo Fiscal à Investigação Científica e Inovação",
      description:
        "Replaced the NHR in 2024. Offers a 20% flat income tax rate on Portuguese-source employment income for qualifying categories: researchers, highly qualified professionals, and certain tech/startup workers. Available for 10 years. Foreign-source income may be exempt. Existing NHR holders keep their regime until expiry.",
    },
    medianSalary: {
      gross: 22600,
      currency: "EUR",
      source: "Eurostat nama_10_fte, annual full-time adjusted salary (est.)",
      year: 2024,
    },
    examples: examples("pt"),
    faq: [
      {
        q: "Is NHR still available in 2025?",
        a: "No. The NHR closed to new applicants on 31 December 2023. Existing NHR holders keep their status until their 10-year window expires. The replacement — IFICI — applies from 2024 to qualifying foreign professionals with more specific eligibility criteria.",
      },
      {
        q: "Who qualifies for the IFICI regime?",
        a: "IFICI targets specific professional categories: researchers, technology and innovation workers, founders of startups recognised by IAPMEI, and highly qualified professionals in defined fields. A minimum salary threshold and professional qualification requirements apply. Consult an AT-registered accountant for your specific situation.",
      },
      {
        q: "How much does Lisbon cost to live in compared to other EU capitals?",
        a: "Lisbon is significantly cheaper than Amsterdam, Paris, or Dublin. A 1-bedroom apartment in the city centre runs €1,200–1,500/month, versus €1,800–2,200 in Paris. Dining and transport are substantially cheaper — a monthly transit pass costs €40 vs €102 in Amsterdam.",
      },
      {
        q: "Is social security included in the calculator?",
        a: "Yes. Employee contributions to Segurança Social are 11% of gross, with no ceiling. This is included in the gross-to-net calculation under standard IRS.",
      },
      {
        q: "Can self-employed professionals benefit from the IFICI?",
        a: "Self-employed (trabalhador independente) workers in eligible categories may qualify for IFICI. However, the calculation of social contributions and deductions differs from employment income. This calculator covers employment income only.",
      },
    ],
    relatedCountrySlugs: ["spain", "france", "italy"],
    relatedCities: [
      { name: "Lisbon", slug: "lisbon", countrySlug: "portugal" },
      { name: "Porto", slug: "porto", countrySlug: "portugal" },
    ],
    seoTitle: "Net Salary Calculator Portugal 2025 — NHR Replaced by IFICI | Expatlix",
    seoDescription:
      "Calculate your Portuguese net salary under standard IRS. Includes IFICI (ex-NHR) context for expats relocating to Lisbon or Porto in 2025.",
  },

  // ── Italy ────────────────────────────────────────────────────────────────
  {
    slug: "italy",
    countryCode: "it",
    name: "Italy",
    flagEmoji: "🇮🇹",
    h1: "Net Salary Calculator Italy 2025",
    intro:
      "Italy's standard IRPF rates are steep — up to 43% at national level before regional and municipal add-ons. But the Impatriates Regime (Regime degli Impatriati) cuts taxable income by 50% for qualifying expats, transforming Italy's effective burden dramatically. On €70k gross, standard IRPF yields around €41k net; the impatriates regime brings that closer to €53k.",
    taxHighlights: [
      "National IRPF: 23% up to €28k, 35% from €28k to €50k, 43% above €50k",
      "Regional + municipal add-ons: typically 1.5–3.3% depending on region",
      "Employee social contributions (INPS): approximately 9.19% of gross",
    ],
    specialRegime: {
      name: "Impatriates Regime (Regime degli Impatriati)",
      description:
        "From 2024 (revised), qualifying workers who move their tax residence to Italy receive a 50% exemption on Italian-source employment income for 5 years. Must not have been an Italian tax resident in the previous 3 years (6 years if buying a home or having children). Previously 70%, revised downward in 2024 reform.",
    },
    medianSalary: {
      gross: 29800,
      currency: "EUR",
      source: "Eurostat nama_10_fte, annual full-time adjusted salary (est.)",
      year: 2024,
    },
    examples: examples("it"),
    faq: [
      {
        q: "Was the impatriates regime changed in 2024?",
        a: "Yes. The 2024 reform reduced the exemption from 70% to 50% and introduced stricter conditions, including not having been an Italian resident in the previous 3–6 years (depending on factors like home ownership and children). Existing beneficiaries under pre-2024 rules are grandfathered.",
      },
      {
        q: "How do regional taxes affect Italian take-home pay?",
        a: "Regional add-on (addizionale regionale) ranges from 1.23% to 3.33% depending on the region. Lombardy (Milan) charges ~1.73%, while some southern regions are higher. Municipal add-on is typically 0.1–0.9%. This calculator uses an approximate blended rate.",
      },
      {
        q: "Is Italy worth it financially post-2024 impatriates reform?",
        a: "At the 50% exemption level, Italy remains highly competitive for senior professionals. On €100k gross, the impatriates regime saves approximately €12–15k/year compared to standard IRPF. The lifestyle quality and living costs (especially outside Milan) reinforce the appeal.",
      },
      {
        q: "What social contributions does an employee pay in Italy?",
        a: "INPS (national pension and social security) employee contributions average around 9.19% for private-sector employees. There is a ceiling above which the rate drops. Healthcare (SSN) is funded through taxes, not separate premiums, and is included in the IRPF.",
      },
      {
        q: "Is the calculation different for Milan vs Rome vs Naples?",
        a: "Income tax is national; regional and municipal add-ons differ. Milan (Lombardy) and Rome (Lazio) have similar overall burden. The bigger difference is living costs — Milan is significantly more expensive than Rome, which is in turn much costlier than Naples.",
      },
    ],
    relatedCountrySlugs: ["france", "spain", "switzerland"],
    relatedCities: [
      { name: "Milan", slug: "milan", countrySlug: "italy" },
      { name: "Rome", slug: "rome", countrySlug: "italy" },
    ],
    seoTitle: "Net Salary Calculator Italy 2025 — Impatriate Tax Regime | Expatlix",
    seoDescription:
      "Calculate your Italian net salary after IRPF and INPS. Includes impatriates regime (50% exemption) context for expats relocating to Milan or Rome.",
  },

  // ── Switzerland ──────────────────────────────────────────────────────────
  {
    slug: "switzerland",
    countryCode: "ch",
    name: "Switzerland",
    flagEmoji: "🇨🇭",
    h1: "Net Salary Calculator Switzerland 2025",
    intro:
      "Switzerland is exceptional: high salaries, low income tax, and — critically — massive variation between cantons. A CHF 120k salary in Zug nets around CHF 88k; the same salary in Geneva nets roughly CHF 78k. Federal tax is low, but cantonal and communal taxes are where the real differences lie. This calculator uses canton-blended averages; adjust for your specific canton below.",
    taxHighlights: [
      "Federal income tax: 0–11.5% (relatively low, caps at CHF 769,700 taxable)",
      "Cantonal + communal tax: varies 6–25% depending on canton and commune",
      "Employee social contributions (AHV/IV/EO + ALV + BVG): approximately 6.2–12% depending on salary",
    ],
    specialRegime: {
      name: "Lump-Sum Taxation (Pauschalbesteuerung)",
      description:
        "Available to wealthy foreigners without gainful employment in Switzerland. Tax is assessed on living expenses rather than actual income — typically at 7× annual rent. Not relevant for employed expats. Most expats pay normal cantonal + federal tax based on actual income.",
    },
    medianSalary: {
      gross: 82000,
      currency: "CHF",
      grossEur: 76000,
      source: "OECD Average Annual Wages 2023",
      year: 2023,
    },
    examples: examples("ch"),
    faq: [
      {
        q: "Why does canton matter so much for Swiss take-home pay?",
        a: "Cantonal and communal taxes are stacked on top of federal tax and can represent the majority of total tax burden. Zug's total rate is among the lowest in Switzerland (around 15% combined), while Geneva and Vaud approach 30%+. Moving between cantons can mean a CHF 10,000–20,000/year net difference on a CHF 120k salary.",
      },
      {
        q: "Is the Swiss salary in CHF or EUR?",
        a: "Switzerland uses CHF (Swiss Francs). Expatlix calculates in CHF and converts to EUR for comparison purposes using a live exchange rate. In 2025, CHF and EUR are close to parity (≈ 0.93).",
      },
      {
        q: "What are the mandatory Swiss employee contributions?",
        a: "AHV (old-age and survivors' insurance): 5.3%; IV (disability): 0.7%; EO (income compensation): 0.25%; ALV (unemployment): 1.1% up to CHF 148,200, then 0.5%. BVG (occupational pension — second pillar) is handled by the employer pension fund and varies.",
      },
      {
        q: "Does Switzerland have an expat-specific tax regime?",
        a: "Not for employed expats. The lump-sum taxation regime exists but only for those not gainfully employed in Switzerland. Expatriates with work permits pay standard income tax. The benefit is Switzerland's naturally low rates, especially in cantons like Zug, Schwyz, or Nidwalden.",
      },
      {
        q: "How does Swiss take-home compare to Germany or France?",
        a: "Switzerland typically nets 15–20% more than an equivalent German or French salary for senior roles, even after accounting for higher Swiss prices. Zurich and Geneva are expensive, but many cantons offer strong purchasing power. Compare using the Salary Calculator for each country.",
      },
    ],
    relatedCountrySlugs: ["germany", "france", "italy"],
    relatedCities: [
      { name: "Zurich", slug: "zurich", countrySlug: "switzerland" },
      { name: "Geneva", slug: "geneva", countrySlug: "switzerland" },
    ],
    seoTitle: "Net Salary Calculator Switzerland 2025 — By Canton | Expatlix",
    seoDescription:
      "Calculate your Swiss take-home pay in CHF after federal, cantonal, and communal taxes. See how Zurich, Geneva, and Zug compare. 2025 rates.",
  },

  // ── Ireland ──────────────────────────────────────────────────────────────
  {
    slug: "ireland",
    countryCode: "ie",
    name: "Ireland",
    flagEmoji: "🇮🇪",
    h1: "Net Salary Calculator Ireland 2025",
    intro:
      "Irish salaries are high — Dublin's tech and pharma sectors regularly offer €70–100k packages. But the combination of PAYE, Universal Social Charge (USC), and PRSI can make the net picture surprising. On a €70k salary, effective total deductions approach 40%. The USC — a flat charge added on top of income tax — is the one most expats underestimate.",
    taxHighlights: [
      "PAYE income tax: 20% up to €42,000, 40% above (2025 standard rate band for single person)",
      "Universal Social Charge (USC): 0.5% to 8% across 4 bands — included on top of PAYE",
      "PRSI (employee): 4.1% of gross earnings (rising to 4.2% in 2026 under roadmap)",
    ],
    specialRegime: {
      name: "Special Assignee Relief Programme (SARP)",
      description:
        "Employees assigned to Ireland from a foreign employer earning over €100,000 may qualify for SARP: 30% of income above €100,000 is exempt from PAYE (but USC and PRSI still apply). Available for up to 5 years. Must be applied for in year 1. Limited to employment income from the Irish employer.",
    },
    medianSalary: {
      gross: 61100,
      currency: "EUR",
      source: "Eurostat nama_10_fte, annual full-time adjusted salary",
      year: 2024,
    },
    examples: examples("ie"),
    faq: [
      {
        q: "What is the Universal Social Charge (USC) and how does it affect my take-home?",
        a: "USC is a tax on gross income charged in addition to PAYE. Rates in 2025: 0.5% on first €12,012; 2% on €12,012–€25,760; 4% on €25,760–€70,044; 8% above €70,044. On a €70k salary, USC adds approximately €2,900 to your total tax bill.",
      },
      {
        q: "Is Dublin as expensive as London for expats?",
        a: "Dublin is approaching London prices. A 1-bedroom city-centre apartment runs €2,000–2,500/month — comparable to or higher than London. However, Irish salaries in tech and pharma are competitive, and the tax treaty network is extensive. The real comparison depends heavily on the specific offer.",
      },
      {
        q: "What is SARP and who qualifies?",
        a: "The Special Assignee Relief Programme exempts 30% of income above €100,000 from PAYE for internationally assigned employees. You must earn ≥€100,000, have worked outside Ireland for a continuous 12-month period, and be assigned by the same group. USC and PRSI are not relieved.",
      },
      {
        q: "Does Ireland have double tax treaties with most countries?",
        a: "Yes. Ireland has one of the most extensive double tax treaty networks in the EU (73+ treaties), which is a significant reason many multinationals use Ireland as a European base. For expats with foreign income or assets, this typically prevents double taxation.",
      },
      {
        q: "Is the PRSI rate going up?",
        a: "Yes. The government's PRSI roadmap increases the employee rate from 4.1% to 4.2% in 2026, with further planned increases. The 2025 rate of 4.1% is used in this calculator.",
      },
    ],
    relatedCountrySlugs: ["united-kingdom", "netherlands", "belgium"],
    relatedCities: [],
    seoTitle: "Net Salary Calculator Ireland 2025 — After PAYE, USC & PRSI | Expatlix",
    seoDescription:
      "See your Irish take-home pay after income tax, USC, and PRSI. Includes SARP relief context for high earners. Built for expats moving to Dublin.",
  },

  // ── United Kingdom ────────────────────────────────────────────────────────
  {
    slug: "united-kingdom",
    countryCode: null,
    name: "United Kingdom",
    flagEmoji: "🇬🇧",
    h1: "Net Salary Calculator UK 2025",
    intro:
      "The UK uses a PAYE system with a personal allowance (£12,570 in 2025), two income tax bands (20% and 40%), and a higher 45% rate above £125,140. National Insurance contributions add 8% on earnings between £12,570 and £50,270, and 2% above. On a £70k salary, take-home is approximately £47,500 — London's rents, however, consume a large share of that.",
    taxHighlights: [
      "Income tax: 20% (£12,570–£50,270), 40% (£50,270–£125,140), 45% above — personal allowance tapers above £100k",
      "National Insurance: 8% on £12,570–£50,270; 2% above",
      "No regional variation — UK income tax is uniform (Scotland has separate rates via SRIT)",
    ],
    specialRegime: {
      name: "Remittance Basis (Non-Domiciled Status)",
      description:
        "Non-domiciled UK residents may elect to pay UK tax only on UK-source income and on foreign income remitted to the UK. This has been significantly restricted since April 2025 — the non-dom regime is being phased out and replaced with a 4-year foreign income exemption for new UK tax residents. This calculator covers employment income on normal domicile rules.",
    },
    medianSalary: {
      gross: 37800,
      currency: "GBP",
      grossEur: 44200,
      source: "ONS Annual Survey of Hours and Earnings (ASHE) / Eurostat (est.)",
      year: 2024,
    },
    examples: [],
    faq: [
      {
        q: "What is the UK personal allowance and does it phase out?",
        a: "The personal allowance is £12,570 in 2025 — income below this is tax-free. Above £100,000, it reduces by £1 for every £2 earned, eliminating entirely at £125,140. This creates an effective 60% marginal rate between £100k–£125k — a well-known trap for high earners.",
      },
      {
        q: "Has the non-dom regime ended?",
        a: "Effectively yes. The April 2025 reforms replaced the permanent remittance basis with a 4-year foreign income exemption for new UK tax residents. Existing non-doms had a transitional period. For most employed expats, this change has limited day-to-day impact on employment income.",
      },
      {
        q: "Does Scotland have different income tax rates?",
        a: "Yes. Scotland has its own income tax bands (Scottish Rate of Income Tax — SRIT) with more gradations. The Scottish starter rate (19%) and intermediate rates mean Scottish taxpayers often pay slightly more than English equivalents for the same salary. NI remains UK-wide.",
      },
      {
        q: "Is London worth it financially compared to Amsterdam or Dublin?",
        a: "London salaries in finance and tech are high, but housing costs are severe — a 1-bedroom in central London runs £2,000–2,800/month. After tax and rent, Amsterdam and Dublin can offer comparable or better monthly surpluses depending on the sector. Use the city compare tool for a direct breakdown.",
      },
      {
        q: "When will Expatlix add a full UK salary calculator?",
        a: "The UK calculator is on the roadmap. In the meantime, use the HMRC Take Home Pay calculator (gov.uk) for an official estimate, or the city comparison pages to see how UK salaries stack up against European alternatives.",
      },
    ],
    relatedCountrySlugs: ["ireland", "netherlands", "germany"],
    relatedCities: [],
    seoTitle: "Net Salary Calculator UK 2025 — After Income Tax & NI | Expatlix",
    seoDescription:
      "Understand UK take-home pay after income tax, National Insurance, and the personal allowance taper. Built for expats and international hires evaluating UK roles.",
  },

  // ── UAE ───────────────────────────────────────────────────────────────────
  {
    slug: "uae",
    countryCode: null,
    name: "United Arab Emirates",
    flagEmoji: "🇦🇪",
    h1: "Net Salary Calculator UAE 2025 — Tax-Free Salaries Explained",
    intro:
      'The UAE has no personal income tax. "Zero tax" is the headline — but it doesn\'t tell the whole story. Your real take-home depends on your housing allowance, whether your employer covers health insurance, end-of-service gratuity accrual, and whether your home country still taxes your foreign income. This page breaks down what UAE expats actually pocket.',
    taxHighlights: [
      "No income tax: zero federal or emirate income tax on employment earnings",
      "No social security: UAE nationals have GPSSA; most expat employees pay no social contributions",
      "End-of-service gratuity: mandatory lump-sum on departure (21 days' pay per year for first 5 years)",
    ],
    specialRegime: {
      name: "End-of-Service Gratuity (ESB)",
      description:
        "All expatriate employees are entitled to end-of-service gratuity under UAE labour law: 21 days' basic pay per year for the first 5 years, then 30 days' per year thereafter. It is paid on leaving the employer and is not subject to tax in the UAE. Check whether your home country taxes this on repatriation.",
    },
    examples: [],
    faq: [
      {
        q: "Do I pay any tax at all in the UAE?",
        a: "No income tax. VAT (5%) applies to goods and services. There is no payroll tax, capital gains tax, or wealth tax for individuals. UAE nationals contribute to GPSSA pension but expats typically do not.",
      },
      {
        q: "Does my home country still tax my UAE income?",
        a: "Possibly. UK, US, and Australian citizens in particular should check their residency and tax treaties. US citizens are taxed on worldwide income regardless of residence. UK residents who spend time in the UK may still have UK tax obligations on foreign income under revised non-dom rules from April 2025.",
      },
      {
        q: "What is typically included in a UAE expat package?",
        a: "Beyond basic salary: housing allowance (often 15–25% of salary), transport allowance, health insurance, annual flight home, school fees for children, and end-of-service gratuity. The gross cash salary underestimates total compensation — always value the full package.",
      },
      {
        q: "Is Dubai more expensive than Abu Dhabi?",
        a: "Dubai's luxury and central districts are pricier. Abu Dhabi's city centre is slightly cheaper on average for rent, but both have wide ranges. Expats in the UAE typically spend more on housing, private schooling, and dining than in European cities.",
      },
      {
        q: "When will Expatlix add a UAE salary calculator?",
        a: "A UAE package modeller (salary + allowances + gratuity + home-country tax simulation) is on the roadmap. In the meantime, use the country comparison pages to benchmark UAE packages against European net salaries.",
      },
    ],
    relatedCountrySlugs: ["united-kingdom", "ireland", "netherlands"],
    relatedCities: [],
    seoTitle: "Net Salary Calculator UAE 2025 — Tax-Free Salary Explained | Expatlix",
    seoDescription:
      "The UAE has no income tax — but your real take-home depends on allowances, gratuity, and home-country obligations. Everything expats need to know.",
  },

  // ── Singapore ─────────────────────────────────────────────────────────────
  {
    slug: "singapore",
    countryCode: null,
    name: "Singapore",
    flagEmoji: "🇸🇬",
    h1: "Net Salary Calculator Singapore 2025",
    intro:
      "Singapore's income tax rates are genuinely low: a S$120k salary faces an effective rate of roughly 11%. But CPF — the Central Provident Fund — changes the cash picture. PR and citizen employees contribute 20% of salary to CPF; Employment Pass (EP) holders on work visas do not. Understanding whether you're EP or PR is the single most important variable for Singapore take-home.",
    taxHighlights: [
      "Progressive income tax: 0% to 24%, effective rate on S$120k is approximately 10–11%",
      "CPF contribution: 20% employee + 17% employer for citizens/PRs (EP holders exempt)",
      "Not for Taxation (NFT) income: dividends and capital gains are not taxed in Singapore",
    ],
    specialRegime: {
      name: "Not Ordinarily Resident (NOR) Scheme",
      description:
        "The NOR scheme allowed expats splitting time between Singapore and other countries to pay tax only on the time spent in Singapore. It was abolished from YA 2025 and no new NOR certificates are issued. Existing beneficiaries are grandfathered until their 5-year period ends.",
    },
    examples: [],
    faq: [
      {
        q: "Does CPF affect expats on Employment Pass?",
        a: "No. CPF contributions only apply to Singapore citizens and Permanent Residents (PRs). Expats on Employment Pass, S Pass, or other work visas are exempt. This means EP holders receive more cash each month but have no mandatory savings vehicle — consider topping up private pension arrangements.",
      },
      {
        q: "How is Singapore's income tax structured?",
        a: "Singapore uses resident tax rates from 0% (first S$20,000) to 24% (above S$1,000,000), with multiple bands in between. Non-resident employees are taxed at 15% on employment income or the resident rate, whichever is higher. Effective rates are very low by global standards.",
      },
      {
        q: "Is Singapore more expensive than European cities?",
        a: "Singapore is one of the world's most expensive cities — particularly for housing, cars, and private schooling. A 1-bedroom apartment in a central district runs S$3,500–5,500/month. The low tax rates offset some of this, but purchasing power depends heavily on whether your employer provides housing or a housing allowance.",
      },
      {
        q: "Does Singapore tax foreign income?",
        a: "Generally no. Singapore uses a territorial tax system: income earned outside Singapore is not taxed unless remitted under specific circumstances. This makes it particularly attractive for global professionals with foreign investments or passive income.",
      },
      {
        q: "When will Expatlix add a Singapore salary calculator?",
        a: "A Singapore calculator (EP vs. PR/citizen, CPF modelling, income tax) is in development. For now, use IRAS's tax calculator on iras.gov.sg for official estimates.",
      },
    ],
    relatedCountrySlugs: ["united-kingdom", "ireland", "netherlands"],
    relatedCities: [],
    seoTitle: "Net Salary Calculator Singapore 2025 — After CPF & Income Tax | Expatlix",
    seoDescription:
      "Singapore's low tax rates are real — but CPF changes your cash take-home. Understand EP vs PR differences before accepting a Singapore job offer.",
  },
];

export function getCountryLPData(slug: string): CountrySalaryLPData | undefined {
  return countryLPData.find((c) => c.slug === slug);
}
