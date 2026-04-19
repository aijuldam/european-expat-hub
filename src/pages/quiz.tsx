import { useState, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { quizQuestions, categoryConfig, calculateQuizResults } from "@/data/quiz";
import {
  ArrowLeft, ArrowRight, Check, Compass,
  Globe, CheckCircle2, ShieldCheck,
  Shield, Coins, Sun, Banknote, Heart, Languages, Zap, Train, Palette,
} from "lucide-react";
import {
  saveLead,
  MARKETING_CONSENT_TEXT,
  PRIVACY_NOTICE_VERSION,
  PRIVACY_NOTICE_URL,
} from "@/lib/leads";

// ── Category icons (quiz question UI) ────────────────────────────
const categoryIcons: Record<string, React.ElementType> = {
  safety: Shield,
  costOfLiving: Coins,
  weather: Sun,
  salary: Banknote,
  family: Heart,
  language: Languages,
  international: Globe,
  cityLife: Zap,
  transport: Train,
  lifestyle: Palette,
};

// ── Language skip logic ────────────────────────────────────────
const langEnvIdx   = quizQuestions.findIndex((q) => q.id === "language_env");
const langSkillsIdx = quizQuestions.findIndex((q) => q.id === "language_skills");

function shouldSkipLanguageSkills(answers: Record<string, string | string[]>) {
  return answers["language_env"] === "english_first";
}

// ── Helpers ───────────────────────────────────────────────────
function buildResultsUrl(answers: Record<string, string | string[]>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(answers)) {
    params.set(k, Array.isArray(v) ? v.join(",") : v);
  }
  return `/quiz/results?${params.toString()}`;
}

// ─────────────────────────────────────────────────────────────
export default function Quiz() {
  const [currentStep, setCurrentStep]     = useState(0);
  const [answers, setAnswers]             = useState<Record<string, string | string[]>>({});
  const [, setLocation]                   = useLocation();

  // Gate state
  const [showGate, setShowGate]           = useState(false);
  const [email, setEmail]                 = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [emailError, setEmailError]       = useState("");
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const emailRef                          = useRef<HTMLInputElement>(null);

  // ── Quiz question state ──────────────────────────────────
  const question   = quizQuestions[currentStep];
  const isMulti    = question.multiSelect === true;
  const rawAnswer  = answers[question.id];
  const selectedValue: string | undefined = isMulti ? undefined : (rawAnswer as string | undefined);
  const selectedValues: string[] = isMulti
    ? (Array.isArray(rawAnswer) ? rawAnswer : [])
    : [];

  const visibleQuestions = quizQuestions.filter(
    (q) => q.id !== "language_skills" || !shouldSkipLanguageSkills(answers)
  );
  const visibleIdx   = visibleQuestions.findIndex((q) => q.id === question.id);
  const totalVisible = visibleQuestions.length;
  const progress     = ((visibleIdx + 1) / totalVisible) * 100;

  // ── Handlers ────────────────────────────────────────────
  const handleSingleSelect = useCallback((value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }, [question.id]);

  const handleMultiToggle = useCallback((value: string) => {
    setAnswers((prev) => {
      const cur  = Array.isArray(prev[question.id]) ? (prev[question.id] as string[]) : [];
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      return { ...prev, [question.id]: next };
    });
  }, [question.id]);

  const handleNext = useCallback(() => {
    if (question.id === "language_env" && answers["language_env"] === "english_first") {
      setAnswers((prev) => { const n = { ...prev }; delete n["language_skills"]; return n; });
      setCurrentStep(langSkillsIdx + 1);
      return;
    }
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowGate(true);
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [currentStep, answers, question.id]);

  const handleBack = useCallback(() => {
    if (currentStep === langSkillsIdx + 1 && shouldSkipLanguageSkills(answers)) {
      setCurrentStep(langEnvIdx);
      return;
    }
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep, answers]);

  // Submit with email
  const handleGetResult = useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      emailRef.current?.focus();
      return;
    }
    setEmailError("");
    setIsSubmitting(true);

    const results   = calculateQuizResults(answers);
    const topResult = results[0];

    saveLead({
      email: trimmed,
      quiz_answers: answers,
      quiz_top_match: topResult?.cityName ?? "",
      quiz_top_match_pct: topResult?.matchPercentage ?? 0,
      quiz_result_snapshot: JSON.stringify(
        results.slice(0, 3).map((r) => ({ cityId: r.cityId, cityName: r.cityName, matchPercentage: r.matchPercentage }))
      ),
      result_delivery_requested: true,
      result_processing_lawful_basis: "legitimate_interests",
      marketing_consent: marketingOptIn,
      ...(marketingOptIn ? {
        marketing_consent_timestamp: new Date().toISOString(),
        marketing_consent_text: MARKETING_CONSENT_TEXT,
      } : {}),
      privacy_notice_version: PRIVACY_NOTICE_VERSION,
      source_url: window.location.href,
    });

    setLocation(buildResultsUrl(answers));
  }, [email, marketingOptIn, answers, setLocation]);

  // Skip — navigate without storing any email
  const handleSkip = useCallback(() => {
    setLocation(buildResultsUrl(answers));
  }, [answers, setLocation]);

  const isNextDisabled = isMulti ? selectedValues.length === 0 : !selectedValue;

  // ── Conversion gate ─────────────────────────────────────
  if (showGate) {
    return (
      <Layout>
        <div className="min-h-[calc(100dvh-8rem)] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
              <Globe className="w-6 h-6 text-accent" />
            </div>

            {/* Headline */}
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 leading-tight">
              Unlock your personalized expat recommendation
            </h2>

            {/* Benefit bullets */}
            <ul className="space-y-2.5 mb-5">
              {[
                "Your top-ranked city matches, scored across 8 dimensions",
                "Save your shortlist and revisit your results anytime",
                "Expat news, tips, and promotions tailored to your move",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>

            <p className="text-sm text-muted-foreground mb-6">
              Get your result by email, save your shortlist, and receive expat news, tips, and promotions tailored to your move.
            </p>

            {/* Form */}
            <div className="space-y-4">

              {/* Email field */}
              <div>
                <label htmlFor="gate-email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email address
                </label>
                <input
                  ref={emailRef}
                  id="gate-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && !isSubmitting && handleGetResult()}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  data-testid="input-email"
                />
                {emailError && (
                  <p className="mt-1.5 text-xs text-destructive" role="alert">{emailError}</p>
                )}
              </div>

              {/* Optional marketing opt-in — unchecked by default */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                    className="sr-only"
                    data-testid="checkbox-marketing"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
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

              {/* Primary CTA */}
              <Button
                onClick={handleGetResult}
                disabled={isSubmitting}
                size="lg"
                className="w-full gap-2 text-base"
                data-testid="button-get-result"
              >
                {isSubmitting ? "Saving…" : "Get my result"}
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Privacy reassurance */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2.5">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  We use your answers to generate your recommendation. Email helps us send and save your results.
                  Marketing is optional and you can unsubscribe anytime.{" "}
                  <a
                    href={PRIVACY_NOTICE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    Privacy Notice
                  </a>
                </span>
              </div>
            </div>

            {/* Skip — visible but clearly secondary */}
            <div className="mt-6 pt-5 border-t border-border/40 text-center">
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-skip"
              >
                Skip and view results online
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </Layout>
    );
  }

  // ── Quiz questions ───────────────────────────────────────
  return (
    <Layout>
      <div className="min-h-[calc(100dvh-8rem)] flex flex-col">

        {/* Progress bar */}
        <div className="bg-primary/5 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Compass className="w-4 h-4" />
                <span>Question {visibleIdx + 1} of {totalVisible}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" data-testid="progress-quiz" />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-2xl">
            {(() => {
              const cat  = categoryConfig[question.category];
              const Icon = categoryIcons[question.category];
              return (
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${cat.colorClass}`}>
                  {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                  {cat.label}
                </span>
              );
            })()}

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2" data-testid="text-question">
              {question.question}
            </h2>
            {question.description
              ? <p className="text-muted-foreground mb-8">{question.description}</p>
              : <div className="mb-8" />
            }

            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = isMulti
                  ? selectedValues.includes(option.value)
                  : selectedValue === option.value;

                return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "ring-2 ring-accent border-accent bg-accent/5"
                        : "hover:border-accent/50 hover:shadow-sm"
                    }`}
                    onClick={() => isMulti ? handleMultiToggle(option.value) : handleSingleSelect(option.value)}
                    data-testid={`option-${option.value}`}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      {isMulti ? (
                        <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                          isSelected ? "border-accent bg-accent" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          isSelected ? "border-accent bg-accent" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      )}
                      <span className="text-sm font-medium text-foreground">{option.label}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between mt-10">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={isNextDisabled}
                className="gap-2"
                data-testid="button-next"
              >
                {visibleIdx === totalVisible - 1 ? "See my results" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
