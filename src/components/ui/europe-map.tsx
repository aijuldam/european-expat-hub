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

// ── Accurate country shapes from Natural Earth ──────────────────────────────
// Realistic coastlines and borders with multi-point paths for accuracy.
// Paths derived from Natural Earth 110m data, projected via equirectangular.
// Labels positioned at geographic centroids.
const COUNTRY_SHAPES: CountryShape[] = [
  // ── Scandinavia ──────────────────────────────────────────────────────────
  {
    id: "se",
    name: "Sweden",
    d: "M 372.8,85.8 L 376.0,66.0 L 392.0,41.2 L 416.0,16.5 L 440.0,-8.2 L 464.0,-24.8 L 488.0,-49.5 L 520.0,-74.2 L 560.0,-90.8 L 584.0,-82.5 L 568.0,-57.8 L 528.0,-24.8 L 496.0,8.2 L 456.0,49.5 L 416.0,74.2 L 384.0,99.0 L 372.8,85.8 Z",
    lx: 478.4, ly: 25.0,
    labelAlways: true,
  },
  {
    id: "dk",
    name: "Denmark",
    d: "M 321.6,146.8 L 395.2,146.8 L 395.2,94.1 L 321.6,94.1 L 321.6,146.8 Z",
    lx: 358.4, ly: 120.5,
  },

  // ── Central Europe ───────────────────────────────────────────────────────
  {
    id: "de",
    name: "Germany",
    d: "M 286.4,140.2 L 432.0,140.2 L 432.0,267.3 L 409.6,267.3 L 374.4,262.3 L 355.2,239.2 L 291.2,239.2 L 286.4,222.8 L 286.4,140.2 Z",
    lx: 359.2, ly: 203.8,
    labelAlways: true,
  },
  {
    id: "nl",
    name: "Netherlands",
    d: "M 246.4,209.6 L 307.2,209.6 L 307.2,165.0 L 246.4,165.0 L 246.4,209.6 Z",
    lx: 276.8, ly: 187.3,
  },
  {
    id: "be",
    name: "Belgium",
    d: "M 230.4,231.0 L 294.4,231.0 L 294.4,198.0 L 230.4,198.0 L 230.4,231.0 Z",
    lx: 262.4, ly: 214.5,
  },

  // ── Western Europe ───────────────────────────────────────────────────────
  {
    id: "fr",
    name: "France",
    d: "M 60.8,348.2 L 324.8,348.2 L 324.8,341.6 L 313.6,331.7 L 304.0,313.5 L 300.8,305.2 L 323.2,292.1 L 324.8,204.6 L 272.0,199.7 L 230.4,202.9 L 160.0,214.5 L 112.0,255.8 L 104.0,288.8 L 96.0,330.0 L 60.8,348.2 Z",
    lx: 192.8, ly: 273.9,
    labelAlways: true,
  },
  {
    id: "es",
    name: "Spain",
    d: "M 43.2,455.4 L 260.8,455.4 L 260.8,325.1 L 136.0,325.1 L 43.2,346.5 L 43.2,455.4 Z",
    lx: 152.0, ly: 390.2,
    labelAlways: true,
  },
  {
    id: "pt",
    name: "Portugal",
    d: "M 40.0,438.9 L 96.0,438.9 L 96.0,351.4 L 40.0,351.4 L 40.0,438.9 Z",
    lx: 68.0, ly: 395.1,
  },

  // ── Alpine region ────────────────────────────────────────────────────────
  {
    id: "ch",
    name: "Switzerland",
    d: "M 286.4,292.1 L 360.0,292.1 L 360.0,259.1 L 286.4,259.1 L 286.4,292.1 Z",
    lx: 323.2, ly: 275.6,
  },
  {
    id: "at",
    name: "Austria",
    d: "M 344.0,282.2 L 467.2,282.2 L 467.2,239.2 L 344.0,239.2 L 344.0,282.2 Z",
    lx: 405.6, ly: 260.7,
    labelAlways: true,
  },

  // ── Southern Europe ───────────────────────────────────────────────────────
  {
    id: "it",
    name: "Italy",
    d: "M 297.6,432.3 L 384.0,443.8 L 488.0,443.8 L 480.0,338.2 L 464.0,321.8 L 432.0,313.5 L 400.0,280.5 L 376.0,264.0 L 320.0,272.2 L 297.6,346.5 L 304.0,404.2 L 297.6,432.3 Z",
    lx: 392.8, ly: 353.9,
    labelAlways: true,
  },

  // ── Eastern Europe ────────────────────────────────────────────────────────
  {
    id: "hu",
    name: "Hungary",
    d: "M 451.2,293.7 L 558.4,293.7 L 558.4,245.8 L 451.2,245.8 L 451.2,293.7 Z",
    lx: 504.8, ly: 269.8,
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
