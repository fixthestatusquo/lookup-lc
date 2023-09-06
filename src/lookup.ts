import { Level } from "level";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Err } from './update';



dotenv.config();

// email = 'robin.halfkann@lobbycontrol.de';

const lookup = async (email: string) => {
  const hash = crypto.createHash('sha512').update(process.env.TRUST_SALT + ":" + email).digest('hex');
  const db = new Level(process.env.DB_PATH || './emails.db', { valueEncoding: 'json' });
  try {
    await db.get(hash);
    console.log("found")
    return true;
  } catch (_error) {
    const error = _error as Err;
    if (error.notFound) {
    console.log("Not found")
      return false;
    } else {
      console.error("Aww, something went wrong", error)
      process.exit();
    }
  }
}

export default lookup;

