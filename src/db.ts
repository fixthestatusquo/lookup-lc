import { Level } from "level";
import dotenv from 'dotenv';

dotenv.config();

interface Record {
  email: any;
}

interface  Err {
    code: string;
    notFound: boolean;
    status: number;
}

const db = new Level(process.env.DB_PATH || './emails.db', { valueEncoding: 'json' });

export { Record, Err, db };
