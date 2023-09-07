import minimist, { ParsedArgs } from 'minimist';
import {start} from "./http";
import { update } from "./update";
import dotenv from 'dotenv';
import axios from 'axios';

const argv: ParsedArgs = minimist(process.argv.slice(2));

dotenv.config();
const port = process.env.PORT || 3000;
(async () => {

  if (!argv.email && !argv.update && !argv.manually_update) {
    console.log("running the lookup server, you can use (on a separate console) email or update");
    await start();
    // help();
  }

  if (argv.email) {
    await axios.get(`http://127.0.0.1:${port}/trust-lookup?email=${argv.email}`)
  }

  if (argv.manually_update) {
    await axios.get(`http://127.0.0.1:${port}/update`)
  }

// what does that one do?
  if (argv.update) update();
})();
