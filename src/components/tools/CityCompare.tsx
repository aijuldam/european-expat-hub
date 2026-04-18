import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import {
  Home, ShoppingCart, UtensilsCrossed, Bus, Zap, Wifi,
  Landmark, HeartPulse, Sun, Share2, Code2, Check, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cities } from "@/data/cities";
import { countries } from "@/data/countries";
import {
  type CityMetrics, type LaunchCitySlug, LAUNCH_CITY_SLUGS,
  getCityMetrics, climateSummary,
} from "@/data/city-costs";
import { trackEvent } from "@/lib/analytics";

// ── Formatters ──────────────────────────────────────────────────────────────

const eur = (n: number) => `€${n.toLocaleString("en-EU")}`;
const eurK = (n: number) =>
  n >= 1000 ? `€${(n / 1000).toFixed(1)}k` : eur(n);
const idx = (n: number) => `${n}/100`;
const hrs = (n: number) => `${n.toLocaleString()} hrs`;
const temp = (n: number) => `${n}°C`;

// ── Section definitions ──────────────────────────────────────────────────────

interface Metric {
  label: string;
  getValue: (d: CityMetrics) => number;
  format: (n: number) => string;
  lowerBetter: boolean;
  estimate?: boolean;
  note?: (d: CityMetrics) => string | undefined;
}

interface Section {
  title: string;
  Icon: React.ElementType;
  metrics: Metric[];
}

const SECTIONS: Section[] = [
  {
    title: "Monthly Rent",
    Icon: Home,
    metrics: [
      { label: "1BR — City Center", getValue: (d) => d.rent.oneBrCityCenter, format: eur, lowerBetter: true },
      { label: "1BR — Outside Center", getValue: (d) => d.rent.oneBrOutside, format: eur, lowerBetter: true },
      { label: "3BR — City Center", getValue: (d) => d.rent.threeBrCityCenter, format: eur, lowerBetter: true },
    ],
  },
  {
    title: "Groceries",
    Icon: ShoppingCart,
    metrics: [
      { label: "Basket Index", getValue: (d) => d.groceriesIndex, format: idx, lowerBetter: true },
    ],
  },
  {
    title: "Eating Out",
    Icon: UtensilsCrossed,
    metrics: [
      { label: "Dinner for 2 (mid-range)", getValue: (d) => d.eatingOut.dinnerForTwo, format: eur, lowerBetter: true },
      { label: "Latte", getValue: (d) => d.eatingOut.latte, format: eur, lowerBetter: true },
      { label: "Domestic Beer (0.5 L)", getValue: (d) => d.eatingOut.domesticBeer, format: eur, lowerBetter: true },
    ],
  },
  {
    title: "Transport",
    Icon: Bus,
    metrics: [
      { label: "Monthly Transit Pass", getValue: (d) => d.transport.monthlyPass, format: eur, lowerBetter: true },
      { label: "Taxi Start Fare", getValue: (d) => d.transport.taxiStart, format: eur, lowerBetter: true },
      { label: "Fuel (1 litre)", getValue: (d) => d.transport.fuelLiter, format: eur, lowerBetter: true },
    ],
  },
  {
    title: "Utilities & Internet",
    Icon: Zap,
    metrics: [
      { label: "Utilities — 85m² apt", getValue: (d) => d.utilities.basic85m2, format: eur, lowerBetter: true },
      { label: "Internet (60 Mbps+)", getValue: (d) => d.internet.monthly, format: eur, lowerBetter: true },
    ],
  },
  {
    title: "Income on €70k Gross ✱",
    Icon: Landmark,
    metrics: [
      {
        label: "Est. Net Take-Home / yr",
        getValue: (d) => d.salary.netEstimate,
        format: eurK,
        lowerBetter: false,
        estimate: true,
        note: (d) => d.salary.note,
      },
    ],
  },
  {
    title: "Healthcare",
    Icon: HeartPulse,
    metrics: [
      {
        label: "Monthly Premium / Top-up",
        getValue: (d) => d.healthcare.monthlyEstimate,
        format: (n) => (n === 0 ? "Bundled" : eur(n)),
        lowerBetter: true,
        note: (d) => d.healthcare.note,
      },
    ],
  },
  {
    title: "Climate",
    Icon: Sun,
    metrics: [
      {
        label: "Summer High (Jun–Aug avg)",
        getValue: (d) => climateSummary(d.climate).summerHigh,
        format: temp,
        lowerBetter: false,
      },
      {
        label: "Winter Low (Dec–Feb avg)",
        getValue: (d) => climateSummary(d.climate).winterLow,
        format: temp,
        lowerBetter: false,
      },
      {
        label: "Sunshine Hours / Year",
        getValue: (d) => d.climate.sunshineHoursPerYear,
        format: hrs,
        lowerBetter: false,
      },
    ],
  },
];

// ── Delta pill ───────────────────────────────────────────────────────────────

function DeltaPill({
  pct,
  favorable,
  small = false,
}: {
  pct: number;
  favorable: boolean;
  small?: boolean;
}) {
  if (pct === 0) return null;
  const label = pct > 0 ? `+${pct}%` : `${pct}%`;
  return (
    <span
      className={cn(
        "inline-block rounded-full font-medium tabular-nums leading-none",
        small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5",
        favorable
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-600"
      )}
    >
      {label}
    </span>
  );
}

// ── Launch-city picker ───────────────────────────────────────────────────────

const FLAG: Record<string, string> = {
  nl: "🇳🇱", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹", hu: "🇭🇺",
  es: "🇪🇸", be: "🇧🇪", ch: "🇨🇭", at: "🇦🇹", pt: "🇵🇹",
  dk: "🇩🇰", se: "🇸🇪",
};

const COUNTRY_NAME: Record<string, string> = Object.fromEntries(
  countries.map((c) => [c.id, c.name])
);

const LAUNCH_CITIES = cities.filter((c) =>
  LAUNCH_CITY_SLUGS.includes(c.slug as LaunchCitySlug)
);

interface CityPickerProps {
  value: string;
  onChange: (slug: string) => void;
  excludeSlug?: string;
  label: string;
}

function CityPicker({ value, onChange, excludeSlug, label }: CityPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = LAUNCH_CITIES.find((c) => c.slug === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
            "hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            open && "ring-2 ring-ring ring-offset-2"
          )}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected
              ? `${FLAG[selected.countryId] ?? ""} ${selected.name}`
              : "Select a city…"}
          </span>
          <span className="ml-2 flex items-center gap-1 shrink-0">
            {selected && (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Clear ${label}`}
                onClick={(e) => { e.stopPropagation(); onChange(""); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange(""); }
                }}
                className="rounded p-0.5 hover:bg-muted text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-60" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={4} className="p-0 w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput placeholder="Search cities…" className="h-10" />
          <CommandList className="max-h-64">
            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
              No cities found.
            </CommandEmpty>
            <CommandGroup>
              {LAUNCH_CITIES.map((city) => {
                const isExcluded = city.slug === excludeSlug;
                return (
                  <CommandItem
                    key={city.slug}
                    value={`${city.name} ${COUNTRY_NAME[city.countryId] ?? ""}`}
                    disabled={isExcluded}
                    onSelect={() => {
                      if (!isExcluded) { onChange(city.slug); setOpen(false); }
                    }}
                    className={cn("cursor-pointer", isExcluded && "opacity-40 cursor-not-allowed")}
                  >
                    <span className="mr-2">{FLAG[city.countryId] ?? ""}</span>
                    <span>{city.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {COUNTRY_NAME[city.countryId]}
                    </span>
                    {city.slug === value && <Check className="ml-2 h-4 w-4 text-accent" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ── Embed snippet helper ─────────────────────────────────────────────────────

function embedSnippet(slugA: string, slugB: string, base: string) {
  const src = `${base}/embed/compare?a=${slugA}&b=${slugB}`;
  return `<iframe src="${src}" width="720" height="960" frameborder="0" style="border:none;border-radius:8px;max-width:100%" loading="lazy" title="City cost comparison: ${slugA} vs ${slugB}"></iframe>`;
}

// ── Main component ───────────────────────────────────────────────────────────

export interface CityCompareProps {
  slugA: string;
  slugB: string;
  onSlugAChange?: (slug: string) => void;
  onSlugBChange?: (slug: string) => void;
  /** embed mode hides pickers, share/embed buttons, and uses compact layout */
  embed?: boolean;
  /** full public URL base for iframe src generation */
  siteBase?: string;
}

export function CityCompare({
  slugA,
  slugB,
  onSlugAChange,
  onSlugBChange,
  embed = false,
  siteBase = "https://aijuldam.github.io/european-expat-hub",
}: CityCompareProps) {
  const dataA = useMemo(() => getCityMetrics(slugA), [slugA]);
  const dataB = useMemo(() => getCityMetrics(slugB), [slugB]);

  const cityA = LAUNCH_CITIES.find((c) => c.slug === slugA);
  const cityB = LAUNCH_CITIES.find((c) => c.slug === slugB);

  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    trackEvent("compare_share", { city_a: slugA, city_b: slugB });
  }, [slugA, slugB]);

  const handleEmbedCopy = useCallback((snippet: string) => {
    navigator.clipboard.writeText(snippet).then(() => {
      setEmbedCopied(true);
      setTimeout(() => setEmbedCopied(false), 2000);
    });
    trackEvent("compare_embed_copy", { city_a: slugA, city_b: slugB });
  }, [slugA, slugB]);

  const hasData = dataA && dataB;

  return (
    <div className="w-full">
      {/* ── Pickers (full mode only) ── */}
      {!embed && (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">City A</label>
            <CityPicker
              value={slugA}
              onChange={onSlugAChange ?? (() => {})}
              excludeSlug={slugB}
              label="Select first city"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">City B</label>
            <CityPicker
              value={slugB}
              onChange={onSlugBChange ?? (() => {})}
              excludeSlug={slugA}
              label="Select second city"
            />
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!hasData && !embed && (
        <div className="text-center text-muted-foreground py-20">
          <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-base">Select two cities above to compare them</p>
        </div>
      )}

      {/* ── Comparison table ── */}
      {hasData && (
        <>
          {/* Action bar (full mode) */}
          {!embed && (
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <p className="text-sm text-muted-foreground">
                All monetary values in EUR. Salary row assumes €70k gross.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Share"}
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Code2 className="w-3.5 h-3.5" />
                      Embed
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[min(420px,90vw)] p-4" align="end">
                    <p className="text-sm font-medium mb-2">Embed this comparison</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      Paste this snippet on your blog or site. It stays live as data updates.
                    </p>
                    <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed mb-3">
                      {embedSnippet(slugA, slugB, siteBase)}
                    </pre>
                    <Button
                      size="sm"
                      className="w-full gap-1.5"
                      onClick={() => handleEmbedCopy(embedSnippet(slugA, slugB, siteBase))}
                    >
                      {embedCopied ? <Check className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
                      {embedCopied ? "Copied!" : "Copy snippet"}
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Sticky city name header */}
          <div
            className={cn(
              "grid gap-0 mb-1 sticky bg-background z-10 border rounded-lg overflow-hidden",
              embed ? "top-0" : "top-[57px] md:top-[65px]"
            )}
            style={{ gridTemplateColumns: "minmax(120px,1fr) 1fr 1fr" }}
          >
            <div className="py-3 px-4 text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Category
            </div>
            <div className="py-3 px-4 font-semibold text-foreground border-l text-sm truncate">
              {cityA ? `${FLAG[cityA.countryId] ?? ""} ${cityA.name}` : "—"}
            </div>
            <div className="py-3 px-4 font-semibold text-foreground border-l text-sm truncate">
              {cityB ? `${FLAG[cityB.countryId] ?? ""} ${cityB.name}` : "—"}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-1">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                {/* Section header */}
                <div className="flex items-center gap-2 px-4 py-2 mt-4 mb-0.5">
                  <section.Icon className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm font-semibold text-foreground">{section.title}</span>
                </div>

                {/* Metric rows */}
                {section.metrics.map((metric) => {
                  const valA = metric.getValue(dataA);
                  const valB = metric.getValue(dataB);
                  const pctA = valB !== 0 ? Math.round(((valA - valB) / Math.abs(valB)) * 100) : 0;
                  const pctB = valA !== 0 ? Math.round(((valB - valA) / Math.abs(valA)) * 100) : 0;
                  const favorableA = metric.lowerBetter ? pctA < 0 : pctA > 0;
                  const favorableB = metric.lowerBetter ? pctB < 0 : pctB > 0;
                  const noteA = metric.note?.(dataA);
                  const noteB = metric.note?.(dataB);

                  return (
                    <div
                      key={metric.label}
                      className="grid border rounded-md bg-background hover:bg-muted/30 transition-colors overflow-hidden"
                      style={{ gridTemplateColumns: "minmax(120px,1fr) 1fr 1fr" }}
                    >
                      <div className="py-3 px-4 text-sm text-muted-foreground flex items-center gap-1 min-w-0">
                        <span className="truncate">{metric.label}</span>
                        {metric.estimate && (
                          <span className="text-[10px] text-muted-foreground/70 shrink-0">✱est.</span>
                        )}
                      </div>
                      {[
                        { val: valA, pct: pctA, favorable: favorableA, note: noteA },
                        { val: valB, pct: pctB, favorable: favorableB, note: noteB },
                      ].map((side, i) => (
                        <div key={i} className="py-3 px-4 border-l flex items-center gap-2 min-w-0">
                          <span className="font-semibold text-foreground text-sm whitespace-nowrap">
                            {metric.format(side.val)}
                          </span>
                          {Math.abs(side.pct) >= 1 && (
                            <DeltaPill pct={side.pct} favorable={side.favorable} />
                          )}
                          {side.note && (
                            <span className="hidden lg:inline text-[10px] text-muted-foreground/70 truncate">
                              {side.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sources + last reviewed */}
          <Card className={cn("mt-8", embed && "mt-4")}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Data sources</p>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
                {[dataA, dataB].map((d) =>
                  d.sources.map((s) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline flex items-center gap-1 min-w-0"
                    >
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{s.label}</span>
                    </a>
                  ))
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ✱ Salary estimates are approximations; individual results vary by employer, deductions, and tax elections.
                {" "}Last reviewed: {[dataA.lastReviewed, dataB.lastReviewed]
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .join(", ")}
              </p>
            </CardContent>
          </Card>

          {/* Embed watermark */}
          {embed && (
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                Powered by <span className="font-semibold">European Expat Hub</span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
