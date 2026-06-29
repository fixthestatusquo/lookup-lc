import esbuild from "esbuild";

const isProd = process.env.NODE_ENV === "production";

esbuild.build({
  entryPoints: ["src/server.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "es2020",
  outfile: "dist/server.js",
  sourcemap: !isProd,
  minify: isProd,
  external: ["better-sqlite3"],
  banner: {
    js: `import { createRequire } from "module"; const require = createRequire(import.meta.url);`,
  },
}).catch(() => process.exit(1));
