# Changelog

## 2026-05-28

### V2 UI/UX
- Re-themed pricing to the brand (dark luxury) with an animated price counter and
  a "Popular" badge on the Pro plan.
- New photo uploader component (gallery + camera, drag-drop, up to 3, cover
  badge, preview/remove).
- Animated landing title and a FAQ accordion (added accordion keyframes).
- Required Terms & Conditions checkbox on signup, with a branded Label.

### V2 Security hardening (production readiness)
- Payment webhooks are now default-deny in production; added Mercado Pago (HMAC)
  and PayU (MD5) signature verification.
- Atomic, user-scoped credit consumption in report creation via
  `create_generation_with_credit`.
- Idempotent payment crediting via `apply_payment_credits` + partial unique index
  on `credit_transactions(stripe_payment_intent_id)`.
- Removed the dead `/api/ai/analyze-face` route.
- Sanitized error responses (no raw `error.message` to clients).
- Added in-memory rate limiting to AI, checkout, webhook and signup endpoints.
- Added security headers + CSP in `next.config.mjs`.
- See `docs/SECURITY.md` → "V2 Hardening" for details.

## 2026-05-27

- Added V2 public report publishing with secure tokens, public `/r/[token]`
  pages, premium report layout, printable HTML report and Playwright-ready
  premium PDF endpoint.
- Added multilingual ES/EN/PT foundation, PDF generation endpoint, WhatsApp share helper,
  multi-provider payment architecture and improved admin overview.
- Added Phase 5 AI provider layer for OpenAI, Anthropic, DeepSeek placeholder
  and demo fallback, plus `/api/ai/analyze-face` and AI usage logging through
  the report generation transaction.
- Added Phase 4 report generation flow with demo login, demo data fallback, client/photo
  form, credit validation, placeholder report JSON and transactional SQL function.
- Added Phase 3 database integration helpers, real dashboard metrics, client CRUD,
  report history and credit transaction views.
- Added Phase 2 Supabase Auth foundation with login, logout, protected route middleware,
  business user detection and super admin checks.
- Scaffolded Phase 1 project foundation.
- Added Next.js, TypeScript, Tailwind and ESLint configuration.
- Added Plenty Barber landing, login, dashboard, pricing and admin shells.
- Added Supabase environment and client helper placeholders.
- Added initial database schema, RLS policy draft and seed plan data.
