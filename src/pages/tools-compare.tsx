import { useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { CityCompare } from "@/components/tools/CityCompare";
import { SITE } from "@/routes";
import { trackEvent } from "@/lib/analytics";
import { Scale } from "lucide-react";

/**
 * /tools/compare?a=amsterdam&b=lisbon
 *
 * URL params `a` and `b` hold the city slugs.
 * Selecting a city via the pickers updates the URL (replaceState) so the
 * comparison is always shareable.
 */
export default function ToolsCompare() {
  const [, navigate] = useLocation();

  // Read initial slugs from URL on first render
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const slugA = params.get("a") ?? "";
  const slugB = params.get("b") ?? "";

  /** Push updated slugs into the URL without a full navigation */
  const updateUrl = useCallback((a: string, b: string) => {
    const search = new URLSearchParams();
    if (a) search.set("a", a);
    if (b) search.set("b", b);
    const qs = search.toString();
    const path = `/tools/compare${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", path);
  }, []);

  const handleSlugAChange = useCallback(
    (a: string) => {
      const b = new URLSearchParams(window.location.search).get("b") ?? "";
      updateUrl(a, b);
      // Force re-render by navigating; replaceState alone won't update wouter
      navigate(
        `/tools/compare${a || b ? `?${new URLSearchParams(a ? { a, ...(b ? { b } : {}) } : b ? { b } : {}).toString()}` : ""}`,
        { replace: true }
      );
    },
    [navigate, updateUrl]
  );

  const handleSlugBChange = useCallback(
    (b: string) => {
      const a = new URLSearchParams(window.location.search).get("a") ?? "";
      navigate(
        `/tools/compare${a || b ? `?${new URLSearchParams(a ? { a, ...(b ? { b } : {}) } : b ? { b } : {}).toString()}` : ""}`,
        { replace: true }
      );
    },
    [navigate]
  );

  // Fire compare_view when both cities are set
  useEffect(() => {
    if (slugA && slugB) {
      trackEvent("compare_view", { city_a: slugA, city_b: slugB });
    }
  }, [slugA, slugB]);

  return (
    <Layout>
      <div className="bg-primary/5 py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-6 h-6 text-accent" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              City Cost Comparison
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Compare cost of living, salaries, and quality of life side by side for
            10 European cities. Share the link or embed the table on your blog.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pb-16">
        <CityCompare
          slugA={slugA}
          slugB={slugB}
          onSlugAChange={handleSlugAChange}
          onSlugBChange={handleSlugBChange}
          siteBase={SITE}
        />
      </div>
    </Layout>
  );
}
