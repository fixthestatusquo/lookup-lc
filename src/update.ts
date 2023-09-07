import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
import schedule from "node-schedule";
import { Err, db } from "./db";

//dotenv.config();

const jobInterval = process.env.JOB_INTERVAL || '5 0 * * *'

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


export const lookup = async (email: string) => {
  if (!process.env.EMAILS_URL) {
    console.error("Missing EMAIL_URL env variable");
    throw new Error ("Missing EMAIL_URL env variable");
  }
  const url = process.env.LOOKUP_URL + email;
  try {
    const { data, status } = await axios.get(url, makeHeaders());
    return {success: true, status:status, data:data};
    } catch (error: any) {
      return {success:false, status:error.response?.status, data: error.response};
  }
}

export const updateDB = async(data: any) => {
  db.clear();
  for (const i in data) {
    try {
      await db.put(data[i], { email: null }, {})
    } catch (e) {
      const error = e as Err;
      console.error("Something went wrong, database is not updated", error);
      throw error;
    }
  }
  return {total:data.length};
}

export const manualUpdate = async () => {
//  const data = await fetchHashes();
  console.log("manually updating");
  updateDB(data);
};

export const scheduleUpdate = () => {
  console.log("going to update the database at",jobInterval);
  schedule.scheduleJob(jobInterval, async () => {
    console.log(`Checking database at ${jobInterval}`);
    updateDB(data);
    });
}

