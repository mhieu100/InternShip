import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   host: "mhieu.vn",
  //   port: 5173,

  // },
});
