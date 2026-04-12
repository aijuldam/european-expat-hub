import { Link, useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCountryBySlug } from "@/data/countries";
import { getCitiesByCountryId } from "@/data/cities";
import { ArrowRight, MapPin, Sun, Shield, Wallet, Users, Globe, Calculator, ChevronLeft } from "lucide-react";

export default function CountryDetail() {
  const params = useParams<{ slug: string }>();
  const country = getCountryBySlug(params.slug ?? "");

  if (!country) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Country not found</h1>
          <Link href="/countries">
            <Button className="mt-4">Back to Countries</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const countryCities = getCitiesByCountryId(country.id);

  const sections = [
    { icon: Sun, title: "Weather & Climate", content: country.avgWeatherSummary, color: "text-amber-500" },
    { icon: Shield, title: "Safety", content: country.safetyContext, color: "text-emerald-500" },
    { icon: Wallet, title: "Cost of Living", content: country.costOfLivingPositioning, color: "text-blue-500" },
    { icon: Users, title: "Family Friendliness", content: country.familyFriendliness, color: "text-pink-500" },
    { icon: Globe, title: "Expat Friendliness", content: country.expatFriendliness, color: "text-purple-500" },
    { icon: Calculator, title: "Tax & Salary Context", content: country.nationalTaxNotes, color: "text-orange-500" },
  ];

  return (
    <Layout>
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link href="/countries" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" /> All Countries
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {country.flagEmoji}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground" data-testid="text-country-name">
                {country.name}
              </h1>
              <p className="text-muted-foreground">{countryCities.length} cities available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">{country.summary}</p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {sections.map((section) => (
              <Card key={section.title}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <section.icon className={`w-5 h-5 ${section.color}`} />
                    <h3 className="font-semibold text-foreground">{section.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Cities in {country.name}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {countryCities.map((city) => (
                <Link key={city.id} href={`/countries/${country.slug}/${city.slug}`}>
                  <Card className="group cursor-pointer hover:shadow-md transition-all h-full" data-testid={`card-city-${city.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{country.name}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">{city.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{city.bestFor}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground">Safety</div>
                          <div className="font-semibold text-foreground">{city.safetyIndex}/100</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground">Sunny Days</div>
                          <div className="font-semibold text-foreground">{city.sunnyDaysPerYear}</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground">Gross Salary</div>
                          <div className="font-semibold text-foreground">{(city.medianSalaryGross / 1000).toFixed(0)}k EUR</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground">CoL Index</div>
                          <div className="font-semibold text-foreground">{city.costOfLivingIndex}/100</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-4 text-sm text-accent font-medium">
                        View Details <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Link href={`/salary-calculator?country=${country.id}`}>
              <Button className="gap-2" data-testid="button-salary-calc">
                <Calculator className="w-4 h-4" /> Salary Calculator
              </Button>
            </Link>
            <Link href="/compare">
              <Button variant="outline" data-testid="button-compare">Compare Cities</Button>
            </Link>
          </div>

          <div className="mt-8 text-xs text-muted-foreground">
            Last updated: {country.lastUpdated}
          </div>
        </div>
      </div>
    </Layout>
  );
}
