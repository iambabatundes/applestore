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
        if (!id.match(/src\/.*\.js$/)) return null;
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react(),
    svgr(),
  ],
  server: {
    port: 3000,
    strictPort: true,
    open: false,
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
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});

// import path from "path";
// import { defineConfig, transformWithEsbuild } from "vite";
// import svgr from "vite-plugin-svgr";
// import react from "@vitejs/plugin-react-swc";
// export default defineConfig({
//   base: "./",
//   plugins: [
//     {
//       name: "treat-js-files-as-jsx",
//       transform(code, id) {
//         if (!id.match(/src\/.*\.js$/)) return null;
//         return transformWithEsbuild(code, id, {
//           loader: "jsx",
//           jsx: "automatic",
//         });
//       },
//     },
//     react(),
//     svgr(),
//   ],
//   test: {
//     globals: true,
//     environment: "jsdom",
//     css: true,
//     reporters: ["verbose"],
//     coverage: {
//       reporter: ["text", "json", "html"],
//       include: ["src/**/*"],
//       exclude: [],
//     },
//   },
//   server: { open: true, port: 3000 },
//   resolve: { alias: { screens: path.resolve(__dirname, "./src/screens") } },
//   build: { outDir: "build" },
//   optimizeDeps: { force: true, esbuildOptions: { loader: { ".js": "jsx" } } },
// });
