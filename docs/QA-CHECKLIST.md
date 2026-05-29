# QA Checklist

- Landing page renders in Spanish, English and Portuguese.
- Demo login works when Supabase is not configured.
- Supabase login works when credentials are configured.
- Dashboard is protected.
- Admin is restricted to `SUPER_ADMIN_EMAIL`.
- Client CRUD is business-scoped.
- New report validates client, image type, image size and credits.
- AI output validates against the report schema.
- PDF download returns a PDF file.
- WhatsApp link opens with encoded message.
- Payment checkout uses the configured provider.
- Webhooks do not add credits without verified provider events.
- `lint`, `typecheck` and `build` pass.

## V2 checks

- Landing shows the animated title and the FAQ accordion expands/collapses.
- Pricing shows the animated price counter and the "Popular" badge on Pro;
  currency switch (CO / BR-PT / US) updates prices.
- Signup blocks submission until Terms & Conditions is checked.
- Photo uploader: gallery + camera, drag-drop, max 3, cover badge, remove works;
  report generation still receives the photos.
- Report creation consumes exactly one credit and is atomic (no credit lost on a
  failed generation; no generation created when credits are 0).
- A duplicate payment webhook delivery does not double-credit (idempotent).
- In production, unverified/`demo` webhooks are rejected (401).
- Response headers include CSP, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` and HSTS.
- API/action errors return generic messages (no raw internal error text).
- `database/functions.sql` applied: `create_generation_with_credit` (12-arg),
  `apply_payment_credits`, and `credit_transactions_payment_ref_key` exist.
