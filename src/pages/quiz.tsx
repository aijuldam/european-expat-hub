import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { quizQuestions, categoryConfig } from "@/data/quiz";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";
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

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [, setLocation] = useLocation();

  const question = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSelect = useCallback((value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }, [question.id]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(answers)) {
        params.set(k, v);
      }
      setLocation(`/quiz/results?${params.toString()}`);
    }
  }, [currentStep, totalSteps, answers, setLocation]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const selectedValue = answers[question.id];

  return (
    <Layout>
      <div className="min-h-[calc(100dvh-8rem)] flex flex-col">
        <div className="bg-primary/5 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Compass className="w-4 h-4" />
                <span>Question {currentStep + 1} of {totalSteps}</span>
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
              {question.options.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all ${
                    selectedValue === option.value
                      ? "ring-2 ring-accent border-accent bg-accent/5"
                      : "hover:border-accent/50 hover:shadow-sm"
                  }`}
                  onClick={() => handleSelect(option.value)}
                  data-testid={`option-${option.value}`}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      selectedValue === option.value ? "border-accent bg-accent" : "border-muted-foreground/30"
                    }`}>
                      {selectedValue === option.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">{option.label}</span>
                  </CardContent>
                </Card>
              ))}
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
                disabled={!selectedValue}
                className="gap-2"
                data-testid="button-next"
              >
                {currentStep === totalSteps - 1 ? "See Results" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
