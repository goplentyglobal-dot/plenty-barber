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

## V2 Hardening (2026-05-28)

Production-readiness pass. All items verified with `typecheck` + `lint` +
`build`.

### Payment webhooks
- `verifyPaymentWebhook` is **default-deny in production**: any provider that is
  not cryptographically verified (and the `demo` provider) is rejected when
  `NODE_ENV === "production"`.
- Wompi (SHA-256 checksum) and Stripe (HMAC + 5-minute timestamp tolerance)
  verifiers were already present.
- Added **Mercado Pago** verification: HMAC-SHA256 over the
  `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` manifest from the
  `x-signature` header. The resource id is read from the `data.id` query param
  (request URL is now passed into the verifier), falling back to the body.
- Added **PayU** verification: MD5 of
  `ApiKey~merchantId~reference~value~currency~statePol` with PayU's decimal
  normalization, plus a `merchant_id` cross-check.
- New secrets in `lib/validations/server-env.ts`: `WOMPI_EVENTS_SECRET`,
  `MERCADOPAGO_WEBHOOK_SECRET`, `PAYU_API_KEY`, `PAYU_MERCHANT_ID`.

### Credits — atomicity & idempotency
- Report creation now consumes credits through the
  `create_generation_with_credit` security-definer function via the
  **user-scoped** Supabase client (so `auth.uid()` membership checks apply). The
  credit decrement, generation insert, transaction log and AI log happen in a
  single transaction — no more check-then-decrement race or partial writes.
- Payment crediting runs through `apply_payment_credits`, backed by a **partial
  unique index** on `credit_transactions(stripe_payment_intent_id)`. Duplicate
  webhook deliveries are no-ops (`insert ... on conflict do nothing`), and the
  balance is only incremented when a new row is actually inserted.

### Surface reduction & error handling
- Removed the dead `/api/ai/analyze-face` route (ran AI without consuming
  credits and leaked error details).
- API routes and server actions no longer return raw `error.message`. Errors are
  logged server-side; clients receive generic messages.

### Abuse mitigation
- In-memory best-effort rate limiting (`lib/security/rate-limit.ts`) on the AI
  illustration route, checkout route, payment webhooks and the signup action.
  For multi-instance production, back it with Redis/Upstash (call sites
  unchanged).

### Transport & browser hardening
- `next.config.mjs` sets `Content-Security-Policy`, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
  (camera self only) and `Strict-Transport-Security` on all routes.

### Deployment requirement
- `database/functions.sql` is **not auto-applied**. Run it in the Supabase SQL
  editor before deploying V2 (creates/updates `create_generation_with_credit`,
  `apply_payment_credits` and the `credit_transactions_payment_ref_key` index).
  If a prior 10-argument `create_generation_with_credit` overload exists, drop it
  so only the 12-argument version remains.
