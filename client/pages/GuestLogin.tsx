import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Hotel,
  Mail,
  Key,
  Eye,
  EyeOff,
  Phone,
  CreditCard,
  ArrowLeft,
  QrCode,
  MessageSquare,
} from "lucide-react";

export default function GuestLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginMethod, setLoginMethod] = useState<
    "email" | "confirmation" | "phone"
  >("confirmation");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmationCode: "",
    phoneNumber: "",
    verificationCode: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock authentication - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store mock token
      localStorage.setItem("guestToken", "mock-guest-token");

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });

      navigate("/guest");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAccess = (code: string) => {
    setFormData({ ...formData, confirmationCode: code });
    setLoginMethod("confirmation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hotel-50 to-hotel-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-hotel-500 flex items-center justify-center mb-4">
            <Hotel className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to Armaflex Hotel
          </h1>
          <p className="text-gray-600">Access your guest portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Guest Portal Access</CardTitle>
            <CardDescription>
              Choose your preferred login method
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Login Method Selection */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={loginMethod === "confirmation" ? "default" : "outline"}
                size="sm"
                onClick={() => setLoginMethod("confirmation")}
                className="text-xs"
              >
                <Key className="h-3 w-3 mr-1" />
                Confirmation
              </Button>
              <Button
                variant={loginMethod === "email" ? "default" : "outline"}
                size="sm"
                onClick={() => setLoginMethod("email")}
                className="text-xs"
              >
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
              <Button
                variant={loginMethod === "phone" ? "default" : "outline"}
                size="sm"
                onClick={() => setLoginMethod("phone")}
                className="text-xs"
              >
                <Phone className="h-3 w-3 mr-1" />
                Phone
              </Button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Confirmation Code Login */}
              {loginMethod === "confirmation" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="confirmationCode">Confirmation Code</Label>
                    <Input
                      id="confirmationCode"
                      placeholder="ARM123456"
                      value={formData.confirmationCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmationCode: e.target.value.toUpperCase(),
                        })
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Found in your booking confirmation email
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="guestLastName">Last Name</Label>
                    <Input id="guestLastName" placeholder="Johnson" required />
                  </div>
                </div>
              )}

              {/* Email Login */}
              {loginMethod === "email" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Phone Login */}
              {loginMethod === "phone" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      placeholder="123456"
                      value={formData.verificationCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          verificationCode: e.target.value,
                        })
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-auto p-0 text-xs text-hotel-600"
                    >
                      Send verification code
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Access Guest Portal"}
              </Button>
            </form>

            <Separator />

            {/* Quick Access Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Quick Access (Demo)
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAccess("ARM123456")}
                  className="justify-start"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Sarah Johnson - Suite 201</div>
                    <div className="text-xs text-gray-500">
                      Checked in • ARM123456
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAccess("ARM789012")}
                  className="justify-start"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">Michael Chen - Room 105</div>
                    <div className="text-xs text-gray-500">
                      Upcoming • ARM789012
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            <Separator />

            {/* Alternative Options */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan QR Code
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Need Help?
                </Button>
              </div>

              <div className="text-center">
                <Link
                  to="/public"
                  className="text-sm text-hotel-600 hover:underline flex items-center justify-center"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back to Hotel Website
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Having trouble accessing your account?</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-hotel-600"
          >
            Contact front desk: +1-555-ARMAFLEX
          </Button>
        </div>
      </div>
    </div>
  );
}
