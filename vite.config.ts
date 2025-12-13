import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
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
    devSourcemap: false,
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    esbuildOptions: {
      target: "es2022",
    },
  },
  define: {
    __DEV__: false,
    "process.env.NODE_ENV": '"production"',
  },
  resolve: {
    conditions: ["browser", "import", "module"],
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    target: "es2022",
    modulePreload: false,
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk: React and related libraries
          'react-vendor': ['react', 'react-dom'],
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
