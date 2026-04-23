import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: {
      host: process.env.VITE_HMR_HOST,
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT) || undefined,
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
});
