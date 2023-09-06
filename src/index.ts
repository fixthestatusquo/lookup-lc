import minimist, { ParsedArgs } from 'minimist';
import lookup from "./lookup";
import { update, manualUpdate } from "./update";
import dotenv from 'dotenv';
import { Level } from "level";

const db = new Level<string, any>(process.env.DB_PATH || './emails.db', { valueEncoding: 'json' });

const argv: ParsedArgs = minimist(process.argv.slice(2));

dotenv.config();

if (!argv.email && !argv.update && !argv.manually_update) {
  console.error("Add some param");
  process.exit();
}

if (argv.email) lookup(argv.email, db);

if (argv.update) {
  update(db);
}

if (argv.manually_update) manualUpdate(db);
