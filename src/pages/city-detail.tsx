import { Link, useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCityBySlug } from "@/data/cities";
import { getCountryBySlug } from "@/data/countries";
import { monthNames } from "@/data/salary-calculator";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ArrowRight, MapPin, Sun, Shield, Wallet, Users, Globe, Calculator, Scale, ChevronLeft, Thermometer, Home, ShoppingCart, Train, UtensilsCrossed } from "lucide-react";

export default function CityDetail() {
  const params = useParams<{ countrySlug: string; citySlug: string }>();
  const country = getCountryBySlug(params.countrySlug ?? "");
  const city = getCityBySlug(params.citySlug ?? "");

  if (!city || !country || city.countryId !== country.id) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">City not found</h1>
          <Link href="/countries">
            <Button className="mt-4">Back to Countries</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const weatherData = city.avgTempByMonth.map((temp, i) => ({
    month: monthNames[i],
    temp,
  }));

  const costCategories = [
    { label: "Rent", value: city.rentIndex, icon: Home, color: "text-red-500" },
    { label: "Groceries", value: city.groceriesIndex, icon: ShoppingCart, color: "text-green-500" },
    { label: "Transport", value: city.transportIndex, icon: Train, color: "text-blue-500" },
    { label: "Dining", value: city.diningIndex, icon: UtensilsCrossed, color: "text-orange-500" },
  ];

  return (
    <Layout>
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link href={`/countries/${country.slug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" /> {country.name}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="text-muted-foreground">{country.name}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3" data-testid="text-city-name">
            {city.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{city.shortSummary}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">{city.population} population</Badge>
            <Badge variant="secondary">{city.language}</Badge>
            <Badge variant="secondary">{city.currency}</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl">
          <Card className="mb-8 border-accent/30 bg-accent/5">
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-accent uppercase tracking-wide mb-2">Best For</h2>
              <p className="text-foreground leading-relaxed">{city.bestFor}</p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Thermometer className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold text-foreground">Monthly Temperature</h3>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-muted-foreground">{city.sunnyDaysPerYear} sunny days/year</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weatherData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="C" />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(value: number) => [`${value}C`, "Avg. Temp"]}
                    />
                    <Bar dataKey="temp" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-semibold text-foreground">Safety</h3>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold text-foreground">{city.safetyIndex}</div>
                  <div>
                    <div className="text-sm font-medium text-foreground">/100</div>
                    <div className="text-xs text-muted-foreground">Safety Index</div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 mb-4">
                  <div
                    className="bg-emerald-500 h-3 rounded-full transition-all"
                    style={{ width: `${city.safetyIndex}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {city.safetyIndex >= 70
                    ? "This city has a high safety rating, indicating low crime and a secure environment for residents."
                    : city.safetyIndex >= 60
                    ? "This city has a moderate-to-good safety rating. Standard urban precautions are advised."
                    : "Exercise typical urban awareness. Safety varies by neighborhood."}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-foreground">Income</h3>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Median Gross Salary</div>
                    <div className="text-2xl font-bold text-foreground">{city.medianSalaryGross.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">EUR / year</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Est. Net Salary</div>
                    <div className="text-2xl font-bold text-accent">{city.estimatedMedianSalaryNet.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">EUR / year</div>
                  </div>
                </div>
                <Link href={`/salary-calculator?country=${country.id}`}>
                  <Button variant="outline" size="sm" className="gap-1 mt-2" data-testid="button-calc-link">
                    <Calculator className="w-3.5 h-3.5" />
                    Calculate Your Salary
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-foreground">Cost of Living</h3>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold text-foreground">{city.costOfLivingIndex}</div>
                  <div>
                    <div className="text-sm font-medium text-foreground">/100</div>
                    <div className="text-xs text-muted-foreground">Overall Index</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {costCategories.map((cat) => (
                    <div key={cat.label} className="flex items-center gap-3">
                      <cat.icon className={`w-4 h-4 ${cat.color} flex-shrink-0`} />
                      <span className="text-sm text-muted-foreground w-20 flex-shrink-0">{cat.label}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div className="bg-foreground/30 h-2 rounded-full" style={{ width: `${cat.value}%` }} />
                      </div>
                      <span className="text-xs font-medium text-foreground w-10 text-right">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-pink-500" />
                  <h3 className="font-semibold text-foreground">Family Fit</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{city.familyFitSummary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-foreground">Expat Fit</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{city.expatFitSummary}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/compare">
              <Button className="gap-2" data-testid="button-compare">
                <Scale className="w-4 h-4" /> Compare with Another City
              </Button>
            </Link>
            <Link href={`/salary-calculator?country=${country.id}`}>
              <Button variant="outline" className="gap-2" data-testid="button-salary">
                <Calculator className="w-4 h-4" /> Salary Calculator
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-xs text-muted-foreground">
            Last updated: {city.lastUpdated}
          </div>
        </div>
      </div>
    </Layout>
  );
}
