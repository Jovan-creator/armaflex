import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, UserRole } from "@/contexts/UserContext";
import { NotificationSystem } from "@/components/NotificationSystem";
import {
  Hotel,
  LayoutDashboard,
  BedDouble,
  Calendar,
  Users,
  CreditCard,
  ClipboardList,
  UserCheck,
  BarChart3,
  Settings,
  BellRing,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
  Shield,
  Coffee,
  Wrench,
  Calculator,
  ChefHat,
  HeadphonesIcon,
  User,
} from "lucide-react";

interface HotelLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Rooms",
    href: "/rooms",
    icon: BedDouble,
    badge: "12 Available",
  },
  {
    title: "Reservations",
    href: "/reservations",
    icon: Calendar,
    badge: "3 New",
  },
  {
    title: "Guests",
    href: "/guests",
    icon: Users,
    badge: null,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
    badge: null,
  },
  {
    title: "Housekeeping",
    href: "/housekeeping",
    icon: ClipboardList,
    badge: "5 Pending",
  },
  {
    title: "Staff",
    href: "/staff",
    icon: UserCheck,
    badge: null,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: BellRing,
    badge: "2 New",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    badge: null,
  },
];

export function HotelLayout({ children }: HotelLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const { user, switchRole, logout } = useUser();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const roleIcons = {
    admin: Shield,
    receptionist: UserCheck,
    housekeeping: Coffee,
    maintenance: Wrench,
    accountant: Calculator,
    restaurant: ChefHat,
    support: HeadphonesIcon,
    guest: User,
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      receptionist: "bg-blue-100 text-blue-800",
      housekeeping: "bg-green-100 text-green-800",
      maintenance: "bg-orange-100 text-orange-800",
      accountant: "bg-indigo-100 text-indigo-800",
      restaurant: "bg-yellow-100 text-yellow-800",
      support: "bg-pink-100 text-pink-800",
      guest: "bg-gray-100 text-gray-800",
    };
    return colors[role] || colors.guest;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 transform bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hotel-500">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">Armaflex HMS</h1>
                <p className="text-xs text-sidebar-foreground/70">Hotel Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-xs bg-hotel-100 text-hotel-800"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-hotel-500 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name.split(" ").map(n => n[0]).join("") || "GU"}
                </span>
              </div>
              <div className="text-sm flex-1">
                <p className="font-medium text-sidebar-foreground">{user?.name || "Guest User"}</p>
                <p className="text-xs text-sidebar-foreground/70">{user?.department}</p>
                {user?.role && (
                  <Badge
                    className={`text-xs mt-1 ${getRoleColor(user.role)}`}
                    variant="outline"
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
            >
              <User className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search guests, rooms, reservations..."
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/public">
                <Hotel className="h-4 w-4 mr-2" />
                Public Site
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <NotificationSystem />
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
