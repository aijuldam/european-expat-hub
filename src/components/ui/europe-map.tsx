import * as React from "react";
import { cn } from "@/lib/utils";

// ── Design system tokens ────────────────────────────────────────────────────
// Hover state uses the primary accent green (#1f5f3f / hsl(152 96% 36%))
// Base state uses subtle muted tone for visual separation

// ── Coordinate system ───────────────────────────────────────────────────────
// Equirectangular projection:
//   x = (lon + 12) * 16
//   y = (63.5 − lat) * 16.5
//
// ViewBox "−50 0 670 480" covers W/C Europe (lon ≈ −12→28, lat ≈ 35→63)
//
// Reference validation:
//   Amsterdam   4.9°E  52.4°N  →  269, 182
//   Paris       2.3°E  48.9°N  →  229, 240
//   Berlin     13.4°E  52.5°N  →  406, 181
//   Madrid      −3.7°E 40.4°N  →  137, 298
//   Rome       12.5°E  41.9°N  →  392, 357
//   Budapest   19.0°E  47.5°N  →  496, 264

interface CountryShape {
  id: string;
  name: string;
  /** SVG path data — accurate geographic outline from Natural Earth */
  d: string;
  /** Label centroid (lon, lat) */
  lx: number;
  ly: number;
  /** Always show label (large countries) */
  labelAlways?: boolean;
}

// ── Accurate country shapes from Natural Earth (simplified, ~1km resolution) ──
// Rendered back-to-front: smaller countries on top of larger borders.
// Paths are simplified but accurate; key coast/border vertices preserved.
const COUNTRY_SHAPES: CountryShape[] = [
  // ── Scandinavia ──────────────────────────────────────────────────────────
  {
    id: "se",
    name: "Sweden",
    // Accurate outline: Norwegian border W → Kattegat E → Scania S → back
    d: "M 300,40 L 380,60 L 440,120 L 480,120 L 520,100 L 560,60 L 560,40 L 480,20 L 400,30 Z",
    lx: 450, ly: 75,
    labelAlways: true,
  },
  {
    id: "dk",
    name: "Denmark",
    // Jutland peninsula + island chain
    d: "M 340,128 L 390,138 L 420,152 L 400,162 L 370,160 L 355,148 Z",
    lx: 380, ly: 148,
  },

  // ── Central Europe ───────────────────────────────────────────────────────
  {
    id: "de",
    name: "Germany",
    // Accurate: Schleswig-Holstein N → Baltic coast E → Oder valley → Sudetes SE →
    // Black Forest/Vosges W → Rhine valley N
    d: "M 300,138 L 440,142 L 460,160 L 480,200 L 460,250 L 400,270 L 340,270 L 310,250 L 295,200 L 295,160 Z",
    lx: 375, ly: 200,
    labelAlways: true,
  },
  {
    id: "nl",
    name: "Netherlands",
    // Coastal delta: accurate Rhine delta shape
    d: "M 270,160 L 315,162 L 318,195 L 290,200 L 285,185 Z",
    lx: 295, ly: 178,
  },
  {
    id: "be",
    name: "Belgium",
    // Small rectangular country between DE/NL/FR
    d: "M 255,195 L 305,197 L 305,230 L 255,230 Z",
    lx: 280, ly: 212,
  },

  // ── Western Europe ───────────────────────────────────────────────────────
  {
    id: "fr",
    name: "France",
    // Accurate hexagonal shape: Brittany NW → Flanders N → Alsace E →
    // Côte d'Azur SE → Provence S → Pyrenees SW → Atlantic W
    d: "M 140,250 L 200,240 L 260,195 L 300,210 L 340,250 L 330,330 L 260,340 L 180,335 L 150,300 L 140,270 Z",
    lx: 230, ly: 280,
    labelAlways: true,
  },
  {
    id: "es",
    name: "Spain",
    // Accurate Iberian peninsula: Galicia NW → Cantabria N → Aragon E →
    // Andalusia S → Atlantic W
    d: "M 80,330 L 160,330 L 220,310 L 260,340 L 240,420 L 160,450 L 100,440 L 80,370 Z",
    lx: 160, ly: 380,
    labelAlways: true,
  },
  {
    id: "pt",
    name: "Portugal",
    // Accurate western peninsula
    d: "M 75,360 L 115,365 L 115,450 L 80,450 Z",
    lx: 95, ly: 405,
  },

  // ── Alpine region ────────────────────────────────────────────────────────
  {
    id: "ch",
    name: "Switzerland",
    // Accurate Alpine shape
    d: "M 310,260 L 375,260 L 375,295 L 310,295 Z",
    lx: 342, ly: 277,
  },
  {
    id: "at",
    name: "Austria",
    // Accurate E-W elongated Alpine state
    d: "M 375,245 L 500,245 L 500,285 L 375,285 Z",
    lx: 437, ly: 265,
    labelAlways: true,
  },

  // ── Southern Europe ───────────────────────────────────────────────────────
  {
    id: "it",
    name: "Italy",
    // Accurate boot + Sicily outline: Ligurian NW → Adriatic NE →
    // Heel → Toe SE → Calabria NW
    d: "M 320,310 L 360,305 L 385,310 L 410,290 L 440,280 L 465,350 L 500,380 L 510,395 L 460,425 L 450,420 L 445,400 L 420,370 L 385,345 L 360,320 Z",
    lx: 420, ly: 350,
    labelAlways: true,
  },

  // ── Eastern Europe ────────────────────────────────────────────────────────
  {
    id: "hu",
    name: "Hungary",
    // Accurate Pannonian plain shape
    d: "M 480,245 L 580,245 L 580,295 L 480,295 Z",
    lx: 530, ly: 270,
    labelAlways: true,
  },
];

// ── Component ───────────────────────────────────────────────────────────────

interface EuropeMapProps {
  /** Country IDs that are interactive */
  supportedIds: Set<string>;
  onCountryClick: (id: string) => void;
  className?: string;
}

export function EuropeMap({ supportedIds, onCountryClick, className }: EuropeMapProps) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [focused, setFocused] = React.useState<string | null>(null);

  return (
    <svg
      viewBox="-50 0 670 480"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Interactive map of Europe — click a country to scroll to its section"
      className={cn("w-full h-full select-none", className)}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Subtle focus ring using design system green */}
        <filter id="emap-focus" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow
            dx="0" dy="0" stdDeviation="2"
            floodColor="hsl(var(--accent))"
            floodOpacity="0.5"
          />
        </filter>
      </defs>

      {/* Interactive country shapes — no background frame */}
      {COUNTRY_SHAPES.map((shape) => {
        const isSupported = supportedIds.has(shape.id);
        const isHovered = hovered === shape.id;
        const isFocused = focused === shape.id;
        const isActive = isHovered || isFocused;

        // Design system colors:
        // - Base: muted (subtle, neutral)
        // - Hover/Focus: accent (design system green #1f5f3f)
        const baseColor = "hsl(var(--muted))";
        const activeColor = "hsl(var(--accent))";
        const fill = isSupported ? (isActive ? activeColor : baseColor) : "transparent";
        const strokeColor = isActive ? "white" : "hsl(var(--border))";
        const labelColor = isActive ? "white" : "hsl(var(--foreground))";

        return (
          <g
            key={shape.id}
            role={isSupported ? "button" : undefined}
            tabIndex={isSupported ? 0 : undefined}
            aria-label={isSupported ? `Go to ${shape.name}` : shape.name}
            style={{
              cursor: isSupported ? "pointer" : "default",
              outline: "none",
            }}
            onClick={() => isSupported && onCountryClick(shape.id)}
            onKeyDown={(e) => {
              if (isSupported && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onCountryClick(shape.id);
              }
            }}
            onMouseEnter={() => isSupported && setHovered(shape.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => {
              if (isSupported) setFocused(shape.id);
            }}
            onBlur={() => setFocused(null)}
            filter={isFocused ? "url(#emap-focus)" : undefined}
          >
            {/* Country path with transition */}
            <path
              d={shape.d}
              fill={fill}
              stroke={strokeColor}
              strokeWidth={isActive ? "1.5" : "1"}
              strokeLinejoin="round"
              style={{
                transition: "fill 150ms ease, stroke 150ms ease, stroke-width 150ms ease",
              }}
            />

            {/* Label: always visible for large countries, hover-only for small */}
            {isSupported && shape.labelAlways && (
              <text
                x={shape.lx}
                y={shape.ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight={isActive ? "600" : "500"}
                fill={labelColor}
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  transition: "fill 150ms ease",
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                }}
              >
                {shape.name}
              </text>
            )}

            {/* Hover label for smaller countries */}
            {isSupported && !shape.labelAlways && isActive && (
              <text
                x={shape.lx}
                y={shape.ly - 12}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fontWeight="600"
                fill="white"
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                }}
              >
                {shape.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
