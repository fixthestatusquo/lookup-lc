# Lookup-lc

1) start the http server 
./bin/start.js
 
2) you can either do a lookup
./bin/lookup.js example.org second@test.org

or
3)
./bin/update.js


To update database `ts-node src/fetch.ts` (debug: `JOB_INTERVAL='* * * * *'` to run every minute)

To run lookup `ts-node  src/lookup.ts --email=SOME_EMAIL`

Lookup returns:

- true if email in database
- false when not found
- error if anything goes wrong

## Configuration

### Mandatory

- `TRUST_KEY` - Trust CRM API key
- `TRUST_SALT`
- `EMAILS_URL` - Trust newsletter list

### Optional

- `JOB_INTERVAL` - When to update database, default '0 0 \* \* \*' (00.00)
- `DB_PATH` - default './emails.db'
