import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AppCombobox, type ComboboxOption } from "@/components/ui/app-combobox";
import { Separator } from "@/components/ui/separator";
import { calculateSalary, NON_EUR_COUNTRIES, type CountryCode, type SalaryBreakdown } from "@/data/salary-calculator";
import { Calculator, AlertTriangle, Info, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";

// ── Country list ──────────────────────────────────────────────────────────────
// sublabel lets users search by currency code (e.g. "HUF" → Hungary)
const COUNTRY_OPTIONS: ComboboxOption[] = [
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "cz", label: "Czech Republic", sublabel: "CZK" },
  { value: "dk", label: "Denmark",        sublabel: "DKK" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "hu", label: "Hungary",        sublabel: "HUF" },
  { value: "ie", label: "Ireland" },
  { value: "it", label: "Italy" },
  { value: "lu", label: "Luxembourg" },
  { value: "nl", label: "Netherlands" },
  { value: "no", label: "Norway",         sublabel: "NOK" },
  { value: "pl", label: "Poland",         sublabel: "PLN" },
  { value: "pt", label: "Portugal" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden",         sublabel: "SEK" },
  { value: "ch", label: "Switzerland",   sublabel: "CHF" },
];

// Default gross amounts per country (native currency)
const DEFAULT_GROSS: Record<CountryCode, string> = {
  nl: "50000",
  fr: "50000",
  de: "50000",
  hu: "12000000",
  be: "50000",
  at: "50000",
  es: "40000",
  pt: "35000",
  it: "40000",
  ch: "120000",
  se: "600000",
  dk: "550000",
  ie: "55000",
  lu: "70000",
  no: "700000",
  pl: "100000",
  cz: "700000",
};

// ── Exchange-rate cache (localStorage, 7-day TTL) ─────────────────────────────
// Source: frankfurter.app — free, no key, ECB-backed.
// Refresh: client-side on page load if cache is stale; falls back to static rates.

const CACHE_KEY = "expatlix_fx_rates_v1";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

interface FxCache {
  /** API rates object: { HUF: 395.12, CHF: 0.93, … } (1 EUR = X local) */
  rates: Record<string, number>;
  /** fetchedAt epoch ms */
  ts: number;
  /** ISO date from API, e.g. "2026-04-22" */
  date: string;
}

function readCache(): FxCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as FxCache;
    if (Date.now() - cache.ts > CACHE_TTL) return null; // stale
    return cache;
  } catch { return null; }
}

function writeCache(cache: FxCache) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { /* quota */ }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SalaryCalculator() {
  const [country, setCountry]                 = useState<CountryCode>("nl");
  const [grossInput, setGrossInput]           = useState<string>(DEFAULT_GROSS.nl);
  const [thirtyPercentRuling, setThirtyPct]   = useState(false);
  const [cadreStatus, setCadreStatus]         = useState(false);
  const [showInEur, setShowInEur]             = useState(false);

  // Live exchange rates — null until loaded; falls back to static NON_EUR_COUNTRIES
  const [fxCache, setFxCache] = useState<FxCache | null>(null);
  const [fxStatus, setFxStatus] = useState<"loading" | "live" | "cached" | "static">("loading");

  // Read ?country= URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("country") as CountryCode | null;
    if (c && c in DEFAULT_GROSS) {
      setCountry(c);
      setGrossInput(DEFAULT_GROSS[c]);
    }
  }, []);

  // Fetch exchange rates (frankfurter.app → localStorage cache → static fallback)
  useEffect(() => {
    async function refresh() {
      // 1. Try cache
      const cached = readCache();
      if (cached) {
        setFxCache(cached);
        setFxStatus("cached");
        return;
      }
      // 2. Fetch live
      try {
        const currencies = Object.values(NON_EUR_COUNTRIES)
          .map((v) => v.currency)
          .join(",");
        const res = await fetch(
          `https://api.frankfurter.app/latest?from=EUR&to=${currencies}`,
          { signal: AbortSignal.timeout(6_000) },
        );
        if (!res.ok) throw new Error("non-2xx");
        const json = await res.json() as { rates: Record<string, number>; date: string };
        const cache: FxCache = { rates: json.rates, ts: Date.now(), date: json.date };
        writeCache(cache);
        setFxCache(cache);
        setFxStatus("live");
      } catch {
        // 3. Static fallback
        setFxStatus("static");
      }
    }
    refresh();
  }, []);

  // Resolve effective rate for the current country
  // Priority: live/cached API rate → static hardcoded rate
  const nonEurStatic   = NON_EUR_COUNTRIES[country] ?? null;
  const isNonEur       = nonEurStatic !== null;
  const localCurrency  = nonEurStatic?.currency ?? "EUR";

  const effectiveRate: { rate: number; date: string } | null = useMemo(() => {
    if (!nonEurStatic) return null;
    const liveRate = fxCache?.rates[nonEurStatic.currency];
    if (liveRate) {
      return { rate: liveRate, date: fxCache!.date };
    }
    return { rate: nonEurStatic.rate, date: nonEurStatic.lastUpdated };
  }, [nonEurStatic, fxCache]);

  // ── Display helpers ────────────────────────────────────────────────────────
  // Single source of truth for currency display. All monetary values are stored
  // in native currency; conversion to EUR happens only at render time.

  const displayCurrency = isNonEur && showInEur ? "EUR" : localCurrency;

  /**
   * Convert a native-currency amount to the display currency.
   * Always returns a positive integer (sign handled separately in breakdown).
   */
  function toDisplayNum(amount: number): number {
    const abs = Math.abs(amount);
    if (isNonEur && showInEur && effectiveRate) {
      return Math.round(abs / effectiveRate.rate);
    }
    return Math.round(abs);
  }

  /** Format with thousands separator + currency code. */
  function formatAmt(amount: number): string {
    return `${toDisplayNum(amount).toLocaleString()} ${displayCurrency}`;
  }

  // ── Input parsing ──────────────────────────────────────────────────────────
  // Number() handles scientific notation; Math.round removes decimals.
  const grossAnnual = Math.round(Number(grossInput)) || 0;

  // ── Country change ─────────────────────────────────────────────────────────
  const handleCountryChange = (v: string) => {
    const c = v as CountryCode;
    setCountry(c);
    setGrossInput(DEFAULT_GROSS[c]);
    setShowInEur(false);
  };

  // ── Calculation ────────────────────────────────────────────────────────────
  const result: SalaryBreakdown | null = useMemo(() => {
    if (grossAnnual <= 0) return null;
    return calculateSalary({
      grossAnnual,
      country,
      thirtyPercentRuling: country === "nl" ? thirtyPercentRuling : undefined,
      cadreStatus: country === "fr" ? cadreStatus : undefined,
    });
  }, [grossAnnual, country, thirtyPercentRuling, cadreStatus]);

  // ── Render ─────────────────────────────────────────────────────────────────
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
                  <Label htmlFor="country-combobox" className="text-sm font-medium mb-2 block">
                    Country
                  </Label>
                  <AppCombobox
                    value={country}
                    onChange={handleCountryChange}
                    options={COUNTRY_OPTIONS}
                    placeholder="Select a country…"
                    searchPlaceholder="Search countries…"
                    aria-label="Select country"
                    data-testid="select-country"
                  />
                </div>

                {/* Gross salary input */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Gross Annual Salary ({localCurrency})
                  </Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={grossInput}
                    onChange={(e) => setGrossInput(e.target.value)}
                    placeholder={`e.g. ${DEFAULT_GROSS[country]}`}
                    data-testid="input-gross"
                    className="text-base"   /* prevent iOS zoom on focus */
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
                      onCheckedChange={setThirtyPct}
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
                        Higher social contributions but better benefits
                      </p>
                    </div>
                    <Switch
                      checked={cadreStatus}
                      onCheckedChange={setCadreStatus}
                      data-testid="switch-cadre"
                    />
                  </div>
                )}

                {/* Non-EUR: currency display toggle */}
                {isNonEur && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="min-w-0">
                        <Label className="text-sm font-medium">Display currency</Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Calculated in {localCurrency} — switch to see EUR equivalents
                        </p>
                      </div>
                      {/* Touch-friendly toggle — min 44 px height */}
                      <div
                        className="flex rounded-md border border-input overflow-hidden text-sm font-semibold shrink-0 self-start sm:self-auto"
                        role="group"
                        aria-label="Currency display toggle"
                      >
                        <button
                          type="button"
                          onClick={() => setShowInEur(false)}
                          className={`px-5 py-2.5 min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            !showInEur
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground hover:bg-muted/50"
                          }`}
                          data-testid="toggle-local"
                          aria-pressed={!showInEur}
                        >
                          {localCurrency}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowInEur(true)}
                          className={`px-5 py-2.5 min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            showInEur
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground hover:bg-muted/50"
                          }`}
                          data-testid="toggle-eur"
                          aria-pressed={showInEur}
                        >
                          EUR
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>

          {result && (
            <>
              {/* ── Summary cards ───────────────────────────────────────────── */}
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="p-6 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Net Annual</div>
                    <div className="text-3xl font-bold text-accent" data-testid="text-net-annual">
                      {toDisplayNum(result.netAnnual).toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">{displayCurrency}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Net Monthly</div>
                    <div className="text-3xl font-bold text-foreground" data-testid="text-net-monthly">
                      {toDisplayNum(result.netMonthly).toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">{displayCurrency}</div>
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

              {/* ── Income benchmark ─────────────────────────────────────────── */}
              {(() => {
                const median   = result.medianGrossAnnual;
                const pct      = Math.round(((grossAnnual - median) / median) * 100);
                const absPct   = Math.abs(pct);
                const isAbove  = pct > 0;
                const isAt     = absPct <= 3;

                const Icon       = isAt ? Minus : isAbove ? TrendingUp : TrendingDown;
                const colorClass = isAt ? "text-muted-foreground" : isAbove ? "text-emerald-600" : "text-amber-600";
                const bgClass    = isAt
                  ? "bg-muted/40"
                  : isAbove
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-amber-50 border-amber-200";

                const label = isAt
                  ? "Around the country median"
                  : isAbove
                  ? `${absPct}% above the country median`
                  : `${absPct}% below the country median`;

                const barPct = Math.min(90, Math.max(10, 50 + pct / 2));

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
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
                      <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/30 z-10" style={{ left: "50%" }} />
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                          isAt ? "bg-muted-foreground/50" : isAbove ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Your salary: <span className="font-medium text-foreground">{formatAmt(grossAnnual)}</span></span>
                      <span>Median: <span className="font-medium text-foreground">{formatAmt(median)}</span></span>
                    </div>
                  </div>
                );
              })()}

              {/* ── Exchange-rate info — non-EUR countries ────────────────────── */}
              {isNonEur && effectiveRate && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground mb-8 px-1">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>
                      1 EUR&nbsp;=&nbsp;{effectiveRate.rate.toLocaleString(undefined, { maximumFractionDigits: 4 })}&nbsp;{localCurrency}
                    </span>
                    <span aria-hidden>·</span>
                    {/* Prominent "last updated" badge */}
                    <span
                      className="inline-flex items-center gap-1 bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full border border-accent/20 text-[11px]"
                      title={`Exchange rate last refreshed: ${effectiveRate.date}`}
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      Updated&nbsp;{effectiveRate.date}
                      {fxStatus === "static" && " (fallback)"}
                    </span>
                    <span aria-hidden>·</span>
                    <span>ECB via frankfurter.app · refreshed weekly</span>
                  </div>
                </div>
              )}

              {/* ── Detailed breakdown ───────────────────────────────────────── */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Detailed Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Gross Annual Salary</span>
                      <span className="font-semibold text-foreground">{formatAmt(result.grossAnnual)}</span>
                    </div>
                    <Separator />
                    {result.breakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="min-w-0 mr-4">
                          <span className="text-muted-foreground">{item.label}</span>
                          <p className="text-xs text-muted-foreground/70">{item.description}</p>
                        </div>
                        {/* item.amount > 0 = deduction (red "-"), < 0 = credit (green "+") */}
                        <span className={`font-medium shrink-0 ${item.amount < 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {item.amount < 0 ? "+" : "−"}{formatAmt(item.amount)}
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

              {/* ── Disclaimer ───────────────────────────────────────────────── */}
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
