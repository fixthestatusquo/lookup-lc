import Database from "better-sqlite3";

const dbPath = process.env.DB_PATH ?? "./hashes.db";

const db = new Database(dbPath);

// WAL mode allows reads to continue concurrently during the sync write transaction
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS hashes (
    hash BLOB PRIMARY KEY
  )
`);

export default db;
