#!/usr/bin/env node
// Run worker manually
// Usage: ./src/worker/run.ts --<orgname>
// Example: ./src/worker/run.ts --duh
import minimist from "minimist";
import dotenv from "dotenv";

const argv = minimist(process.argv.slice(2));
const clientFlag = Object.keys(argv).find((k) => k !== "_" && argv[k] === true);
const envFile = argv.env || (clientFlag ? `.env.${clientFlag}` : ".env");
dotenv.config({ path: envFile });

import("./sync.ts").then((m) => m.sync()).catch(console.error);
