import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EuropeMap } from "@/components/ui/europe-map";
import { countries } from "@/data/countries";
import { getCitiesByCountryId } from "@/data/cities";
import { ArrowRight, MapPin, Sun, Shield, Wallet } from "lucide-react";

const SUPPORTED_IDS = new Set(countries.map((c) => c.id));

/** Scroll to a country card, accounting for the 64px sticky navbar */
function scrollToCountry(id: string) {
  const el = document.getElementById(`country-${id}`);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function CountriesOverview() {
  return (
    <Layout>
      <div className="bg-primary/5 py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* Left: heading */}
            <div className="md:flex-1">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3" data-testid="text-countries-title">
                Explore Countries
              </h1>
              <p className="text-muted-foreground max-w-md">
                Start with a country to understand the national context, then drill into specific cities for detailed profiles.
              </p>
              <p className="text-xs text-muted-foreground mt-3 hidden md:block">
                Click a country on the map to jump to its section.
              </p>
            </div>

            {/* Right: interactive Europe map */}
            <div className="w-full md:w-[340px] lg:w-[400px] flex-shrink-0">
              <EuropeMap
                supportedIds={SUPPORTED_IDS}
                onCountryClick={scrollToCountry}
                className="max-h-[220px] md:max-h-[240px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {countries.map((country) => {
            const countryCities = getCitiesByCountryId(country.id);
            return (
              <Card key={country.id} id={`country-${country.id}`} className="overflow-hidden" data-testid={`card-country-${country.id}`}>
                <CardContent className="p-0">
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                        {country.flagEmoji}
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-foreground">{country.name}</h2>
                        <p className="text-sm text-muted-foreground">{countryCities.length} cities available</p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6">{country.summary}</p>

                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                          <Sun className="w-4 h-4 text-amber-500" />
                          Weather
                        </div>
                        <p className="text-xs text-muted-foreground">{country.avgWeatherSummary.slice(0, 100)}...</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          Safety
                        </div>
                        <p className="text-xs text-muted-foreground">{country.safetyContext.slice(0, 100)}...</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
                          <Wallet className="w-4 h-4 text-blue-500" />
                          Cost of Living
                        </div>
                        <p className="text-xs text-muted-foreground">{country.costOfLivingPositioning.slice(0, 100)}...</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-foreground mb-3">Cities in {country.name}</h3>
                      <div className="flex flex-wrap gap-3">
                        {countryCities.map((city) => (
                          <Link key={city.id} href={`/countries/${country.slug}/${city.slug}`}>
                            <div className="flex items-center gap-2 bg-muted/50 hover:bg-accent/10 px-4 py-2 rounded-lg transition-colors cursor-pointer group">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent" />
                              <span className="text-sm font-medium text-foreground group-hover:text-accent">{city.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Link href={`/countries/${country.slug}`}>
                        <Button className="gap-2" data-testid={`button-explore-${country.id}`}>
                          Explore {country.name} <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/salary-calculator?country=${country.id}`}>
                        <Button variant="outline" data-testid={`button-calc-${country.id}`}>
                          Salary Calculator
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
