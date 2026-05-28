# Security

## Rules

- Keep private keys server-side.
- Protect dashboard routes with Supabase Auth.
- Protect admin routes with a secure admin role or `SUPER_ADMIN_EMAIL`.
- Enforce business ownership by `business_id`.
- Validate inputs with Zod.
- Use private Supabase Storage for photos and PDFs.
- Use signed URLs for temporary access.
- Verify Stripe webhook signatures before changing credits.
- Verify the active payment provider webhook before changing credits.
- Log AI usage without storing unsafe prompts or secrets.
- Keep AI provider calls server-side only. Frontend code must never receive
  `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `DEEPSEEK_API_KEY` or equivalent keys.

## Current Status

Phase 2 adds Supabase session protection for `/dashboard` and `/admin`, plus a
server-side super admin check based on `SUPER_ADMIN_EMAIL`. Business dashboard
pages require an active `business_users` record.

Phase 5 adds server-side AI provider adapters with Zod validation for generated
report JSON. Demo fallback is for local development only.

Payment adapters are server-side only. Wompi is the recommended first provider
for Colombia, with Mercado Pago and Stripe prepared for LatAm/USA expansion.

Report photos and generated style references are stored in private Supabase
Storage buckets. Public report pages receive only signed URLs generated
server-side, so client photos are not placed in public buckets.
