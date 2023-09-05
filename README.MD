# Lookup-lc

### Configuration environment:

- `TRUST_KEY` - Trust CRM API key

## Lookup

-
- The request payload should be `{email: "some@email.com"}`
- It returns:
  - true if members is found and subscribed
  - false when not found
  - error if anything goes wrong

### Configuration

- `TRUST_KEY` - Trust CRM API key
