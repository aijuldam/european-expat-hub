import { useEffect } from "react";
import { CityCompare } from "@/components/tools/CityCompare";
import { trackEvent } from "@/lib/analytics";

/**
 * /embed/compare?a=amsterdam&b=lisbon
 *
 * Stripped-down embed view: no navbar, no full footer.
 * Intended to be loaded inside an <iframe> on partner sites.
 * The "Powered by European Expat Hub" watermark is rendered by CityCompare
 * when embed=true.
 */
export default function EmbedCompare() {
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const slugA = params.get("a") ?? "";
  const slugB = params.get("b") ?? "";

  useEffect(() => {
    if (slugA && slugB) {
      trackEvent("compare_view", { city_a: slugA, city_b: slugB, mode: "embed" });
    }
  }, [slugA, slugB]);

  return (
    <div className="min-h-screen bg-background font-sans p-4">
      <CityCompare slugA={slugA} slugB={slugB} embed />
    </div>
  );
}
