import { Level } from "level";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Err } from './fetch';

dotenv.config();

const db = new Level('./emails.db', { valueEncoding: 'json' });

const email = 'robin.halfkann@lobbycontrol.de';

const lookup = async (email: string) => {
  const hash = crypto.createHash('sha512').update(process.env.TRUST_SALT + ":" + email).digest('hex');
  try {
    await db.get(hash);
    console.log("oo")
    return true;
  } catch (_error) {
    const error = _error as Err;
    if (error.notFound) {
console.log("aaa")
      return false;
    } else {
      console.error("Aww, something went wrong", error)
      throw error;
    }
  }
}



lookup(email);
