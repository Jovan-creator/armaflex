import PlaceholderPage from "./PlaceholderPage";
import { BarChart3 } from "lucide-react";

export default function Reports() {
  return (
    <PlaceholderPage
      title="Reports & Analytics"
      description="Comprehensive business intelligence and performance insights"
      icon={<BarChart3 className="h-8 w-8 text-hotel-700" />}
      features={[
        "Occupancy rate analytics",
        "Revenue and financial reports",
        "Guest satisfaction metrics",
        "Staff performance analytics",
        "Seasonal trend analysis",
        "Competitive benchmarking",
        "Custom report builder",
        "Automated report scheduling",
        "Export to PDF/Excel formats",
        "Real-time dashboard widgets"
      ]}
    />
  );
}
