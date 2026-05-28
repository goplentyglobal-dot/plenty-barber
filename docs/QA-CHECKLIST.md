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
