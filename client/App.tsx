import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { HotelLayout } from "@/components/HotelLayout";
import { PublicLayout } from "@/components/PublicLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import RoomsAdmin from "./pages/RoomsAdmin";
import Reservations from "./pages/Reservations";
import Guests from "./pages/Guests";
import Billing from "./pages/Billing";
import Housekeeping from "./pages/Housekeeping";
import Staff from "./pages/Staff";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import ChannelManager from "./pages/ChannelManager";
import Inventory from "./pages/Inventory";
import Maintenance from "./pages/Maintenance";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import PublicHome from "./pages/PublicHome";
import {
  AboutPage,
  ContactPage,
  FAQPage,
  GalleryPage,
} from "./pages/PublicPages";
import { PublicRoomsPage, PublicReviewsPage } from "./pages/PublicRoomsReviews";
import NotFound from "./pages/NotFound";
import GuestBookingReal from "./pages/GuestBookingReal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Management Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HotelLayout>
                    <Dashboard />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute requiredPermission="rooms">
                  <HotelLayout>
                    <Rooms />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute requiredPermission="bookings">
                  <HotelLayout>
                    <Reservations />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/guests"
              element={
                <ProtectedRoute requiredPermission="guests">
                  <HotelLayout>
                    <Guests />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute requiredPermission="billing">
                  <HotelLayout>
                    <Billing />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/housekeeping"
              element={
                <ProtectedRoute requiredPermission="housekeeping">
                  <HotelLayout>
                    <Housekeeping />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute requiredPermission="*">
                  <HotelLayout>
                    <Staff />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredPermission="reports">
                  <HotelLayout>
                    <Reports />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredPermission="*">
                  <HotelLayout>
                    <Settings />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute requiredPermission="*">
                  <HotelLayout>
                    <Notifications />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/channel-manager"
              element={
                <ProtectedRoute requiredPermission="*">
                  <HotelLayout>
                    <ChannelManager />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute requiredPermission="*">
                  <HotelLayout>
                    <Inventory />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <ProtectedRoute requiredPermission="*">
                  <HotelLayout>
                    <Maintenance />
                  </HotelLayout>
                </ProtectedRoute>
              }
            />

            {/* Public Pages - No Authentication Required */}
            <Route
              path="/public"
              element={
                <ProtectedRoute requireAuth={false}>
                  <PublicLayout>
                    <PublicHome />
                  </PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/public/about"
              element={
                <ProtectedRoute requireAuth={false}>
                  <PublicLayout>
                    <AboutPage />
                  </PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/public/rooms"
              element={
                <ProtectedRoute requireAuth={false}>
                  <PublicLayout>
                    <PublicRoomsPage />
                  </PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/public/reviews"
              element={
                <ProtectedRoute requireAuth={false}>
                  <PublicLayout>
                    <PublicReviewsPage />
                  </PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/public/contact"
              element={
                <ProtectedRoute requireAuth={false}>
                  <PublicLayout>
                    <ContactPage />
                  </PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/public/faqs"
              element={
                <ProtectedRoute requireAuth={false}>
                  <PublicLayout>
                    <FAQPage />
                  </PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/public/gallery"
              element={
                <ProtectedRoute requireAuth={false}>
                  <PublicLayout>
                    <GalleryPage />
                  </PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/book"
              element={
                <ProtectedRoute requireAuth={false}>
                  <PublicLayout>
                    <GuestBookingReal />
                  </PublicLayout>
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
