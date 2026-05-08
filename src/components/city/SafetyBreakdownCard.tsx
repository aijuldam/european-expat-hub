import { Shield, Info, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCityMetrics } from "@/data/city-costs";
import type { City } from "@/data/cities";
import type { CrimeMetricType } from "@/data/city-costs";

interface Props {
  city: City;
}

function IndexBar({ value, higherIsBetter }: { value: number; higherIsBetter: boolean }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = higherIsBetter
    ? pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"
    : pct <= 30 ? "bg-emerald-500" : pct <= 55 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex-1 bg-muted rounded-full h-1.5">
      <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function metricTypeLabel(type: CrimeMetricType): React.ReactNode {
  if (type === "perception_index") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 cursor-default">
              perception index <Info className="w-2.5 h-2.5" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
            This is a perception-based index compiled from resident surveys, not official
            police statistics. It reflects how safe people feel, which may differ from
            recorded crime rates.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <span className="text-[10px] text-emerald-700 font-medium">
      official rate / 100k
    </span>
  );
}

function SafetyRow({
  label,
  value,
  unit,
  higherIsBetter,
  metricType,
  tooltip,
}: {
  label: string;
  value: number | null;
  unit: string;
  higherIsBetter: boolean;
  metricType: CrimeMetricType;
  tooltip: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground w-28 flex-shrink-0">{label}</span>
      {value !== null ? (
        <>
          <IndexBar value={value} higherIsBetter={higherIsBetter} />
          <span className="text-xs font-semibold text-foreground w-14 text-right flex-shrink-0">
            {value}<span className="font-normal text-muted-foreground">{unit}</span>
          </span>
          <div className="w-28 flex-shrink-0">{metricTypeLabel(metricType)}</div>
        </>
      ) : (
        <span className="text-xs text-muted-foreground italic">— not available</span>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors flex-shrink-0" aria-label={`About ${label}`}>
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

export function SafetyBreakdownCard({ city }: Props) {
  const metrics = getCityMetrics(city.slug);
  const safety = metrics?.safety ?? null;

  // Fall back to the opaque city.safetyIndex if no detailed JSON
  const safetyIndex = safety?.safetyIndex ?? city.safetyIndex;

  const indexColor =
    safetyIndex >= 75 ? "text-emerald-600" :
    safetyIndex >= 60 ? "text-amber-600" :
    "text-red-600";

  const numbeoCrimeSource = metrics?.sources.find(s =>
    s.source_type === "crowdsourced" && s.metric_keys.includes("safety")
  );

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-blue-500" aria-hidden="true" />
          <h3 className="font-semibold text-foreground">Safety</h3>
        </div>

        {/* Safety Index — primary number */}
        <div className="flex items-end gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-4xl font-bold ${indexColor}`}>{safetyIndex}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground/50 hover:text-muted-foreground mb-1" aria-label="About Safety Index">
                      <Info className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs text-xs leading-relaxed">
                    A perception-based index (0–100, higher = safer) compiled by Numbeo from
                    resident surveys. This is <strong>not an official crime rate</strong>. It
                    reflects how safe residents perceive their city to be, which can differ
                    significantly from recorded crime statistics.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-xs text-muted-foreground">/100 · Safety Index</div>
          </div>
          <div className="flex-1 pb-1">
            <IndexBar value={safetyIndex} higherIsBetter={true} />
          </div>
        </div>

        {/* Breakdown — only for launch cities */}
        {safety ? (
          <>
            <div className="space-y-3 mb-4">
              <SafetyRow
                label="Overall Crime"
                value={safety.crimeIndex}
                unit="/100"
                higherIsBetter={false}
                metricType={safety.propertyCrimeMetricType}
                tooltip="Overall perceived crime level (0–100, lower = safer). Numbeo perception index based on resident surveys."
              />
              <SafetyRow
                label="Property Crime"
                value={safety.propertyCrimeIndex}
                unit="/100"
                higherIsBetter={false}
                metricType={safety.propertyCrimeMetricType}
                tooltip="Perceived frequency of property crime — theft, burglary, vandalism. Numbeo perception index."
              />
              <SafetyRow
                label="Violent Crime"
                value={safety.violentCrimeIndex}
                unit="/100"
                higherIsBetter={false}
                metricType={safety.violentCrimeMetricType}
                tooltip="Perceived frequency of violent crime. Numbeo perception index."
              />
            </div>

            {/* Perception disclaimer */}
            <div className="rounded-md bg-amber-50 border border-amber-200/60 px-3 py-2 text-xs text-amber-800 leading-relaxed mb-4">
              ⚠️ These are <strong>perception-based indicators</strong>, not official crime
              statistics. Residents' sense of safety can differ from recorded crime rates.
            </div>
          </>
        ) : (
          <div className="rounded-md bg-muted/40 px-4 py-3 mb-4 text-sm text-muted-foreground italic">
            Detailed safety breakdown coming soon for this city.
          </div>
        )}

        {/* Source */}
        {numbeoCrimeSource && (
          <div className="border-t border-border/50 pt-3">
            <div className="text-xs text-muted-foreground mb-1 font-medium">Source</div>
            <a
              href={numbeoCrimeSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {numbeoCrimeSource.label}
              <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
              <span className="text-amber-600/80 text-[10px]">(crowd)</span>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
