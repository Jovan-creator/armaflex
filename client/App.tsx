import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HotelLayout } from "@/components/HotelLayout";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import Guests from "./pages/Guests";
import Billing from "./pages/Billing";
import Housekeeping from "./pages/Housekeeping";
import Staff from "./pages/Staff";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <HotelLayout>
              <Dashboard />
            </HotelLayout>
          } />
          <Route path="/rooms" element={
            <HotelLayout>
              <Rooms />
            </HotelLayout>
          } />
          <Route path="/reservations" element={
            <HotelLayout>
              <Reservations />
            </HotelLayout>
          } />
          <Route path="/guests" element={
            <HotelLayout>
              <Guests />
            </HotelLayout>
          } />
          <Route path="/billing" element={
            <HotelLayout>
              <Billing />
            </HotelLayout>
          } />
          <Route path="/housekeeping" element={
            <HotelLayout>
              <Housekeeping />
            </HotelLayout>
          } />
          <Route path="/staff" element={
            <HotelLayout>
              <Staff />
            </HotelLayout>
          } />
          <Route path="/reports" element={
            <HotelLayout>
              <Reports />
            </HotelLayout>
          } />
          <Route path="/settings" element={
            <HotelLayout>
              <Settings />
            </HotelLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
