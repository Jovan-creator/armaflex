import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Hotel,
  Menu,
  Phone,
  Mail,
  MapPin,
  Star,
  Calendar,
  Users,
  Camera,
  Info,
  MessageCircle,
  HelpCircle,
  ArrowLeft,
  LogIn,
} from "lucide-react";

interface PublicLayoutProps {
  children: ReactNode;
}

const publicNavigation = [
  { name: "Home", href: "/public", icon: Hotel },
  { name: "About Us", href: "/public/about", icon: Info },
  { name: "Rooms & Suites", href: "/public/rooms", icon: Users },
  { name: "Gallery", href: "/public/gallery", icon: Camera },
  { name: "Reviews", href: "/public/reviews", icon: Star },
  { name: "Contact", href: "/public/contact", icon: MessageCircle },
  { name: "FAQs", href: "/public/faqs", icon: HelpCircle },
];

export function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/public" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hotel-500">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Armaflex Hotel</h1>
                <p className="text-xs text-muted-foreground">Luxury Experience</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {publicNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-hotel-600",
                      isActive ? "text-hotel-600" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* CTA and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="hidden sm:flex border-hotel-500 text-hotel-600 hover:bg-hotel-50"
                onClick={() => navigate("/login")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Staff Login
              </Button>
              <Button
                className="hidden md:flex bg-hotel-500 hover:bg-hotel-600"
                onClick={() => navigate("/public/rooms")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-6 mt-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hotel-500">
                        <Hotel className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Armaflex Hotel</h2>
                        <p className="text-sm text-muted-foreground">Luxury Experience</p>
                      </div>
                    </div>

                    <nav className="flex flex-col space-y-3">
                      {publicNavigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              isActive
                                ? "bg-hotel-100 text-hotel-800"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </nav>

                    <Button
                      variant="outline"
                      className="w-full border-hotel-500 text-hotel-600 hover:bg-hotel-50"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/login");
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Staff Login
                    </Button>

                    <Button
                      className="w-full bg-hotel-500 hover:bg-hotel-600"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/public/rooms");
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-luxury-900 text-luxury-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Hotel Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hotel-500">
                  <Hotel className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Armaflex Hotel</h3>
                  <p className="text-sm text-luxury-300">Luxury Experience</p>
                </div>
              </div>
              <p className="text-sm text-luxury-300 leading-relaxed">
                Experience the pinnacle of luxury hospitality with our world-class service, 
                elegant accommodations, and exceptional amenities.
              </p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-hotel-500 text-hotel-500" />
                ))}
                <span className="text-sm text-luxury-300">5.0 • 1,247 reviews</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <nav className="flex flex-col space-y-2">
                {publicNavigation.slice(0, 5).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-sm text-luxury-300 hover:text-hotel-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Services</h4>
              <ul className="space-y-2 text-sm text-luxury-300">
                <li>• 24/7 Room Service</li>
                <li>• Concierge Services</li>
                <li>• Spa & Wellness</li>
                <li>• Fine Dining Restaurant</li>
                <li>• Business Center</li>
                <li>• Event Facilities</li>
                <li>• Airport Transfers</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-hotel-500 mt-0.5" />
                  <div className="text-sm text-luxury-300">
                    <p>123 Luxury Avenue</p>
                    <p>Premium District, City 12345</p>
                    <p>United States</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-hotel-500" />
                  <span className="text-sm text-luxury-300">+1 (555) 123-HOTEL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-hotel-500" />
                  <span className="text-sm text-luxury-300">info@armaflexhotel.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-luxury-800 mt-8 pt-8 text-center">
            <p className="text-sm text-luxury-400">
              © 2024 Armaflex Hotel Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
