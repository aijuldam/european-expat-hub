import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { CityCombobox } from "@/components/ui/city-combobox";
import { compareCities } from "@/data/comparison";
import {
  TrendingDown,
  Home,
  ShoppingCart,
  Bus,
  UtensilsCrossed,
  Wallet,
  BarChart3,
  Check,
  Minus,
  ArrowRight,
} from "lucide-react";

// Keys from comparisonDimensions to surface in this guide (in display order)
const COL_KEYS = [
  "costOfLivingIndex",
  "rentIndex",
  "groceriesIndex",
  "transportIndex",
  "diningIndex",
  "estimatedMedianSalaryNet",
];

const ICON_MAP: Record<string, React.ReactNode> = {
  costOfLivingIndex:        <BarChart3      className="w-4 h-4" />,
  rentIndex:                <Home           className="w-4 h-4" />,
  groceriesIndex:           <ShoppingCart   className="w-4 h-4" />,
  transportIndex:           <Bus            className="w-4 h-4" />,
  diningIndex:              <UtensilsCrossed className="w-4 h-4" />,
  estimatedMedianSalaryNet: <Wallet         className="w-4 h-4" />,
};

// Quick-fact cards shown above the comparator
const QUICK_FACTS = [
  {
    icon: <Home className="w-5 h-5 text-accent" />,
    title: "Rent",
    body: "Accounts for 30–50 % of a typical expat budget. Amsterdam and Munich lead; Budapest and Lisbon are 2–3× cheaper.",
  },
  {
    icon: <ShoppingCart className="w-5 h-5 text-accent" />,
    title: "Groceries",
    body: "Prices vary ~40 % across the EU. Southern and Eastern Europe are consistently cheaper than Northern Europe.",
  },
  {
    icon: <Bus className="w-5 h-5 text-accent" />,
    title: "Transport",
    body: "Monthly transit passes range from ~€24 (Vienna) to ~€102 (Amsterdam). Good networks reduce the need for a car.",
  },
  {
    icon: <UtensilsCrossed className="w-5 h-5 text-accent" />,
    title: "Dining out",
    body: "A restaurant dinner for two ranges from ~€25 in Budapest to ~€70 in Paris. Lunch menus are often 30–50 % cheaper.",
  },
];

export default function GuideCostOfLiving() {
  const [city1Id, setCity1Id] = useState("");
  const [city2Id, setCity2Id] = useState("");

  const fullResult = useMemo(() => {
    if (!city1Id || !city2Id || city1Id === city2Id) return null;
    return compareCities(city1Id, city2Id);
  }, [city1Id, city2Id]);

  // Filter to cost-of-living dimensions only, in our preferred order
  const colDimensions = useMemo(() => {
    if (!fullResult) return null;
    return COL_KEYS.map((key) =>
      fullResult.dimensions.find((d) => d.dimension.key === key)
    ).filter(Boolean) as (typeof fullResult.dimensions)[number][];
  }, [fullResult]);

  return (
    <Layout>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-6 h-6 text-accent" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Cost of Living in Europe
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            How much does it really cost to live in a European city? Compare rent,
            groceries, transport, and dining across our 35 + city database — then
            run a side-by-side comparison to find the best fit for your budget.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">

        {/* ── Quick-fact cards ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            The four biggest expenses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_FACTS.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {f.icon}
                    <span className="font-semibold text-foreground">{f.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── City comparator ───────────────────────────────────────────── */}
        <section id="compare">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
            Compare two cities
          </h2>
          <p className="text-muted-foreground mb-8">
            Pick any two cities to see how their cost of living stacks up across
            rent, groceries, transport, dining, and take-home pay.
          </p>

          {/* City pickers */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8 max-w-2xl">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                First city
              </label>
              <CityCombobox
                value={city1Id}
                onChange={setCity1Id}
                excludeId={city2Id}
                label="Select a city"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Second city
              </label>
              <CityCombobox
                value={city2Id}
                onChange={setCity2Id}
                excludeId={city1Id}
                label="Select a city"
              />
            </div>
          </div>

          {/* Same-city guard */}
          {city1Id && city2Id && city1Id === city2Id && (
            <p className="text-muted-foreground py-4">
              Please select two different cities.
            </p>
          )}

          {/* Empty state */}
          {(!city1Id || !city2Id) && (
            <div className="text-center text-muted-foreground py-12 border border-dashed rounded-lg">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-25" />
              <p className="text-sm">Select two cities above to see their cost comparison</p>
            </div>
          )}

          {/* Results */}
          {colDimensions && fullResult && (
            <div className="space-y-2">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4 text-center">
                <div className="text-lg font-serif font-bold text-foreground">
                  {fullResult.city1.name}
                </div>
                <div className="text-xs text-muted-foreground self-center uppercase tracking-wide min-w-[130px]">
                  vs
                </div>
                <div className="text-lg font-serif font-bold text-foreground">
                  {fullResult.city2.name}
                </div>
              </div>

              {colDimensions.map(({ dimension, formatted1, formatted2, winner, difference }) => (
                <Card key={dimension.key} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[1fr_auto_1fr]">
                      {/* City 1 value */}
                      <div
                        className={`p-4 text-center transition-colors ${
                          winner === "city1" ? "bg-accent/10" : ""
                        }`}
                      >
                        <div className="text-base font-semibold text-foreground">
                          {formatted1}
                        </div>
                        {winner === "city1" && (
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Check className="w-3 h-3 text-accent" />
                            <span className="text-xs text-accent font-medium">Better</span>
                          </div>
                        )}
                      </div>

                      {/* Centre label */}
                      <div className="flex flex-col items-center justify-center px-3 border-x bg-muted/20 min-w-[130px] py-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                          {ICON_MAP[dimension.key]}
                          <span className="text-xs font-medium text-foreground text-center leading-tight">
                            {dimension.label}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {winner === "tie" ? (
                            <span className="flex items-center gap-1">
                              <Minus className="w-3 h-3" /> Equal
                            </span>
                          ) : (
                            difference
                          )}
                        </div>
                      </div>

                      {/* City 2 value */}
                      <div
                        className={`p-4 text-center transition-colors ${
                          winner === "city2" ? "bg-accent/10" : ""
                        }`}
                      >
                        <div className="text-base font-semibold text-foreground">
                          {formatted2}
                        </div>
                        {winner === "city2" && (
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Check className="w-3 h-3 text-accent" />
                            <span className="text-xs text-accent font-medium">Better</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* CTA to full compare */}
              <div className="pt-4 text-center">
                <Link
                  href={`/compare?city1=${city1Id}&city2=${city2Id}`}
                  className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:underline"
                >
                  See full comparison including safety, weather & salaries
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Methodology note ─────────────────────────────────────────── */}
        <section className="border-t pt-8">
          <p className="text-xs text-muted-foreground max-w-2xl">
            Indices are Numbeo-style scores (0–100) where a higher index means higher
            cost. Salary figures are gross/net annual in EUR. Data is updated periodically
            — see{" "}
            <Link href="/methodology" className="underline hover:text-foreground">
              Methodology
            </Link>{" "}
            for sources and update frequency.
          </p>
        </section>
      </div>
    </Layout>
  );
}
