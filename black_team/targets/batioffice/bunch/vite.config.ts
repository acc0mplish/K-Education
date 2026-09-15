import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://tauri.app/configure/build-options
export default defineConfig({
  plugins: [react()],

  // Tauri expects a static server URL for `devUrl`.
  server: {
    port: 1420,
    strictPort: true,
    host: "127.0.0.1",
    hmr: {
      host: "127.0.0.1",
      port: 1421,
    },
  },
  build: {
    target: "es2021",
    minify: "esbuild",
    sourcemap: false,
  },
});
