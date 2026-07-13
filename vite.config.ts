import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
      // Polling: útil em WSL/volumes montados (não implica Docker no projeto)
      watch: {
        usePolling: true,
        interval: 1000,
      },
      hmr: {
        host: "localhost",
        port: 3000,
        clientPort: 3000,
      },
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
        "@src": path.resolve(__dirname, "src"),
      },
    },
  };
});
