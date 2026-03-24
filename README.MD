# Lookup

A small Node.js Fastify service to check if an email is already subscribed to your newsletter.

## Features

- Lookup if an email is already subscribed (`/lookup`)
- Returns structured result, built with TypeScript

## Installation

Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd lookup
npm install
```

Create a `.env` file, BREVO_KEY is needed.

## Development

Start the server in development mode:

```bash
npm run dev
```

### Test Lookup

You can test the lookup endpoint:

```bash
curl -X POST "http://localhost:5001/lookup?email=brucewayne@example.com"
```

or

```bash
node src/test.ts brucewayne@example.com
```

Example response if subscribed:

```json
{
  "customer": { "emailStatus": "already_subscribed" },
  "action": {
    "customFields": { "isSubscribed": true },
    "privacy": { "optIn": true }
  }
}
```

If not subscribed:

```json
{}
```

## Build for Production

```bash
npm run build
```

This will compile TypeScript into `dist/`.

Run production server:

```bash
node dist/server.js
```

## Deployment

TBD

## Endpoints

- `POST /lookup?email=<email>` – Returns subscription status for the given email.

## Notes

- It is implemented only for LC

## Extending for other organizations

Looks like that elixir when using lookup can pass data other than just email - supporter_id, org_id, action_page_id, and custom_fields (needs to be confirmed). This allows implementing org-specific logic in the future without changing the core. For example, we could branch behavior based on org_id or apply custom rules per organization while still using the same endpoint for the basic email subscription check.
