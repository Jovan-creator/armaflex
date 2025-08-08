import PlaceholderPage from "./PlaceholderPage";
import { CreditCard } from "lucide-react";

export default function Billing() {
  return (
    <PlaceholderPage
      title="Billing & Payments"
      description="Complete financial management for room charges, services, and payments"
      icon={<CreditCard className="h-8 w-8 text-hotel-700" />}
      features={[
        "Invoice generation and management",
        "Multiple payment method support",
        "Room charges and service billing",
        "Tax calculation and compliance",
        "Refund and adjustment processing",
        "Payment history tracking",
        "Financial reporting and analytics",
        "Integration with accounting systems",
        "Automated billing workflows",
        "Currency conversion support"
      ]}
    />
  );
}
