import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Step2Upload from "./pages/Step2Upload";
import Step3Analysis from "./pages/Step3Analysis";
import Step3B from "./pages/Step3B";
import Step3C from "./pages/Step3C";
import Step4Review from "./pages/Step4Review";
import Step56Report from "./pages/Step56Report";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/step2" component={Step2Upload} />
      <Route path="/step3" component={Step3Analysis} />
      <Route path="/step3b" component={Step3B} />
      <Route path="/step3c" component={Step3C} />
      <Route path="/step4" component={Step4Review} />
      <Route path="/step56" component={Step56Report} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
