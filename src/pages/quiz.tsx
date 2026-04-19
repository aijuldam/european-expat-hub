import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { quizQuestions, categoryConfig } from "@/data/quiz";
import { ArrowLeft, ArrowRight, Check, Compass } from "lucide-react";
import { Shield, Coins, Sun, Banknote, Heart, Languages, Globe, Zap, Train, Palette } from "lucide-react";

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

// Indices of the two language questions — used for skip logic
const langEnvIdx = quizQuestions.findIndex((q) => q.id === "language_env");
const langSkillsIdx = quizQuestions.findIndex((q) => q.id === "language_skills");

function shouldSkipLanguageSkills(answers: Record<string, string | string[]>) {
  return answers["language_env"] === "english_first";
}

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [, setLocation] = useLocation();

  const question = quizQuestions[currentStep];
  const isMulti = question.multiSelect === true;

  // Derive selected state for single vs multi
  const rawAnswer = answers[question.id];
  const selectedValue = isMulti ? undefined : (rawAnswer as string | undefined);
  const selectedValues: string[] = isMulti
    ? (Array.isArray(rawAnswer) ? rawAnswer : [])
    : [];

  // Visible steps: exclude language_skills when english_first is selected
  const visibleQuestions = quizQuestions.filter(
    (q) => q.id !== "language_skills" || !shouldSkipLanguageSkills(answers)
  );
  const visibleIdx = visibleQuestions.findIndex((q) => q.id === question.id);
  const totalVisible = visibleQuestions.length;
  const progress = ((visibleIdx + 1) / totalVisible) * 100;

  const handleSingleSelect = useCallback((value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }, [question.id]);

  const handleMultiToggle = useCallback((value: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[question.id]) ? (prev[question.id] as string[]) : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [question.id]: next };
    });
  }, [question.id]);

  const handleNext = useCallback(() => {
    // Skip language_skills if english_first selected
    if (question.id === "language_env" && answers["language_env"] === "english_first") {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next["language_skills"];
        return next;
      });
      setCurrentStep(langSkillsIdx + 1);
      return;
    }

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Navigate directly to results — no gate required
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(answers)) {
        params.set(k, Array.isArray(v) ? v.join(",") : v);
      }
      setLocation(`/quiz/results?${params.toString()}`);
    }
  }, [currentStep, answers, question.id, setLocation]);

  const handleBack = useCallback(() => {
    // If we're one step past language_skills and it was skipped, jump back to language_env
    if (currentStep === langSkillsIdx + 1 && shouldSkipLanguageSkills(answers)) {
      setCurrentStep(langEnvIdx);
      return;
    }
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep, answers]);

  const isNextDisabled = isMulti ? selectedValues.length === 0 : !selectedValue;

  return (
    <Layout>
      <div className="min-h-[calc(100dvh-8rem)] flex flex-col">
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

        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-2xl">
            {(() => {
              const cat = categoryConfig[question.category];
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
            {question.description && (
              <p className="text-muted-foreground mb-8">{question.description}</p>
            )}
            {!question.description && <div className="mb-8" />}

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
                        // Checkbox for multi-select
                        <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                          isSelected ? "border-accent bg-accent" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      ) : (
                        // Radio for single-select
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
