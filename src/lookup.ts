import crypto from 'crypto';
import dotenv from 'dotenv';
import { Err, Record, DatabaseType } from "./index";

dotenv.config();

// email = 'robin.halfkann@lobbycontrol.de';

const lookup = async (email: string, db: DatabaseType<string, Record>) => {
  const hash = crypto.createHash('sha512').update(process.env.TRUST_SALT + ":" + email).digest('hex');
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

