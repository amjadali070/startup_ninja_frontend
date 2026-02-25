import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    base: "/",
    plugins: [
      react(),
      // Only use mkcert in local development (not on production server builds)
      ...(isDev ? [mkcert()] : []),
    ],
    server: {
      https: isDev,
      port: 3000,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
