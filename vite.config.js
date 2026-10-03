import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development the browser talks to Vite (5173); /api is forwarded to Nginx (8080),
// which load-balances across the FastAPI containers. Same-origin = no CORS headaches and
// the refresh-token cookie just works.
const apiTarget = process.env.VITE_PROXY_TARGET || "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": apiTarget, "/health": apiTarget },
  },
});
