import minimist, { ParsedArgs } from 'minimist';
import lookup from "./lookup";
import { update, manualUpdate } from "./update";
import dotenv from 'dotenv';

const argv: ParsedArgs = minimist(process.argv.slice(2));

dotenv.config();

if (!argv.email && !argv.update && !argv.manually_update) {
  console.error("Add some param");
  process.exit();
}

if (argv.email) lookup(argv.email);


if (argv.update) {
  update();
}

if (argv.manually_update) manualUpdate();
