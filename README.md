# Plenty Barber

Premium B2B SaaS web app for AI-powered visagism reports for barbershops, salons,
spas and image consultants.

## Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Supabase
- Stripe
- Zod
- Lucide React

## Local Setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill only the keys required for the
phase being developed. Never commit real secrets.

## Current Phase

Phase 3 database integration is scaffolded:

- Next.js app structure
- Plenty Barber dark luxury styling
- Landing page shell
- Login page shell
- Dashboard shell
- Supabase client helper placeholders
- Environment variable validation
- Initial database schema and policies
- Supabase email/password login
- Logout server action
- Middleware protection for dashboard and admin routes
- Business user and super admin detection helpers
- Business-scoped query helpers
- Real dashboard metrics from Supabase
- Client create, search, update and delete actions
- Report history from `generations`
- Credit transaction ledger from `credit_transactions`
- Local demo login when Supabase is not configured
- New report flow with client selection, photo validation, credit check and placeholder report output
- Server-side AI provider layer for OpenAI, Anthropic and future DeepSeek support
- `/api/ai/analyze-face` with Zod-validated report JSON
- ES/EN/PT language switcher for the public experience
- PDF download endpoint and WhatsApp share helper
- Multi-provider payment architecture: Wompi, Mercado Pago, Stripe, PayU and demo

## Demo Login

If `.env.local` does not include Supabase credentials and the app runs in development,
the login form uses a local demo session. Enter any valid-looking email and password,
then go to `/dashboard`.

Demo mode is disabled in production and is only meant for local product review.

## AI Providers

Set `PREFERRED_AI_PROVIDER` to `openai`, `anthropic`, `deepseek` or leave it
blank to auto-select the first configured provider. Without provider keys, local
development uses demo analysis.

## Payments

Set `PAYMENT_PROVIDER` to `wompi`, `mercadopago`, `stripe`, `payu` or `demo`.
For Colombia-first launch, Wompi is the default recommendation. Stripe remains
available for USA/international expansion.

## Verification

When Node and npm are available:

```bash
npm run lint
npm run typecheck
npm run build
```
