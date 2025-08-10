import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useUser, UserRole } from "@/contexts/UserContext";
import {
  Hotel,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  UserCheck,
  Coffee,
  Wrench,
  Calculator,
  ChefHat,
  HeadphonesIcon,
  User,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Users,
  Calendar,
  ArrowRight,
  Play,
  Award,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock user credentials for demo
const mockUsers = [
  {
    email: "admin@armaflex.com",
    password: "admin123",
    role: "admin" as UserRole,
    name: "Jovan K",
    department: "Management",
  },
  {
    email: "receptionist@armaflex.com", 
    password: "reception123",
    role: "receptionist" as UserRole,
    name: "Sarah Johnson",
    department: "Front Desk",
  },
  {
    email: "housekeeping@armaflex.com",
    password: "cleaning123",
    role: "housekeeping" as UserRole,
    name: "Maria Garcia", 
    department: "Housekeeping",
  },
  {
    email: "maintenance@armaflex.com",
    password: "repair123",
    role: "maintenance" as UserRole,
    name: "Robert Wilson",
    department: "Maintenance",
  },
  {
    email: "finance@armaflex.com",
    password: "finance123",
    role: "accountant" as UserRole,
    name: "Emily Davis",
    department: "Finance",
  },
  {
    email: "restaurant@armaflex.com",
    password: "food123",
    role: "restaurant" as UserRole,
    name: "Michael Chen",
    department: "Restaurant",
  },
  {
    email: "support@armaflex.com",
    password: "help123",
    role: "support" as UserRole,
    name: "Lisa Brown",
    department: "IT Support",
  },
];

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

const roleColors = {
  admin: "bg-purple-100 text-purple-800 border-purple-200",
  receptionist: "bg-blue-100 text-blue-800 border-blue-200", 
  housekeeping: "bg-green-100 text-green-800 border-green-200",
  maintenance: "bg-orange-100 text-orange-800 border-orange-200",
  accountant: "bg-indigo-100 text-indigo-800 border-indigo-200",
  restaurant: "bg-yellow-100 text-yellow-800 border-yellow-200",
  support: "bg-pink-100 text-pink-800 border-pink-200",
  guest: "bg-gray-100 text-gray-800 border-gray-200",
};

const features = [
  {
    icon: Shield,
    title: "Secure Access",
    description: "Role-based authentication with enterprise-grade security",
  },
  {
    icon: Users,
    title: "Multi-User Support",
    description: "Designed for teams with different access levels",
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Live dashboards and performance metrics",
  },
  {
    icon: CheckCircle,
    title: "Complete Management",
    description: "Everything you need to run your hotel efficiently",
  },
];

const stats = [
  { label: "Hotels Using Armaflex", value: "500+" },
  { label: "Staff Members", value: "10,000+" },
  { label: "Bookings Processed", value: "1M+" },
  { label: "Customer Satisfaction", value: "99.5%" },
];

// Hotel background images for slider - Using reliable CDN
const hotelImages = [
  {
    url: "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
    alt: "Luxury Hotel Lobby with modern design",
    title: "Grand Lobby Experience"
  },
  {
    url: "https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839183_1280.jpg",
    alt: "Elegant hotel room with city view",
    title: "Premium Accommodation"
  },
  {
    url: "https://cdn.pixabay.com/photo/2017/03/22/17/39/kitchen-2165756_1280.jpg",
    alt: "Hotel exterior with beautiful architecture",
    title: "Stunning Architecture"
  },
  {
    url: "https://cdn.pixabay.com/photo/2016/11/29/03/53/architecture-1867187_1280.jpg",
    alt: "Hotel restaurant dining area",
    title: "Fine Dining Experience"
  },
  {
    url: "https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092_1280.jpg",
    alt: "Modern hotel swimming pool area",
    title: "Relaxation & Recreation"
  },
  {
    url: "https://cdn.pixabay.com/photo/2016/11/30/08/46/bedroom-1872196_1280.jpg",
    alt: "Luxurious hotel spa and wellness center",
    title: "Wellness & Spa Services"
  }
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const testimonials = [
    {
      text: "Armaflex has revolutionized our hotel operations. The intuitive interface and comprehensive features make managing our property effortless.",
      author: "James Wellington",
      role: "General Manager",
      hotel: "Luxury Resort & Spa",
    },
    {
      text: "The real-time analytics and reporting features have given us insights we never had before. Our revenue has increased by 25% since implementation.",
      author: "Maria Rodriguez",
      role: "Operations Director",
      hotel: "Metropolitan Hotel Chain",
    },
    {
      text: "Staff love how easy it is to use. Training new employees takes minutes instead of hours. The role-based access is perfect for our needs.",
      author: "David Park",
      role: "IT Manager",
      hotel: "Boutique Hotels Group",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Auto-rotate background images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % hotelImages.length);
    }, 6000); // Changed to 6 seconds to be different from testimonials
    return () => clearInterval(timer);
  }, []);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = hotelImages.map((img) => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = resolve;
          image.onerror = reject;
          image.src = img.url;
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsImageLoaded(true);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
        setIsImageLoaded(true); // Still show the component
      }
    };

    preloadImages();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      setUser({
        id: Math.random().toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      });
      
      // Redirect to appropriate dashboard
      navigate("/");
    } else {
      setError("Invalid email or password. Please try again.");
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (user: typeof mockUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setShowDemoAccounts(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % hotelImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + hotelImages.length) % hotelImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImage(index);
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image Slider */}
      <div
        className="absolute inset-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {hotelImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
              style={{
                backgroundImage: `url(${image.url})`,
                animation: index === currentImage ? 'ken-burns 6s ease-in-out infinite alternate' : 'none'
              }}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-900/80 via-luxury-800/70 to-luxury-900/90" />
          </div>
        ))}

        {/* Loading state */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 animate-pulse" />
        )}
      </div>

      {/* Image Navigation Controls */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 lg:block hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevImage}
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 lg:block hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextImage}
          className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 lg:block hidden">
        <div className="flex space-x-2">
          {hotelImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImage
                  ? 'bg-hotel-400 scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Image Title Overlay */}
      <div className="absolute bottom-20 left-12 z-20 lg:block hidden">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
          <p className="text-white/90 text-sm font-medium">
            {hotelImages[currentImage]?.title}
          </p>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-hotel-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-hotel-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-hotel-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-20 min-h-screen flex">
        {/* Left Side - Branding & Information */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 text-white">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-xl bg-hotel-500 flex items-center justify-center">
                <Hotel className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Armaflex Hotel Management</h1>
                <p className="text-hotel-200">Professional Hotel Operations Platform</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-hotel-300">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Why Choose Armaflex?</h2>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-hotel-500/20 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-hotel-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{feature.title}</h3>
                    <p className="text-sm text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm">
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-hotel-400 text-hotel-400" />
              ))}
            </div>
            <blockquote className="text-white/90 italic mb-4">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-hotel-500 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {testimonials[currentTestimonial].author.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div>
                <div className="font-medium text-white">{testimonials[currentTestimonial].author}</div>
                <div className="text-xs text-gray-300">
                  {testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].hotel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-hotel-500 flex items-center justify-center">
                  <Hotel className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-300">Sign in to Armaflex Hotel Management System</p>
            </div>

            {/* Login Card */}
            <Card className="backdrop-blur-xl bg-white/95 border-white/20 shadow-2xl">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access the management system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-hotel-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-hotel-500"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-hotel-500 hover:bg-hotel-600 transition-all duration-200 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Demo Accounts Section */}
                <div className="pt-6 border-t">
                  <Button
                    variant="outline"
                    className="w-full mb-4"
                    onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                  >
                    {showDemoAccounts ? "Hide" : "Show"} Demo Accounts
                  </Button>
                  
                  {showDemoAccounts && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        Click any role to auto-fill credentials:
                      </p>
                      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                        {mockUsers.map((user) => {
                          const Icon = roleIcons[user.role];
                          return (
                            <Button
                              key={user.email}
                              variant="ghost"
                              className="justify-start h-auto p-3 hover:bg-hotel-50 transition-colors"
                              onClick={() => handleDemoLogin(user)}
                            >
                              <div className="flex items-center space-x-3 w-full">
                                <div className="h-8 w-8 rounded-full bg-hotel-100 flex items-center justify-center">
                                  <Icon className="h-4 w-4 text-hotel-600" />
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.department}</p>
                                </div>
                                <Badge className={roleColors[user.role]} variant="outline">
                                  {user.role}
                                </Badge>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        All demo passwords follow the format: [role]123
                      </p>
                    </div>
                  )}
                </div>

                {/* Guest Access */}
                <div className="pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Not a staff member?
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-hotel-600 hover:text-hotel-700 hover:bg-hotel-50 w-full"
                    onClick={() => navigate("/public")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Continue as Guest to Public Website
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security & Info */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>24/7 Support</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                This is a demo system. In production, use secure authentication.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes ken-burns {
          0% { transform: scale(1.05) translateX(0px) translateY(0px); }
          50% { transform: scale(1.1) translateX(-20px) translateY(-10px); }
          100% { transform: scale(1.05) translateX(0px) translateY(0px); }
        }
      `}</style>
    </div>
  );
}
