import { defineConfig } from "tsup";
// import { preserveDirectivesPlugin } from "esbuild-plugin-preserve-directives";

export default defineConfig({
  entry: ["src/index.ts", "src/server.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  // esbuildPlugins: [preserveDirectivesPlugin()],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
