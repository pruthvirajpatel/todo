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
  css: {
    preprocessorOptions: {
      scss: {
      },
    },
  },
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
          // Vendor chunk: React and related libraries
          'react-vendor': ['react', 'react-dom'],
          // Virtualization chunk: Only loaded when needed
          'virtualization': ['react-window'],
        },
        // Name chunks based on their module
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      
    },
    chunkSizeWarningLimit: 800,
  },
});
