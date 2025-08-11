import serverless from "serverless-http";
import { createServer } from "../../server";
import { initializeDatabase } from "../../server/database/db";

console.log("🚀 Initializing Netlify Function...");

// Ensure database is initialized before creating server
let appPromise: Promise<any> | null = null;

const getApp = async () => {
  if (!appPromise) {
    appPromise = (async () => {
      console.log("🗄️ Initializing database...");
      await initializeDatabase();
      console.log("✅ Database initialized");

      const app = createServer();
      console.log("✅ Express app created successfully");
      return app;
    })();
  }
  return appPromise;
};

// Export the serverless handler
export const handler = async (event: any, context: any) => {
  const app = await getApp();
  const serverlessHandler = serverless(app, {
    binary: ["image/*", "font/*", "application/octet-stream"],
  });

  return serverlessHandler(event, context);
};
