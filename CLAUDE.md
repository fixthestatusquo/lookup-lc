# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Run server in development mode (tsx, with pino-pretty logging)
npm run build        # Bundle with esbuild into dist/server.js (production)
npm start            # Run the compiled dist/server.js
npm run start:prod   # Run dist/server.js with NODE_ENV=production
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
```

Both `npm run dev` and `npm start` accept a client flag to select an env file:
```bash
npm run dev -- --duh          # loads .env.duh
npm run dev -- --env=.env.lc  # loads explicit path
```

Manual endpoint test (server must be running):
```bash
curl -X POST "http://localhost:3000/lookup?email=user@example.com"
# Or via test script (reads PORT from the same env file):
npx tsx src/test.ts user@example.com --duh
npx tsx src/test.ts user@example.com --env=.env.lc
```

## Environment Variables

All `.env.*` files are gitignored. Required in every `.env`:
- `TYPE` — CRM backend: `brevo` or `activecampaign`
- `PORT` — port to listen on (required; no default)

**Brevo** (`TYPE=brevo`):
- `BREVO_KEY` — Brevo API key
- `BREVO_LIST_ID` — numeric list ID to check membership against

**ActiveCampaign** (`TYPE=activecampaign`):
- `API_KEY` — ActiveCampaign API token
- `API_URL` — ActiveCampaign account URL (e.g. `https://account.api-us1.com`)
- `API_LIST_ID` — (optional) numeric list ID; if omitted, only contact existence is checked

**Optional:**
- `SENTRY_DSN` — Sentry error reporting (only active in production)
- `NODE_ENV` — `development` enables pino-pretty logging; `production` enables Sentry

## Architecture

Single Fastify service with one endpoint (`POST /lookup` and `GET /lookup`), supporting multiple CRM backends.

**Request flow:**
1. `src/server.ts` — bootstraps Fastify, loads env file (via `--<client>` or `--env=` flag), registers routes
2. `src/http.ts` — extracts `email` from query or body, calls `lookup()`, formats response
3. `src/lookup/index.ts` — dispatches to the correct backend based on `TYPE`; also owns `formatResult()`
4. `src/lookup/brevo.ts` — Brevo backend: contact must be in `LIST_ID`, not blacklisted, and have `DOUBLE_OPT-IN === "1"`
5. `src/lookup/activecampaign.ts` — ActiveCampaign backend: contact must exist and (if `API_LIST_ID` set) have active list membership (`status === "1"`)
6. `src/sentry.ts` — wraps Sentry init and `captureException`; only initializes in production with a DSN set

**Response format:**
- Subscribed: `{ customer: { emailStatus: "already_subscribed" }, action: { customFields: { isSubscribed: true }, privacy: { optIn: true } } }`
- Not subscribed or not found: `{}`
- CRM 404 responses are treated as "not found" (returns `false`), not errors

**Build:** esbuild bundles everything into `dist/server.js`; `tsc` is only used for type checking (no separate compilation step).
