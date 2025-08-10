import React, { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Hotel,
  Calendar,
  CreditCard,
  User,
  LogOut,
  Menu,
  Home,
  Bell,
  Settings,
  MessageSquare,
  Utensils,
  Car,
  Wifi,
  Phone,
  Star,
  Clock,
  MapPin,
  HeadphonesIcon,
  ShoppingBag,
  Camera,
  Dumbbell,
} from "lucide-react";

interface GuestPortalLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/guest",
    icon: Home,
    description: "Overview of your stay",
  },
  {
    title: "My Reservations",
    href: "/guest/reservations",
    icon: Calendar,
    description: "View and manage bookings",
  },
  {
    title: "Bills & Payments",
    href: "/guest/billing",
    icon: CreditCard,
    description: "View charges and receipts",
  },
  {
    title: "Services",
    href: "/guest/services",
    icon: HeadphonesIcon,
    description: "Request hotel services",
  },
  {
    title: "Dining",
    href: "/guest/dining",
    icon: Utensils,
    description: "Restaurant reservations",
  },
  {
    title: "Amenities",
    href: "/guest/amenities",
    icon: Dumbbell,
    description: "Pool, gym, spa bookings",
  },
  {
    title: "Concierge",
    href: "/guest/concierge",
    icon: MapPin,
    description: "Local recommendations",
  },
  {
    title: "Reviews",
    href: "/guest/reviews",
    icon: Star,
    description: "Share your experience",
  },
  {
    title: "Profile",
    href: "/guest/profile",
    icon: User,
    description: "Account settings",
  },
];

const quickActions = [
  {
    title: "Room Service",
    icon: Utensils,
    color: "bg-orange-500",
    action: "request-room-service",
  },
  {
    title: "Housekeeping",
    icon: Clock,
    color: "bg-blue-500",
    action: "request-housekeeping",
  },
  {
    title: "Concierge",
    icon: Phone,
    color: "bg-green-500",
    action: "call-concierge",
  },
  {
    title: "WiFi Info",
    icon: Wifi,
    color: "bg-purple-500",
    action: "wifi-info",
  },
];

// Mock guest data - in real app this would come from authentication
const mockGuest = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  avatar: null,
  room: "Suite 201",
  checkIn: "2024-01-15",
  checkOut: "2024-01-18",
  status: "checked-in",
};

export function GuestPortalLayout({ children }: GuestPortalLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("guestToken");
    navigate("/guest/login");
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "request-room-service":
        navigate("/guest/services?category=room-service");
        break;
      case "request-housekeeping":
        navigate("/guest/services?category=housekeeping");
        break;
      case "call-concierge":
        window.open("tel:+1-555-CONCIERGE", "_self");
        break;
      case "wifi-info":
        alert("WiFi Network: ArmafleXGuest\nPassword: Welcome2024");
        break;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Hotel Branding */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-hotel-500 flex items-center justify-center">
            <Hotel className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Armaflex Hotel</h1>
            <p className="text-sm text-gray-500">Guest Portal</p>
          </div>
        </div>

        {/* Guest Info Card */}
        <Card className="bg-gradient-to-r from-hotel-50 to-hotel-100 border-hotel-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mockGuest.avatar || ""} />
                <AvatarFallback className="bg-hotel-500 text-white">
                  {mockGuest.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {mockGuest.name}
                </h3>
                <p className="text-sm text-gray-600">{mockGuest.room}</p>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                {mockGuest.status === "checked-in" ? "Checked In" : "Reserved"}
              </Badge>
            </div>
            <div className="text-xs text-gray-600">
              <div className="flex justify-between">
                <span>
                  Check-in: {new Date(mockGuest.checkIn).toLocaleDateString()}
                </span>
                <span>
                  Check-out: {new Date(mockGuest.checkOut).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100",
                  isActive
                    ? "bg-hotel-100 text-hotel-700 border-r-2 border-hotel-500"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <Icon className="h-5 w-5" />
                <div className="flex-1">
                  <div>{item.title}</div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      {/* Quick Actions */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.action}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action)}
                className="h-auto p-3 flex flex-col space-y-1"
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    action.color,
                  )}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs">{action.title}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-3">
          <Hotel className="h-8 w-8 text-hotel-500" />
          <div>
            <h1 className="text-lg font-bold">Armaflex Hotel</h1>
            <p className="text-sm text-gray-500">Guest Portal</p>
          </div>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
