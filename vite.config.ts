/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { runAction, uxp, uxpSetup } from "vite-uxp-plugin";
import react from "@vitejs/plugin-react"; 

import { config } from "./uxp.config";

const action = process.env.BOLT_ACTION;
const mode = process.env.MODE;

if (action) runAction(config, action);

const shouldNotEmptyDir =
  mode === "dev" && config.manifest.requiredPermissions?.enableAddon;

export default defineConfig({
  plugins: [
    uxp(config, mode),
    react(), 
  ],
  build: {
    sourcemap: mode && ["dev", "build"].includes(mode) ? true : false,
    minify: false,
    emptyOutDir: !shouldNotEmptyDir,
    rollupOptions: {
      external: [
        "premierepro", 
        "bolt-uxp-hybrid.uxpaddon", 
        "fs",
        "os",
        "path",
        "process",
        "shell",
      ],
      output: {
        format: "iife",
        globals: {
          "uxp": "uxp",
          "premierepro": "premierepro",
        },
      },
    },
  },
  publicDir: "public",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
