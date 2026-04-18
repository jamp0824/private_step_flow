import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Stage7Monitoring from "./pages/Stage7Monitoring";
import Step2Upload from "./pages/Step2Upload";
import Step3Analysis from "./pages/Step3Analysis";
import Step3B from "./pages/Step3B";
import Step3C from "./pages/Step3C";
import Step4Review from "./pages/Step4Review";
import Step5Report from "./pages/Step5Report";
import Step6Approval from "./pages/Step6Approval";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/stage1" component={Dashboard} />
      <Route path="/stage2" component={Step2Upload} />
      <Route path="/stage3" component={Step3Analysis} />
      <Route path="/stage3/subordinated" component={Step3B} />
      <Route path="/stage3/perpetual" component={Step3C} />
      <Route path="/stage4" component={Step4Review} />
      <Route path="/stage5" component={Step5Report} />
      <Route path="/stage6" component={Step6Approval} />
      <Route path="/stage7" component={Stage7Monitoring} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <WorkflowProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WorkflowProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
