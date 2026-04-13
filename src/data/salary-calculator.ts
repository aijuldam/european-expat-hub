export interface SalaryInput {
  grossAnnual: number;
  country: "nl" | "fr" | "hu";
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
  };
}

export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  if (input.country === "nl") {
    return calculateDutchNetSalary(input.grossAnnual, input.thirtyPercentRuling ?? false);
  }
  if (input.country === "hu") {
    return calculateHungarianNetSalary(input.grossAnnual);
  }
  return calculateFrenchNetSalary(input.grossAnnual, input.cadreStatus ?? false);
}

export const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
