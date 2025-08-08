import PlaceholderPage from "./PlaceholderPage";
import { ClipboardList } from "lucide-react";

export default function Housekeeping() {
  return (
    <PlaceholderPage
      title="Housekeeping Management"
      description="Streamlined cleaning schedules, task tracking, and room maintenance"
      icon={<ClipboardList className="h-8 w-8 text-hotel-700" />}
      features={[
        "Room cleaning schedule management",
        "Task assignment and tracking",
        "Staff performance monitoring",
        "Inventory management for supplies",
        "Maintenance request handling",
        "Room inspection checklists",
        "Real-time status updates",
        "Priority task management",
        "Staff communication tools",
        "Quality control reporting"
      ]}
    />
  );
}
