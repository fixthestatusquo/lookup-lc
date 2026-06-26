
const esbuild = require("esbuild");

const isProd = process.env.NODE_ENV === "production";

esbuild.build({
  entryPoints: ["src/server.ts"],
  bundle: true,
  platform: "node",
  target: "es2019",
  outfile: "dist/server.js",
  sourcemap: !isProd,
  minify: isProd,
  external: ["better-sqlite3"],
}).catch(() => process.exit(1));
