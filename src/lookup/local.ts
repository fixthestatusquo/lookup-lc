import db from "../db.ts";
import { hashEmail } from "../hash.ts";

const query = db.prepare("SELECT 1 FROM hashes WHERE hash = ?");

export const localLookup = (email: string): boolean =>
  query.get(hashEmail(email)) !== undefined;
