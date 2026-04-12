import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
