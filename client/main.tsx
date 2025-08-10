import { createRoot } from "react-dom/client";
import App from "./App";
import "./i18n/config";
import { initializePWA } from "./utils/serviceWorker";
import { offlineStorage } from "./utils/offlineStorage";

// Initialize PWA features
initializePWA().catch(console.error);

// Initialize offline storage
offlineStorage.init().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
