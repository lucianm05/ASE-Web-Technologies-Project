import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import viteSvgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteSvgr(), react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
