import { defineConfig } from "tsup"
import { preserveDirectives } from "esbuild-plugin-preserve-directives"

export default defineConfig({
  entry: ["src/index.ts", "src/server.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  esbuildPlugins: [preserveDirectives()],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    }
  },
})
