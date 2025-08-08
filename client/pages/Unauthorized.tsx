import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Shield, ArrowLeft, Home, LogOut } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl text-red-800">Access Denied</CardTitle>
            <CardDescription className="text-red-600 mt-2">
              You don't have permission to access this resource.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {user && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700">
                <strong>Current Role:</strong> {user.role}
              </p>
              <p className="text-sm text-red-700">
                <strong>Department:</strong> {user.department}
              </p>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Your current role doesn't have the necessary permissions to view this page. 
            Please contact your administrator if you believe this is an error.
          </p>

          <div className="space-y-3">
            <Button 
              onClick={handleGoBack} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={handleGoHome} 
              className="w-full bg-hotel-500 hover:bg-hotel-600"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout & Switch User
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
