import { App } from "encore.dev/application";
import { secret } from "encore.dev/config";

// Import services
import analytics from "./backend/analytics/encore.service";
import auth from "./backend/auth/encore.service";
import chat from "./backend/chat/encore.service";
import news from "./backend/news/encore.service";
import pos from "./backend/pos/encore.service";
import review from "./backend/review/encore.service";
import user from "./backend/user/encore.service";

// Import the auth handler to connect it to the gateway
import { auth as authHandler } from "./backend/auth/auth";

// Define the application.
export default new App("payream-analytics-dashboard", {
  // Use Cloudflare for production deployments.
  // TODO: Fill in your Cloudflare Account ID and Zone ID in the Encore Cloud dashboard.
  cloudflare: {
    accountID: secret("CloudflareAccountID"),
    zoneID: secret("CloudflareZoneID"),
  },
  // Define the production domain for the frontend.
  domains: ["www.payream.xyz"],
  // Define the API gateway.
  gateway: {
    auth: authHandler,
  },
  // List all services in the app.
  services: [
    analytics,
    auth,
    chat,
    news,
    pos,
    review,
    user,
  ],
});
