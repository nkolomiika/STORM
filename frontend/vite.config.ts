import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const proxyTarget = process.env.VITE_PROXY_TARGET ?? "http://backend:8000";

export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    css: { include: [/theme\.css/] },
    setupFiles: "./src/setupTests.ts",
    /** Дубликаты компилированных *.test.js рядом с *.test.tsx давали двойной запуск одних и тех же тестов. */
    exclude: ["**/node_modules/**", "**/dist/**", "**/*.test.js"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.*", "src/setupTests.ts", "src/**/*.d.ts"],
      reporter: ["text", "json", "json-summary", "html"],
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    https: true,
    proxy: {
      "/auth/callback": {
        target: proxyTarget,
        changeOrigin: true,
      },
      "/api": {
        target: proxyTarget,
        changeOrigin: true,
      },
      "/ws": {
        target: proxyTarget,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
