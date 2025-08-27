import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Providers from "./pages/Providers";
import Demands from "./pages/Demands";
import NewProvider from "./pages/NewProvider";
import ProviderDetails from "./pages/ProviderDetails";
import NewDemand from "./pages/NewDemand";
import DemandDetails from "./pages/DemandDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/providers/new" element={<NewProvider />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />
          <Route path="/demands" element={<Demands />} />
          <Route path="/demands/new" element={<NewDemand />} />
          <Route path="/demands/:id" element={<DemandDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;