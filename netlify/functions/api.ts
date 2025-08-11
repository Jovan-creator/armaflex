import serverless from "serverless-http";
import { createServer } from "../../server";

console.log("🚀 Initializing Netlify Function...");

// Create the Express app
const app = createServer();

console.log("✅ Express app created successfully");

// Export the serverless handler
export const handler = serverless(app, {
  binary: ["image/*", "font/*", "application/octet-stream"],
});
