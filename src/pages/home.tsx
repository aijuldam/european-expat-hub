import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cities } from "@/data/cities";
import { countries, getCountryById } from "@/data/countries";
import { ArrowRight, BarChart3, Calculator, Globe, MapPin, Scale, Compass } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <section className="relative bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm">
            <Globe className="w-4 h-4" />
            <span>Netherlands & France available now</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight" data-testid="text-hero-title">
            Find the best European city for your life, family, and finances
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            A structured decision tool that combines personalized recommendations, salary estimation, and city comparison to help you choose where to live in Europe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <Button size="lg" variant="secondary" className="text-base px-8 gap-2" data-testid="button-start-quiz">
                <Compass className="w-5 h-5" />
                Take the Quiz
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/countries">
              <Button size="lg" variant="outline" className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-browse-countries">
                Browse Countries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three steps to finding your ideal European city</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Compass, title: "1. Take the Quiz", desc: "Answer 10 questions about your preferences, lifestyle, and priorities to get personalized city recommendations." },
              { icon: BarChart3, title: "2. Explore & Compare", desc: "Browse detailed city profiles with data on weather, safety, salaries, and cost of living. Compare cities side by side." },
              { icon: Calculator, title: "3. Plan Financially", desc: "Estimate your take-home pay with country-specific salary calculators for the Netherlands and France." },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">Explore Cities</h2>
              <p className="text-muted-foreground">Discover what each city has to offer</p>
            </div>
            <Link href="/compare">
              <Button variant="outline" className="hidden sm:flex gap-2" data-testid="button-compare-teaser">
                <Scale className="w-4 h-4" />
                Compare Cities
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((city) => {
              const country = getCountryById(city.countryId);
              return (
                <Link key={city.id} href={`/countries/${country?.slug}/${city.slug}`}>
                  <Card className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 h-full" data-testid={`card-city-${city.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{country?.name}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">{city.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{city.bestFor}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground mb-0.5">Safety</div>
                          <div className="font-semibold text-foreground">{city.safetyIndex}/100</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground mb-0.5">Sunny Days</div>
                          <div className="font-semibold text-foreground">{city.sunnyDaysPerYear}</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground mb-0.5">CoL Index</div>
                          <div className="font-semibold text-foreground">{city.costOfLivingIndex}/100</div>
                        </div>
                        <div className="bg-muted/50 rounded-md p-2">
                          <div className="text-muted-foreground mb-0.5">Median Salary</div>
                          <div className="font-semibold text-foreground">{(city.medianSalaryGross / 1000).toFixed(0)}k</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="sm:hidden mt-6 text-center">
            <Link href="/compare">
              <Button variant="outline" className="gap-2">
                <Scale className="w-4 h-4" />
                Compare Cities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">Countries</h2>
            <p className="text-muted-foreground">Start with a country, then explore its cities</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {countries.map((country) => (
              <Link key={country.id} href={`/countries/${country.slug}`}>
                <Card className="group cursor-pointer hover:shadow-md transition-all h-full" data-testid={`card-country-${country.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {country.flagEmoji}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{country.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{country.summary.slice(0, 150)}...</p>
                    <div className="flex items-center gap-1 mt-4 text-sm text-accent font-medium">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
