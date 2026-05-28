# Database

The initial SQL lives in:

- `database/schema.sql`
- `database/policies.sql`
- `database/seed.sql`

Core tables:

- `businesses`
- `business_users`
- `plans`
- `end_clients`
- `generations`
- `credit_transactions`
- `ai_logs`
- `system_config`

RLS must remain enabled for business-scoped tables. Service role access is
server-only and must never be exposed to client components.

Phase 3 query helpers live in `lib/database/` and expose business-scoped reads
for dashboard metrics, clients, reports and credit transactions.

Phase 4 adds `database/functions.sql`. Run it after `schema.sql`, `policies.sql`
and `seed.sql` so report generation can deduct one credit and create a generation
inside a single database transaction.

If policies were installed before the RLS helper function was added, run
`database/rls-fix.sql` once to replace recursive policies.

Run `database/public-report.sql` to add public report publishing fields:
`public_token`, `is_public`, `published_at`, `views_count` and
`public_expires_at`.
