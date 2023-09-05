import { Level } from "level";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Err } from './fetch';
import minimist, { ParsedArgs } from 'minimist';

const argv: ParsedArgs = minimist(process.argv.slice(2));
const db = new Level('./emails.db', { valueEncoding: 'json' });

dotenv.config();

// email = 'robin.halfkann@lobbycontrol.de';

const lookup = async (email: string) => {
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

const isPaused = () => {
  const date = new Date();
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  return (hours === 17 && minutes >= 56) || (hours === 0 && minutes <= 2)
}

if (!argv.email) {
    console.error("Add email address (--email=SOME_EMAIL)");
    process.exit();
  } else if (isPaused()) {
    console.log("Can't run lookup while updating database, pause 3 minutes");
    setTimeout(() => lookup(argv.email), 1 * 60 * 1000)
  } else {
    lookup(argv.email);
  }

