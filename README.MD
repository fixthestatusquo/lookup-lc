# Lookup-lc

1. npm build
2. start the http server 

    ./bin/start.js

open a separate console and  you can either do a lookup (of multiple emails)


    ./bin/lookup.js example.org second@test.org

or update 
    ./bin/update.js

by default, the database is automatically updated at 5am


a successful lookup of an email that exits return:

    {
      customer: { emailStatus: 'already_subscribed' },
      action: { customFields: { isSubscribed: true } }
    }

and an empty json otherwise

## Configuration

### Mandatory

- `TRUST_KEY` - Trust CRM API key
- `TRUST_SALT`
- `EMAILS_URL` - Trust newsletter list

### Optional

- `JOB_INTERVAL` - When to update database, default '5 0 \* \* \*' (05.00)
- `DB_PATH` - default './emails.db'
