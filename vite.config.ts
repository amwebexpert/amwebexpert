import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// GitHub Pages serves from /amwebexpert/; base must match for assets to load
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    base: isProduction ? "/amwebexpert/" : "/",
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
      tsconfigPaths(),
    ],
    server: {
      port: 3000,
      open: true,
    },
    build: {
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 2000,
    },
  };
});
