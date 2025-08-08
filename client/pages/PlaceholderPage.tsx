import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: ReactNode;
  features: string[];
  comingSoon?: boolean;
}

export default function PlaceholderPage({
  title,
  description,
  icon,
  features,
  comingSoon = true,
}: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-lg bg-hotel-100 flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-lg mt-2">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Planned Features:</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-hotel-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {comingSoon && (
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Coming Soon</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This module is under development. Continue prompting to help build out this page with specific features you need.
              </p>
              <Button className="bg-hotel-500 hover:bg-hotel-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                Request Development
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
