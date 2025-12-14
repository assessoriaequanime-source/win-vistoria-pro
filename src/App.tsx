import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { VistoriaProvider } from "@/contexts/VistoriaContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NovaVistoria from "./pages/NovaVistoria";
import BuscarVistoria from "./pages/BuscarVistoria";
import RealizarVistoria from "./pages/RealizarVistoria";
import VistoriaConcluida from "./pages/VistoriaConcluida";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <VistoriaProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/nova-vistoria" element={<NovaVistoria />} />
              <Route path="/buscar" element={<BuscarVistoria />} />
              <Route path="/vistoria/:codigo" element={<RealizarVistoria />} />
              <Route path="/concluida/:codigo" element={<VistoriaConcluida />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </VistoriaProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
