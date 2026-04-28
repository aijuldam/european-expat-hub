import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cities } from "@/data/cities";
import { countries, getCountryById } from "@/data/countries";
import { ArrowRight, BarChart3, Globe, MapPin, Scale, Compass } from "lucide-react";

export default function Home() {
  return (
    <Layout>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm">
            <Globe className="w-4 h-4" />
            <span>{countries.length} countries available now</span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight"
            data-testid="text-hero-title"
          >
            Build your best life in Europe
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Compare destinations, understand local systems, and move faster, safer, and fully prepared for your new life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-8 gap-2"
                data-testid="button-start-quiz"
              >
                <Compass className="w-5 h-5" />
                Take the Quiz
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/compare">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="button-browse-countries"
              >
                Compare destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <div className="bg-muted/40 border-y border-border py-5">
        <p className="text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
          Make a major life decision with more clarity, more confidence, and a stronger start to your new life in Europe.
        </p>
      </div>

      {/* ── Why Expatlix ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
              A better move starts with a better decision
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Moving to a new country means comparing far more than rent or weather. Taxes, healthcare, schools, administration, utilities, and day-to-day quality of life all shape whether a place is truly the right fit.
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
              Expatlix brings those factors together so expats can make data-informed decisions, feel confident about what comes next, and move forward with momentum.
            </p>
          </div>

          {/* Feature cards — Section 2: What users can do */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            {[
              {
                icon: Scale,
                title: "Compare destinations",
                desc: "Evaluate countries and cities based on the criteria that matter most to your life.",
                href: "/compare",
              },
              {
                icon: Globe,
                title: "Understand local systems",
                desc: "See how essential systems work before you move, from administration to practical setup.",
                href: "/countries",
              },
              {
                icon: Compass,
                title: "Follow the right steps",
                desc: "Get guidance that helps you avoid delays, mistakes, and unnecessary costs.",
                href: "/guides/settle-down",
              },
            ].map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <div className="text-center group cursor-pointer">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
              Tools to Plan Your European Move
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-3 max-w-2xl mx-auto">
            {[
              "Choose a destination with more confidence.",
              "Understand key country differences faster.",
              "Save time on setup and admin.",
              "Avoid common relocation mistakes.",
              "Reduce the risk of overpaying for essential services.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent block" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Explore Cities ───────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">Explore 35+ European Expat Cities</h2>
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

      {/* ── Countries — for people building a life across borders ─────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
              Compare 12 Countries — Tax, Cost &amp; Quality of Life
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Whether you are moving for work, family, flexibility, or a better lifestyle, Expatlix helps turn a complex relocation into a clear path toward a life that fits better.
            </p>
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

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-primary-foreground/60 uppercase tracking-widest mb-4 font-medium">
            A better way to plan life abroad
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 max-w-2xl mx-auto">
            Start your next European chapter with confidence
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
            Choose the place that fits your life, understand what comes next, and begin your move feeling ready, excited, and supported.
          </p>
          <Link href="/quiz">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8 gap-2"
            >
              <Compass className="w-5 h-5" />
              Start your next European chapter
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

    </Layout>
  );
}
