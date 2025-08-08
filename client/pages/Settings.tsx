import PlaceholderPage from "./PlaceholderPage";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <PlaceholderPage
      title="System Settings"
      description="Configure system preferences, user permissions, and integrations"
      icon={<SettingsIcon className="h-8 w-8 text-hotel-700" />}
      features={[
        "User role and permission management",
        "System configuration options",
        "Hotel property settings",
        "Tax and currency settings",
        "Email and notification preferences",
        "Integration management",
        "Backup and security settings",
        "Theme and appearance customization",
        "Language and localization",
        "System maintenance tools"
      ]}
    />
  );
}
