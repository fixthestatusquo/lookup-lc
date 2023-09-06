import { Level } from "level";
import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
import schedule from "node-schedule";

dotenv.config();

const jobInterval = process.env.JOB_INTERVAL || '0 0 * * *'

interface Record {
  email: null | string;
}

export interface  Err {
      code: string;
    notFound: boolean;
    status: number;
};

const makeHeaders = () => {
  const key = process.env['TRUST_KEY'];
  if (!key) throw Error("TRUST_KEY not set");
  const stamp = Math.floor(Math.floor(Date.now() / 1000) / 30).toString();
  const token = crypto.createHmac("sha256", key).update(stamp).digest().toString('hex');

  return {
    headers: {
      'Authorization': `Token token="proca-test:${token}"`,
      'Content-Type': 'application/json'
    }
  }
}

const fetchHashes = async () => {
  if (!process.env.EMAILS_URL) {
    console.error("Missing URL env variable");
    return;
  }
  const url = process.env.EMAILS_URL;
  try {
    const { data, status } = await axios.get(url, makeHeaders());
    console.log("Fetching data:", status);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const manualUpdate = () => {
  console.log("manually updating");
};

const update = () => {
const db = new Level('./emails.db', { valueEncoding: 'json' });
  schedule.scheduleJob(jobInterval, async () => {
    console.log(`Checking database at ${jobInterval}`);
    const data = await fetchHashes();
    for (const i in data) {
      try {
        await db.get(data[i]);
      } catch (e) {
        const error = e as Err;
        if (error.notFound) {
          console.log("Saving hash: ", data[i])
          await db.put<string, Record>(data[i], { email: null }, {})
          const s = await db.get(data[i]);
          console.log("yay", s);
        } else {
          console.error("Aww, something went wrong", error);
          process.exit();
        }
      }
    }
  });

}

export { update, manualUpdate}