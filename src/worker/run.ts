import minimist from "minimist";
import dotenv from "dotenv";

const argv = minimist(process.argv.slice(2));
const clientFlag = Object.keys(argv).find((k) => k !== "_" && argv[k] === true);
const envFile = argv.env || (clientFlag ? `.env.${clientFlag}` : ".env");
dotenv.config({ path: envFile });

import("./sync").then((m) => m.sync()).catch(console.error);
