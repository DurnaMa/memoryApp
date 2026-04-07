import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@scss": resolve(__dirname, "scss"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
      },
    },
  },
});
