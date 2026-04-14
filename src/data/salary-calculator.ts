export interface SalaryInput {
  grossAnnual: number;
  country: "nl" | "fr" | "hu" | "de";
  thirtyPercentRuling?: boolean;
  cadreStatus?: boolean;
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
  upTo: number;
  rate: number;
}

const dutchTaxParams = {
  year: 2024,
  brackets: [
    { upTo: 73031, rate: 0.3697 },
    { upTo: Infinity, rate: 0.495 },
  ] as TaxBracket[],
  generalTaxCredit: {
    maxCredit: 3362,
    phaseOutStart: 22661,
    phaseOutRate: 0.0658,
    minCredit: 0,
  },
  labourTaxCredit: {
    maxCredit: 5052,
    phaseOutStart: 37691,
    phaseOutRate: 0.0651,
    minCredit: 0,
  },
  thirtyPercentRulingExemption: 0.3,
  // Median gross annual wage — CBS Statline 2023 (full-time equivalent)
  medianGrossAnnual: 44000,
  medianSource: "CBS Statline 2023",
};

function calculateDutchNetSalary(
  grossAnnual: number,
  thirtyPercentRuling: boolean
): SalaryBreakdown {
  let taxableIncome = grossAnnual;
  let thirtyPercentBenefit = 0;

  if (thirtyPercentRuling) {
    thirtyPercentBenefit = grossAnnual * dutchTaxParams.thirtyPercentRulingExemption;
    taxableIncome = grossAnnual - thirtyPercentBenefit;
  }

  let incomeTax = 0;
  let remaining = taxableIncome;
  const breakdown: { label: string; amount: number; description: string }[] = [];

  for (const bracket of dutchTaxParams.brackets) {
    if (remaining <= 0) break;
    const taxableInBracket = Math.min(remaining, bracket.upTo - (bracket === dutchTaxParams.brackets[0] ? 0 : dutchTaxParams.brackets[0].upTo));
    const taxForBracket = taxableInBracket * bracket.rate;
    incomeTax += taxForBracket;
    remaining -= taxableInBracket;

    breakdown.push({
      label: `Tax bracket ${bracket.rate * 100}%`,
      amount: Math.round(taxForBracket),
      description: `${bracket.rate * 100}% on ${Math.round(taxableInBracket).toLocaleString()} EUR`,
    });
  }

  let generalCredit = dutchTaxParams.generalTaxCredit.maxCredit;
  if (taxableIncome > dutchTaxParams.generalTaxCredit.phaseOutStart) {
    const reduction =
      (taxableIncome - dutchTaxParams.generalTaxCredit.phaseOutStart) *
      dutchTaxParams.generalTaxCredit.phaseOutRate;
    generalCredit = Math.max(dutchTaxParams.generalTaxCredit.minCredit, generalCredit - reduction);
  }

  let labourCredit = dutchTaxParams.labourTaxCredit.maxCredit;
  if (taxableIncome > dutchTaxParams.labourTaxCredit.phaseOutStart) {
    const reduction =
      (taxableIncome - dutchTaxParams.labourTaxCredit.phaseOutStart) *
      dutchTaxParams.labourTaxCredit.phaseOutRate;
    labourCredit = Math.max(dutchTaxParams.labourTaxCredit.minCredit, labourCredit - reduction);
  }

  const totalCredits = generalCredit + labourCredit;
  incomeTax = Math.max(0, incomeTax - totalCredits);

  breakdown.push({
    label: "General tax credit",
    amount: -Math.round(generalCredit),
    description: "Standard tax credit for all taxpayers",
  });

  breakdown.push({
    label: "Labour tax credit",
    amount: -Math.round(labourCredit),
    description: "Credit for employed individuals",
  });

  if (thirtyPercentRuling) {
    breakdown.unshift({
      label: "30% ruling exemption",
      amount: -Math.round(thirtyPercentBenefit),
      description: `${Math.round(thirtyPercentBenefit).toLocaleString()} EUR exempted from taxable income`,
    });
  }

  const totalDeductions = incomeTax;
  const netAnnual = grossAnnual - totalDeductions;

  return {
    grossAnnual,
    grossMonthly: Math.round(grossAnnual / 12),
    taxableIncome: Math.round(taxableIncome),
    incomeTax: Math.round(incomeTax),
    socialContributions: 0,
    totalDeductions: Math.round(totalDeductions),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netAnnual / 12),
    effectiveTaxRate: Math.round((totalDeductions / grossAnnual) * 100 * 10) / 10,
    breakdown,
    disclaimer:
      "This is an indicative estimate based on 2024 Dutch tax parameters. Social security contributions are included in the tax brackets. Actual results may vary based on personal circumstances. This is not tax or legal advice.",
    medianGrossAnnual: dutchTaxParams.medianGrossAnnual,
    medianSource: dutchTaxParams.medianSource,
  };
}

const frenchTaxParams = {
  year: 2024,
  socialContributionRate: {
    nonCadre: 0.225,
    cadre: 0.25,
  },
  csg: 0.098,
  crds: 0.005,
  incomeTaxBrackets: [
    { upTo: 11294, rate: 0 },
    { upTo: 28797, rate: 0.11 },
    { upTo: 82341, rate: 0.30 },
    { upTo: 177106, rate: 0.41 },
    { upTo: Infinity, rate: 0.45 },
  ] as TaxBracket[],
  // Median gross annual wage — INSEE 2022 (salaire médian brut, full-time)
  medianGrossAnnual: 26512,
  medianSource: "INSEE 2022",
};

function calculateFrenchNetSalary(
  grossAnnual: number,
  cadreStatus: boolean
): SalaryBreakdown {
  const socialRate = cadreStatus
    ? frenchTaxParams.socialContributionRate.cadre
    : frenchTaxParams.socialContributionRate.nonCadre;

  const socialContributions = grossAnnual * socialRate;
  const csgCrdsBase = grossAnnual * 0.9825;
  const csgDeductible = csgCrdsBase * 0.068;
  const csgNonDeductible = csgCrdsBase * 0.024;
  const crds = csgCrdsBase * frenchTaxParams.crds;
  const totalSocial = socialContributions + csgDeductible + csgNonDeductible + crds;

  const netSocialSalary = grossAnnual - totalSocial;
  const taxableIncome = netSocialSalary + csgNonDeductible + crds;

  let incomeTax = 0;
  let prevLimit = 0;
  const breakdown: { label: string; amount: number; description: string }[] = [];

  breakdown.push({
    label: "Social contributions",
    amount: Math.round(socialContributions),
    description: `${(socialRate * 100).toFixed(1)}% social charges (${cadreStatus ? "cadre" : "non-cadre"})`,
  });

  breakdown.push({
    label: "CSG (deductible)",
    amount: Math.round(csgDeductible),
    description: "Contribution sociale generalisee (deductible portion)",
  });

  breakdown.push({
    label: "CSG (non-deductible) + CRDS",
    amount: Math.round(csgNonDeductible + crds),
    description: "Non-deductible CSG and CRDS contributions",
  });

  for (const bracket of frenchTaxParams.incomeTaxBrackets) {
    if (taxableIncome <= prevLimit) break;
    const taxableInBracket = Math.min(taxableIncome, bracket.upTo) - prevLimit;
    if (taxableInBracket <= 0) {
      prevLimit = bracket.upTo;
      continue;
    }
    const taxForBracket = taxableInBracket * bracket.rate;
    incomeTax += taxForBracket;

    if (bracket.rate > 0) {
      breakdown.push({
        label: `Income tax ${bracket.rate * 100}%`,
        amount: Math.round(taxForBracket),
        description: `${bracket.rate * 100}% on ${Math.round(taxableInBracket).toLocaleString()} EUR`,
      });
    }

    prevLimit = bracket.upTo;
  }

  const totalDeductions = totalSocial + incomeTax;
  const netAnnual = grossAnnual - totalDeductions;

  return {
    grossAnnual,
    grossMonthly: Math.round(grossAnnual / 12),
    taxableIncome: Math.round(taxableIncome),
    incomeTax: Math.round(incomeTax),
    socialContributions: Math.round(totalSocial),
    totalDeductions: Math.round(totalDeductions),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netAnnual / 12),
    effectiveTaxRate: Math.round((totalDeductions / grossAnnual) * 100 * 10) / 10,
    breakdown,
    disclaimer:
      "This is an indicative estimate based on 2024 French tax and social contribution parameters. Actual results may vary based on personal circumstances, family quotient, and specific employment terms. This is not tax or legal advice.",
    medianGrossAnnual: frenchTaxParams.medianGrossAnnual,
    medianSource: frenchTaxParams.medianSource,
  };
}

// ── Hungary ────────────────────────────────────────────────────────────────
// Source: 2024 Hungarian tax law (Act CXVII of 1995 as amended)
// Salaries in Hungary are denominated in HUF; inputs here are treated as
// EUR-equivalent for cross-country comparison purposes.

const hungarianTaxParams = {
  year: 2024,
  incomeTaxRate: 0.15,          // SZJA — flat personal income tax
  socialContributions: {
    pension: 0.10,              // Nyugdíjjárulék
    health: 0.07,               // Egészségbiztosítási járulék (7%)
    labourMarket: 0.015,        // Munkaerőpiaci járulék
  },
  // Employer-side (informational, not deducted from net shown):
  employerSocialTax: 0.13,      // Szociális hozzájárulási adó (szocho)
  // Median gross annual wage — KSH (Hungarian Central Statistical Office) 2023
  medianGrossAnnual: 4_320_000, // ~360 000 HUF/month median gross
  medianSource: "KSH 2023",
};

function calculateHungarianNetSalary(grossAnnual: number): SalaryBreakdown {
  const { incomeTaxRate, socialContributions } = hungarianTaxParams;

  const incomeTax = grossAnnual * incomeTaxRate;
  const pension = grossAnnual * socialContributions.pension;
  const health = grossAnnual * socialContributions.health;
  const labourMarket = grossAnnual * socialContributions.labourMarket;
  const totalSocial = pension + health + labourMarket;
  const totalDeductions = incomeTax + totalSocial;
  const netAnnual = grossAnnual - totalDeductions;

  const breakdown: { label: string; amount: number; description: string }[] = [
    {
      label: "Income tax (SZJA)",
      amount: Math.round(incomeTax),
      description: `Flat ${incomeTaxRate * 100}% személyi jövedelemadó`,
    },
    {
      label: "Pension contribution",
      amount: Math.round(pension),
      description: `${+(socialContributions.pension * 100).toPrecision(4)}% nyugdíjjárulék`,
    },
    {
      label: "Health insurance",
      amount: Math.round(health),
      description: `${+(socialContributions.health * 100).toPrecision(4)}% egészségbiztosítási járulék`,
    },
    {
      label: "Labour market contribution",
      amount: Math.round(labourMarket),
      description: `${+(socialContributions.labourMarket * 100).toPrecision(4)}% munkaerőpiaci járulék`,
    },
  ];

  return {
    grossAnnual,
    grossMonthly: Math.round(grossAnnual / 12),
    taxableIncome: grossAnnual,
    incomeTax: Math.round(incomeTax),
    socialContributions: Math.round(totalSocial),
    totalDeductions: Math.round(totalDeductions),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netAnnual / 12),
    effectiveTaxRate:
      Math.round((totalDeductions / grossAnnual) * 100 * 10) / 10,
    breakdown,
    disclaimer:
      "This is an indicative estimate based on 2024 Hungarian tax parameters (15% flat SZJA + 18.5% employee social contributions). Hungarian salaries are typically denominated in HUF; EUR-equivalent input is used here for cross-country comparison. Actual results may vary based on personal circumstances, family status, and age-based exemptions (e.g. under-25 income tax relief). Employer social tax (szocho, 13%) is not included in the net figure shown. This is not tax or legal advice.",
    medianGrossAnnual: hungarianTaxParams.medianGrossAnnual,
    medianSource: hungarianTaxParams.medianSource,
  };
}

// ── Germany ────────────────────────────────────────────────────────────────
// Source: Einkommensteuergesetz (EStG) §32a 2024 — Grundtabelle.
// Employee social contributions per SGB V / SGB VI / SGB III / SGB XI 2024.

const germanTaxParams = {
  year: 2024,
  // Personal allowances (deducted from gross before income-tax brackets apply)
  grundfreibetrag: 11_604,         // Basic personal allowance
  arbeitnehmerPauschbetrag: 1_230, // Standard work-expense flat-rate deduction
  // Income-tax zone boundaries (zvE = taxable income after allowances)
  zone2End: 17_005,
  zone3End: 66_760,
  zone4End: 277_826,
  // Solidaritätszuschlag — only levied when income tax exceeds the threshold
  soliThreshold: 18_130,
  soliRate: 0.055,
  // Social contributions — employee share only; all subject to assessment ceilings
  socialContributions: {
    // GKV: 7.3% statutory + avg ~1.6% Zusatzbeitrag → employee pays half = 8.15%
    health:       { rate: 0.0815, ceiling: 62_100 },
    // Pflegeversicherung: 1.7% employee (assumes ≥1 child; childless +0.6%)
    longTermCare: { rate: 0.0170, ceiling: 62_100 },
    // Rentenversicherung: 18.6% → 9.3% employee
    pension:      { rate: 0.0930, ceiling: 90_600 },
    // Arbeitslosenversicherung: 2.6% → 1.3% employee
    unemployment: { rate: 0.0130, ceiling: 90_600 },
  },
  // Median gross annual wage — Destatis 2023 (Verdienststrukturerhebung)
  medianGrossAnnual: 43_750,
  medianSource: "Destatis 2023",
};

/**
 * Compute Einkommensteuer using the official §32a 2024 zone formula.
 * Input: zvE = taxable income (gross − social contributions − allowances).
 */
function computeGermanIncomeTax(zvE: number): number {
  const { grundfreibetrag, zone2End, zone3End, zone4End } = germanTaxParams;

  if (zvE <= grundfreibetrag) return 0;

  if (zvE <= zone2End) {
    // Zone 2: progressive 14% → 24%
    const y = (zvE - grundfreibetrag) / 10_000;
    return Math.round((979.18 * y + 1_400) * y);
  }

  if (zvE <= zone3End) {
    // Zone 3: progressive 24% → 42%
    const z = (zvE - zone2End) / 10_000;
    return Math.round((192.59 * z + 2_397) * z + 1_025.38);
  }

  if (zvE <= zone4End) {
    // Zone 4: flat 42%
    return Math.round(0.42 * zvE - 9_972.98);
  }

  // Zone 5: flat 45% (Reichensteuer)
  return Math.round(0.45 * zvE - 18_307.73);
}

function calculateGermanNetSalary(grossAnnual: number): SalaryBreakdown {
  const sc = germanTaxParams.socialContributions;

  const healthBase       = Math.min(grossAnnual, sc.health.ceiling);
  const careBase         = Math.min(grossAnnual, sc.longTermCare.ceiling);
  const pensionBase      = Math.min(grossAnnual, sc.pension.ceiling);
  const unemploymentBase = Math.min(grossAnnual, sc.unemployment.ceiling);

  const healthContrib       = healthBase       * sc.health.rate;
  const longTermCareContrib = careBase         * sc.longTermCare.rate;
  const pensionContrib      = pensionBase      * sc.pension.rate;
  const unemploymentContrib = unemploymentBase * sc.unemployment.rate;
  const totalSocial = healthContrib + longTermCareContrib + pensionContrib + unemploymentContrib;

  // Taxable income = gross − social contributions − Arbeitnehmer-Pauschbetrag
  const zvE = Math.max(
    0,
    grossAnnual - totalSocial - germanTaxParams.arbeitnehmerPauschbetrag,
  );

  const incomeTax = computeGermanIncomeTax(zvE);

  // Solidaritätszuschlag (only if income tax exceeds the 2024 free threshold)
  const soli =
    incomeTax > germanTaxParams.soliThreshold
      ? Math.round(incomeTax * germanTaxParams.soliRate)
      : 0;

  const totalDeductions = totalSocial + incomeTax + soli;
  const netAnnual = grossAnnual - totalDeductions;

  const breakdown: { label: string; amount: number; description: string }[] = [
    {
      label: "Health insurance (GKV)",
      amount: Math.round(healthContrib),
      description: `8.15% employee share (capped at ${sc.health.ceiling.toLocaleString()} EUR/yr)`,
    },
    {
      label: "Long-term care insurance",
      amount: Math.round(longTermCareContrib),
      description: `1.7% Pflegeversicherung employee share (childless: +0.6%)`,
    },
    {
      label: "Pension insurance",
      amount: Math.round(pensionContrib),
      description: `9.3% Rentenversicherung employee share (capped at ${sc.pension.ceiling.toLocaleString()} EUR/yr)`,
    },
    {
      label: "Unemployment insurance",
      amount: Math.round(unemploymentContrib),
      description: `1.3% Arbeitslosenversicherung employee share`,
    },
    {
      label: "Income tax (Einkommensteuer)",
      amount: incomeTax,
      description: `2024 progressive rate on ${Math.round(zvE).toLocaleString()} EUR taxable income`,
    },
  ];

  if (soli > 0) {
    breakdown.push({
      label: "Solidarity surcharge (Soli)",
      amount: soli,
      description: `5.5% on income tax above ${germanTaxParams.soliThreshold.toLocaleString()} EUR threshold`,
    });
  }

  return {
    grossAnnual,
    grossMonthly: Math.round(grossAnnual / 12),
    taxableIncome: Math.round(zvE),
    incomeTax,
    socialContributions: Math.round(totalSocial),
    totalDeductions: Math.round(totalDeductions),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netAnnual / 12),
    effectiveTaxRate: Math.round((totalDeductions / grossAnnual) * 100 * 10) / 10,
    breakdown,
    disclaimer:
      "This is an indicative estimate based on 2024 German tax parameters (EStG §32a Grundtabelle). Social contributions apply the 2024 statutory rates and assessment ceilings. Taxable income is approximated as gross salary minus employee social contributions and the standard Arbeitnehmer-Pauschbetrag (€1,230). Church tax, capital gains, child allowances, and other individual deductions are not included. Childless employees pay an additional 0.6% long-term care surcharge. This is not tax or legal advice.",
    medianGrossAnnual: germanTaxParams.medianGrossAnnual,
    medianSource: germanTaxParams.medianSource,
  };
}

export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  if (input.country === "nl") {
    return calculateDutchNetSalary(input.grossAnnual, input.thirtyPercentRuling ?? false);
  }
  if (input.country === "hu") {
    return calculateHungarianNetSalary(input.grossAnnual);
  }
  if (input.country === "de") {
    return calculateGermanNetSalary(input.grossAnnual);
  }
  return calculateFrenchNetSalary(input.grossAnnual, input.cadreStatus ?? false);
}

// ── Exchange rate config ───────────────────────────────────────────────────
// Update `rate` and `lastUpdated` once a month.
// Source: ECB / Magyar Nemzeti Bank (MNB) reference rates.
export const hufEurRate = {
  rate: 395,              // 1 EUR = 395 HUF
  lastUpdated: "1 Apr 2025",
};

export const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
