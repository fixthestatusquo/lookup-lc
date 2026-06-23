import Database from "better-sqlite3";

const dbPath = process.env.DB_PATH ?? "./emails.db";

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS hashes (
    hash TEXT PRIMARY KEY
  )
`);

export default db;
