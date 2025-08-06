import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./frontend/setupTests.ts"],
    include: [
      "frontend/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "backend/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}"
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "frontend/setupTests.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "**/dist/**"
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
      "~backend": path.resolve(__dirname, "./backend"),
    },
  },
});
