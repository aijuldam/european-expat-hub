import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { calculateSalary, type SalaryBreakdown } from "@/data/salary-calculator";
import { Calculator, ArrowRight, AlertTriangle } from "lucide-react";

export default function SalaryCalculator() {
  const [country, setCountry] = useState<"nl" | "fr">("nl");
  const [grossInput, setGrossInput] = useState<string>("50000");
  const [thirtyPercentRuling, setThirtyPercentRuling] = useState(false);
  const [cadreStatus, setCadreStatus] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("country");
    if (c === "nl" || c === "fr") setCountry(c);
  }, []);

  const grossAnnual = parseInt(grossInput) || 0;

  const result: SalaryBreakdown | null = useMemo(() => {
    if (grossAnnual <= 0) return null;
    return calculateSalary({
      grossAnnual,
      country,
      thirtyPercentRuling: country === "nl" ? thirtyPercentRuling : undefined,
      cadreStatus: country === "fr" ? cadreStatus : undefined,
    });
  }, [grossAnnual, country, thirtyPercentRuling, cadreStatus]);

  return (
    <Layout>
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-6 h-6 text-accent" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground" data-testid="text-salary-title">
              Salary Calculator
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Estimate your gross-to-net income by country. Select your country, enter your gross annual salary, and see a detailed breakdown.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Country</Label>
                  <Select value={country} onValueChange={(v) => setCountry(v as "nl" | "fr")}>
                    <SelectTrigger data-testid="select-country">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nl">Netherlands</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Gross Annual Salary (EUR)</Label>
                  <Input
                    type="number"
                    value={grossInput}
                    onChange={(e) => setGrossInput(e.target.value)}
                    placeholder="e.g. 50000"
                    min={0}
                    data-testid="input-gross"
                  />
                </div>

                {country === "nl" && (
                  <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                    <div>
                      <Label className="text-sm font-medium">30% Ruling</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tax benefit for qualifying expat knowledge workers
                      </p>
                    </div>
                    <Switch
                      checked={thirtyPercentRuling}
                      onCheckedChange={setThirtyPercentRuling}
                      data-testid="switch-30percent"
                    />
                  </div>
                )}

                {country === "fr" && (
                  <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                    <div>
                      <Label className="text-sm font-medium">Cadre Status</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Cadre employees have higher social contributions but better benefits
                      </p>
                    </div>
                    <Switch
                      checked={cadreStatus}
                      onCheckedChange={setCadreStatus}
                      data-testid="switch-cadre"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {result && (
            <>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="p-6 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Net Annual</div>
                    <div className="text-3xl font-bold text-accent" data-testid="text-net-annual">
                      {result.netAnnual.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">EUR</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Net Monthly</div>
                    <div className="text-3xl font-bold text-foreground" data-testid="text-net-monthly">
                      {result.netMonthly.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">EUR</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-xs text-muted-foreground mb-1">Effective Tax Rate</div>
                    <div className="text-3xl font-bold text-foreground" data-testid="text-tax-rate">
                      {result.effectiveTaxRate}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Detailed Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Gross Annual Salary</span>
                      <span className="font-semibold text-foreground">{result.grossAnnual.toLocaleString()} EUR</span>
                    </div>
                    <Separator />
                    {result.breakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">{item.label}</span>
                          <p className="text-xs text-muted-foreground/70">{item.description}</p>
                        </div>
                        <span className={`font-medium ${item.amount < 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {item.amount < 0 ? "+" : "-"}{Math.abs(item.amount).toLocaleString()} EUR
                        </span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="text-foreground">Net Annual Salary</span>
                      <span className="text-accent text-lg">{result.netAnnual.toLocaleString()} EUR</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">{result.disclaimer}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
