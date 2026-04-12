import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cities } from "@/data/cities";
import { compareCities } from "@/data/comparison";
import { Scale, ArrowRight, Check, Minus } from "lucide-react";

export default function Compare() {
  const [city1Id, setCity1Id] = useState<string>("");
  const [city2Id, setCity2Id] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c1 = params.get("city1");
    const c2 = params.get("city2");
    if (c1) setCity1Id(c1);
    if (c2) setCity2Id(c2);
  }, []);

  const result = useMemo(() => {
    if (!city1Id || !city2Id || city1Id === city2Id) return null;
    return compareCities(city1Id, city2Id);
  }, [city1Id, city2Id]);

  return (
    <Layout>
      <div className="bg-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-6 h-6 text-accent" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground" data-testid="text-compare-title">
              Compare Cities
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Select two cities to see a detailed side-by-side comparison across key dimensions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">First City</label>
              <Select value={city1Id} onValueChange={setCity1Id}>
                <SelectTrigger data-testid="select-city1">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={c.id} disabled={c.id === city2Id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Second City</label>
              <Select value={city2Id} onValueChange={setCity2Id}>
                <SelectTrigger data-testid="select-city2">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={c.id} disabled={c.id === city1Id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {city1Id && city2Id && city1Id === city2Id && (
            <div className="text-center text-muted-foreground py-8">
              Please select two different cities to compare.
            </div>
          )}

          {!city1Id || !city2Id ? (
            <div className="text-center text-muted-foreground py-16">
              <Scale className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Select two cities above to see their comparison</p>
            </div>
          ) : null}

          {result && (
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6 text-center">
                <div className="text-xl font-serif font-bold text-foreground">{result.city1.name}</div>
                <div className="text-sm text-muted-foreground self-center">vs</div>
                <div className="text-xl font-serif font-bold text-foreground">{result.city2.name}</div>
              </div>

              {result.dimensions.map(({ dimension, formatted1, formatted2, winner, difference }) => (
                <Card key={dimension.key} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-0">
                      <div className={`p-4 text-center ${winner === "city1" ? "bg-accent/10" : ""}`}>
                        <div className="text-lg font-semibold text-foreground">{formatted1}</div>
                        {winner === "city1" && (
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Check className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs text-accent font-medium">Better</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center justify-center px-4 border-x bg-muted/20 min-w-[140px]">
                        <div className="text-xs font-medium text-foreground text-center">{dimension.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {winner === "tie" ? (
                            <span className="flex items-center gap-1"><Minus className="w-3 h-3" /> Equal</span>
                          ) : (
                            difference
                          )}
                        </div>
                      </div>
                      <div className={`p-4 text-center ${winner === "city2" ? "bg-accent/10" : ""}`}>
                        <div className="text-lg font-semibold text-foreground">{formatted2}</div>
                        {winner === "city2" && (
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <Check className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs text-accent font-medium">Better</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="grid sm:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Best For</h3>
                    <p className="text-sm text-muted-foreground">{result.city1.bestFor}</p>
                    <h3 className="font-semibold text-foreground mb-2 mt-4">Family Fit</h3>
                    <p className="text-sm text-muted-foreground">{result.city1.familyFitSummary}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Best For</h3>
                    <p className="text-sm text-muted-foreground">{result.city2.bestFor}</p>
                    <h3 className="font-semibold text-foreground mb-2 mt-4">Family Fit</h3>
                    <p className="text-sm text-muted-foreground">{result.city2.familyFitSummary}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
