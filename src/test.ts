import minimist from "minimist";
import dotenv from "dotenv";

const argv = minimist(process.argv.slice(2));
const clientFlag = Object.keys(argv).find(k => k !== '_' && argv[k] === true);
const envFile = argv.env || (clientFlag ? `.env.${clientFlag}` : ".env");
dotenv.config({ path: envFile });

const email = argv._[0];
if (!email) {
  console.error("Usage: node src/test.ts <email> --<clientname>");
  console.error("       node src/test.ts <email> --env=.env.lc");
  process.exit(1);
}

const port = process.env.PORT;
if (!port) throw new Error(`PORT not set — check ${envFile}`);

const baseUrl = `http://localhost:${port}/lookup`;

const runCase = async (label: string, url: string, init?: RequestInit) => {
  try {
    const res = await fetch(url, init);
    const data = await res.json();
    console.log(`[${label}] status ${res.status}:`, data);
  } catch (err) {
    console.error(`[${label}] error:`, err);
  }
};

const testLookup = async (email: string) => {
  const encoded = encodeURIComponent(email);

  await runCase("GET, query param", `${baseUrl}?email=${encoded}`, {
    method: "GET",
  });

  await runCase("POST, no body, query param", `${baseUrl}?email=${encoded}`, {
    method: "POST",
  });

  await runCase("POST, JSON body, application/json", baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  await runCase("POST, JSON body, text/plain", baseUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ email }),
  });
};

testLookup(email);
