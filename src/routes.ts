/**
 * Central route list — consumed by:
 *   1. src/App.tsx      (runtime RouteHead for head-tag hydration)
 *   2. scripts/prerender.mjs  (which paths to render + SEO metadata)
 *
 * To add a new route:
 *   a) Add a wouter <Route> in src/App.tsx (routing stays there).
 *   b) Add a matching entry to `staticRoutes` below with title + description.
 *   c) Run `pnpm build` — the prerender script picks it up automatically.
 *   Dynamic routes (countries/:slug, etc.) are expanded from data files in
 *   `expandRoutes()` below; no manual entry needed for new cities/countries.
 */

import type { Country } from "./data/countries";
import type { City } from "./data/cities";
import { countryLPData } from "./data/salary-lp-data";
import { cityComparisonData } from "./data/city-comparison-lp-data";

export const SITE = "https://expatlix.com";

export interface RouteSeo {
  title: string;
  description: string;
  schema?: object;
}

export interface RouteConfig {
  path: string;
  seo: RouteSeo;
}

export const staticRoutes: RouteConfig[] = [
  {
    path: "/",
    seo: {
      title: "Expatlix — Build your best life in Europe",
      description:
        "Compare destinations, understand local systems, and move faster, safer, and fully prepared for your new life in Europe.",
    },
  },
  {
    path: "/countries",
    seo: {
      title: "European Countries for Expats | Expatlix",
      description:
        "Explore 12 European countries — tax systems, cost of living, weather, and quality of life for expats.",
    },
  },
  {
    path: "/compare",
    seo: {
      title: "Compare European Cities | Expatlix",
      description:
        "Side-by-side comparison of European cities across safety, cost of living, salaries, weather, and more.",
    },
  },
  {
    path: "/salary-calculator",
    seo: {
      title: "European Salary Calculator 2024 | Expatlix",
      description:
        "Estimate your gross-to-net salary in the Netherlands, France, Germany, and Hungary with 2024 tax parameters.",
    },
  },
  {
    path: "/quiz",
    seo: {
      title: "Expat City Match Quiz | Expatlix",
      description:
        "Answer 9 questions to discover your ideal European expat city based on your lifestyle and priorities.",
    },
  },
  {
    path: "/quiz/results",
    seo: {
      title: "Your City Match Results | Expatlix",
      description: "Your personalised European city recommendations from the expat lifestyle quiz.",
    },
  },
  {
    path: "/methodology",
    seo: {
      title: "Methodology | Expatlix",
      description: "How we score cities, calculate salary estimates, and compile quality-of-life indices.",
    },
  },
  {
    path: "/guides/settle-down",
    seo: {
      title: "Settle Down in Europe | Expatlix",
      description: "Guides on housing, banking, visas, and settling into your new European city. Coming soon.",
    },
  },
  {
    path: "/guides/schools-family",
    seo: {
      title: "Schools & Family in Europe | Expatlix",
      description: "International schools, childcare, and family life guides for European expats. Coming soon.",
    },
  },
  {
    path: "/guides/cost-of-living",
    seo: {
      title: "Cost of Living in Europe 2026 | Expatlix",
      description:
        "Compare rent, groceries, transport, and dining costs across 35+ European cities. Side-by-side city cost-of-living comparison tool.",
    },
  },
  {
    path: "/tools/compare",
    seo: {
      title: "European City Cost Comparison Tool | Expatlix",
      description:
        "Compare cost of living, rent, salaries, healthcare, and climate side by side for 10 European cities. Shareable link and embeddable widget.",
    },
  },
  {
    path: "/embed/compare",
    seo: {
      title: "City Comparison Embed | Expatlix",
      description: "Embeddable side-by-side city cost comparison widget.",
    },
  },
  {
    path: "/admin",
    seo: {
      title: "Admin | Expatlix",
      description: "Protected analytics dashboard.",
    },
  },
];

/** Expand static routes + one entry per country + one entry per city. */
export function expandRoutes(countries: Country[], cities: City[]): RouteConfig[] {
  const countryRoutes: RouteConfig[] = countries.map((c) => ({
    path: `/countries/${c.slug}`,
    seo: {
      title: `Living in ${c.name} as an Expat | Expatlix`,
      description: `Expat guide to ${c.name}: cost of living, salaries, safety, taxes, and quality of life.`,
    },
  }));

  const cityRoutes: RouteConfig[] = cities.map((city) => {
    const country = countries.find((c) => c.id === city.countryId);
    return {
      path: `/countries/${country?.slug ?? city.countryId}/${city.slug}`,
      seo: {
        title: `Living in ${city.name} | Expatlix`,
        description: `Expat guide to ${city.name}: cost of living, median salary, safety index, weather, and transport.`,
      },
    };
  });

  // SEO landing pages: /salary-calculator/[country]
  const salaryLPRoutes: RouteConfig[] = countryLPData.map((lp) => ({
    path: `/salary-calculator/${lp.slug}`,
    seo: {
      title: lp.seoTitle,
      description: lp.seoDescription,
    },
  }));

  // SEO landing pages: /compare/[city1]-vs-[city2]
  const cityComparisonRoutes: RouteConfig[] = cityComparisonData.map((lp) => ({
    path: `/compare/${lp.slug}`,
    seo: {
      title: lp.seoTitle,
      description: lp.seoDescription,
    },
  }));

  return [
    ...staticRoutes,
    ...countryRoutes,
    ...cityRoutes,
    ...salaryLPRoutes,
    ...cityComparisonRoutes,
  ];
}
