import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp, Scale, Calculator } from "lucide-react";
import { getCityComparisonData } from "@/data/city-comparison-lp-data";
import { getCityMetrics } from "@/data/city-costs";
import { getCityBySlug } from "@/data/cities";
import { useState } from "react";

interface Props {
  params: { slug: string };
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-accent transition-colors gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      {open && <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

function eur(n: number) {
  return "€" + Math.round(n).toLocaleString("en-EU");
}

function Better({ city, isLeft }: { city: string; isLeft: boolean }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isLeft ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"}`}>
      ↓ lower
    </span>
  );
}

export default function CityComparison({ params }: Props) {
  const lp = getCityComparisonData(params.slug);

  if (!lp) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Comparison not found</h1>
          <Link href="/compare"><Button>Browse All Comparisons</Button></Link>
        </div>
      </Layout>
    );
  }

  const m1 = getCityMetrics(lp.city1Slug);
  const m2 = getCityMetrics(lp.city2Slug);
  const c1 = getCityBySlug(lp.city1Slug);
  const c2 = getCityBySlug(lp.city2Slug);

  // Use city-costs data if available, else fall back to cities.ts indices
  const rent1 = m1?.rent.oneBrCityCenter ?? (c1 ? Math.round(c1.rentIndex * 20) : null);
  const rent2 = m2?.rent.oneBrCityCenter ?? (c2 ? Math.round(c2.rentIndex * 20) : null);
  const net1 = m1?.salary.netEstimate ?? c1?.estimatedMedianSalaryNet;
  const net2 = m2?.salary.netEstimate ?? c2?.estimatedMedianSalaryNet;
  const gross1 = m1?.salary.grossRef ?? c1?.medianSalaryGross;
  const gross2 = m2?.salary.grossRef ?? c2?.medianSalaryGross;

  // Monthly surplus = (net / 12) - rent - monthly transport - utilities
  const monthly1 = net1 ? Math.round(net1 / 12) : null;
  const monthly2 = net2 ? Math.round(net2 / 12) : null;
  const surplus1 = monthly1 && rent1 ? monthly1 - rent1 - (m1?.transport.monthlyPass ?? 0) - (m1?.utilities.basic85m2 ?? 0) : null;
  const surplus2 = monthly2 && rent2 ? monthly2 - rent2 - (m2?.transport.monthlyPass ?? 0) - (m2?.utilities.basic85m2 ?? 0) : null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": lp.faq.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  };

  const compareToolUrl = `/compare?city1=${lp.city1Slug}&city2=${lp.city2Slug}`;

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-sm text-primary-foreground/60 mb-4">
              <Link href="/compare" className="hover:text-primary-foreground transition-colors">Compare Cities</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-foreground">{lp.city1Name} vs {lp.city2Name}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-5 leading-tight">
              {lp.h1}
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mb-8 leading-relaxed">
              {lp.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={compareToolUrl}>
                <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
                  <Scale className="w-5 h-5" />
                  Interactive Comparison Tool
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick verdict ─────────────────────────────────────────────── */}
      <div className="bg-muted/40 border-y border-border py-5">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-sm text-center text-muted-foreground italic">
            <span className="text-foreground font-semibold not-italic">Verdict: </span>
            {lp.verdict}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">

        {/* ── Best for cards ───────────────────────────────────────────── */}
        <section className="grid sm:grid-cols-2 gap-4 mb-12">
          <Card className="border-accent/30">
            <CardContent className="p-5">
              <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                {lp.city1Name} — best for
              </div>
              <p className="text-sm text-foreground">{lp.bestFor1}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardContent className="p-5">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                {lp.city2Name} — best for
              </div>
              <p className="text-sm text-foreground">{lp.bestFor2}</p>
            </CardContent>
          </Card>
        </section>

        {/* ── Salary & surplus comparison ──────────────────────────────── */}
        {(net1 || net2) && (
          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">
              Salary & Monthly Surplus
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Based on a {gross1 ? eur(gross1) : "€70,000"} gross reference salary.
              Surplus = net monthly − 1-bed rent − transport − utilities.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 font-semibold text-foreground rounded-tl-lg">Metric</th>
                    <th className="text-right px-4 py-3 font-semibold text-accent">{lp.city1Name}</th>
                    <th className="text-right px-4 py-3 font-semibold text-primary rounded-tr-lg">{lp.city2Name}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Net annual (est.)", v1: net1 ? eur(net1) : "—", v2: net2 ? eur(net2) : "—" },
                    { label: "Net monthly", v1: monthly1 ? eur(monthly1) : "—", v2: monthly2 ? eur(monthly2) : "—" },
                    { label: "1-bed rent (city centre)", v1: rent1 ? eur(rent1) : "—", v2: rent2 ? eur(rent2) : "—" },
                    { label: "Monthly transport pass", v1: m1 ? eur(m1.transport.monthlyPass) : "—", v2: m2 ? eur(m2.transport.monthlyPass) : "—" },
                    { label: "Utilities (85m²)", v1: m1 ? eur(m1.utilities.basic85m2) : "—", v2: m2 ? eur(m2.utilities.basic85m2) : "—" },
                    { label: "Est. monthly surplus", v1: surplus1 ? eur(surplus1) : "—", v2: surplus2 ? eur(surplus2) : "—" },
                  ].map(({ label, v1, v2 }) => (
                    <tr key={label} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{label}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">{v1}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">{v2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Net salary estimated from city cost data. Surplus is indicative — personal spending varies.{" "}
              <Link href="/methodology" className="underline hover:text-foreground">Methodology</Link>
            </p>
          </section>
        )}

        {/* ── Cost of living breakdown ─────────────────────────────────── */}
        {(m1 || m2) && (
          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-5">
              Cost of Living Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 font-semibold text-foreground rounded-tl-lg">Item</th>
                    <th className="text-right px-4 py-3 font-semibold text-accent">{lp.city1Name}</th>
                    <th className="text-right px-4 py-3 font-semibold text-primary rounded-tr-lg">{lp.city2Name}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "1-bed (city centre)", unit: "/mo",
                      v1: m1?.rent.oneBrCityCenter, v2: m2?.rent.oneBrCityCenter, lowerIsBetter: true
                    },
                    {
                      label: "1-bed (outside centre)", unit: "/mo",
                      v1: m1?.rent.oneBrOutside, v2: m2?.rent.oneBrOutside, lowerIsBetter: true
                    },
                    {
                      label: "Dinner for two", unit: "",
                      v1: m1?.eatingOut.dinnerForTwo, v2: m2?.eatingOut.dinnerForTwo, lowerIsBetter: true
                    },
                    {
                      label: "Monthly transit pass", unit: "/mo",
                      v1: m1?.transport.monthlyPass, v2: m2?.transport.monthlyPass, lowerIsBetter: true
                    },
                    {
                      label: "Utilities (85m²)", unit: "/mo",
                      v1: m1?.utilities.basic85m2, v2: m2?.utilities.basic85m2, lowerIsBetter: true
                    },
                    {
                      label: "Internet", unit: "/mo",
                      v1: m1?.internet.monthly, v2: m2?.internet.monthly, lowerIsBetter: true
                    },
                    {
                      label: "Latte", unit: "",
                      v1: m1?.eatingOut.latte, v2: m2?.eatingOut.latte, lowerIsBetter: true
                    },
                  ].filter(r => r.v1 != null || r.v2 != null).map(({ label, unit, v1, v2, lowerIsBetter }) => {
                    const cheaper1 = lowerIsBetter
                      ? (v1 != null && v2 != null && v1 < v2)
                      : (v1 != null && v2 != null && v1 > v2);
                    const cheaper2 = lowerIsBetter
                      ? (v1 != null && v2 != null && v2 < v1)
                      : (v1 != null && v2 != null && v2 > v1);
                    return (
                      <tr key={label} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{label}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${cheaper1 ? "text-accent" : "text-foreground"}`}>
                            {v1 != null ? `€${v1}${unit}` : "—"}
                          </span>
                          {cheaper1 && <span className="ml-1.5 text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">lower</span>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${cheaper2 ? "text-primary" : "text-foreground"}`}>
                            {v2 != null ? `€${v2}${unit}` : "—"}
                          </span>
                          {cheaper2 && <span className="ml-1.5 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">lower</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Key difference callout ───────────────────────────────────── */}
        <section className="mb-12">
          <Card className="bg-muted/30">
            <CardContent className="p-5 flex gap-4 items-start">
              <span className="text-2xl" aria-hidden="true">⚖️</span>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Key difference</div>
                <p className="text-sm text-foreground font-medium">{lp.keyDifference}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── Salary calculator CTAs ───────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-xl font-serif font-bold text-foreground mb-5">
            Calculate Your Take-Home Pay
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href={`/salary-calculator/${lp.country1Slug}`}>
              <Card className="group cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 h-full border-accent/20">
                <CardContent className="p-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{lp.country1Name}</div>
                    <div className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {lp.city1Name} Salary Calculator
                    </div>
                  </div>
                  <Calculator className="w-5 h-5 text-accent shrink-0" />
                </CardContent>
              </Card>
            </Link>
            <Link href={`/salary-calculator/${lp.country2Slug}`}>
              <Card className="group cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 h-full border-primary/20">
                <CardContent className="p-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{lp.country2Name}</div>
                    <div className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {lp.city2Name} Salary Calculator
                    </div>
                  </div>
                  <Calculator className="w-5 h-5 text-primary shrink-0" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        {lp.faq.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-5">
              Frequently Asked Questions
            </h2>
            <Card>
              <CardContent className="p-6">
                {lp.faq.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── Related comparisons ──────────────────────────────────────── */}
        {lp.relatedSlugs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">More City Comparisons</h2>
            <div className="flex flex-wrap gap-3">
              {lp.relatedSlugs.map((slug) => (
                <Link key={slug} href={`/compare/${slug}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    {slugToLabel(slug)} <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              ))}
              <Link href="/compare">
                <Button variant="outline" size="sm" className="gap-1">
                  All comparisons <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-xl font-serif font-bold text-foreground mb-3">
            Want a full side-by-side breakdown?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Use the interactive compare tool to see all 9 dimensions — salary, safety, cost, weather, and more.
          </p>
          <Link href={compareToolUrl}>
            <Button size="lg" className="gap-2 px-8">
              <Scale className="w-5 h-5" />
              Compare {lp.city1Name} vs {lp.city2Name}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

function slugToLabel(slug: string): string {
  return slug
    .split("-vs-")
    .map((part) => part.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "))
    .join(" vs ");
}
