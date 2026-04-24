import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  envPrefix: ["VITE_", "REACT_APP_"],
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: [".hiworld.social"],
    hmr: {
      host: process.env.VITE_HMR_HOST || "hiworld.social",
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT || 80),
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    globals: true,
    css: true,
  },
});
