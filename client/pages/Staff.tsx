import PlaceholderPage from "./PlaceholderPage";
import { UserCheck } from "lucide-react";

export default function Staff() {
  return (
    <PlaceholderPage
      title="Staff Management"
      description="Employee scheduling, performance tracking, and team coordination"
      icon={<UserCheck className="h-8 w-8 text-hotel-700" />}
      features={[
        "Employee profile management",
        "Shift scheduling and planning",
        "Time tracking and attendance",
        "Performance evaluation system",
        "Training and certification tracking",
        "Payroll integration",
        "Role and permission management",
        "Internal communication tools",
        "Leave and vacation management",
        "Staff analytics and reporting"
      ]}
    />
  );
}
