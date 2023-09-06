import minimist, { ParsedArgs } from 'minimist';
import {start} from "./http";
import { manualUpdate } from "./update";
import dotenv from 'dotenv';
import axios from 'axios';

const argv: ParsedArgs = minimist(process.argv.slice(2));

dotenv.config();

(async () => {

  if (!argv.email && !argv.update && !argv.manually_update) {
    console.error("Wrong params");
    // help();
    process.exit();
  }

  if (process.argv.length > 3) {
    console.error("Can't run two processes at the same time!");
    process.exit();
  }

  await start();

  if (argv.email) {
    await axios.get(`http://127.0.0.1:3000/trust-lookup?email=${argv.email}`)
  }

  if (argv.update) {
    console.log("LL")
    await axios.get(`http://127.0.0.1:3000/update`)
  }

  if (argv.manually_update) manualUpdate();
})();
