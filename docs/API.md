# API

Planned route handlers:

- `POST /api/reports/create`
- `GET /api/reports/[id]`
- `GET /api/reports`
- `POST /api/ai/analyze-face`
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

`/api/ai/analyze-face` is server-side only and accepts a data URL image plus an
optional provider. It returns validated report JSON and usage metadata. Private
provider keys must remain in `.env.local` or deployment environment variables.

Payments use a provider abstraction. `PAYMENT_PROVIDER` can be `wompi`,
`mercadopago`, `stripe`, `payu` or `demo`.

Public reports use `/r/[public_token]`. Internal reports can be published or
unpublished from `/report/[id]`.
