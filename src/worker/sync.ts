import * as ftp from "basic-ftp";
import { readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import db from "../db.ts";

const fetchViaFtp = async (): Promise<string[]> => {
  const client = new ftp.Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
    });

    const files = await client.list();
    // we check all CSV files on that path
    // should we download specific file instead ?
    const csvFile = files.find((f) => f.name.endsWith(".csv"));
    if (!csvFile) throw new Error("No CSV file found on FTP server");

    const tmpFile = join(tmpdir(), "hashes.csv");
    await client.downloadTo(tmpFile, csvFile.name);
    const content = readFileSync(tmpFile, "utf-8");
    unlinkSync(tmpFile);

    return content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } finally {
    client.close();
  }
};

const fetchHashes = async (): Promise<string[]> => {
  const method = process.env.FETCH_METHOD;
  switch (method) {
    case "ftp":
      return fetchViaFtp();
    default:
      throw new Error(`Unknown FETCH_METHOD "${method}". Supported: ftp`);
  }
};

export const sync = async () => {
  const hexHashes = await fetchHashes();
  const blobs = hexHashes.map((h) => Buffer.from(h, "hex"));

  const replace = db.transaction((blobs: Buffer[]) => {
    db.exec("DELETE FROM hashes");
    const insert = db.prepare("INSERT INTO hashes (hash) VALUES (?)");
    for (const blob of blobs) insert.run(blob);
  });

  replace(blobs);
  console.log(`Synced ${blobs.length} hashes at ${new Date().toISOString()}`);
};
