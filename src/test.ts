import minimist from "minimist";
import dotenv from "dotenv";

const argv = minimist(process.argv.slice(2));
const clientFlag = Object.keys(argv).find(k => k !== '_' && argv[k] === true);
const envFile = argv.env || (clientFlag ? `.env.${clientFlag}` : ".env");
dotenv.config({ path: envFile });

const email = argv._[0];
if (!email) {
  console.error("Usage: tsx src/test.ts <email> --<clientname>");
  console.error("       tsx src/test.ts <email> --env=.env.lc");
  process.exit(1);
}

const port = process.env.PORT;
if (!port) throw new Error(`PORT not set — check ${envFile}`);

const testLookup = async (email: string) => {
  try {
    const res = await fetch(
      `http://localhost:${port}/lookup?email=${encodeURIComponent(email)}`,
      { method: "POST" },
    );
    const data = await res.json();
    console.log("Response for", email, ":", data);
  } catch (err) {
    console.error("Error calling lookup:", err);
  }
};

testLookup(email);
