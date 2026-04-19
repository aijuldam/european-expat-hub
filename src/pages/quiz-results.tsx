import { useMemo, useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { calculateQuizResults, dimensionLabels, type QuizDimension } from "@/data/quiz";
import { getCountryById } from "@/data/countries";
import { getCityById } from "@/data/cities";
import { ArrowRight, MapPin, Trophy, BarChart3, RotateCcw, Mail, Check, Info, CheckCircle2 } from "lucide-react";
import {
  saveLead,
  MARKETING_CONSENT_TEXT,
  PRIVACY_NOTICE_VERSION,
  PRIVACY_NOTICE_URL,
} from "@/lib/leads";

export default function QuizResults() {
  const results = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const answers: Record<string, string | string[]> = {};
    params.forEach((value, key) => {
      answers[key] = value.includes(",") ? value.split(",") : value;
    });
    return calculateQuizResults(answers);
  }, []);

  const answers = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const a: Record<string, string | string[]> = {};
    params.forEach((value, key) => {
      a[key] = value.includes(",") ? value.split(",") : value;
    });
    return a;
  }, []);

  const topResults = results.slice(0, 3);
  const otherResults = results.slice(3);

  // ── Optional email capture state ────────────────────────────────
  const [email, setEmail] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSaveResults = useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      emailInputRef.current?.focus();
      return;
    }
    setEmailError("");
    setIsSubmitting(true);

    const topResult = results[0];

    saveLead({
      email: trimmed,
      quiz_answers: answers,
      quiz_top_match: topResult?.cityName ?? "",
      quiz_top_match_pct: topResult?.matchPercentage ?? 0,
      quiz_result_snapshot: JSON.stringify(topResults.map((r) => ({
        cityId: r.cityId,
        cityName: r.cityName,
        matchPercentage: r.matchPercentage,
      }))),
      result_processing_lawful_basis: "legitimate_interests",
      marketing_consent: marketingOptIn,
      ...(marketingOptIn
        ? {
            marketing_consent_timestamp: new Date().toISOString(),
            marketing_consent_text: MARKETING_CONSENT_TEXT,
          }
        : {}),
      privacy_notice_version: PRIVACY_NOTICE_VERSION,
      source_url: window.location.href,
    });

    setIsSubmitting(false);
    setSubmitted(true);
  }, [email, marketingOptIn, results, answers, topResults]);

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-1.5 mb-4 text-sm text-accent font-medium">
            <Trophy className="w-4 h-4" />
            Your Recommendations
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3" data-testid="text-results-title">
            Your Best Matches
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Based on your preferences, here are the cities that fit you best. The match percentage reflects how well each city aligns with your priorities.
          </p>
          {/* Profiling / automated decision-making notice */}
          <p className="mt-3 text-xs text-muted-foreground/70 max-w-xl mx-auto flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            Your quiz answers were used to generate these personalised recommendations. No fully automated decision with legal effect is made — you are free to explore any city.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        {/* ── Top 3 results ────────────────────────────────────── */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {topResults.map((result, index) => {
            const city = getCityById(result.cityId);
            const country = city ? getCountryById(city.countryId) : undefined;

            return (
              <Card key={result.cityId} className={`overflow-hidden ${index === 0 ? "ring-2 ring-accent" : ""}`} data-testid={`card-result-${result.cityId}`}>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{result.countryName}</span>
                          {index === 0 && <Badge variant="default" className="ml-2">Best Match</Badge>}
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-foreground">
                          #{index + 1} {result.cityName}
                        </h2>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-accent">{result.matchPercentage}%</div>
                        <div className="text-xs text-muted-foreground">match</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {result.topReasons.map((reason) => (
                        <Badge key={reason} variant="secondary" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        Score Breakdown
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {(Object.keys(dimensionLabels) as QuizDimension[]).map((dim) => {
                          const score = result.dimensionScores[dim];
                          const maxPossible = 30;
                          const pct = Math.min(100, Math.max(0, (score / maxPossible) * 100));
                          return (
                            <div key={dim} className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground w-28 flex-shrink-0 truncate">{dimensionLabels[dim]}</span>
                              <Progress value={pct} className="h-1.5 flex-1" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Link href={`/countries/${country?.slug}/${city?.slug}`}>
                        <Button size="sm" className="gap-1" data-testid={`button-view-${result.cityId}`}>
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      {index < topResults.length - 1 && (
                        <Link href={`/compare?city1=${result.cityId}&city2=${topResults[index === 0 ? 1 : 0].cityId}`}>
                          <Button size="sm" variant="outline" data-testid={`button-compare-${result.cityId}`}>
                            Compare
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── Other matches ─────────────────────────────────────── */}
        {otherResults.length > 0 && (
          <div className="max-w-3xl mx-auto mt-10">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Other matches
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {otherResults.map((result) => {
                const city = getCityById(result.cityId);
                const country = city ? getCountryById(city.countryId) : undefined;
                return (
                  <Link key={result.cityId} href={`/countries/${country?.slug}/${city?.slug}`}>
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border/50 hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer group">
                      <div className="flex items-center gap-2 text-sm text-foreground group-hover:text-accent transition-colors">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium">{result.cityName}</span>
                        <span className="text-muted-foreground text-xs">{result.countryName}</span>
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">{result.matchPercentage}%</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Optional: save & email results ───────────────────── */}
        <div className="max-w-3xl mx-auto mt-12">
          <Card className="border-dashed">
            <CardContent className="p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Got it — we'll send your results shortly.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You can update your preferences or unsubscribe at any time via the link in our emails.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Save and email your results</h3>
                    <Badge variant="outline" className="text-xs font-normal">Optional</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-5">
                    Enter your email if you'd like us to send you your results and recommendations. No account needed.
                  </p>

                  <div className="space-y-4">
                    {/* Email field */}
                    <div>
                      <label htmlFor="results-email" className="block text-sm font-medium text-foreground mb-1.5">
                        Email address
                      </label>
                      <input
                        ref={emailInputRef}
                        id="results-email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && !isSubmitting && handleSaveResults()}
                        placeholder="you@example.com"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        data-testid="input-email"
                      />
                      {emailError && (
                        <p className="mt-1.5 text-xs text-destructive">{emailError}</p>
                      )}
                    </div>

                    {/* Optional marketing opt-in — unchecked by default */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="mt-0.5 relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={marketingOptIn}
                          onChange={(e) => setMarketingOptIn(e.target.checked)}
                          className="sr-only"
                          data-testid="checkbox-marketing"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                            ${marketingOptIn
                              ? "border-accent bg-accent"
                              : "border-muted-foreground/40 group-hover:border-accent/60"}`}
                        >
                          {marketingOptIn && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {MARKETING_CONSENT_TEXT}
                      </span>
                    </label>

                    {/* Privacy notice */}
                    <p className="text-xs text-muted-foreground">
                      We use your quiz answers to generate your recommendation and, if you provide your email, to send
                      your results. See our{" "}
                      <a
                        href={PRIVACY_NOTICE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-foreground transition-colors"
                      >
                        Privacy Notice
                      </a>{" "}
                      for details on how we handle your data, your rights, and how to unsubscribe.
                    </p>

                    <Button
                      onClick={handleSaveResults}
                      disabled={isSubmitting || !email.trim()}
                      className="gap-2"
                      data-testid="button-save-results"
                    >
                      {isSubmitting ? "Sending…" : "Send my results"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Retake ────────────────────────────────────────────── */}
        <div className="text-center mt-10">
          <Link href="/quiz">
            <Button variant="outline" className="gap-2" data-testid="button-retake">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
