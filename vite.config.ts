import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),

    visualizer({
      filename: "bundle-stats.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      open: true,
    }),
  ],

  optimizeDeps: {
    include: ["react", "react-dom"],
    esbuildOptions: {
      target: "esnext",
    },
  },

  build: {
    target: "esnext",
    modulePreload: true,
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },

    chunkSizeWarningLimit: 800,
  },
});
