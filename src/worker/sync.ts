import db from "../db";
import { hashEmail } from "../hash";

// TODO: implement fetching subscribed emails for this org
const fetchEmails = async (): Promise<string[]> => {
  throw new Error("fetchEmails not implemented");
};

export const sync = async () => {
  const emails = await fetchEmails();
  const hashes = emails.map(hashEmail);

  const replace = db.transaction((hashes: string[]) => {
    db.exec("DELETE FROM hashes");
    const insert = db.prepare("INSERT INTO hashes (hash) VALUES (?)");
    for (const hash of hashes) insert.run(hash);
  });

  replace(hashes);
  console.log(`Synced ${hashes.length} hashes`);
};
