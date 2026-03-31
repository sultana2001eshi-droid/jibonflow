import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ToolsPage from "./pages/Tools";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Developer from "./pages/Developer";
import Terms from "./pages/Terms";
import BudgetPlanner from "./pages/tools/BudgetPlanner";
import MealPlanner from "./pages/tools/MealPlanner";
import ApplicationGenerator from "./pages/tools/ApplicationGenerator";
import BusinessToolkit from "./pages/tools/BusinessToolkit";
import LifeOrganizer from "./pages/tools/LifeOrganizer";
import CaptionGenerator from "./pages/tools/CaptionGenerator";
import DecisionHelper from "./pages/tools/DecisionHelper";
import AgeCalculator from "./pages/tools/AgeCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/budget" element={<BudgetPlanner />} />
          <Route path="/tools/meal" element={<MealPlanner />} />
          <Route path="/tools/application" element={<ApplicationGenerator />} />
          <Route path="/tools/business" element={<BusinessToolkit />} />
          <Route path="/tools/organizer" element={<LifeOrganizer />} />
          <Route path="/tools/caption" element={<CaptionGenerator />} />
          <Route path="/tools/decision" element={<DecisionHelper />} />
          <Route path="/tools/time" element={<AgeCalculator />} />
          <Route path="/tools/age" element={<AgeCalculator />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
