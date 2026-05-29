# API

Planned route handlers:

- `POST /api/reports/create`
- `GET /api/reports/[id]`
- `GET /api/reports`
- `POST /api/ai/generate-illustrations`
- `POST /api/pdf/generate`
- `GET /api/pdf/generate?reportId=...`
- `GET /api/pdf/premium?reportId=...`
- `GET /api/credits/balance`
- `POST /api/credits/adjust`
- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/webhook`
- `POST /api/payments/create-checkout`
- `POST /api/payments/webhook/[provider]`
- `POST /api/whatsapp/share-link`
- `POST /api/storage/sign-upload`
- `POST /api/storage/signed-url`
- `POST /api/auth/demo-login` development-only fallback when Supabase is not configured

All mutating endpoints must validate input with Zod and enforce business access
server-side.

Face analysis runs inside the report-creation server action (not a standalone
route): the action calls the server-side AI adapter and persists results through
the `create_generation_with_credit` transactional function. Private provider
keys must remain in `.env.local` or deployment environment variables.

`/api/ai/generate-illustrations` is server-side only, rate-limited, validates
its input with Zod and enforces business ownership of the target report.

Payments use a provider abstraction. `PAYMENT_PROVIDER` can be `wompi`,
`mercadopago`, `stripe`, `payu` or `demo`.

Public reports use `/r/[public_token]`. Internal reports can be published or
unpublished from `/report/[id]`.
