import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocationProvider } from "@/context/location-context";
import { SeoHead } from "@/components/SeoHead";
import { expandRoutes } from "@/routes";
import { countries } from "@/data/countries";
import { cities } from "@/data/cities";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import QuizResults from "@/pages/quiz-results";
import CountriesOverview from "@/pages/countries-overview";
import CountryDetail from "@/pages/country-detail";
import CityDetail from "@/pages/city-detail";
import Compare from "@/pages/compare";
import SalaryCalculator from "@/pages/salary-calculator";
import Methodology from "@/pages/methodology";
import ToolsCompare from "@/pages/tools-compare";
import EmbedCompare from "@/pages/embed-compare";
import GuideCostOfLiving from "@/pages/guide-cost-of-living";
import GuideSettleDown from "@/pages/guide-settle-down";
import GuideSchoolsFamily from "@/pages/guide-schools-family";

// Computed once — includes static routes + every country + every city path.
const allRoutes = expandRoutes(countries, cities);

/** Renders correct <head> tags for the current wouter path (static AND dynamic). */
function RouteHead() {
  const [loc] = useLocation();
  const route = allRoutes.find((r) => r.path === loc) ?? allRoutes[0];
  return <SeoHead seo={route.seo} path={loc} />;
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/quiz/results" component={QuizResults} />
      <Route path="/countries" component={CountriesOverview} />
      <Route path="/countries/:slug" component={CountryDetail} />
      <Route path="/countries/:countrySlug/:citySlug" component={CityDetail} />
      <Route path="/compare" component={Compare} />
      <Route path="/salary-calculator" component={SalaryCalculator} />
      <Route path="/methodology" component={Methodology} />
      <Route path="/guides/cost-of-living" component={GuideCostOfLiving} />
      <Route path="/guides/settle-down" component={GuideSettleDown} />
      <Route path="/guides/schools-family" component={GuideSchoolsFamily} />
      <Route path="/tools/compare" component={ToolsCompare} />
      <Route path="/embed/compare" component={EmbedCompare} />
      <Route component={NotFound} />
    </Switch>
  );
}

// locationHook is only passed during SSR prerendering (entry-server.tsx).
// In the browser it is undefined, and WouterRouter falls back to history API.
function App({ locationHook }: { locationHook?: (...args: unknown[]) => unknown }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* LocationProvider wraps the router so Navbar + all pages share context */}
        <LocationProvider>
          <WouterRouter
            base={import.meta.env.BASE_URL.replace(/\/$/, "")}
            hook={locationHook as never}
          >
            <RouteHead />
            <Router />
          </WouterRouter>
        </LocationProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
