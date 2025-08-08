import { useState } from "react";
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
} from "lucide-react";

// Mock user credentials for demo
const mockUsers = [
  {
    email: "admin@armaflex.com",
    password: "admin123",
    role: "admin" as UserRole,
    name: "John Doe",
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  
  const { setUser } = useUser();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-900 via-luxury-800 to-luxury-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-hotel-500 flex items-center justify-center">
              <Hotel className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to Armaflex Hotel Management System</p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                className="w-full bg-hotel-500 hover:bg-hotel-600 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Accounts Section */}
            <div className="mt-6 pt-6 border-t">
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              >
                {showDemoAccounts ? "Hide" : "Show"} Demo Accounts
              </Button>
              
              {showDemoAccounts && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    Click any role to auto-fill credentials:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {mockUsers.map((user) => {
                      const Icon = roleIcons[user.role];
                      return (
                        <Button
                          key={user.email}
                          variant="ghost"
                          className="justify-start h-auto p-3 hover:bg-hotel-50"
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

            {/* Public Site Link */}
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Not a staff member?
              </p>
              <Button 
                variant="ghost" 
                className="text-hotel-600 hover:text-hotel-700 hover:bg-hotel-50"
                onClick={() => navigate("/public")}
              >
                Visit Public Website
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            This is a demo system. In production, use secure authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
