import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { port: 5174 },
  preview: { port: 4174 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          radix: ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-tabs", "@radix-ui/react-checkbox", "@radix-ui/react-switch", "@radix-ui/react-radio-group", "@radix-ui/react-progress", "@radix-ui/react-label", "@radix-ui/react-slot"],
        },
      },
    },
  },
});
