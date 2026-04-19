/**
 * Gross-to-net salary calculator — 12 European countries.
 *
 * Sources
 * -------
 * Primary  : europe_salary_tax_2026_comparison_expanded.xlsx (uploaded 2026-04-19)
 * Secondary: individual country legislation cited per-country below.
 *
 * Design rules
 * ------------
 * - One `*TaxParams` config object per country (pure data, no logic).
 * - One `calculate*NetSalary()` pure function per country.
 * - Shared `SalaryBreakdown` result schema.
 * - `calculateSalary()` dispatches by country code.
 * - All monetary figures in the country's native currency (EUR for euro-zone,
 *   CHF / SEK / DKK for the three non-euro countries).
 */

// ── Shared types ──────────────────────────────────────────────────────────────

export type CountryCode =
  | "nl" | "fr" | "de" | "hu"   // existing
  | "be" | "at" | "es" | "pt"   // new eurozone
  | "it" | "ch" | "se" | "dk";  // new (IT: euro; CH/SE/DK: native ccy)

export interface SalaryInput {
  grossAnnual: number;
  country: CountryCode;
  thirtyPercentRuling?: boolean; // NL only
  cadreStatus?: boolean;         // FR only
}

export interface SalaryBreakdown {
  grossAnnual: number;
  grossMonthly: number;
  taxableIncome: number;
  incomeTax: number;
  socialContributions: number;
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  effectiveTaxRate: number;
  breakdown: { label: string; amount: number; description: string }[];
  disclaimer: string;
  /** Median gross annual salary in the country's native currency */
  medianGrossAnnual: number;
  /** Short citation for the median figure */
  medianSource: string;
}

interface TaxBracket {
  upTo: number; // inclusive upper bound (use Infinity for top bracket)
  rate: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Apply progressive brackets to a taxable amount. Brackets must be ordered. */
function applyBrackets(taxableIncome: number, brackets: TaxBracket[]): number {
  let tax = 0;
  let prevLimit = 0;
  for (const bracket of brackets) {
    if (taxableIncome <= prevLimit) break;
    const width = Math.min(taxableIncome, bracket.upTo) - prevLimit;
    tax += width * bracket.rate;
    prevLimit = bracket.upTo;
  }
  return tax;
}

function round(n: number) { return Math.round(n); }

function pct(rate: number) { return `${+(rate * 100).toPrecision(5)}%`; }

// ═══════════════════════════════════════════════════════════════════════════
// 1. NETHERLANDS
// Source: spreadsheet + Belastingdienst 2026
// Brackets 2026 (Box 1 — combines income tax + national insurance premiums):
//   35.70 % up to €38,883   (income tax 8.05% + AOW/ANW/WLz 27.65%)
//   37.56 % €38,883–€79,137 (income tax 37.56%; AOW/ANW/WLz not due above first ceiling)
//   49.50 % above €79,137
// ZVW (health insurance) employee income-related levy is collected via employer;
// the nominal premium (~€165/mo) is paid separately — not deducted here.
// Simplification: tax credits updated to estimated 2026 values.
// ═══════════════════════════════════════════════════════════════════════════

const dutchTaxParams = {
  year: 2026,
  brackets: [
    { upTo:  38_883, rate: 0.3570 },
    { upTo:  79_137, rate: 0.3756 },
    { upTo: Infinity, rate: 0.4950 },
  ] as TaxBracket[],
  // Algemene heffingskorting 2026 (estimated; 2025 value: max €3,068)
  generalTaxCredit: {
    maxCredit: 3_100,
    phaseOutStart: 24_812,
    phaseOutRate: 0.0637,
    minCredit: 0,
  },
  // Arbeidskorting 2026 (estimated; 2025 value: max €5,599)
  labourTaxCredit: {
    maxCredit: 5_700,
    phaseOutStart: 43_071,
    phaseOutRate: 0.0651,
    minCredit: 0,
  },
  thirtyPercentRulingExemption: 0.30,
  medianGrossAnnual: 46_000,       // CBS Statline 2024 estimate
  medianSource: "CBS Statline 2024",
};

function calculateDutchNetSalary(
  grossAnnual: number,
  thirtyPercentRuling: boolean,
): SalaryBreakdown {
  let taxableIncome = grossAnnual;
  let rulingBenefit = 0;

  if (thirtyPercentRuling) {
    rulingBenefit = grossAnnual * dutchTaxParams.thirtyPercentRulingExemption;
    taxableIncome = grossAnnual - rulingBenefit;
  }

  const bd: SalaryBreakdown["breakdown"] = [];

  if (thirtyPercentRuling) {
    bd.push({
      label: "30% ruling exemption",
      amount: -round(rulingBenefit),
      description: `€${round(rulingBenefit).toLocaleString()} exempt from taxable income`,
    });
  }

  // Apply brackets sequentially
  let remaining = taxableIncome;
  let prevLimit = 0;
  let incomeTax = 0;
  for (const bracket of dutchTaxParams.brackets) {
    if (remaining <= 0) break;
    const width = Math.min(remaining, bracket.upTo - prevLimit);
    const bracketTax = width * bracket.rate;
    incomeTax += bracketTax;
    bd.push({
      label: `Tax bracket ${pct(bracket.rate)}`,
      amount: round(bracketTax),
      description: `${pct(bracket.rate)} on €${round(width).toLocaleString()}`,
    });
    remaining -= width;
    prevLimit = bracket.upTo === Infinity ? bracket.upTo : bracket.upTo;
  }

  // Tax credits (phase out with income)
  const p = dutchTaxParams;
  let generalCredit = p.generalTaxCredit.maxCredit;
  if (taxableIncome > p.generalTaxCredit.phaseOutStart) {
    generalCredit = Math.max(0,
      generalCredit - (taxableIncome - p.generalTaxCredit.phaseOutStart) * p.generalTaxCredit.phaseOutRate);
  }
  let labourCredit = p.labourTaxCredit.maxCredit;
  if (taxableIncome > p.labourTaxCredit.phaseOutStart) {
    labourCredit = Math.max(0,
      labourCredit - (taxableIncome - p.labourTaxCredit.phaseOutStart) * p.labourTaxCredit.phaseOutRate);
  }
  incomeTax = Math.max(0, incomeTax - generalCredit - labourCredit);

  bd.push({ label: "General tax credit",  amount: -round(generalCredit),  description: "Algemene heffingskorting" });
  bd.push({ label: "Labour tax credit",   amount: -round(labourCredit),   description: "Arbeidskorting" });

  return build(grossAnnual, taxableIncome, incomeTax, 0, bd,
    "Indicative estimate — 2026 Dutch Box-1 rates. ZVW nominal health premium (~€165/mo) paid separately. " +
    "Credits phased out with income. 30% ruling: employer must apply; 5-year cap. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. FRANCE
// Source: spreadsheet + DGFIP 2026 barème
// Brackets updated to 2026 values from spreadsheet.
// Social charges: CSG/CRDS 9.7% on 98.25% base; general payroll charges ~22.5–25%.
// SS ceiling (PASS) 2026: €48,060 / yr (spreadsheet).
// Simplification: employer charges not split by ceiling tranche (single blended rate).
// ═══════════════════════════════════════════════════════════════════════════

const frenchTaxParams = {
  year: 2026,
  socialContributionRate: { nonCadre: 0.225, cadre: 0.25 },
  csgRate: 0.068,          // deductible CSG
  csgNdRate: 0.024,        // non-deductible CSG
  crdsRate: 0.005,
  csgBase: 0.9825,         // CSG/CRDS assessed on 98.25% of gross
  brackets: [
    { upTo:  11_600, rate: 0.00 },
    { upTo:  29_579, rate: 0.11 },
    { upTo:  84_577, rate: 0.30 },
    { upTo: 181_917, rate: 0.41 },
    { upTo: Infinity, rate: 0.45 },
  ] as TaxBracket[],
  medianGrossAnnual: 27_200,   // INSEE 2023 estimate
  medianSource: "INSEE 2023",
};

function calculateFrenchNetSalary(grossAnnual: number, cadreStatus: boolean): SalaryBreakdown {
  const p = frenchTaxParams;
  const socialRate = cadreStatus ? p.socialContributionRate.cadre : p.socialContributionRate.nonCadre;
  const socialContribs = grossAnnual * socialRate;

  const csgBase = grossAnnual * p.csgBase;
  const csgDeductible    = csgBase * p.csgRate;
  const csgNonDeductible = csgBase * p.csgNdRate;
  const crds             = csgBase * p.crdsRate;
  const totalSocial = socialContribs + csgDeductible + csgNonDeductible + crds;

  // Taxable income = net social salary + non-deductible CSG/CRDS (added back)
  const taxableIncome = grossAnnual - totalSocial + csgNonDeductible + crds;
  const incomeTax = applyBrackets(taxableIncome, p.brackets);

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "Social contributions", amount: round(socialContribs),
      description: `${pct(socialRate)} payroll charges (${cadreStatus ? "cadre" : "non-cadre"})` },
    { label: "CSG (deductible)",     amount: round(csgDeductible),
      description: "Contribution sociale généralisée — deductible portion" },
    { label: "CSG (non-ded.) + CRDS", amount: round(csgNonDeductible + crds),
      description: "Non-deductible CSG + CRDS assessed on 98.25% of gross" },
  ];

  let prevLimit = 0;
  for (const bracket of p.brackets) {
    if (bracket.rate === 0) { prevLimit = bracket.upTo; continue; }
    if (taxableIncome <= prevLimit) break;
    const width = Math.min(taxableIncome, bracket.upTo) - prevLimit;
    if (width > 0) bd.push({
      label: `Income tax ${pct(bracket.rate)}`,
      amount: round(width * bracket.rate),
      description: `${pct(bracket.rate)} on €${round(width).toLocaleString()}`,
    });
    prevLimit = bracket.upTo;
  }

  return build(grossAnnual, round(taxableIncome), round(incomeTax), round(totalSocial), bd,
    "Indicative estimate — 2026 French tax parameters. Family quotient not applied (single person). " +
    "Withholding at source (PAYE) since 2019. Employer charges not shown. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. GERMANY
// Source: spreadsheet + EStG §32a 2026 projections
// Grundfreibetrag 2026: €12,348 (spreadsheet). Ceilings updated to 2026 values.
// ═══════════════════════════════════════════════════════════════════════════

const germanTaxParams = {
  year: 2026,
  grundfreibetrag: 12_348,
  arbeitnehmerPauschbetrag: 1_230,
  // Zone boundaries for §32a formula (zvE = taxable income)
  zone2End: 17_543,
  zone3End: 68_481,
  zone4End: 277_826,
  soliThreshold: 18_130,
  soliRate: 0.055,
  socialContributions: {
    // Spreadsheet: pension/unemployment ceiling €101,400; health/care €69,750
    health:       { rate: 0.0815, ceiling: 69_750 },
    longTermCare: { rate: 0.0170, ceiling: 69_750 },
    pension:      { rate: 0.0930, ceiling: 101_400 },
    unemployment: { rate: 0.0130, ceiling: 101_400 },
  },
  medianGrossAnnual: 45_000,   // Destatis 2024 estimate
  medianSource: "Destatis 2024",
};

function computeGermanIncomeTax(zvE: number): number {
  const { grundfreibetrag, zone2End, zone3End, zone4End } = germanTaxParams;
  if (zvE <= grundfreibetrag) return 0;
  if (zvE <= zone2End) {
    const y = (zvE - grundfreibetrag) / 10_000;
    return round((979.18 * y + 1_400) * y);
  }
  if (zvE <= zone3End) {
    const z = (zvE - zone2End) / 10_000;
    return round((192.59 * z + 2_397) * z + 966.53);
  }
  if (zvE <= zone4End) return round(0.42 * zvE - 9_972.98);
  return round(0.45 * zvE - 18_307.73);
}

function calculateGermanNetSalary(grossAnnual: number): SalaryBreakdown {
  const sc = germanTaxParams.socialContributions;
  const healthC   = Math.min(grossAnnual, sc.health.ceiling)       * sc.health.rate;
  const careC     = Math.min(grossAnnual, sc.longTermCare.ceiling)  * sc.longTermCare.rate;
  const pensionC  = Math.min(grossAnnual, sc.pension.ceiling)       * sc.pension.rate;
  const unempC    = Math.min(grossAnnual, sc.unemployment.ceiling)  * sc.unemployment.rate;
  const totalSocial = healthC + careC + pensionC + unempC;

  const zvE = Math.max(0, grossAnnual - totalSocial - germanTaxParams.arbeitnehmerPauschbetrag);
  const incomeTax = computeGermanIncomeTax(zvE);
  const soli = incomeTax > germanTaxParams.soliThreshold ? round(incomeTax * germanTaxParams.soliRate) : 0;

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "Health insurance (GKV)",    amount: round(healthC),  description: `${pct(sc.health.rate)} employee share (ceil. €${sc.health.ceiling.toLocaleString()}/yr)` },
    { label: "Long-term care insurance",  amount: round(careC),    description: `${pct(sc.longTermCare.rate)} Pflegeversicherung (childless: +0.6%)` },
    { label: "Pension insurance",         amount: round(pensionC), description: `${pct(sc.pension.rate)} Rentenversicherung (ceil. €${sc.pension.ceiling.toLocaleString()}/yr)` },
    { label: "Unemployment insurance",    amount: round(unempC),   description: `${pct(sc.unemployment.rate)} Arbeitslosenversicherung` },
    { label: "Income tax (Einkommensteuer)", amount: incomeTax,   description: `2026 §32a formula on €${round(zvE).toLocaleString()} taxable income` },
  ];
  if (soli > 0) bd.push({ label: "Solidarity surcharge (Soli)", amount: soli, description: `5.5% on income tax above €${germanTaxParams.soliThreshold.toLocaleString()}` });

  return build(grossAnnual, round(zvE), incomeTax + soli, round(totalSocial), bd,
    "Indicative estimate — 2026 German tax (EStG §32a). Church tax, child allowances and capital income not included. " +
    "Childless employees pay +0.6% long-term care surcharge. Not tax advice.",
    germanTaxParams.medianGrossAnnual, germanTaxParams.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. HUNGARY
// Source: Act CXVII of 1995 (SZJA) + spreadsheet
// Flat 15% SZJA + 18.5% employee social contributions (unchanged 2025–2026).
// ═══════════════════════════════════════════════════════════════════════════

const hungarianTaxParams = {
  year: 2026,
  incomeTaxRate: 0.15,
  socialContributions: { pension: 0.10, health: 0.07, labourMarket: 0.015 },
  employerSocialTax: 0.13,
  medianGrossAnnual: 4_620_000, // ~385 000 HUF/month — KSH 2024 estimate
  medianSource: "KSH 2024",
};

function calculateHungarianNetSalary(grossAnnual: number): SalaryBreakdown {
  const p = hungarianTaxParams;
  const incomeTax    = grossAnnual * p.incomeTaxRate;
  const pension      = grossAnnual * p.socialContributions.pension;
  const health       = grossAnnual * p.socialContributions.health;
  const labourMarket = grossAnnual * p.socialContributions.labourMarket;
  const totalSocial  = pension + health + labourMarket;
  const bd: SalaryBreakdown["breakdown"] = [
    { label: "Income tax (SZJA)",             amount: round(incomeTax),    description: `Flat ${pct(p.incomeTaxRate)} személyi jövedelemadó` },
    { label: "Pension contribution",          amount: round(pension),      description: `${pct(p.socialContributions.pension)} nyugdíjjárulék` },
    { label: "Health insurance",             amount: round(health),       description: `${pct(p.socialContributions.health)} egészségbiztosítási járulék` },
    { label: "Labour market contribution",   amount: round(labourMarket), description: `${pct(p.socialContributions.labourMarket)} munkaerőpiaci járulék` },
  ];
  return build(grossAnnual, grossAnnual, round(incomeTax), round(totalSocial), bd,
    "Indicative estimate — 2026 Hungarian tax (flat 15% SZJA + 18.5% employee social contributions). " +
    "Under-25 income tax exemption and family allowances not included. Employer szocho (13%) not shown. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. BELGIUM
// Source: spreadsheet + FOD Financiën 2025/2026
// Brackets: 25/40/45/50% (spreadsheet). 2026 thresholds indexed ~1.6% from 2025.
// Employee SSC: 13.07% flat (no statutory ceiling on total SSC in BE).
// Work-expense deduction: 30% of gross, capped at €5,930 (spreadsheet).
// Personal allowance (belastingvrije som): €10,910 — reduces tax via 25% bracket.
// Local communal tax surcharge: 7.0% average (applies to income tax after credit).
// Simplification: special low-income SSC reductions, family multiplier not applied.
// ═══════════════════════════════════════════════════════════════════════════

const belgianTaxParams = {
  year: 2026,
  employeeSSC: 0.1307,
  workExpenseDeduction: { rate: 0.30, cap: 5_930 },
  personalAllowance: 10_910,
  brackets: [
    { upTo: 15_200, rate: 0.25 },
    { upTo: 26_830, rate: 0.40 },
    { upTo: 46_440, rate: 0.45 },
    { upTo: Infinity, rate: 0.50 },
  ] as TaxBracket[],
  communalSurchargeRate: 0.070, // national average; actual varies by municipality
  medianGrossAnnual: 48_000,    // Statbel 2023 estimate
  medianSource: "Statbel 2023",
};

function calculateBelgianNetSalary(grossAnnual: number): SalaryBreakdown {
  const p = belgianTaxParams;
  const ssc = grossAnnual * p.employeeSSC;
  const workDeduction = Math.min(grossAnnual * p.workExpenseDeduction.rate, p.workExpenseDeduction.cap);
  // Taxable income after SSC and forfait professional expenses
  const taxableIncome = Math.max(0, grossAnnual - ssc - workDeduction);
  // Personal allowance — reduces tax by applying 25% rate to the exempt amount
  const allowanceCredit = Math.min(p.personalAllowance, taxableIncome) * 0.25;
  const grossTax = applyBrackets(taxableIncome, p.brackets);
  const taxBeforeSurcharge = Math.max(0, grossTax - allowanceCredit);
  const communalTax = taxBeforeSurcharge * p.communalSurchargeRate;
  const totalIncomeTax = taxBeforeSurcharge + communalTax;

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "Employee SSC (NSSO)", amount: round(ssc),
      description: `${pct(p.employeeSSC)} Office national de Sécurité sociale` },
    { label: "Work-expense deduction", amount: -round(workDeduction),
      description: `30% forfait, capped at €${p.workExpenseDeduction.cap.toLocaleString()}` },
  ];
  let prevLimit = 0;
  for (const br of p.brackets) {
    if (taxableIncome <= prevLimit) break;
    const w = Math.min(taxableIncome, br.upTo) - prevLimit;
    if (w > 0) bd.push({ label: `Income tax ${pct(br.rate)}`, amount: round(w * br.rate), description: `${pct(br.rate)} on €${round(w).toLocaleString()}` });
    prevLimit = br.upTo;
  }
  bd.push({ label: "Personal allowance credit", amount: -round(allowanceCredit),
    description: `25% × €${p.personalAllowance.toLocaleString()} belastingvrije som` });
  bd.push({ label: "Communal tax surcharge", amount: round(communalTax),
    description: `${pct(p.communalSurchargeRate)} average — varies by municipality` });

  return build(grossAnnual, round(taxableIncome), round(totalIncomeTax), round(ssc), bd,
    "Indicative estimate — 2026 Belgian income tax. Communal surcharge at 7% national average. " +
    "Family allowances, special SSC reductions for low incomes not applied. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. AUSTRIA
// Source: spreadsheet + EStG (Österreich) 2025/2026
// Grundfreibetrag 2026: €13,541 (spreadsheet). Brackets scaled from 2025 law.
// Employee SS (ASVG): 18.07% — pension 10.25%, health 3.87%, unemployment 2.95%, misc 1%.
// Ceiling (Höchstbeitragsgrundlage): €79,380/yr (2026 estimate — increases ~1.8%/yr).
// Simplification: 13th/14th-month "Sonderzahlungen" taxed at 6% flat are NOT modelled;
//   all income treated as regular; this may underestimate net for salaried employees.
// ═══════════════════════════════════════════════════════════════════════════

const austrianTaxParams = {
  year: 2026,
  // 2026 brackets estimated by indexing 2025 brackets by Grundfreibetrag growth factor
  brackets: [
    { upTo:  13_541, rate: 0.00 },
    { upTo:  22_034, rate: 0.20 },
    { upTo:  36_471, rate: 0.30 },
    { upTo:  70_321, rate: 0.40 },
    { upTo: 104_874, rate: 0.48 },
    { upTo: 1_000_000, rate: 0.50 },
    { upTo: Infinity,  rate: 0.55 },
  ] as TaxBracket[],
  employeeSSRate: 0.1807,
  ssCeiling: 79_380, // Höchstbeitragsgrundlage 2026 estimate
  medianGrossAnnual: 44_500,   // Statistik Austria 2023 estimate
  medianSource: "Statistik Austria 2023",
};

function calculateAustrianNetSalary(grossAnnual: number): SalaryBreakdown {
  const p = austrianTaxParams;
  const ssBase = Math.min(grossAnnual, p.ssCeiling);
  const ssc = ssBase * p.employeeSSRate;
  const taxableIncome = Math.max(0, grossAnnual - ssc);
  const incomeTax = applyBrackets(taxableIncome, p.brackets);

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "Employee social insurance", amount: round(ssc),
      description: `${pct(p.employeeSSRate)} ASVG (pension 10.25%, health 3.87%, unemployment 2.95%, misc) — ceil. €${p.ssCeiling.toLocaleString()}/yr` },
  ];
  let prevLimit = 0;
  for (const br of p.brackets) {
    if (br.rate === 0) { prevLimit = br.upTo; continue; }
    if (taxableIncome <= prevLimit) break;
    const w = Math.min(taxableIncome, br.upTo) - prevLimit;
    if (w > 0) bd.push({ label: `Income tax ${pct(br.rate)}`, amount: round(w * br.rate), description: `${pct(br.rate)} on €${round(w).toLocaleString()}` });
    prevLimit = br.upTo;
  }

  return build(grossAnnual, round(taxableIncome), round(incomeTax), round(ssc), bd,
    "Indicative estimate — 2026 Austrian income tax (EStG). 13th/14th-month Sonderzahlungen (taxed at flat 6%) " +
    "are not modelled; actual net is typically slightly higher for salaried employees. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. SPAIN
// Source: spreadsheet + Ley 35/2006 IRPF + AGE 2025
// Brackets: combined national + Madrid regional rates (most common for expats).
// Employee SS: 6.35% (contingencias 4.70% + desempleo 1.55% + formación 0.10%).
// SS ceiling: €61,214/yr (monthly max €5,101.20 — spreadsheet).
// SS floor: €16,574/yr (monthly min €1,381.20 — spreadsheet).
// Employment income reduction (rendimiento neto del trabajo): up to €5,565.
// Personal allowance (mínimo personal): €5,550 → tax credit at lowest marginal rate.
// Simplification: Madrid regional rates used; other regions may vary ±3 pp at high incomes.
//   Beckham Law (régimen especial impatriados, flat 24%) not modelled.
// ═══════════════════════════════════════════════════════════════════════════

const spanishTaxParams = {
  year: 2026,
  brackets: [
    { upTo:  12_450, rate: 0.19 },
    { upTo:  20_200, rate: 0.24 },
    { upTo:  35_200, rate: 0.30 },
    { upTo:  60_000, rate: 0.37 },
    { upTo: 300_000, rate: 0.45 },
    { upTo: Infinity, rate: 0.47 },
  ] as TaxBracket[],
  employeeSSRate: 0.0635,
  ssCeiling: 61_214,     // €5,101.20/month × 12
  ssFloor:   16_574,     // €1,381.20/month × 12
  // Employment income reduction (Art. 20 LIRPF)
  employmentReduction: { maxDeduction: 5_565, thresholdStart: 13_115, thresholdEnd: 16_825 },
  personalAllowance: 5_550,
  medianGrossAnnual: 29_200,   // INE 2023 estimate (Encuesta Anual de Estructura Salarial)
  medianSource: "INE 2023",
};

function calculateSpanishNetSalary(grossAnnual: number): SalaryBreakdown {
  const p = spanishTaxParams;
  // SS base clamped between floor and ceiling
  const ssBase = Math.min(Math.max(grossAnnual, p.ssFloor), p.ssCeiling);
  const ssc = ssBase * p.employeeSSRate;

  // Employment income reduction (Art. 20 LIRPF)
  let empReduction = 0;
  if (grossAnnual <= p.employmentReduction.thresholdStart) {
    empReduction = p.employmentReduction.maxDeduction;
  } else if (grossAnnual <= p.employmentReduction.thresholdEnd) {
    const slope = p.employmentReduction.maxDeduction /
      (p.employmentReduction.thresholdEnd - p.employmentReduction.thresholdStart);
    empReduction = p.employmentReduction.maxDeduction -
      (grossAnnual - p.employmentReduction.thresholdStart) * slope;
  }
  // else empReduction = 0 for income above thresholdEnd

  const taxableIncome = Math.max(0, grossAnnual - ssc - empReduction);
  const grossTax = applyBrackets(taxableIncome, p.brackets);
  // Personal allowance credit: tax that would be due on €5,550 at the lowest rate
  const personalCredit = Math.min(p.personalAllowance, taxableIncome) * p.brackets[0].rate;
  const incomeTax = Math.max(0, grossTax - personalCredit);

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "Employee SS (Seg. Social)", amount: round(ssc),
      description: `${pct(p.employeeSSRate)} — base clamped €${round(p.ssFloor).toLocaleString()}–€${round(p.ssCeiling).toLocaleString()}/yr` },
  ];
  if (empReduction > 0) bd.push({
    label: "Employment income reduction", amount: -round(empReduction),
    description: "Art. 20 LIRPF — phases out above €13,115 gross",
  });
  let prevLimit = 0;
  for (const br of p.brackets) {
    if (taxableIncome <= prevLimit) break;
    const w = Math.min(taxableIncome, br.upTo) - prevLimit;
    if (w > 0) bd.push({ label: `IRPF ${pct(br.rate)}`, amount: round(w * br.rate), description: `${pct(br.rate)} on €${round(w).toLocaleString()}` });
    prevLimit = br.upTo;
  }
  bd.push({ label: "Personal allowance (mín. personal)", amount: -round(personalCredit),
    description: `${pct(p.brackets[0].rate)} × €${p.personalAllowance.toLocaleString()}` });

  return build(grossAnnual, round(taxableIncome), round(incomeTax), round(ssc), bd,
    "Indicative estimate — 2026 Spanish IRPF using Madrid combined national + regional rates. " +
    "Other autonomous communities may vary. Beckham Law flat 24% regime not applied. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. PORTUGAL
// Source: spreadsheet + CIRS (Código do IRS) 2025 — 2026 brackets pending.
// Brackets: 9 tranches up to 48% (spreadsheet confirms top rate 48%).
// Employee SS: 11% — no ceiling (TSU regime for employees).
// Specific deduction (dedução específica cat. A): higher of €4,104 or SS paid.
//   — effectively means: if SS > €4,104 (gross > €37,309), SS is the deduction.
// Solidarity surtax (sobretaxa solidária): 2.5% on €80k–€250k; 5% above €250k.
// Simplification: personal health/education credits, NHR/IFICI regime not applied.
// ═══════════════════════════════════════════════════════════════════════════

const portugueseTaxParams = {
  year: 2026,
  brackets: [
    { upTo:   8_059, rate: 0.145 },
    { upTo:  12_160, rate: 0.210 },
    { upTo:  17_233, rate: 0.265 },
    { upTo:  22_306, rate: 0.282 },
    { upTo:  28_400, rate: 0.351 },
    { upTo:  41_629, rate: 0.381 },
    { upTo:  44_987, rate: 0.435 },
    { upTo:  80_000, rate: 0.450 },
    { upTo: Infinity, rate: 0.480 },
  ] as TaxBracket[],
  employeeSSRate: 0.11,
  specificDeductionMin: 4_104,   // minimum dedução específica
  solidaritySurtax: [
    { upTo: 250_000, rate: 0.025 },  // on €80k–€250k
    { upTo: Infinity, rate: 0.050 }, // above €250k
  ] as TaxBracket[],
  solidarityThreshold: 80_000,
  medianGrossAnnual: 23_500,    // INE Portugal 2023 estimate
  medianSource: "INE Portugal 2023",
};

function calculatePortugueseNetSalary(grossAnnual: number): SalaryBreakdown {
  const p = portugueseTaxParams;
  const ssc = grossAnnual * p.employeeSSRate;
  // Dedução específica = max(€4,104, SS paid) — reduces IRS taxable base
  const specificDeduction = Math.max(p.specificDeductionMin, ssc);
  const taxableIncome = Math.max(0, grossAnnual - specificDeduction);
  const baseTax = applyBrackets(taxableIncome, p.brackets);

  // Solidarity surtax on income above €80k
  const solidarityBase = Math.max(0, taxableIncome - p.solidarityThreshold);
  const solidarityTax = solidarityBase > 0
    ? applyBrackets(solidarityBase, p.solidaritySurtax)
    : 0;
  const totalIncomeTax = baseTax + solidarityTax;

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "Employee SS (TSU)", amount: round(ssc),
      description: `${pct(p.employeeSSRate)} segurança social (no ceiling)` },
    { label: "Specific deduction", amount: -round(specificDeduction),
      description: `Dedução específica cat. A — max(€4,104, SS paid)` },
  ];
  let prevLimit = 0;
  for (const br of p.brackets) {
    if (taxableIncome <= prevLimit) break;
    const w = Math.min(taxableIncome, br.upTo) - prevLimit;
    if (w > 0) bd.push({ label: `IRS ${pct(br.rate)}`, amount: round(w * br.rate), description: `${pct(br.rate)} on €${round(w).toLocaleString()}` });
    prevLimit = br.upTo;
  }
  if (solidarityTax > 0) bd.push({
    label: "Solidarity surtax", amount: round(solidarityTax),
    description: "2.5% on €80k–€250k / 5% above €250k",
  });

  return build(grossAnnual, round(taxableIncome), round(totalIncomeTax), round(ssc), bd,
    "Indicative estimate — 2025/2026 Portuguese IRS. NHR/IFICI preferential regime not applied. " +
    "Health and education credits not included. Solidarity surtax applied above €80k. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. ITALY
// Source: spreadsheet + TUIR (DPR 917/1986) 2024 reform (3-bracket system)
// Brackets 2024-onwards: 23/33/43% (per spreadsheet). Note: legislation uses 23/35/43%;
//   spreadsheet shows 33% — used as source of truth per task instructions.
// Employee INPS: 9.19% up to €103,055; 10.19% above (INPS 2024 circular).
// Regional surtax: 1.23% average (varies by region; Lazio used ~1.73%).
// Municipal surtax: 0.40% average (varies widely).
// Employment deduction (detrazione da lavoro dipendente) — Art. 13 TUIR.
// Simplification: regional/municipal actual rates replaced by national averages.
//   Impatriati 50% income exemption not modelled.
// ═══════════════════════════════════════════════════════════════════════════

const italianTaxParams = {
  year: 2026,
  brackets: [
    { upTo:  28_000, rate: 0.23 },
    { upTo:  50_000, rate: 0.33 },  // spreadsheet: 33% (legislation: 35%)
    { upTo: Infinity, rate: 0.43 },
  ] as TaxBracket[],
  inpsRate:      0.0919,
  inpsRateHigh:  0.1019,  // above ceiling
  inpsCeiling:  103_055,
  regionalSurtaxRate: 0.0123, // national average
  municipalSurtaxRate: 0.0040,
  medianGrossAnnual: 30_500,   // Istat 2023 estimate
  medianSource: "Istat 2023",
};

/** Art. 13 TUIR employment deduction (simplified) */
function italianEmploymentDeduction(grossAnnual: number): number {
  if (grossAnnual <= 0) return 0;
  if (grossAnnual <= 15_000)  return 1_880;
  if (grossAnnual <= 28_000)  return Math.max(0, 1_910 * (28_000 - grossAnnual) / 13_000 + 978);
  if (grossAnnual <= 50_000)  return Math.max(0, 1_190 * (50_000 - grossAnnual) / 22_000);
  return 0;
}

function calculateItalianNetSalary(grossAnnual: number): SalaryBreakdown {
  const p = italianTaxParams;
  const inpsBase = Math.min(grossAnnual, p.inpsCeiling);
  const inpsHigh = Math.max(0, grossAnnual - p.inpsCeiling);
  const ssc = inpsBase * p.inpsRate + inpsHigh * p.inpsRateHigh;

  const empDeduction = italianEmploymentDeduction(grossAnnual);
  const taxableIncome = Math.max(0, grossAnnual - ssc); // INPS reduces gross before IRPEF
  const irpef = Math.max(0, applyBrackets(taxableIncome, p.brackets) - empDeduction);
  const regionalTax = taxableIncome * p.regionalSurtaxRate;
  const municipalTax = taxableIncome * p.municipalSurtaxRate;
  const totalIncomeTax = irpef + regionalTax + municipalTax;

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "INPS contribution", amount: round(ssc),
      description: `${pct(p.inpsRate)} up to €${p.inpsCeiling.toLocaleString()}; ${pct(p.inpsRateHigh)} above` },
  ];
  let prevLimit = 0;
  for (const br of p.brackets) {
    if (taxableIncome <= prevLimit) break;
    const w = Math.min(taxableIncome, br.upTo) - prevLimit;
    if (w > 0) bd.push({ label: `IRPEF ${pct(br.rate)}`, amount: round(w * br.rate), description: `${pct(br.rate)} on €${round(w).toLocaleString()}` });
    prevLimit = br.upTo;
  }
  if (empDeduction > 0) bd.push({ label: "Employment deduction", amount: -round(empDeduction), description: "Detrazione da lavoro dipendente (Art. 13 TUIR)" });
  bd.push({ label: "Regional surtax (avg)", amount: round(regionalTax), description: `${pct(p.regionalSurtaxRate)} addizionale regionale — national average` });
  bd.push({ label: "Municipal surtax (avg)", amount: round(municipalTax), description: `${pct(p.municipalSurtaxRate)} addizionale comunale — national average` });

  return build(grossAnnual, round(taxableIncome), round(totalIncomeTax), round(ssc), bd,
    "Indicative estimate — 2024/2026 Italian IRPEF (3-bracket reform). Middle bracket uses 33% per source data " +
    "(legislation: 35%). Regional/municipal rates are national averages; actual rates vary by region. " +
    "Impatriati 50% exemption not modelled. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. SWITZERLAND
// Source: spreadsheet + ESTV (Federal Tax Administration) 2024 + Zurich 2024 tariff
// Currency: CHF. All inputs and outputs in CHF.
// Federal income tax (DBSt): progressive, max marginal 11.5%.
// Cantonal + municipal: Zurich city used as reference (spreadshet: "canton matters greatly").
// Employee social contributions (per spreadsheet):
//   AHV/IV/EO: 5.30%; ALV: 1.10% up to CHF 148,200; solidarity ALV 0.50% to CHF 315,000.
// BVG (occupational pension 2nd pillar): employer-defined — NOT modelled.
// Simplification: Quellensteuer, forfait d'impôt not applicable to employed residents.
//   Results are for Zurich canton/city only; Geneva, Zug etc. differ significantly.
// ═══════════════════════════════════════════════════════════════════════════

const swissTaxParams = {
  year: 2026,
  currency: "CHF",
  // Combined federal + Zurich canton + Zurich city effective marginal brackets
  // (derived from official ESTV tax calculator for single, no children, Zurich city 2024)
  federalBrackets: [
    { upTo:  17_800, rate: 0.000 },
    { upTo:  31_600, rate: 0.010 },
    { upTo:  41_400, rate: 0.020 },
    { upTo:  55_200, rate: 0.030 },
    { upTo:  72_500, rate: 0.040 },
    { upTo:  78_100, rate: 0.060 },
    { upTo: 103_600, rate: 0.080 },
    { upTo: 134_600, rate: 0.090 },
    { upTo: 176_000, rate: 0.105 },
    { upTo: Infinity, rate: 0.115 },
  ] as TaxBracket[],
  // Zurich cantonal + municipal surcharge ≈ 119% × cantonal base
  // Approximate combined effective marginal rates for Zurich city (single, 2024)
  cantonalBrackets: [
    { upTo:   6_100, rate: 0.000 },
    { upTo:  11_000, rate: 0.020 },
    { upTo:  16_000, rate: 0.030 },
    { upTo:  24_000, rate: 0.060 },
    { upTo:  36_000, rate: 0.090 },
    { upTo:  51_000, rate: 0.110 },
    { upTo:  69_000, rate: 0.130 },
    { upTo:  90_000, rate: 0.145 },
    { upTo: 127_000, rate: 0.160 },
    { upTo: 166_000, rate: 0.165 },
    { upTo: Infinity, rate: 0.170 },
  ] as TaxBracket[],
  ahvIvEo: 0.0530,                          // no ceiling (AHV 8.7% split 50/50)
  alv: { rate: 0.0110, ceiling: 148_200 },  // ALV unemployment
  alvSolidarity: { rate: 0.0050, from: 148_200, to: 315_000 }, // solidarity ALV
  medianGrossAnnual: 98_000,   // BFS Lohnstrukturerhebung 2022
  medianSource: "BFS (Swiss FSO) 2022",
};

function calculateSwissNetSalary(grossAnnual: number): SalaryBreakdown {
  const p = swissTaxParams;
  const ahv = grossAnnual * p.ahvIvEo;
  const alvBase = Math.min(grossAnnual, p.alv.ceiling) * p.alv.rate;
  const alvSol = Math.max(0, Math.min(grossAnnual, p.alvSolidarity.to) - p.alvSolidarity.from) * p.alvSolidarity.rate;
  const totalSocial = ahv + alvBase + alvSol;

  const taxableIncome = Math.max(0, grossAnnual - totalSocial);
  const federalTax   = applyBrackets(taxableIncome, p.federalBrackets);
  const cantonalTax  = applyBrackets(taxableIncome, p.cantonalBrackets);
  const totalIncomeTax = federalTax + cantonalTax;

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "AHV/IV/EO contribution", amount: round(ahv), description: `${pct(p.ahvIvEo)} (no ceiling for AHV)` },
    { label: "ALV unemployment", amount: round(alvBase), description: `${pct(p.alv.rate)} up to CHF ${p.alv.ceiling.toLocaleString()}` },
  ];
  if (alvSol > 0) bd.push({ label: "ALV solidarity", amount: round(alvSol), description: `${pct(p.alvSolidarity.rate)} on CHF ${p.alvSolidarity.from.toLocaleString()}–${p.alvSolidarity.to.toLocaleString()}` });
  bd.push({ label: "Federal income tax (DBSt)", amount: round(federalTax), description: `Progressive, based on ${round(taxableIncome).toLocaleString()} CHF taxable income` });
  bd.push({ label: "Cantonal + municipal tax (Zurich)", amount: round(cantonalTax), description: "Approximate Zurich city rate — other cantons differ significantly" });

  return build(grossAnnual, round(taxableIncome), round(totalIncomeTax), round(totalSocial), bd,
    "Indicative estimate for Zurich canton/city — 2024 tariff. BVG (2nd-pillar pension) is employer-defined and " +
    "not included. Other cantons (Geneva, Zug, Basel) differ substantially. Church tax not included. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 11. SWEDEN
// Source: spreadsheet + Skatteverket 2025
// Currency: SEK. All inputs and outputs in SEK.
// Employee social contributions: NONE — all paid by employer (arbetsgivaravgift 31.42%).
// Municipal tax (kommunalskatt): 32% average (actual varies 29–35% by municipality).
// State tax (statlig inkomstskatt): 20% above SEK 643,400 (2025 threshold).
// Grundavdrag (basic deduction): approximated at SEK 50,000 for working-age incomes.
// Jobbskatteavdrag (employment tax credit): reduces municipal tax by ~10–15%.
// Simplification: exact grundavdrag taper and full jobbskatteavdrag formula not modelled.
// ═══════════════════════════════════════════════════════════════════════════

const swedishTaxParams = {
  year: 2026,
  currency: "SEK",
  municipalRate: 0.3200,         // 32% average — actual varies by municipality
  stateRate: 0.2000,             // state tax on income above threshold
  stateThreshold: 643_400,       // SEK — 2025 value; 2026 indexed
  grundavdragApprox: 50_000,     // SEK — simplified flat approximation for working-age
  // Jobbskatteavdrag: approx. 10.65% of (gross – 0.91 × grundavdrag), capped at SEK 50 000
  jobTaxCreditRate: 0.1065,
  jobTaxCreditCap: 50_000,
  medianGrossAnnual: 480_000,    // SCB 2023 estimate
  medianSource: "SCB 2023",
};

function calculateSwedishNetSalary(grossAnnual: number): SalaryBreakdown {
  const p = swedishTaxParams;
  const grundavdrag = p.grundavdragApprox;
  const taxableIncome = Math.max(0, grossAnnual - grundavdrag);

  const municipalTax = taxableIncome * p.municipalRate;
  const stateTax = Math.max(0, grossAnnual - p.stateThreshold) * p.stateRate;

  // Jobbskatteavdrag (employment deduction credit)
  const jobCreditBase = Math.max(0, grossAnnual - 0.91 * grundavdrag);
  const jobTaxCredit = Math.min(jobCreditBase * p.jobTaxCreditRate, p.jobTaxCreditCap);
  const totalIncomeTax = Math.max(0, municipalTax + stateTax - jobTaxCredit);

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "Basic deduction (grundavdrag)", amount: -round(grundavdrag), description: "Approximated at SEK 50,000 — actual amount tapers with income" },
    { label: "Municipal tax (kommunalskatt)", amount: round(municipalTax), description: `${pct(p.municipalRate)} average — varies 29–35% by municipality` },
    { label: "State tax (statlig)", amount: round(stateTax), description: `20% on income above SEK ${p.stateThreshold.toLocaleString()}` },
    { label: "Employment tax credit (jobbskatteavdrag)", amount: -round(jobTaxCredit), description: "Estimated credit reducing municipal tax" },
  ];

  return build(grossAnnual, round(taxableIncome), round(totalIncomeTax), 0, bd,
    "Indicative estimate — 2025/2026 Swedish income tax. Municipal rate is national average (32%); " +
    "your municipality may differ. Jobbskatteavdrag and grundavdrag use simplified approximations. " +
    "Employer social contributions (31.42%) not deducted from employee net. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ═══════════════════════════════════════════════════════════════════════════
// 12. DENMARK
// Source: spreadsheet + Skattestyrelsen 2025
// Currency: DKK. All inputs and outputs in DKK.
// AM-bidrag (arbejdsmarkedsbidrag): 8% of gross — treated as pre-income-tax levy.
// Personal allowance (personfradrag): DKK 49,400 (2025).
// Employment deduction (beskæftigelsesfradrag): 10.65%, capped at DKK 44,800.
// Municipal tax (kommuneskat): 25% average (varies 22–28% by municipality).
// Bottom state tax (bundskat): 12.18%.
// Top state tax (topskat): 15% on personal income above DKK 588,900.
// Simplification: church tax (~0.7%) not included. No distinction between
//   kommuneskat base and bundskat base — employment deduction applied uniformly.
// ═══════════════════════════════════════════════════════════════════════════

const danishTaxParams = {
  year: 2026,
  currency: "DKK",
  amBidragRate: 0.080,           // 8% labor market contribution
  personfradrag: 49_400,         // personal allowance
  beskfradragRate: 0.1065,       // employment deduction rate
  beskfradragCap: 44_800,        // max employment deduction
  municipalRate: 0.2500,         // average kommuneskat
  bundSkatRate: 0.1218,          // bottom state tax
  topSkatRate: 0.1500,           // 15% top state tax
  topSkatThreshold: 588_900,     // DKK — before AM-bidrag subtraction
  medianGrossAnnual: 560_000,    // Danmarks Statistik 2023 estimate
  medianSource: "Danmarks Statistik 2023",
};

function calculateDanishNetSalary(grossAnnual: number): SalaryBreakdown {
  const p = danishTaxParams;
  const amBidrag = grossAnnual * p.amBidragRate;
  const personalIncome = grossAnnual - amBidrag; // "personlig indkomst"

  const beskfradrag = Math.min(personalIncome * p.beskfradragRate, p.beskfradragCap);
  // Municipal + bottom state tax base
  const taxBase = Math.max(0, personalIncome - p.personfradrag - beskfradrag);
  const municipalTax = taxBase * p.municipalRate;
  const bottomStateTax = taxBase * p.bundSkatRate;
  // Top state tax on personal income above threshold
  const topStateTax = Math.max(0, personalIncome - p.topSkatThreshold) * p.topSkatRate;
  const totalIncomeTax = municipalTax + bottomStateTax + topStateTax;

  const bd: SalaryBreakdown["breakdown"] = [
    { label: "AM-bidrag (labour market)", amount: round(amBidrag), description: `${pct(p.amBidragRate)} arbejdsmarkedsbidrag` },
    { label: "Employment deduction", amount: -round(beskfradrag), description: `${pct(p.beskfradragRate)} beskæftigelsesfradrag, capped at DKK ${p.beskfradragCap.toLocaleString()}` },
    { label: "Municipal tax (avg)", amount: round(municipalTax), description: `${pct(p.municipalRate)} kommuneskat — national average; varies 22–28%` },
    { label: "Bottom state tax (bundskat)", amount: round(bottomStateTax), description: `${pct(p.bundSkatRate)} on taxable income above personal allowance` },
    { label: "Top state tax (topskat)", amount: round(topStateTax), description: `15% on personal income above DKK ${p.topSkatThreshold.toLocaleString()}` },
  ];

  return build(grossAnnual, round(taxBase), round(totalIncomeTax), 0, bd,
    "Indicative estimate — 2025/2026 Danish income tax. Municipal rate is national average (25%); " +
    "actual commune varies 22–28%. Church tax (~0.7%) not included. Top tax applied on personal income " +
    "above DKK 588,900 before AM-bidrag. Not tax advice.",
    p.medianGrossAnnual, p.medianSource);
}

// ── Build helper ──────────────────────────────────────────────────────────────

function build(
  grossAnnual: number,
  taxableIncome: number,
  incomeTax: number,
  socialContributions: number,
  breakdown: SalaryBreakdown["breakdown"],
  disclaimer: string,
  medianGrossAnnual: number,
  medianSource: string,
): SalaryBreakdown {
  const totalDeductions = incomeTax + socialContributions;
  const netAnnual = grossAnnual - totalDeductions;
  return {
    grossAnnual,
    grossMonthly: round(grossAnnual / 12),
    taxableIncome,
    incomeTax: round(incomeTax),
    socialContributions: round(socialContributions),
    totalDeductions: round(totalDeductions),
    netAnnual: round(netAnnual),
    netMonthly: round(netAnnual / 12),
    effectiveTaxRate: grossAnnual > 0
      ? Math.round((totalDeductions / grossAnnual) * 1000) / 10
      : 0,
    breakdown,
    disclaimer,
    medianGrossAnnual,
    medianSource,
  };
}

// ── Public dispatcher ─────────────────────────────────────────────────────────

export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const g = input.grossAnnual;
  if (!g || g <= 0) {
    return build(0, 0, 0, 0, [], "Enter a positive gross salary.", 0, "");
  }
  switch (input.country) {
    case "nl": return calculateDutchNetSalary(g, input.thirtyPercentRuling ?? false);
    case "fr": return calculateFrenchNetSalary(g, input.cadreStatus ?? false);
    case "de": return calculateGermanNetSalary(g);
    case "hu": return calculateHungarianNetSalary(g);
    case "be": return calculateBelgianNetSalary(g);
    case "at": return calculateAustrianNetSalary(g);
    case "es": return calculateSpanishNetSalary(g);
    case "pt": return calculatePortugueseNetSalary(g);
    case "it": return calculateItalianNetSalary(g);
    case "ch": return calculateSwissNetSalary(g);
    case "se": return calculateSwedishNetSalary(g);
    case "dk": return calculateDanishNetSalary(g);
  }
}

// ── Exchange rates (non-EUR countries) ───────────────────────────────────────
// Update rate + lastUpdated monthly. Source: ECB reference rates.

export const hufEurRate  = { rate: 395,   lastUpdated: "Apr 2026" }; // 1 EUR = 395 HUF
export const chfEurRate  = { rate: 0.93,  lastUpdated: "Apr 2026" }; // 1 EUR = 0.93 CHF
export const sekEurRate  = { rate: 11.45, lastUpdated: "Apr 2026" }; // 1 EUR = 11.45 SEK
export const dkkEurRate  = { rate: 7.46,  lastUpdated: "Apr 2026" }; // 1 EUR = 7.46 DKK

/** Countries whose native currency is not EUR */
export const NON_EUR_COUNTRIES: Record<string, { currency: string; rate: number; lastUpdated: string }> = {
  hu: { currency: "HUF", ...hufEurRate },
  ch: { currency: "CHF", ...chfEurRate },
  se: { currency: "SEK", ...sekEurRate },
  dk: { currency: "DKK", ...dkkEurRate },
};

export const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
