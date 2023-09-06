import minimist, { ParsedArgs } from 'minimist';
import lookup from "./lookup";
import {start} from "./http";
import { update, manualUpdate } from "./update";
import dotenv from 'dotenv';

const argv: ParsedArgs = minimist(process.argv.slice(2));

dotenv.config();

// if (!argv.email && !argv.update && !argv.manually_update) {
//   //run the server
//   start ();
// }

if (!argv.email && !argv.update && !argv.manually_update) {
    console.error("Wrong params");
  // help();
  process.exit();
}


if (process.argv.length > 3) {
  console.error("Can't run two processes at the same time!");
  process.exit();
}

if (argv.email) lookup(argv.email);

if (argv.update) {
  start();
  update();
}

if (argv.manually_update) manualUpdate();
