import { Home, ShoppingCart, Train, UtensilsCrossed, Info, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCostOfLiving, REFERENCE_CITY_NAME } from "@/data/cost-of-living";
import { getCityMetrics } from "@/data/city-costs";
import type { City } from "@/data/cities";

interface Props {
  city: City;
}

function MetricRow({
  icon: Icon,
  label,
  value,
  unit,
  tooltip,
  colorClass,
}: {
  icon: React.ElementType;
  label: string;
  value: number | null;
  unit: string;
  tooltip: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 flex-shrink-0 ${colorClass}`} aria-hidden="true" />
      <span className="text-sm text-muted-foreground w-24 flex-shrink-0">{label}</span>
      <span className="flex-1 text-sm font-medium text-foreground">
        {value !== null ? (
          <>
            <span className="font-semibold">€{value.toLocaleString()}</span>
            <span className="text-muted-foreground text-xs ml-1">{unit}</span>
          </>
        ) : (
          <span className="text-muted-foreground italic text-xs">— data coming soon</span>
        )}
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors" aria-label={`About ${label}`}>
              <Info className="w-3.5 h-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs text-xs leading-relaxed">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function CostBreakdownCard({ city }: Props) {
  const col = getCostOfLiving(city);
  const metrics = getCityMetrics(city.slug);
  const hasDetail = metrics !== null;

  const scoreColor =
    col.totalScore <= 85 ? "text-emerald-600" :
    col.totalScore <= 110 ? "text-foreground" :
    col.totalScore <= 140 ? "text-amber-600" :
    "text-red-600";

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-4xl font-bold ${scoreColor}`}>{col.totalScore}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground/50 hover:text-muted-foreground mt-1" aria-label="About Cost of Living Score">
                      <Info className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs text-xs leading-relaxed">
                    A score showing how expensive this city is for a standard 2-adult household
                    renting a 1-bedroom city-centre apartment. <strong>{REFERENCE_CITY_NAME} = 100</strong>.
                    A score of {col.totalScore} means this city is approximately{" "}
                    {col.totalScore > 100
                      ? `${col.totalScore - 100}% more expensive`
                      : `${100 - col.totalScore}% cheaper`}{" "}
                    than {REFERENCE_CITY_NAME}. Calculated from rent, groceries, public transport,
                    and dining. Methodology: {col.methodologyVersion}.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-xs text-muted-foreground">
              Cost of Living Score
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {REFERENCE_CITY_NAME} = 100 · 2-adult household
            </div>
          </div>
          {col.totalScore === 100 && (
            <span className="text-xs bg-accent/10 text-accent border border-accent/20 rounded-full px-2 py-0.5 font-medium whitespace-nowrap">
              Reference city
            </span>
          )}
        </div>

        {/* EUR Breakdown */}
        {hasDetail ? (
          <div className="space-y-3 mb-5">
            <MetricRow
              icon={Home}
              label="Rent"
              value={col.rentEurPerM2CityCenter}
              unit="/m² city centre"
              tooltip="Median monthly rental price per square metre for a city-centre residential apartment. Source: Numbeo crowd-reported data."
              colorClass="text-blue-500"
            />
            <MetricRow
              icon={ShoppingCart}
              label="Groceries"
              value={col.groceryMonthlyEur2Adults}
              unit="/month · 2 adults"
              tooltip="Estimated monthly grocery spend for 2 adults. Actual spending varies by diet and shopping habits. Source: Numbeo / national statistics."
              colorClass="text-green-500"
            />
            <MetricRow
              icon={Train}
              label="Transport"
              value={col.transportMonthlyPassEur}
              unit="/month · 1 pass"
              tooltip="Cost of one adult monthly public transport subscription. Sourced directly from the official transit operator fare schedule."
              colorClass="text-purple-500"
            />
            <MetricRow
              icon={UtensilsCrossed}
              label="Dining"
              value={col.diningMidrangeDinner2Eur}
              unit="/dinner · 2 adults"
              tooltip="Cost of a mid-range restaurant dinner for 2 adults including drinks, based on crowd-reported pricing."
              colorClass="text-orange-500"
            />
          </div>
        ) : (
          <div className="rounded-md bg-muted/40 px-4 py-3 mb-5 text-sm text-muted-foreground italic">
            Detailed cost breakdown coming soon for this city.
          </div>
        )}

        {/* Sources footer */}
        {hasDetail && metrics.sources.length > 0 && (
          <div className="border-t border-border/50 pt-3">
            <div className="text-xs text-muted-foreground mb-1.5 font-medium">Sources</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {metrics.sources.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s.label}
                  <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                  {s.source_type === "crowdsourced" && (
                    <span className="text-amber-600/80 text-[10px]">(crowd)</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
