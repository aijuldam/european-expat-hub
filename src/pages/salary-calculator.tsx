import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { calculateSalary, NON_EUR_COUNTRIES, type CountryCode, type SalaryBreakdown } from "@/data/salary-calculator";
import { Calculator, AlertTriangle, Info, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Default gross inputs per country (native currency)
const DEFAULT_GROSS: Record<CountryCode, string> = {
  nl: "50000",
  fr: "50000",
  de: "50000",
  hu: "12000000",   // ~30k EUR/year in HUF
  be: "50000",
  at: "50000",
  es: "40000",
  pt: "35000",
  it: "40000",
  ch: "120000",     // CHF — Zurich reference
  se: "600000",     // SEK — Stockholm reference
  dk: "550000",     // DKK — Copenhagen reference
  ie: "55000",      // EUR — Dublin tech salary
  lu: "70000",      // EUR — Luxembourg finance salary
  no: "700000",     // NOK — Oslo reference
  pl: "100000",     // PLN — Warsaw tech salary
  cz: "700000",     // CZK — Prague tech salary
};

export default function SalaryCalculator() {
  const [country, setCountry] = useState<CountryCode>("nl");
  const [grossInput, setGrossInput] = useState<string>(DEFAULT_GROSS.nl);
  const [thirtyPercentRuling, setThirtyPercentRuling] = useState(false);
  const [cadreStatus, setCadreStatus] = useState(false);
  const [showInEur, setShowInEur] = useState(false);   // Hungary only: toggle EUR display

  // Read ?country= URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("country") as CountryCode | null;
    if (c && c in DEFAULT_GROSS) {
      setCountry(c);
      setGrossInput(DEFAULT_GROSS[c]);
    }
  }, []);

  // Reset gross input and EUR toggle when country changes
  const handleCountryChange = (v: string) => {
    const c = v as CountryCode;
    setCountry(c);
    setGrossInput(DEFAULT_GROSS[c]);
    setShowInEur(false);
  };

  const nonEurInfo = NON_EUR_COUNTRIES[country] ?? null;   // null for EUR countries
  const isNonEur = nonEurInfo !== null;
  const localCurrency = nonEurInfo?.currency ?? "EUR";
  const grossAnnual = parseInt(grossInput) || 0;

  const result: SalaryBreakdown | null = useMemo(() => {
    if (grossAnnual <= 0) return null;
    return calculateSalary({
      grossAnnual,
      country,
      thirtyPercentRuling: country === "nl" ? thirtyPercentRuling : undefined,
      cadreStatus: country === "fr" ? cadreStatus : undefined,
    });
  }, [grossAnnual, country, thirtyPercentRuling, cadreStatus]);

  // Currency formatter — all raw values are in the country's native currency.
  // showInEur converts non-EUR amounts → EUR for display.
  function formatAmt(amount: number): string {
    const abs = Math.abs(amount);
    if (isNonEur && showInEur) {
      return `${Math.round(abs / nonEurInfo!.rate).toLocaleString()} EUR`;
    }
    return `${abs.toLocaleString()} ${localCurrency}`;
  }

  return (
    <Layout>
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-6 h-6 text-accent" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground" data-testid="text-salary-title">
              Salary Calculator
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Estimate your gross-to-net income by country. Select your country, enter your gross annual salary, and see a detailed breakdown.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Country selector */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Country</Label>
                  <Select value={country} onValueChange={handleCountryChange}>
                    <SelectTrigger data-testid="select-country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="at">Austria</SelectItem>
                      <SelectItem value="be">Belgium</SelectItem>
                      <SelectItem value="cz">Czech Republic (CZK)</SelectItem>
                      <SelectItem value="dk">Denmark (DKK)</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="hu">Hungary (HUF)</SelectItem>
                      <SelectItem value="ie">Ireland</SelectItem>
                      <SelectItem value="it">Italy</SelectItem>
                      <SelectItem value="lu">Luxembourg</SelectItem>
                      <SelectItem value="nl">Netherlands</SelectItem>
                      <SelectItem value="no">Norway (NOK)</SelectItem>
                      <SelectItem value="pl">Poland (PLN)</SelectItem>
                      <SelectItem value="pt">Portugal</SelectItem>
                      <SelectItem value="es">Spain</SelectItem>
                      <SelectItem value="se">Sweden (SEK)</SelectItem>
                      <SelectItem value="ch">Switzerland (CHF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gross salary input — label and placeholder adapt to country */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Gross Annual Salary ({localCurrency})
                  </Label>
                  <Input
                    type="number"
                    value={grossInput}
                    onChange={(e) => setGrossInput(e.target.value)}
                    placeholder={`e.g. ${DEFAULT_GROSS[country]}`}
                    min={0}
                    data-testid="input-gross"
                  />
                </div>

                {/* NL: 30% ruling toggle */}
                {country === "nl" && (
                  <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                    <div>
                      <Label className="text-sm font-medium">30% Ruling</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tax benefit for qualifying expat knowledge workers
                      </p>
                    </div>
                    <Switch
                      checked={thirtyPercentRuling}
                      onCheckedChange={setThirtyPercentRuling}
                      data-testid="switch-30percent"
                    />
                  </div>
                )}

                {/* FR: cadre status toggle */}
                {country === "fr" && (
                  <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                    <div>
                      <Label className="text-sm font-medium">Cadre Status</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Cadre employees have higher social contributions but better benefits
                      </p>
                    </div>
                    <Switch
                      checked={cadreStatus}
                      onCheckedChange={setCadreStatus}
                      data-testid="switch-cadre"
                    />
                  </div>
                )}

                {/* Non-EUR countries: currency display toggle */}
                {isNonEur && (
                  <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                    <div>
                      <Label className="text-sm font-medium">Display currency</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Results are calculated in {localCurrency} — switch to see EUR equivalents
                      </p>
                    </div>
                    <div className="flex rounded-md border border-input overflow-hidden text-sm font-medium">
                      <button
                        onClick={() => setShowInEur(false)}
                        className={`px-3 py-1.5 transition-colors ${!showInEur ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted/50"}`}
                        data-testid="toggle-local"
                      >
                        {localCurrency}
                      </button>
                      <button
                        onClick={() => setShowInEur(true)}
                        className={`px-3 py-1.5 transition-colors ${showInEur ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted/50"}`}
                        data-testid="toggle-eur"
                      >
                        EUR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {result && (
            <>
              {/* Summary cards */}
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="p-6 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Net Annual</div>
                    <div className="text-3xl font-bold text-accent" data-testid="text-net-annual">
                      {isNonEur && showInEur
                        ? Math.round(result.netAnnual / nonEurInfo!.rate).toLocaleString()
                        : result.netAnnual.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isNonEur && showInEur ? "EUR" : localCurrency}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Net Monthly</div>
                    <div className="text-3xl font-bold text-foreground" data-testid="text-net-monthly">
                      {isNonEur && showInEur
                        ? Math.round(result.netMonthly / nonEurInfo!.rate).toLocaleString()
                        : result.netMonthly.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isNonEur && showInEur ? "EUR" : localCurrency}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Effective Tax Rate</div>
                    <div className="text-3xl font-bold text-foreground" data-testid="text-tax-rate">
                      {result.effectiveTaxRate}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Median income benchmark */}
              {(() => {
                const median = result.medianGrossAnnual;
                const pct = Math.round(((grossAnnual - median) / median) * 100);
                const absPct = Math.abs(pct);
                const isAbove = pct > 0;
                const isAt = absPct <= 3; // within ±3% → "around median"

                // Display values — respect non-EUR toggle
                const fmtMedian = isNonEur && showInEur
                  ? `${Math.round(median / nonEurInfo!.rate).toLocaleString()} EUR`
                  : `${median.toLocaleString()} ${localCurrency}`;

                const Icon = isAt ? Minus : isAbove ? TrendingUp : TrendingDown;
                const colorClass = isAt
                  ? "text-muted-foreground"
                  : isAbove
                  ? "text-emerald-600"
                  : "text-amber-600";
                const bgClass = isAt
                  ? "bg-muted/40"
                  : isAbove
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-amber-50 border-amber-200";

                const label = isAt
                  ? "Around the country median"
                  : isAbove
                  ? `${absPct}% above the country median`
                  : `${absPct}% below the country median`;

                // Progress bar: median anchored at 50%; salary fills proportionally
                // Clamp displayed bar between 10% and 90% of width
                const barPct = Math.min(90, Math.max(10, 50 + (pct / 2)));

                return (
                  <div className={`rounded-lg border px-4 py-3 mb-4 ${bgClass}`} data-testid="benchmark-block">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Income benchmark
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Source: {result.medianSource}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${colorClass}`} />
                      <span className={`text-sm font-semibold ${colorClass}`}>{label}</span>
                    </div>
                    {/* Visual bar */}
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
                      {/* Median marker */}
                      <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10" style={{ left: "50%" }} />
                      {/* User salary fill */}
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all ${isAt ? "bg-muted-foreground/50" : isAbove ? "bg-emerald-500" : "bg-amber-500"}`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Your salary: <span className="font-medium text-foreground">{formatAmt(grossAnnual)}</span></span>
                      <span>Median: <span className="font-medium text-foreground">{fmtMedian}</span></span>
                    </div>
                  </div>
                );
              })()}

              {/* Exchange rate helper — non-EUR countries only */}
              {isNonEur && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8 px-1">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    Reference rate: 1 EUR = {nonEurInfo!.rate.toLocaleString()} {localCurrency}
                    &nbsp;·&nbsp;
                    Last updated: {nonEurInfo!.lastUpdated}
                    &nbsp;·&nbsp;
                    Approx. monthly reference rate
                  </span>
                </div>
              )}

              {/* Detailed breakdown */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Detailed Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Gross Annual Salary</span>
                      <span className="font-semibold text-foreground">
                        {formatAmt(result.grossAnnual)}
                      </span>
                    </div>
                    <Separator />
                    {result.breakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">{item.label}</span>
                          <p className="text-xs text-muted-foreground/70">{item.description}</p>
                        </div>
                        <span className={`font-medium ${item.amount < 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {item.amount < 0 ? "+" : "-"}{formatAmt(item.amount)}
                        </span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-foreground">Net Annual Salary</span>
                      <span className="text-accent text-lg">{formatAmt(result.netAnnual)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">{result.disclaimer}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
