# Lookup

A small Node.js/Fastify service to check if an email is already subscribed to a newsletter. Supports Brevo, ActiveCampaign, and local hash DB backends.

## Installation

Requires Node.js 24+ (use `nvm use` to activate the pinned version).

```bash
git clone <repo-url>
cd lookup
nvm use
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables) below).

## Development

```bash
npm run dev           # start with .env
npm run dev -- --org_name  # start with .env.org_name
npm run dev -- --env=.env.org_name  # start with explicit path
```

## Environment Variables

Required in every `.env`:

- `TYPE` — backend: `brevo`, `activecampaign`, or `local`
- `PORT` — port to listen on

**Brevo** (`TYPE=brevo`):

- `BREVO_KEY` — Brevo API key
- `BREVO_LIST_ID` — numeric list ID to check membership against

**ActiveCampaign** (`TYPE=activecampaign`):

- `API_KEY` — ActiveCampaign API token
- `API_URL` — account URL (e.g. `https://account.api-us1.com`)
- `API_LIST_ID` — (optional) list ID; if omitted, only contact existence is checked

**Local hash DB** (`TYPE=local`):

- `FETCH_METHOD` — how to fetch hashes: `ftp`
- `FTP_HOST` — FTP server hostname
- `FTP_USER` — FTP username
- `FTP_PASS` — FTP password
- `DB_PATH` — (optional) path to SQLite file; defaults to `./hashes.db`
- `WORKER_CRON` — (optional) sync schedule; defaults to `0 10 * * *` (daily at 10am)

**Optional:**

- `SENTRY_DSN` — Sentry error reporting (production only)
- `NODE_ENV` — `development` enables pretty logging; `production` enables Sentry

## Endpoints

`POST /lookup?email=<email>` or `GET /lookup?email=<email>`

**Subscribed:**

```json
{
  "customer": { "emailStatus": "already_subscribed" },
  "action": {
    "customFields": { "isSubscribed": true },
    "privacy": { "optIn": true }
  }
}
```

**Not subscribed / not found:**

```json
{}
```

## Testing

Start the server with one of the pre-configured env files:

```bash
npm run dev -- --orgname
```

Then in another terminal, use curl or the included test script (reads `PORT` from the env file automatically):

```bash
curl -X POST "http://localhost:<port>/lookup?email=user@example.com"

node src/test.ts user@example.com --orgname
```

## Local backend: manual sync

To trigger a one-off hash sync without starting the server:

```bash
./src/worker/run.ts --orgname
```

## Production Build

```bash
npm run build        # bundles to dist/server.js
npm run start:prod   # runs with NODE_ENV=production
```
