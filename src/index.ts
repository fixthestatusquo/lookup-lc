import minimist, { ParsedArgs } from 'minimist';
import {start} from "./http";
import { scheduleUpdate } from "./update";
import dotenv from 'dotenv';
import axios from 'axios';

const argv: ParsedArgs = minimist(process.argv.slice(2));

dotenv.config();
const port = process.env.PORT || 3000;

(async () => {

  if (!argv.email && !argv.update) {
    console.log("running the lookup server, you can use (on a separate console) email or update");
    await start();
    scheduleUpdate();
  }

  if (argv.email) {
    const email = argv.email;
    await axios.post(`http://127.0.0.1:${port}/lookup?email=${email}`, { email: email })
  }

  // to manually run update
  if (argv.update) {
    await axios.post(`http://127.0.0.1:${port}/update`, {});
  }
})();
