# Deployment

## Recommended Stack

- Vercel for Next.js hosting.
- Supabase for Auth, Postgres, RLS and private Storage.
- Wompi for Colombia-first payments.
- Mercado Pago for LatAm expansion.
- Stripe for USA/international expansion.

## Required SQL Order

Run these files in Supabase SQL editor:

1. `database/schema.sql`
2. `database/policies.sql`
3. `database/seed.sql`
4. `database/functions.sql`

## Required Environment Variables

Start from `.env.example`. Production must include:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPER_ADMIN_EMAIL`
- AI provider key for the selected provider
- Payment provider credentials

Recommended production baseline:

```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
PAYMENT_PROVIDER="wompi"
PREFERRED_AI_PROVIDER="openai"
OPENAI_MODEL="gpt-4o-mini"
OPENAI_IMAGE_MODEL="gpt-image-1.5"
OPENAI_IMAGE_EDIT_MODEL="gpt-image-1.5"
OPENAI_IMAGE_QUALITY="high"
OPENAI_HAIRSTYLE_PREVIEW_MODE="personalized"
```

For production webhooks, do not leave signing secrets empty:

- Wompi: `WOMPI_EVENTS_SECRET` and `WOMPI_INTEGRITY_SECRET`
- Stripe: `STRIPE_WEBHOOK_SECRET`
- Mercado Pago / PayU: configure their webhook secrets before activating them as primary providers.

OpenAI Platform must have:

- Active billing credits or payment method.
- Project spend limit above zero.
- The API key assigned to the same project being billed.
- Access to the selected text/vision and image models.

## Local Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Vercel Checklist

1. Import the repository into Vercel.
2. Add all production environment variables in the Vercel project settings.
3. Set `NEXT_PUBLIC_APP_URL` to the final production URL.
4. Configure Supabase Auth redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com/login`
   - `https://your-domain.com/reset-password`
5. Configure Google OAuth authorized redirect URI in Supabase:
   - `https://<supabase-project-ref>.supabase.co/auth/v1/callback`
6. Configure payment provider webhook URLs:
   - Wompi: `https://your-domain.com/api/payments/webhook/wompi`
   - Stripe: `https://your-domain.com/api/payments/webhook/stripe`
   - Mercado Pago: `https://your-domain.com/api/payments/webhook/mercadopago`
   - PayU: `https://your-domain.com/api/payments/webhook/payu`
7. Run a production smoke test:
   - Sign up / login.
   - Create onboarding business.
   - Create client.
   - Generate one AI report.
   - Publish public link.
   - Download premium PDF.
   - Start a checkout in sandbox/test mode.

## Premium PDF

The premium PDF endpoint is Playwright-ready. Install browser binaries in the
deployment environment if using server-side PDF rendering:

```bash
npx playwright install chromium
```

If Playwright is unavailable, the endpoint redirects to the printable HTML report.

## Private Storage

Report assets use private Supabase Storage buckets:

- `client-photos`
- `report-illustrations`

The app creates these buckets automatically with the service role key when a
report is generated. Database rows store internal `storage://...` references,
and report pages resolve them into signed URLs at render time. Do not make these
buckets public.
