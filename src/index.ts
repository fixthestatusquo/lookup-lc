import minimist, { ParsedArgs } from 'minimist';
import lookup from "./lookup";
import { update, manualUpdate } from "./update";
import dotenv from 'dotenv';
import { Level } from "level";

export interface DatabaseType<KeyType, ValueType> {
  clear(): Promise<void>;
  put(key: KeyType, value: ValueType, options?: any): Promise<void>;
  get(key: KeyType, options?: any): Promise<ValueType>;
}

export interface Record {
  email: null | string;
}

export interface  Err {
      code: string;
    notFound: boolean;
    status: number;
};

const db = new Level<string, Record>(process.env.DB_PATH || './emails.db', { valueEncoding: 'json' });

const argv: ParsedArgs = minimist(process.argv.slice(2));

dotenv.config();

if (!argv.email && !argv.update && !argv.manually_update) {
  console.error("Add some param");
  process.exit();
}

if (process.argv.length > 3) {
  console.error("Can't run two processes at the same time!");
  process.exit();
}

if (argv.email) lookup(argv.email, db);

if (argv.update) {
  update(db);
}

if (argv.manually_update) manualUpdate(db);
