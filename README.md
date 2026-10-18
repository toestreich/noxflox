# NoxFlox

The Rental Passport for New York: renters build one verified rental application and share it with any broker through an expiring, revocable link.

- [Technical overview](docs/technical-overview.md): MVP scope, architecture, data model, security and milestones.

## Status: front end only

This is a clickable prototype of the MVP. Every screen is built, but there's **no backend yet**:

- All data is sample data in [`src/lib/mock-data.ts`](src/lib/mock-data.ts) (John, Maya, the listings). Its shapes mirror the schema in the technical overview, so wiring up the backend means swapping these for real queries.
- Forms and buttons work in the browser (share options, revoke, drawing redaction boxes, activity filters), but nothing is saved. Reloading resets everything.
- No sign-in, no uploads, no AI. Sign-up drops you into the matching demo view.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Checks: `npm run lint`, `npm run typecheck`, `npm run build`. No environment variables are needed. Deploys to Vercel as-is.

## Screens

| Route | Screen |
|---|---|
| `/` | Landing |
| `/signup` | Sign up (renter or broker) |
| `/passport` | Renter: passport home |
| `/passport/documents/pay-stubs` | Renter: upload and review a document |
| `/passport/documents/pay-stubs/redact` | Renter: hide sensitive details |
| `/passport/household` | Renter: co-applicants and guarantor |
| `/applications` | Renter: application request from a broker |
| `/applications/share` | Renter: choose what to share |
| `/access` | Renter: access log and revoke |
| `/broker/listings` | Broker: listings dashboard |
| `/broker/listings/new` | Broker: add a listing and get its application link |
| `/broker/applicants` | Broker: applicants (filter with `?listing=`) |
| `/broker/applicants/john-sam` | Broker: applicant review |
| `/broker/activity` | Broker: activity |

Use the **Renter / Broker** switch in the header to move between the two sides.

## Next: the backend

See milestones M0–M1 in the [technical overview](docs/technical-overview.md#9-milestones): Supabase (auth, Postgres with row-level security, private storage), then the sharing loop.
