import db from "../db";
import { hashEmail } from "../hash";

const query = db.prepare("SELECT 1 FROM hashes WHERE hash = ?");

export const localLookup = (email: string): boolean =>
  query.get(hashEmail(email)) !== undefined;
