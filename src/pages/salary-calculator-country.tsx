import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { getCountryLPData } from "@/data/salary-lp-data";
import { getCountryBySlug } from "@/data/countries";
import { getCitiesByCountryId } from "@/data/cities";
import { useState } from "react";

interface Props {
  params: { country: string };
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

function fmt(n: number) {
  return "€" + n.toLocaleString("en-EU");
}

export default function SalaryCalculatorCountry({ params }: Props) {
  const lp = getCountryLPData(params.country);
  const country = getCountryBySlug(params.country);

  if (!lp) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Country not found</h1>
          <Link href="/salary-calculator"><Button>Back to Salary Calculator</Button></Link>
        </div>
      </Layout>
    );
  }

  const cities = country ? getCitiesByCountryId(country.id) : [];
  const hasCalculator = lp.countryCode !== null;
  const calcLink = hasCalculator
    ? `/salary-calculator?country=${lp.countryCode}`
    : `/salary-calculator`;

  // Schema: FAQPage + SoftwareApplication
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": lp.faq.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  };

  const appSchema = hasCalculator ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${lp.name} Net Salary Calculator`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": `https://expatlix.com/salary-calculator/${lp.slug}`,
    "description": lp.seoDescription,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
  } : null;

  return (
    <Layout>
      {/* Inject schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {appSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" aria-hidden="true">{lp.flagEmoji}</span>
              <nav aria-label="Breadcrumb" className="text-sm text-primary-foreground/60">
                <Link href="/salary-calculator" className="hover:text-primary-foreground transition-colors">
                  Salary Calculator
                </Link>
                <span className="mx-2">/</span>
                <span className="text-primary-foreground">{lp.name}</span>
              </nav>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight mb-5 leading-tight">
              {lp.h1}
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mb-8 leading-relaxed">
              {lp.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={calcLink}>
                <Button size="lg" variant="secondary" className="gap-2 text-base px-8">
                  <Calculator className="w-5 h-5" />
                  {hasCalculator ? `Open ${lp.name} Calculator` : "Open Salary Calculator"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              {lp.relatedCountrySlugs[0] && (
                <Link href={`/salary-calculator/${lp.relatedCountrySlugs[0]}`}>
                  <Button size="lg" variant="outline"
                    className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Compare with {countryName(lp.relatedCountrySlugs[0])}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tax highlights strip ─────────────────────────────────────── */}
      <div className="bg-muted/40 border-y border-border py-5">
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row md:divide-x divide-border gap-4 md:gap-0">
            {lp.taxHighlights.map((h) => (
              <li key={h} className="md:px-6 first:pl-0 last:pr-0 text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">→ </span>{h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">

        {/* ── Special regime ───────────────────────────────────────────── */}
        {lp.specialRegime && (
          <section className="mb-12">
            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {lp.specialRegime.name}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lp.specialRegime.description}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── Median salary benchmark ───────────────────────────────────── */}
        {lp.medianSalary && (
          <section className="mb-12">
            <Card className="border-border bg-muted/30">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Median Annual Salary — {lp.name}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {lp.medianSalary.currency !== "EUR"
                        ? `${lp.medianSalary.currency} ${lp.medianSalary.gross.toLocaleString("en-EU")}`
                        : `€${lp.medianSalary.gross.toLocaleString("en-EU")}`}
                      {lp.medianSalary.grossEur && lp.medianSalary.currency !== "EUR" && (
                        <span className="text-base font-normal text-muted-foreground ml-2">
                          ≈ €{lp.medianSalary.grossEur.toLocaleString("en-EU")}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Gross, full-time adjusted · {lp.medianSalary.source} · {lp.medianSalary.year}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-right sm:max-w-[220px] leading-relaxed">
                    Use this as a benchmark when evaluating job offers. Salaries in tech, finance, and consulting typically run 30–60% above the national median.
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── Example calculations ─────────────────────────────────────── */}
        {lp.examples.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">
              Example Take-Home Pay — {lp.name} 2025
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Standard employment income. Figures in EUR.
              {lp.countryCode === "CH" && " Converted from CHF at current rate."}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-3 font-semibold text-foreground rounded-tl-lg">Gross Annual</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">Net Annual</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground">Net Monthly</th>
                    <th className="text-right px-4 py-3 font-semibold text-foreground rounded-tr-lg">Effective Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {lp.examples.map((ex) => (
                    <tr key={ex.grossAnnual} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{fmt(ex.grossAnnual)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">{fmt(ex.netAnnual)}</td>
                      <td className="px-4 py-3 text-right text-accent font-semibold">
                        {fmt(Math.round(ex.netAnnual / 12))}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{ex.effectiveTaxRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Estimates only. Based on 2025 tax parameters. Does not include bonuses, pension contributions, or employer-side charges.{" "}
              <Link href="/methodology" className="underline hover:text-foreground transition-colors">
                Methodology
              </Link>
            </p>
          </section>
        )}

        {/* ── No calculator yet – info card ────────────────────────────── */}
        {!hasCalculator && (
          <section className="mb-12">
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Calculator className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <h2 className="font-semibold text-foreground mb-2">Interactive Calculator Coming Soon</h2>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  A full gross-to-net calculator for {lp.name} is in development.
                  In the meantime, use the resources below.
                </p>
                <a
                  href={
                    params.country === "united-kingdom"
                      ? "https://www.gov.uk/estimate-income-tax"
                      : params.country === "uae"
                      ? "https://u.ae/en/information-and-services/jobs/labour-law"
                      : "https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-reliefs-rebates-and-deductions"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  Official tax resource <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── Cities in this country ───────────────────────────────────── */}
        {(lp.relatedCities.length > 0 || cities.length > 0) && (
          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold text-foreground mb-5">
              Cities in {lp.name}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(lp.relatedCities.length > 0 ? lp.relatedCities : cities.slice(0, 3).map(c => ({
                name: c.name, slug: c.slug, countrySlug: params.country
              }))).map((city) => (
                <Link key={city.slug} href={`/countries/${city.countrySlug}/${city.slug}`}>
                  <Card className="group cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 h-full">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                        {city.name}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        View city guide <ArrowRight className="w-3 h-3" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

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

        {/* ── Internal links ───────────────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Compare Other Countries</h2>
          <div className="flex flex-wrap gap-3">
            {lp.relatedCountrySlugs.map((slug) => (
              <Link key={slug} href={`/salary-calculator/${slug}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  {countryName(slug)} <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ))}
            <Link href="/salary-calculator">
              <Button variant="outline" size="sm" className="gap-1">
                All countries <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </section>

      </div>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-xl font-serif font-bold text-foreground mb-3">
            Ready to calculate your {lp.name} salary?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Open the calculator, enter your gross salary, and see your real take-home — including all deductions.
          </p>
          <Link href={calcLink}>
            <Button size="lg" className="gap-2 px-8">
              <Calculator className="w-5 h-5" />
              {hasCalculator ? `Calculate ${lp.name} Take-Home` : "Open Salary Calculator"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

/** Fallback display name from slug */
function countryName(slug: string): string {
  return slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}
