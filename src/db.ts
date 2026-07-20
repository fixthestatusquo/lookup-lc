import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const dbPath = process.env.DB_PATH ?? "./hashes.db";
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// WAL mode allows reads to continue concurrently during the sync write transaction
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS hashes (
    hash BLOB PRIMARY KEY
  )
`);

export default db;
