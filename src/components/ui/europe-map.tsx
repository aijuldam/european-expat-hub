import * as React from "react";
import { cn } from "@/lib/utils";

// ── Coordinate system ───────────────────────────────────────────────────────
// Equirectangular projection:
//   x = (lon + 12) * 16
//   y = (63.5  − lat) * 16.5
//
// ViewBox "10 10 570 460" crops to W/C Europe (lon ≈ −10→24, lat ≈ 35→62).
//
// Reference check:
//   Amsterdam  4.9°E  52.4°N  →  269, 182
//   Paris      2.3°E  48.9°N  →  229, 240
//   Berlin    13.4°E  52.5°N  →  406, 181
//   Rome      12.5°E  41.9°N  →  392, 357
//   Budapest  19.0°E  47.5°N  →  496, 264

interface CountryShape {
  id: string;
  name: string;
  /** SVG path data — straight-line geographic outline */
  d: string;
  /** Label centroid */
  lx: number;
  ly: number;
  /** Render the label without hover (only for large countries) */
  labelAlways?: boolean;
}

// ── Non-interactive context shapes ─────────────────────────────────────────
// Great Britain — simplified 10-point mainland outline.
// Provides orientation anchor for NL/BE/FR without adding interaction noise.
const CONTEXT_PATHS: string[] = [
  "M101,220 L144,197 L193,165 L158,157 L104,129 L128,83 L144,83 L163,124 L192,157 L184,206 Z",
];

// ── Interactive country shapes ──────────────────────────────────────────────
// Rendered back-to-front so smaller countries sit on top of larger neighbours
// at shared borders. Shapes follow real geographic outlines (key border/coast
// vertices), significantly more accurate than the previous rectangles.
const COUNTRY_SHAPES: CountryShape[] = [
  // ── Scandinavia ──────────────────────────────────────────────────────────
  {
    id: "se",
    name: "Sweden",
    // Southern Sweden (Götaland + Svealand): NW tip → NE → SE → Malmö area → back
    d: "M368,41 L568,41 L568,132 L480,132 L416,107 Z",
    lx: 490, ly: 88,
    labelAlways: true,
  },
  {
    id: "dk",
    name: "Denmark",
    // Jutland peninsula + rough island area
    d: "M320,92 L392,123 L432,140 L392,148 L320,132 Z",
    lx: 376, ly: 124,
  },

  // ── Central ──────────────────────────────────────────────────────────────
  {
    id: "de",
    name: "Germany",
    // 8-point outline: Schleswig coast → Baltic NE → Oder E → Bavaria SE →
    // Alps SW → Rhine W → back N
    d: "M285,140 L424,149 L432,205 L408,243 L367,263 L312,263 L291,231 L290,193 Z",
    lx: 357, ly: 205,
    labelAlways: true,
  },
  {
    id: "nl",
    name: "Netherlands",
    // Small coastal delta shape — slightly wider at N coast
    d: "M248,162 L306,163 L304,200 L286,208 L248,200 Z",
    lx: 275, ly: 183,
  },
  {
    id: "be",
    name: "Belgium",
    d: "M232,198 L294,198 L294,231 L232,231 Z",
    lx: 263, ly: 215,
  },

  // ── Western Europe ───────────────────────────────────────────────────────
  {
    id: "fr",
    name: "France",
    // 10-point hexagonal outline: Bretagne NW → Calais N → Alsace E →
    // Riviera SE → Perpignan S → Pyrenees W → Biscay W → back NW
    d: "M115,247 L164,242 L222,204 L242,214 L320,245 L312,326 L243,333 L163,330 L163,280 L115,264 Z",
    lx: 205, ly: 278,
    labelAlways: true,
  },
  {
    id: "es",
    name: "Spain",
    // 9-point Iberian outline (Portugal overlays the W slice)
    // Galicia NW → Cantabrian N coast → Pyrenees E → Valencia E →
    // Almería SE → Gibraltar S → Atlantic SW → W coast → back
    d: "M46,326 L120,329 L163,330 L243,330 L211,374 L168,429 L106,452 L51,437 L47,355 Z",
    lx: 143, ly: 374,
    labelAlways: true,
  },
  {
    id: "pt",
    name: "Portugal",
    // Sits on top of Spain's western slice
    d: "M42,353 L93,357 L90,435 L47,437 Z",
    lx: 67, ly: 396,
  },

  // ── Alpine ───────────────────────────────────────────────────────────────
  {
    id: "ch",
    name: "Switzerland",
    d: "M288,257 L360,257 L360,290 L288,290 Z",
    lx: 324, ly: 274,
  },
  {
    id: "at",
    name: "Austria",
    // Elongated E-W shape
    d: "M344,239 L467,239 L467,282 L344,282 Z",
    lx: 406, ly: 261,
    labelAlways: true,
  },

  // ── Southern Europe ───────────────────────────────────────────────────────
  {
    id: "it",
    name: "Italy",
    // 14-point boot outline:
    // Ligurian NW → Genova → La Spezia → Adriatic NE (Trieste) →
    // Adriatic coast S → Brindisi heel → toe bottom → toe W →
    // Calabria NW → Napoli → Roma → Tyrrhenian N → back to Ligurian
    d: "M301,323 L336,320 L352,323 L384,315 L414,294 L432,354 L480,380 L488,388 L448,421 L441,418 L440,397 L421,374 L381,357 L360,330 Z",
    lx: 420, ly: 357,
    labelAlways: true,
  },

  // ── Eastern Europe ────────────────────────────────────────────────────────
  {
    id: "hu",
    name: "Hungary",
    d: "M449,245 L557,245 L557,293 L449,293 Z",
    lx: 503, ly: 269,
    labelAlways: true,
  },
];

// Small countries: show label above shape on hover, not inline
const SMALL_COUNTRIES = new Set(["nl", "be", "ch", "dk", "pt"]);

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
      viewBox="10 10 570 460"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Interactive map of Europe — click a country to scroll to its section"
      className={cn("w-full h-full select-none", className)}
    >
      <defs>
        {/* Subtle elevation shadow on hover */}
        <filter id="emap-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.18" />
        </filter>
        {/* Focus ring highlight */}
        <filter id="emap-focus" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow
            dx="0" dy="0" stdDeviation="3"
            floodColor="hsl(var(--ring))"
            floodOpacity="0.6"
          />
        </filter>
      </defs>

      {/* Map area background — very light tint to define the frame */}
      <rect
        x="10" y="10" width="570" height="460"
        fill="hsl(var(--primary) / 0.03)"
        rx="10"
      />

      {/* Non-interactive context shapes (UK) */}
      {CONTEXT_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="hsl(var(--muted-foreground) / 0.09)"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      ))}

      {/* Interactive country shapes */}
      {COUNTRY_SHAPES.map((shape) => {
        const isSupported = supportedIds.has(shape.id);
        const isHovered = hovered === shape.id;
        const isFocused = focused === shape.id;
        const isActive  = isHovered || isFocused;
        const isSmall   = SMALL_COUNTRIES.has(shape.id);

        const fill = isSupported
          ? isActive
            ? "hsl(var(--primary) / 0.34)"
            : "hsl(var(--primary) / 0.13)"
          : "hsl(var(--muted-foreground) / 0.09)";

        return (
          <g
            key={shape.id}
            role={isSupported ? "button" : undefined}
            tabIndex={isSupported ? 0 : undefined}
            aria-label={isSupported ? `Go to ${shape.name}` : shape.name}
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
            onFocus={() => { if (isSupported) setFocused(shape.id); }}
            onBlur={() => setFocused(null)}
            filter={
              isFocused
                ? "url(#emap-focus)"
                : isHovered
                ? "url(#emap-shadow)"
                : undefined
            }
          >
            {/* Country fill */}
            <path
              d={shape.d}
              fill={fill}
              stroke="white"
              strokeWidth={isActive ? "2" : "1.5"}
              strokeLinejoin="round"
              style={{ transition: "fill 120ms ease, stroke-width 120ms ease" }}
            />

            {/* Always-visible label (large countries) */}
            {isSupported && shape.labelAlways && !isSmall && (
              <text
                x={shape.lx}
                y={shape.ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fontWeight={isActive ? "700" : "500"}
                fill={
                  isActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--foreground) / 0.65)"
                }
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  transition: "fill 120ms ease",
                }}
              >
                {shape.name}
              </text>
            )}

            {/* Hover-only floating label (small countries) */}
            {isSupported && isSmall && isActive && (
              <>
                {/* Label pill background */}
                <rect
                  x={shape.lx - 26}
                  y={shape.ly - 26}
                  width="52"
                  height="16"
                  rx="4"
                  fill="hsl(var(--primary))"
                  style={{ pointerEvents: "none" }}
                />
                <text
                  x={shape.lx}
                  y={shape.ly - 18}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7.5"
                  fontWeight="600"
                  fill="hsl(var(--primary-foreground))"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {shape.name}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
