import PlaceholderPage from "./PlaceholderPage";
import { Users } from "lucide-react";

export default function Guests() {
  return (
    <PlaceholderPage
      title="Guest Management"
      description="Comprehensive guest profiles, preferences, and history tracking"
      icon={<Users className="h-8 w-8 text-hotel-700" />}
      features={[
        "Guest profile management with contact information",
        "Stay history and preference tracking",
        "Loyalty program integration",
        "Guest communication center",
        "VIP and special requests management",
        "Guest feedback and reviews",
        "Document storage (ID copies, etc.)",
        "Automated guest communication",
        "Guest segmentation and targeting",
        "Check-in/check-out workflow"
      ]}
    />
  );
}
