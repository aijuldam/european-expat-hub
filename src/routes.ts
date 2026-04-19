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

export const SITE = "https://aijuldam.github.io/european-expat-hub";

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
      title: "European Expat Hub | Find Your Perfect European City",
      description:
        "Compare European cities for cost of living, salaries, safety, and quality of life. Find your perfect expat destination.",
    },
  },
  {
    path: "/countries",
    seo: {
      title: "European Countries for Expats | European Expat Hub",
      description:
        "Explore 12 European countries — tax systems, cost of living, weather, and quality of life for expats.",
    },
  },
  {
    path: "/compare",
    seo: {
      title: "Compare European Cities | European Expat Hub",
      description:
        "Side-by-side comparison of European cities across safety, cost of living, salaries, weather, and more.",
    },
  },
  {
    path: "/salary-calculator",
    seo: {
      title: "European Salary Calculator 2024 | European Expat Hub",
      description:
        "Estimate your gross-to-net salary in the Netherlands, France, Germany, and Hungary with 2024 tax parameters.",
    },
  },
  {
    path: "/quiz",
    seo: {
      title: "Expat City Match Quiz | European Expat Hub",
      description:
        "Answer 9 questions to discover your ideal European expat city based on your lifestyle and priorities.",
    },
  },
  {
    path: "/quiz/results",
    seo: {
      title: "Your City Match Results | European Expat Hub",
      description: "Your personalised European city recommendations from the expat lifestyle quiz.",
    },
  },
  {
    path: "/methodology",
    seo: {
      title: "Methodology | European Expat Hub",
      description: "How we score cities, calculate salary estimates, and compile quality-of-life indices.",
    },
  },
  {
    path: "/guides/cost-of-living",
    seo: {
      title: "Cost of Living in Europe 2026 | European Expat Hub",
      description:
        "Compare rent, groceries, transport, and dining costs across 35+ European cities. Side-by-side city cost-of-living comparison tool.",
    },
  },
  {
    path: "/tools/compare",
    seo: {
      title: "European City Cost Comparison Tool | European Expat Hub",
      description:
        "Compare cost of living, rent, salaries, healthcare, and climate side by side for 10 European cities. Shareable link and embeddable widget.",
    },
  },
  {
    path: "/embed/compare",
    seo: {
      title: "City Comparison Embed | European Expat Hub",
      description: "Embeddable side-by-side city cost comparison widget.",
    },
  },
];

/** Expand static routes + one entry per country + one entry per city. */
export function expandRoutes(countries: Country[], cities: City[]): RouteConfig[] {
  const countryRoutes: RouteConfig[] = countries.map((c) => ({
    path: `/countries/${c.slug}`,
    seo: {
      title: `Living in ${c.name} as an Expat | European Expat Hub`,
      description: `Expat guide to ${c.name}: cost of living, salaries, safety, taxes, and quality of life.`,
    },
  }));

  const cityRoutes: RouteConfig[] = cities.map((city) => {
    const country = countries.find((c) => c.id === city.countryId);
    return {
      path: `/countries/${country?.slug ?? city.countryId}/${city.slug}`,
      seo: {
        title: `Living in ${city.name} | European Expat Hub`,
        description: `Expat guide to ${city.name}: cost of living, median salary, safety index, weather, and transport.`,
      },
    };
  });

  return [...staticRoutes, ...countryRoutes, ...cityRoutes];
}
