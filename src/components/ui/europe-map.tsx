import * as React from "react";
import { cn } from "@/lib/utils";

// ── Simplified polygon map data ─────────────────────────────────────────────
// Projection: x = (lon + 12) * 10, y = (65 - lat) * 10
// ViewBox: "0 0 420 310"
// Points derived from approximate country bounding polygons.

interface MapShape {
  id: string;
  name: string;
  /** SVG polygon points string */
  points: string;
  /** Approximate centroid for the country name label */
  cx: number;
  cy: number;
}

const SHAPES: MapShape[] = [
  // Render order: largest/background first, smallest/foreground last
  {
    id: "se",
    name: "Sweden",
    points: "272,50 360,50 360,97 300,97",
    cx: 320, cy: 73,
  },
  {
    id: "dk",
    name: "Denmark",
    points: "200,72 272,72 272,104 220,104 200,90",
    cx: 238, cy: 90,
  },
  {
    id: "de",
    name: "Germany",
    points: "179,99 270,99 270,177 179,177",
    cx: 224, cy: 138,
  },
  {
    id: "es",
    name: "Spain",
    points: "28,211 153,214 153,291 64,291 28,281",
    cx: 95, cy: 252,
  },
  {
    id: "fr",
    name: "France",
    points: "70,139 145,139 197,165 195,212 145,217 100,216 70,175",
    cx: 130, cy: 178,
  },
  {
    id: "it",
    name: "Italy",
    points: "187,179 250,206 305,245 275,271 245,245 195,213",
    cx: 246, cy: 230,
  },
  {
    id: "pt",
    name: "Portugal",
    points: "25,228 58,230 56,281 30,281",
    cx: 42, cy: 255,
  },
  {
    id: "ch",
    name: "Switzerland",
    points: "180,172 225,172 225,192 180,192",
    cx: 202, cy: 182,
  },
  {
    id: "at",
    name: "Austria",
    points: "215,160 292,160 292,186 215,186",
    cx: 253, cy: 173,
  },
  {
    id: "hu",
    name: "Hungary",
    points: "281,164 349,164 349,193 281,193",
    cx: 315, cy: 178,
  },
  {
    id: "be",
    name: "Belgium",
    points: "145,135 184,135 184,155 145,155",
    cx: 164, cy: 145,
  },
  {
    id: "nl",
    name: "Netherlands",
    points: "153,114 192,114 192,143 153,143",
    cx: 172, cy: 128,
  },
];

// Country IDs that are too small for an inline label
const NO_INLINE_LABEL = new Set(["nl", "be", "ch", "at", "dk"]);

interface EuropeMapProps {
  /** IDs of countries that are clickable/highlighted */
  supportedIds: Set<string>;
  onCountryClick: (id: string) => void;
  className?: string;
}

export function EuropeMap({ supportedIds, onCountryClick, className }: EuropeMapProps) {
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 420 310"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Map of Europe — click a country to navigate to its section"
      role="img"
      className={cn("w-full h-full", className)}
      style={{ overflow: "visible" }}
    >
      {/* Very light background for the map area */}
      <rect x="0" y="0" width="420" height="310" fill="transparent" />

      {SHAPES.map((shape) => {
        const isSupported = supportedIds.has(shape.id);
        const isHovered = hovered === shape.id;

        const fill = isSupported
          ? isHovered
            ? "hsl(var(--primary) / 0.35)"
            : "hsl(var(--primary) / 0.15)"
          : "hsl(var(--muted-foreground) / 0.12)";

        const stroke = "white";
        const strokeWidth = 1.5;

        return (
          <g
            key={shape.id}
            role={isSupported ? "button" : undefined}
            tabIndex={isSupported ? 0 : undefined}
            aria-label={isSupported ? `Navigate to ${shape.name}` : shape.name}
            style={{ cursor: isSupported ? "pointer" : "default", outline: "none" }}
            onClick={() => isSupported && onCountryClick(shape.id)}
            onKeyDown={(e) => {
              if (isSupported && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onCountryClick(shape.id);
              }
            }}
            onMouseEnter={() => isSupported && setHovered(shape.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => isSupported && setHovered(shape.id)}
            onBlur={() => setHovered(null)}
          >
            <polygon
              points={shape.points}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              style={{ transition: "fill 150ms ease" }}
            />
            {/* Inline country name for larger countries */}
            {isSupported && !NO_INLINE_LABEL.has(shape.id) && (
              <text
                x={shape.cx}
                y={shape.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7"
                fontWeight={isHovered ? "700" : "500"}
                fill="hsl(var(--foreground) / 0.75)"
                style={{ pointerEvents: "none", userSelect: "none", transition: "font-weight 100ms ease" }}
              >
                {shape.name}
              </text>
            )}
            {/* Tooltip label for smaller countries — shown only on hover */}
            {isSupported && NO_INLINE_LABEL.has(shape.id) && isHovered && (
              <text
                x={shape.cx}
                y={shape.cy - 14}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7.5"
                fontWeight="700"
                fill="hsl(var(--primary))"
                style={{ pointerEvents: "none", userSelect: "none" }}
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
