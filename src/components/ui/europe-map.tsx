import * as React from "react";
import { cn } from "@/lib/utils";

// ── Coordinate system ────────────────────────────────────────────────────────
// Projection: d3.geoMercator(), center [11, 50], scale 640
//             translate [W/2 − 30, H/2 + 60] where W=620, H=490
// ViewBox: "-50 0 620 490"
//
// Source: Natural Earth 110m admin-0 countries (world-atlas v2)
// Paths generated via scripts/gen-map-paths.mjs — do not edit by hand.
//
// Reference check (pixel positions in this projection):
//   Paris      2.3°E 48.9°N → ≈ 196, 326
//   Berlin    13.4°E 52.5°N → ≈ 280, 287
//   Rome      12.5°E 41.9°N → ≈ 298, 425
//   Budapest  19.0°E 47.5°N → ≈ 375, 345

interface CountryShape {
  id: string;
  name: string;
  /** SVG path — Natural Earth 110m, Mercator-projected */
  d: string;
  /** Label centroid in SVG pixels */
  lx: number;
  ly: number;
  /** Show label at rest (large/prominent countries) */
  labelAlways?: boolean;
}

// ── Country shapes — Natural Earth 110m via d3.geoMercator ──────────────────
const COUNTRY_SHAPES: CountryShape[] = [
  {
    id: "at",
    name: "Austria",
    d: "M346.8,337L345.9,343.8L339.7,343.9L341.8,347.4L338.1,358L336,360.8L326.2,361.2L320.6,364.8L311.4,363.6L295.4,359.4L292.9,353.7L281.8,356.5L280.6,359.7L273.8,357.3L268.1,356.9L263,353.9L264.7,349.9L264.3,347L267.7,346L273.3,350.6L274.9,346.3L284.7,347L292.7,344L298.1,344.5L301.6,347.9L302.6,345.1L301,334.2L305.1,332.1L309,324.3L317.3,329.7L323.6,322.8L327.5,321.5L336.2,326.7L341.4,325.9L346.6,329L345.7,331.2Z",
    lx: 314.2, ly: 345.4,
    labelAlways: true,
  },
  {
    id: "be",
    name: "Belgium",
    d: "M225.9,290.9L224.6,302.8L221.7,303.4L220.5,313.1L210.8,305.3L205,306.6L197.2,298.4L192,291.3L186.8,291L185.2,284.8L194.1,281.3L202.3,282.7L212.7,279L219.8,286.8Z",
    lx: 208.4, ly: 293.6,
  },
  {
    id: "ch",
    name: "Switzerland",
    d: "M264.3,347L264.7,349.9L263,353.9L268.1,356.9L273.8,357.3L272.9,364L268,366.8L259.7,364.7L257.3,371.2L252,371.8L250,369.2L243.8,374.6L238.4,375.4L233.6,372L229.7,364.9L224.4,367.4L224.6,360.1L232.7,350.9L232.4,346.7L237.5,348.2L240.6,345.4L250,345.5L252.3,341.9Z",
    lx: 247.8, ly: 359,
  },
  {
    id: "de",
    name: "Germany",
    d: "M314.9,237L317.4,246.5L314.3,251.5L318.4,258.1L321.2,267.8L320.3,274.1L324.9,285.5L319.9,287.4L317,285.3L314.1,288.7L306.1,292.2L302,296.5L293.8,300.4L295.8,305.6L297,312.8L302.7,317L309,324.3L305.1,332.1L301,334.2L302.6,345.1L301.6,347.9L298.1,344.5L292.7,344L284.7,347L274.9,346.3L273.3,350.6L267.7,346L264.3,347L252.3,341.9L250,345.5L240.6,345.4L242,333.5L247.6,321.9L231.5,318.8L226.2,314.3L226.9,306.7L224.6,302.8L225.9,290.9L224,272.2L230.7,272.2L233.6,265.3L236.3,248.5L234.3,242.1L236.4,238.2L245.8,237.1L247.9,241.3L255.4,232L252.9,224.8L252.4,213.8L260.8,216.4L268,213.5L268.1,220.9L279.4,225.4L279.3,232.2L290.7,228.6L297,223.4L309.6,230.9Z",
    lx: 271.9, ly: 286.1,
    labelAlways: true,
  },
  {
    id: "dk",
    name: "Denmark",
    d: "M268,213.5L260.8,216.4L252.4,213.8L247.8,203L247.5,182.5L249.4,177.1L252.6,170.9L262.4,169.6L266.3,163.9L275.3,158L274.9,168.7L271.6,175.4L273,181.1L279,184.2L276.3,191.8L273,189.6L264.9,203.9ZM295.3,191.2L298.9,201.2L292.2,217L280.5,206L278.9,197.8Z",
    lx: 267.6, ly: 192.2,
  },
  {
    id: "es",
    name: "Spain",
    d: "M73.9,505L72.9,500.4L77.1,495.1L78.6,491.2L74.8,487L77.8,477.6L73.4,469L78.2,467.8L78.7,460.9L80.5,458.7L80.6,447.2L85.8,443.2L82.6,435.7L76.1,435.2L74.2,437.1L67.6,437.1L64.8,429.7L60.3,431.9L56.2,435.8L52.2,418.4L68,407.3L81.7,410.1L96.7,410L108.6,412.6L117.8,411.8L135.9,412.3L140.3,418.3L160.9,425.2L165,421.9L177.5,428.8L190.5,426.8L191.1,435.6L180.5,445.5L166.2,448.7L165.2,453.6L158.3,461.8L154,473.6L158.4,481.8L151.9,488.2L149.5,497.4L141.1,500.2L133.1,510.9L119,511.2L108.3,510.9L101.3,515.8L97.1,521L91.6,519.9L87.5,515.2L84.3,507.2Z",
    lx: 116.6, ly: 463,
    labelAlways: true,
  },
  {
    id: "fr",
    name: "France",
    d: "M226.2,314.3L231.5,318.8L247.6,321.9L242,333.5L240.6,345.4L237.5,348.2L232.4,346.7L232.7,350.9L224.6,360.1L224.4,367.4L229.7,364.9L233.6,372L233.1,376.5L236.4,382.5L232.5,387.3L235.4,399.5L241.5,401.4L240.2,408.2L230.1,416.9L208,412.7L191.8,417.7L190.5,426.8L177.5,428.8L165,421.9L160.9,425.2L140.3,418.3L135.9,412.3L141.7,403.1L143.8,371.6L132.3,354.5L124,346.2L107,339.8L105.8,327.6L120.3,323.9L139.1,328.2L135.5,308.9L146.1,316.3L172.1,302.8L175.4,288.4L185.2,284.8L186.8,291L192,291.3L197.2,298.4L205,306.6L210.8,305.3L220.5,313.1L223,314.6ZM254.8,424.5L262,418.7L263.9,431.7L260.2,443.2L255.1,440.2L252.6,430.1Z",
    lx: 184.8, ly: 370,
    labelAlways: true,
  },
  {
    id: "hu",
    name: "Hungary",
    d: "M403.8,332L410,336.5L410.8,341L404,344.5L398.7,355.7L392,366.7L383,369.8L376,369.1L367.5,373.3L363.3,375.7L354.1,372.6L345.7,365.7L342.2,363.7L340,358.2L338.1,358L341.8,347.4L339.7,343.9L345.9,343.8L346.8,337L352.5,341.3L356.6,343.1L366,341L366.9,337.7L371.3,337.2L376.8,334.6L378,335.7L383.2,333.6L385.8,329.6L389.5,328.6L401.4,333.7Z",
    lx: 373.2, ly: 352.3,
    labelAlways: true,
  },
  {
    id: "it",
    name: "Italy",
    d: "M273.8,357.3L280.6,359.7L281.8,356.5L292.9,353.7L295.4,359.4L311.4,363.6L310.1,371.6L312.8,378.4L303.9,376L294.8,381.7L295.4,389.6L294.1,394L297.7,402L308.2,409.8L313.9,422.5L326.3,434.6L335,434.6L337.7,437.9L334.6,440.8L344.6,446.2L352.8,450.7L362.4,458.4L363.6,461.1L361.5,466.3L355.3,459.5L345.5,457.1L340.9,466.5L348.9,471.9L347.6,479.5L342.9,480.3L337,492.5L332.3,493.6L332.4,489.3L334.6,481.6L337.1,478.6L332.7,470.2L329.3,462.9L324.7,461L321.4,454.7L314.2,452L309.4,446.1L301.1,445.1L292.3,438.4L282.1,428.6L274.5,419.9L271.1,404.6L265.5,402.9L256.4,397.7L251.3,399.8L244.8,407L240.2,408.2L241.5,401.4L235.4,399.5L232.5,387.3L236.4,382.5L233.1,376.5L233.6,372L238.4,375.4L243.8,374.6L250,369.2L252,371.8L257.3,371.2L259.7,364.7L268,366.8L272.9,364ZM322,490.3L330.5,489.1L326.5,500.2L328.1,504.5L325.8,511.7L317.2,506.5L311.6,504.9L296,497.8L297.5,490.5L310.6,491.8ZM254.4,450.4L260,445.8L266.7,456.3L265.1,475.5L260.1,474.6L255.5,479.4L251.3,475.6L250.8,458L248.3,449.6Z",
    lx: 300, ly: 430,
    labelAlways: true,
  },
  {
    id: "nl",
    name: "Netherlands",
    d: "M234.3,242.1L236.3,248.5L233.6,265.3L230.7,272.2L224,272.2L225.9,290.9L219.8,286.8L212.7,279L202.3,282.7L194.1,281.3L199.9,276.4L209.7,249.5L225,241.6Z",
    lx: 218.6, ly: 264.2,
  },
  {
    id: "pt",
    name: "Portugal",
    d: "M56.2,435.8L60.3,431.9L64.8,429.7L67.6,437.1L74.2,437.1L76.1,435.2L82.6,435.7L85.8,443.2L80.6,447.2L80.5,458.7L78.7,460.9L78.2,467.8L73.4,469L77.8,477.6L74.8,487L78.6,491.2L77.1,495.1L72.9,500.4L73.9,505L69.4,508.7L63.5,506.7L57.7,508.2L59.4,497.3L58.4,488.5L53.4,487.2L50.7,481.8L51.6,472.4L56.1,467.1L56.9,461.2L59.2,452.4L58.9,446.2L56.7,440.8Z",
    lx: 67.1, ly: 469.3,
    labelAlways: true,
  },
  {
    id: "se",
    name: "Sweden",
    d: "M280.3,134.1L285.2,121.5L294.5,106.3L298.2,79.5L291.1,67.6L290.4,35.5L297.7,12L308.7,12.4L312.6,2.2L308.6,-6.7L325.9,-44.6L337.1,-75.9L344.4,-96.9L355.2,-96.8L358.1,-113.6L379.2,-108.7L380.8,-129L387.7,-130.2L402.6,-115.1L420.1,-94.6L420.4,-50.2L424.1,-39.4L404.9,-31.7L394.1,-13L395.8,3L378.1,23.5L356.5,44.8L348.4,78.4L356.3,94.6L367,107.2L356.7,132L345.1,137L340.8,172.3L334.5,191.3L321,189.4L314.6,205.1L301.7,206L298.1,187.2L288.8,164Z",
    lx: 337.1, ly: 60,
    labelAlways: true,
  },
];

// ── Component ────────────────────────────────────────────────────────────────

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
      viewBox="-50 0 620 490"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Interactive map of Europe — click a country to scroll to its section"
      className={cn("w-full h-full select-none", className)}
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="emap-focus" x="-8%" y="-8%" width="116%" height="116%">
          <feDropShadow dx="0" dy="0" stdDeviation="2"
            floodColor="hsl(var(--accent))" floodOpacity="0.5" />
        </filter>
      </defs>

      {COUNTRY_SHAPES.map((shape) => {
        const isSupported = supportedIds.has(shape.id);
        const isHovered = hovered === shape.id;
        const isFocused = focused === shape.id;
        const isActive = isHovered || isFocused;

        const fill = isSupported
          ? isActive ? "hsl(var(--accent))" : "hsl(var(--muted))"
          : "transparent";
        const stroke = isActive ? "white" : "hsl(var(--border))";
        const labelFill = isActive ? "white" : "hsl(var(--foreground))";

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
            filter={isFocused ? "url(#emap-focus)" : undefined}
          >
            <path
              d={shape.d}
              fill={fill}
              stroke={stroke}
              strokeWidth={isActive ? "1.5" : "0.8"}
              strokeLinejoin="round"
              style={{ transition: "fill 150ms ease, stroke 150ms ease" }}
            />

            {/* Persistent label for prominent countries */}
            {isSupported && shape.labelAlways && (
              <text
                x={shape.lx}
                y={shape.ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight={isActive ? "700" : "500"}
                fill={labelFill}
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

            {/* Tooltip label on hover for smaller countries */}
            {isSupported && !shape.labelAlways && isActive && (
              <text
                x={shape.lx}
                y={shape.ly - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fontWeight="700"
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
