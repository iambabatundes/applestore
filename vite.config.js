import path from "path";
import { defineConfig, transformWithEsbuild } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null; // Only apply to JS files in src

        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react(),
    svgr(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    reporters: ["verbose"],
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*"],
      exclude: [],
    },
  },
  server: {
    open: true, // Open browser automatically
    port: 3000, // Default CRA port
  },
  resolve: {
    alias: {
      screens: path.resolve(__dirname, "./src/screens"),
    },
  },
  build: {
    outDir: "build",
  },
  optimizeDeps: {
    force: true, // Force optimize dependencies
    esbuildOptions: {
      loader: {
        ".js": "jsx", // Ensure JSX support in JS files
      },
    },
  },
});
