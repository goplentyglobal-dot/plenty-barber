# PLENTY BARBER — MASTER CODEX BUILD GUIDE

**Documento operativo para construir Plenty Barber con Codex**  
**Producto:** Plenty Barber  
**Empresa:** GoPlenty Global  
**Tipo:** B2B SaaS / AI BeautyTech / Web App Premium  
**Stack recomendado:** Next.js 14+ / React / TypeScript / Tailwind / Supabase / Stripe / OpenAI-Anthropic / PDF / WhatsApp  
**Objetivo:** Usar Codex como agente de desarrollo para construir una web app vendible, escalable y profesional.

---

## 0. PROPÓSITO DE ESTE DOCUMENTO

Este archivo está diseñado para ser entregado a Codex como guía principal de construcción.

La intención es que Codex pueda leer este documento y entender:

- Qué producto debe construir.
- Qué arquitectura debe usar.
- Qué pantallas debe crear.
- Qué base de datos debe implementar.
- Qué APIs debe construir.
- Cómo debe manejar seguridad.
- Cómo debe conectar Supabase, Stripe, IA, PDF y WhatsApp.
- Cómo debe dividir el trabajo por fases.
- Qué criterios debe cumplir antes de considerar una tarea terminada.

Este documento debe vivir en la raíz del repositorio como:

```txt
CODEX_BUILD_GUIDE.md
```

También puede complementarse con:

```txt
AGENTS.md
README.md
docs/PRD.md
docs/API.md
docs/DATABASE.md
docs/SECURITY.md
.env.example
```

---

## 1. VISIÓN DEL PRODUCTO

Plenty Barber es una plataforma web SaaS para barberías, peluquerías, salones de belleza, spas, estéticas y asesores de imagen.

Permite que un negocio suba una foto de un cliente y genere un informe profesional de visajismo con inteligencia artificial.

El informe debe incluir:

- Análisis de forma del rostro.
- Rasgos faciales destacados.
- Tono y subtón de piel.
- Colorimetría personal.
- Colores recomendados para ropa.
- Colores de cabello recomendados.
- Cortes o estilos de cabello sugeridos.
- Estilos a evitar.
- Resumen ejecutivo.
- Tres propuestas visuales de look.
- PDF descargable con el logo del negocio.
- Link para compartir por WhatsApp.

El producto debe sentirse como una herramienta premium, seria y vendible, no como una prueba técnica.

---

## 2. PRINCIPIO CENTRAL

Plenty Barber no se vende como “una app con IA”.

Se vende como:

> Un sistema premium de consulta de imagen que ayuda a barberías y salones a elevar la experiencia del cliente, vender más servicios y diferenciarse con tecnología.

Cada decisión técnica, visual y de UX debe reforzar:

- Confianza.
- Exclusividad.
- Claridad.
- Facilidad de uso.
- Valor comercial.
- Privacidad.
- Escalabilidad.

---

## 3. INSTRUCCIONES GENERALES PARA CODEX

Cuando Codex trabaje sobre este repositorio, debe seguir estas reglas:

1. Leer primero este archivo completo.
2. Leer después `README.md`, `docs/PRD.md`, `docs/DATABASE.md`, `docs/API.md`, `docs/SECURITY.md` y `.env.example` si existen.
3. No crear soluciones improvisadas fuera del stack definido.
4. No exponer claves privadas en frontend.
5. No usar datos mock como solución final si existe base de datos real.
6. No romper la estructura del proyecto.
7. No eliminar archivos existentes sin justificación.
8. Mantener TypeScript estricto.
9. Crear componentes reutilizables.
10. Priorizar mobile-first.
11. Mantener una estética premium dark luxury.
12. Validar entradas con Zod.
13. Proteger endpoints server-side.
14. Usar Supabase RLS cuando aplique.
15. Verificar con `npm run lint`, `npm run typecheck` y `npm run build` cuando estén disponibles.
16. Documentar cambios importantes en `CHANGELOG.md`.

---

## 4. MODO DE TRABAJO RECOMENDADO CON CODEX

### 4.1 Primera instrucción para Codex

Usar este prompt inicial:

```txt
Read CODEX_BUILD_GUIDE.md, README.md and the docs folder. 
Understand the product vision, architecture, stack, database and security requirements. 
Do not code yet. First, produce a concise implementation plan divided by phases and list the files you need to create or modify.
```

### 4.2 Segunda instrucción para Codex

Después de que Codex proponga el plan:

```txt
Start with Phase 1: project foundation. 
Create or update the Next.js app structure, install required dependencies, configure TypeScript, Tailwind, shadcn/ui structure, Supabase client helpers, environment variable validation and base layout. 
Do not implement AI, Stripe or PDF yet. 
Make sure the app builds successfully.
```

### 4.3 Tercera instrucción para Codex

```txt
Implement authentication and role-based routing with Supabase. 
Create login, logout, protected dashboard, admin route protection and business user detection. 
Follow the database schema and security rules from docs/DATABASE.md and docs/SECURITY.md.
```

### 4.4 Regla de avances

Codex debe trabajar por fases, no construir todo en una sola ejecución.

Cada fase debe terminar con:

```txt
- Summary of changes
- Files modified
- Tests/checks executed
- Known limitations
- Next recommended task
```

---

## 5. STACK TÉCNICO DEFINIDO

### Frontend

```txt
Next.js 14+
React
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
React Hook Form
Zod
Lucide React
```

### Backend

```txt
Next.js Server Actions
Next.js Route Handlers
Supabase
Stripe Webhooks
Server-side AI calls
PDF rendering on server
```

### Base de datos

```txt
Supabase PostgreSQL
Supabase Auth
Supabase Storage
Row Level Security
```

### Pagos

```txt
Stripe Checkout
Stripe Subscriptions
Stripe Customer Portal
Stripe Webhooks
```

### IA

```txt
OpenAI
Anthropic
Google Gemini
Mistral
Replicate / Flux / Ideogram opcional
```

### PDF

Opciones aceptables:

```txt
react-pdf
puppeteer
playwright PDF
html-to-pdf server-side
```

Elegir la opción más estable para Vercel.

### Hosting

```txt
Vercel
Supabase
Stripe
```

---

## 6. ESTRUCTURA DE REPOSITORIO ESPERADA

Codex debe construir o mantener una estructura similar a esta:

```txt
plenty-barber/
│
├── app/
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── clients/
│   │   ├── reports/
│   │   ├── credits/
│   │   ├── settings/
│   │   └── team/
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── businesses/
│   │   ├── plans/
│   │   ├── generations/
│   │   └── ai-logs/
│   ├── pricing/
│   │   └── page.tsx
│   ├── report/
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/
│       ├── ai/
│       ├── credits/
│       ├── pdf/
│       ├── reports/
│       ├── stripe/
│       └── whatsapp/
│
├── components/
│   ├── ui/
│   ├── brand/
│   ├── dashboard/
│   ├── reports/
│   ├── clients/
│   ├── admin/
│   ├── forms/
│   └── layout/
│
├── lib/
│   ├── ai/
│   │   ├── prompts/
│   │   ├── providers/
│   │   └── validators/
│   ├── supabase/
│   ├── stripe/
│   ├── pdf/
│   ├── storage/
│   ├── whatsapp/
│   ├── auth/
│   ├── validations/
│   └── utils/
│
├── database/
│   ├── schema.sql
│   ├── policies.sql
│   └── seed.sql
│
├── public/
│   ├── logos/
│   ├── icons/
│   └── images/
│
├── docs/
│   ├── PRD.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── API.md
│   ├── ROADMAP.md
│   ├── BRAND-MANUAL.md
│   ├── ONBOARDING.md
│   ├── LANDING-COPY.md
│   └── CHANGELOG.md
│
├── CODEX_BUILD_GUIDE.md
├── AGENTS.md
├── README.md
├── .env.example
├── package.json
└── tailwind.config.ts
```

---

## 7. VARIABLES DE ENTORNO

Codex debe crear `.env.example` si no existe.

No debe crear `.env.local` con secretos reales.

```env
# App
NEXT_PUBLIC_APP_NAME="Plenty Barber"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_STARTER_MONTHLY=""
STRIPE_PRICE_PRO_MONTHLY=""
STRIPE_PRICE_AGENCY_MONTHLY=""

# AI
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GOOGLE_AI_API_KEY=""
MISTRAL_API_KEY=""
REPLICATE_API_TOKEN=""

# Storage
SIGNED_URL_EXPIRATION_DAYS="30"
PHOTO_RETENTION_DAYS="90"
MAX_UPLOAD_IMAGE_MB="10"

# Admin
SUPER_ADMIN_EMAIL=""
```

---

## 8. IDENTIDAD VISUAL QUE DEBE RESPETAR

Plenty Barber debe tener estética:

```txt
Dark luxury
Premium barbershop
Editorial
Minimalista
Dorado sobre negro
Elegante
Clara
Mobile-first
```

### Colores

```txt
Noir: #0A0A0A
Noir Soft: #141414
Noir Medium: #1E1E1E
Gold: #C9A84C
Light Gold: #E8D5A3
Deep Gold: #8A6820
Cream: #F7F3EC
White: #FFFFFF
Muted Gray: #6B6660
```

### Tipografías recomendadas

```txt
Display: Cinzel
Editorial: Cormorant Garamond
UI: DM Sans
```

Si Google Fonts no está configurado, usar fallback seguro.

### Componentes

El diseño debe usar:

- Cards oscuras.
- Bordes dorados sutiles.
- Botones dorados premium.
- Espaciado generoso.
- Tablas limpias.
- Estados vacíos elegantes.
- Loading states premium.
- Microinteracciones suaves.
- Íconos limpios.

---

## 9. USUARIOS Y ROLES

### Super Admin

Propietario: GoPlenty Global.

Puede:

- Ver todos los negocios.
- Ver ingresos.
- Ver créditos.
- Ajustar créditos.
- Ver logs de IA.
- Ver generaciones.
- Manejar planes.
- Activar/desactivar negocios.

### Business Owner

Puede:

- Ver dashboard.
- Crear clientes.
- Generar informes.
- Descargar PDFs.
- Compartir por WhatsApp.
- Comprar créditos.
- Subir logo.
- Manejar equipo.
- Ver facturación.

### Operator / Stylist

Puede:

- Crear clientes.
- Generar informes.
- Ver historial.
- Descargar PDF.
- Compartir WhatsApp.

No puede:

- Ver facturación.
- Ajustar créditos.
- Manejar plan.
- Acceder a admin global.

### Final Client

No tiene cuenta.

Solo recibe:

- PDF.
- Link.
- Recomendaciones.

---

## 10. BASE DE DATOS QUE CODEX DEBE IMPLEMENTAR

Codex debe basarse en estas tablas:

```txt
businesses
business_users
plans
end_clients
generations
credit_transactions
ai_logs
system_config
```

### 10.1 businesses

```sql
businesses (
  id uuid primary key,
  name text not null,
  email text unique not null,
  phone text,
  logo_url text,
  plan_id uuid,
  credits_remaining integer default 0,
  credits_alert_threshold integer default 10,
  auto_reload boolean default false,
  preferred_ai_provider text default 'openai',
  preferred_image_provider text default 'openai',
  stripe_customer_id text,
  stripe_subscription_id text,
  active boolean default true,
  created_at timestamptz default now()
)
```

### 10.2 business_users

```sql
business_users (
  id uuid primary key,
  business_id uuid not null,
  auth_user_id uuid unique,
  email text not null,
  role text check (role in ('owner','operator')),
  full_name text,
  active boolean default true,
  created_at timestamptz default now()
)
```

### 10.3 end_clients

```sql
end_clients (
  id uuid primary key,
  business_id uuid not null,
  full_name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

### 10.4 generations

```sql
generations (
  id uuid primary key,
  business_id uuid not null,
  end_client_id uuid,
  created_by uuid,
  photo_urls text[],
  gender text,
  ai_provider text,
  ai_model text,
  image_provider text,
  tokens_used integer,
  cost_usd numeric,
  report_json jsonb,
  illustration_urls text[],
  pdf_url text,
  pdf_expires_at timestamptz,
  status text check (status in ('pending','processing','done','error')),
  error_message text,
  created_at timestamptz default now()
)
```

### 10.5 credit_transactions

```sql
credit_transactions (
  id uuid primary key,
  business_id uuid not null,
  credits_delta integer not null,
  price_usd numeric,
  stripe_payment_intent_id text,
  type text,
  note text,
  created_at timestamptz default now()
)
```

### 10.6 ai_logs

```sql
ai_logs (
  id uuid primary key,
  business_id uuid,
  generation_id uuid,
  provider text,
  model text,
  request_type text,
  input_tokens integer,
  output_tokens integer,
  cost_usd numeric,
  status text,
  error_message text,
  created_at timestamptz default now()
)
```

---

## 11. PANTALLAS QUE CODEX DEBE CREAR

### 11.1 Landing Page

Ruta:

```txt
/
```

Debe incluir:

- Hero premium.
- Problema.
- Solución.
- Cómo funciona.
- Beneficios.
- Demo visual.
- Planes.
- FAQ.
- CTA final.

CTA principal:

```txt
Generate Your First Report
```

CTA secundario:

```txt
Book a Demo
```

### 11.2 Login

Ruta:

```txt
/login
```

Debe incluir:

- Email.
- Password.
- Login.
- Forgot password.
- Diseño oscuro premium.

### 11.3 Dashboard

Ruta:

```txt
/dashboard
```

Debe incluir:

- Créditos restantes.
- Reportes del mes.
- Clientes registrados.
- Últimos informes.
- CTA: New Report.
- Alerta de créditos bajos.

### 11.4 Nuevo Informe

Ruta:

```txt
/dashboard/reports/new
```

Flujo:

1. Seleccionar cliente o crear uno.
2. Subir foto.
3. Confirmar datos.
4. Generar informe.
5. Mostrar loading premium.
6. Redirigir a resultado.

### 11.5 Clientes

Ruta:

```txt
/dashboard/clients
```

Debe incluir:

- Tabla/lista.
- Buscar.
- Crear cliente.
- Editar cliente.
- Ver historial.

### 11.6 Historial de Reportes

Ruta:

```txt
/dashboard/reports
```

Debe incluir:

- Lista de generaciones.
- Estado.
- Cliente.
- Fecha.
- Descargar PDF.
- Ver reporte.

### 11.7 Reporte Individual

Ruta:

```txt
/report/[id]
```

Debe incluir:

- Header con cliente.
- Análisis facial.
- Colorimetría.
- Recomendaciones.
- Propuestas visuales.
- Botón PDF.
- Botón WhatsApp.

### 11.8 Créditos

Ruta:

```txt
/dashboard/credits
```

Debe incluir:

- Balance.
- Historial de transacciones.
- Comprar créditos.
- Estado de plan.

### 11.9 Configuración

Ruta:

```txt
/dashboard/settings
```

Debe incluir:

- Nombre del negocio.
- Logo.
- Teléfono.
- Proveedor IA preferido.
- Datos básicos.

### 11.10 Admin Global

Ruta:

```txt
/admin
```

Debe incluir:

- MRR.
- Negocios activos.
- Generaciones del mes.
- Costos IA.
- Margen estimado.
- Clientes con créditos bajos.
- Logs recientes.

---

## 12. ENDPOINTS QUE CODEX DEBE CREAR

### Reports

```txt
POST /api/reports/create
GET /api/reports/[id]
GET /api/reports
```

### AI

```txt
POST /api/ai/analyze-face
POST /api/ai/generate-illustrations
```

### PDF

```txt
POST /api/pdf/generate
```

### Credits

```txt
GET /api/credits/balance
POST /api/credits/adjust
```

### Stripe

```txt
POST /api/stripe/create-checkout-session
POST /api/stripe/webhook
```

### WhatsApp

```txt
POST /api/whatsapp/share-link
```

### Uploads

```txt
POST /api/storage/sign-upload
POST /api/storage/signed-url
```

---

## 13. FLUJO DE GENERACIÓN DE INFORME

Codex debe implementar esta lógica:

```txt
1. Usuario autenticado abre New Report.
2. Selecciona o crea cliente.
3. Sube foto.
4. Sistema valida archivo.
5. Sistema revisa créditos.
6. Si no hay créditos, bloquear generación.
7. Crear registro en generations con status='processing'.
8. Descontar 1 crédito.
9. Crear credit_transaction tipo generation_use.
10. Enviar foto al análisis IA server-side.
11. Recibir JSON estructurado.
12. Guardar report_json.
13. Generar imágenes propuestas si está disponible.
14. Generar PDF.
15. Guardar PDF en storage.
16. Actualizar status='done'.
17. Mostrar reporte.
18. Permitir descargar o compartir.
```

Si falla IA:

```txt
- Marcar generation.status='error'
- Guardar error_message seguro
- No exponer stack trace al usuario
- Mostrar mensaje amigable
```

---

## 14. SISTEMA DE CRÉDITOS

### Regla principal

Cada informe consume:

```txt
1 credit
```

### Planes sugeridos

```txt
Starter: 100 credits / $29
Pro: 200 credits / $49
Agency: 500 credits / $99
```

### Reglas

- No permitir generación si créditos = 0.
- Descontar crédito dentro de transacción.
- Registrar cada movimiento en credit_transactions.
- Admin puede ajustar créditos.
- Alertar si créditos <= threshold.
- Stripe webhook asigna créditos tras pago confirmado.

---

## 15. STRIPE

Codex debe implementar:

### Checkout

```txt
/api/stripe/create-checkout-session
```

Debe permitir:

- Suscripción mensual.
- Compra de créditos extra.
- Redirección success/cancel.

### Webhook

```txt
/api/stripe/webhook
```

Debe manejar:

```txt
checkout.session.completed
invoice.paid
invoice.payment_failed
customer.subscription.created
customer.subscription.deleted
payment_intent.succeeded
```

### Regla crítica

No actualizar créditos basado en el frontend.

Solo actualizar créditos después de webhook verificado.

---

## 16. IA — ANÁLISIS DE VISAJISMO

Codex debe crear un sistema modular:

```txt
lib/ai/providers/openai.ts
lib/ai/providers/anthropic.ts
lib/ai/prompts/visagism-analysis.ts
lib/ai/validators/report-schema.ts
```

### Output esperado

```json
{
  "morfologia_facial": {
    "forma": "ovalado",
    "descripcion": "string",
    "rasgos_destacados": ["string"]
  },
  "colorimetria": {
    "tono_piel": "medio",
    "subtono": "cálido",
    "estacion": "otoño",
    "paleta_colores_ropa": {
      "ideales": ["#hex"],
      "evitar": ["#hex"],
      "descripcion": "string"
    },
    "paleta_cabello": {
      "tonos_ideales": ["string"],
      "tonos_evitar": ["string"],
      "descripcion": "string"
    }
  },
  "recomendaciones_peinado": {
    "estilos_ideales": [
      {
        "nombre": "string",
        "descripcion": "string",
        "por_que_funciona": "string"
      }
    ],
    "estilos_evitar": ["string"],
    "recomendaciones_adicionales": "string"
  },
  "resumen_ejecutivo": "string"
}
```

### Reglas de seguridad en IA

La IA no debe:

- Hacer diagnósticos médicos.
- Criticar el rostro.
- Usar lenguaje ofensivo.
- Prometer resultados absolutos.
- Sugerir cirugías.
- Hablar de defectos.

Debe usar frases como:

```txt
Based on the visible image...
This aesthetic analysis suggests...
A professional stylist may validate...
```

---

## 17. PDF

Codex debe crear un PDF premium con:

- Logo del establecimiento.
- Nombre del cliente.
- Fecha.
- Forma del rostro.
- Colorimetría.
- Paleta de colores.
- Tonos de cabello.
- Tres looks.
- Recomendaciones adicionales.
- Footer: Powered by Plenty Barber.

Debe ser:

- Claro.
- Elegante.
- Legible.
- Mobile-shareable.
- No sobrecargado.

---

## 18. WHATSAPP

Codex debe crear helper:

```txt
lib/whatsapp/create-share-url.ts
```

Debe generar:

```txt
https://wa.me/[phone]?text=[encoded_message]
```

Mensaje sugerido:

```txt
Hola [Nombre], aquí tienes tu informe personalizado de visagismo creado por [Negocio]. Puedes verlo aquí: [PDF_URL]
```

---

## 19. SEGURIDAD

Codex debe cumplir:

- RLS en Supabase.
- Validación con Zod.
- API keys server-side.
- Storage privado.
- Signed URLs.
- Stripe webhook signature.
- Protección de rutas.
- Protección por business_id.
- Sanitización de inputs.
- Manejo seguro de errores.
- Rate limit en endpoints IA.

No debe:

- Exponer `SUPABASE_SERVICE_ROLE_KEY`.
- Exponer `OPENAI_API_KEY`.
- Usar buckets públicos para fotos.
- Permitir acceso cross-business.
- Confiar en datos enviados por frontend para créditos o pagos.

---

## 20. PROMPTS LISTOS PARA CODEX POR FASE

### Fase 1 — Foundation

```txt
Using CODEX_BUILD_GUIDE.md as the source of truth, build the project foundation.

Tasks:
- Ensure the app uses Next.js, TypeScript and Tailwind.
- Create the recommended folder structure.
- Add shadcn/ui compatible component structure.
- Configure global styles with Plenty Barber brand colors.
- Create base layout, landing page shell, login page shell and dashboard shell.
- Add environment variable validation.
- Do not implement Supabase logic yet beyond client helpers.
- Make sure npm run build passes.

Return:
- Summary
- Files changed
- Commands executed
- Next recommended step
```

### Fase 2 — Supabase Auth

```txt
Implement Supabase authentication and role-based access.

Tasks:
- Add Supabase browser/server clients.
- Add login page functionality.
- Add logout action.
- Protect /dashboard routes.
- Protect /admin routes.
- Create helper to get current business user.
- Add role detection: owner, operator, super_admin.
- Do not expose service role key to client.
- Add basic error handling.

Verify:
- Unauthenticated users cannot access dashboard.
- Operators cannot access admin.
- Build passes.
```

### Fase 3 — Database Integration

```txt
Implement database integration based on docs/DATABASE.md and database/schema.sql.

Tasks:
- Add TypeScript types for core tables.
- Create query helpers for businesses, clients, reports, credits.
- Implement client CRUD.
- Implement dashboard metrics from real data.
- Implement report history page.
- Add loading, empty and error states.

Verify:
- Client creation works.
- Client list works.
- Report list handles empty state.
```

### Fase 4 — Report Generation Flow

```txt
Implement the New Report flow.

Tasks:
- Create /dashboard/reports/new.
- Add client selection.
- Add new client inline creation.
- Add image upload UI.
- Validate image type and size.
- Create generation record.
- Check credits before generation.
- Deduct one credit safely.
- Redirect to report page.

Do not implement real AI yet if provider keys are not configured. Add clean server-side placeholder that matches the final JSON schema, and clearly isolate it so it can be replaced by real provider logic.
```

### Fase 5 — AI Integration

```txt
Implement AI analysis provider layer.

Tasks:
- Create lib/ai/prompts/visagism-analysis.ts.
- Create lib/ai/validators/report-schema.ts with Zod.
- Create provider adapter for OpenAI.
- Add fallback mock only for development.
- Ensure output is valid JSON.
- Save report_json in generations.
- Log provider, model and estimated cost in ai_logs.

Security:
- Server-side only.
- No API keys in frontend.
```

### Fase 6 — PDF

```txt
Implement PDF generation.

Tasks:
- Create branded PDF template.
- Include business logo, client name, date, analysis, color swatches and recommendations.
- Generate PDF server-side.
- Save PDF to private Supabase Storage.
- Return signed URL.
- Add Download PDF button.

Verify:
- PDF renders correctly.
- Signed URL works.
- No public bucket exposure.
```

### Fase 7 — WhatsApp

```txt
Implement WhatsApp sharing.

Tasks:
- Create helper to encode WhatsApp message.
- Add Share by WhatsApp button on report page.
- Use client phone if available.
- Allow fallback if phone is missing.
- Include signed PDF URL.

Verify:
- Link opens WhatsApp.
- Message is readable.
- URL is correctly encoded.
```

### Fase 8 — Stripe and Credits

```txt
Implement Stripe subscriptions and credit packs.

Tasks:
- Create pricing page.
- Create checkout session endpoint.
- Create webhook endpoint.
- Verify webhook signatures.
- On subscription paid, assign credits.
- On extra credit purchase, add credits.
- On failed payment, mark account alert.
- Add customer portal link.

Critical:
- Never update credits from frontend success page.
- Only update after verified webhook.
```

### Fase 9 — Admin Panel

```txt
Build Super Admin panel.

Tasks:
- Create /admin dashboard.
- Show active businesses.
- Show generations this month.
- Show credits by business.
- Show AI costs.
- Show margin estimate.
- Add business detail page.
- Add credit adjustment.
- Add plans view.
- Add logs view.

Security:
- Only SUPER_ADMIN_EMAIL or secure admin role can access.
```

### Fase 10 — Polish and QA

```txt
Polish the product for launch.

Tasks:
- Improve loading states.
- Improve mobile responsiveness.
- Add empty states.
- Add error states.
- Add animations carefully.
- Run lint, typecheck and build.
- Check QA-CHECKLIST.md.
- Update CHANGELOG.md.
```

---

## 21. COMPONENTES UI NECESARIOS

Codex debe crear componentes reutilizables:

```txt
AppShell
DashboardShell
AdminShell
MetricCard
CreditBadge
LowCreditAlert
ClientForm
ClientTable
ReportCard
ReportStatusBadge
ImageUploadDropzone
GenerateReportButton
PDFDownloadButton
WhatsAppShareButton
ColorSwatchList
RecommendationCard
PlanCard
AdminBusinessTable
CreditTransactionTable
```

---

## 22. ESTADOS QUE NO PUEDEN FALTAR

Cada flujo importante debe tener:

```txt
Loading
Empty
Error
Success
Unauthorized
Not enough credits
Processing
Done
```

Ejemplos:

- Si no hay clientes: mostrar CTA para crear el primero.
- Si no hay reportes: mostrar CTA para generar uno.
- Si créditos son 0: bloquear botón y mostrar compra.
- Si IA falla: mostrar error amigable y permitir reintento.

---

## 23. CRITERIOS DE ACEPTACIÓN DEL MVP

Codex debe considerar el MVP completo solo si:

- Landing page existe.
- Login funciona.
- Dashboard protegido funciona.
- Cliente puede crearse.
- Foto puede subirse.
- Créditos se validan.
- Reporte se genera.
- AI output se guarda.
- PDF se genera.
- WhatsApp link funciona.
- Stripe checkout existe.
- Webhook verifica firma.
- Admin puede ver negocios.
- Admin puede ajustar créditos.
- App compila sin errores.
- No hay keys privadas expuestas.
- UI se ve premium en mobile y desktop.

---

## 24. COMANDOS DE VERIFICACIÓN

Codex debe usar estos comandos cuando existan:

```bash
npm install
npm run lint
npm run typecheck
npm run build
npm run test
```

Si un script no existe, Codex debe:

1. Indicarlo.
2. Sugerir agregarlo.
3. No inventar que fue ejecutado.

---

## 25. ERRORES COMUNES QUE CODEX DEBE EVITAR

No hacer:

- Crear todo como una sola página.
- Mezclar admin y dashboard cliente.
- Guardar créditos solo en frontend.
- Crear PDFs públicos sin control.
- Hacer prompts de IA sin JSON estructurado.
- Dejar APIs sin validación.
- Exponer claves.
- Usar estilos genéricos sin marca.
- Crear una app bonita pero no vendible.
- Ignorar mobile.
- Ignorar Stripe webhooks.
- Ignorar RLS.
- Ignorar logs de costos IA.

---

## 26. ARCHIVO AGENTS.md RECOMENDADO

Crear también un archivo `AGENTS.md` con este contenido:

```md
# AGENTS.md — Plenty Barber

## Project Mission

Build Plenty Barber as a premium B2B SaaS for AI-powered visagism reports for barbershops, salons and beauty businesses.

## Rules

- Follow CODEX_BUILD_GUIDE.md.
- Keep TypeScript strict.
- Use Next.js, Supabase, Stripe and Tailwind.
- Never expose private keys.
- Keep the design premium: dark luxury, gold accents, mobile-first.
- Use server-side AI calls only.
- Validate input with Zod.
- Protect business data by business_id.
- Run lint/typecheck/build after major changes.
- Summarize files changed after every task.

## Do Not

- Do not remove documentation.
- Do not create public buckets for client photos.
- Do not bypass Stripe webhooks.
- Do not hardcode real secrets.
- Do not use unsafe AI outputs without validation.
```

---

## 27. PROMPT MAESTRO PARA PEGAR EN CODEX

Este es el prompt más importante. Úsalo al iniciar la construcción real:

```txt
You are working on Plenty Barber, a premium B2B SaaS web app for AI-powered visagism reports for barbershops, salons, spas and image consultants.

Before coding, read:
- CODEX_BUILD_GUIDE.md
- README.md
- docs/PRD.md
- docs/DATABASE.md
- docs/API.md
- docs/SECURITY.md
- docs/BRAND-MANUAL.md
- .env.example

Follow the product vision, stack, architecture, security rules and brand system exactly.

Build the project in phases. Do not attempt to implement everything at once.

Start by analyzing the repository and returning:
1. Current repo state
2. Missing files
3. Recommended implementation phases
4. First set of files you will create or modify
5. Risks or blockers

Do not expose secrets. Do not create fake final implementations. Use safe development placeholders only when clearly isolated and documented.
```

---

## 28. PROMPT PARA REVISIÓN DE CALIDAD

Usar cuando ya haya código:

```txt
Review the current implementation of Plenty Barber against CODEX_BUILD_GUIDE.md, docs/PRD.md, docs/SECURITY.md and docs/QA-CHECKLIST.md.

Identify:
- Missing MVP requirements
- Security risks
- Broken architecture decisions
- UI/UX inconsistencies
- Mobile issues
- Stripe issues
- Supabase/RLS issues
- AI validation issues
- PDF generation issues

Return a prioritized fix plan with critical, high, medium and low priority items.
Do not modify files yet.
```

---

## 29. PROMPT PARA HACER FIXES

```txt
Implement the critical and high-priority fixes from the previous review.

Rules:
- Do not introduce new features.
- Focus only on correctness, security and build stability.
- Keep UI aligned with the brand.
- Run lint/typecheck/build if available.
- Summarize changes and remaining risks.
```

---

## 30. DEFINICIÓN FINAL DE EXCELENCIA

Plenty Barber estará listo para vender cuando:

- Un negocio entienda el valor en menos de 2 minutos.
- El flujo principal pueda usarse desde un celular.
- Un informe pueda generarse sin ayuda técnica.
- El PDF se vea profesional.
- El link de WhatsApp sea simple.
- Los créditos y pagos funcionen.
- El admin tenga control.
- La marca se vea premium.
- La seguridad esté cuidada.
- El producto parezca un activo comercial, no un experimento.

---

## 31. NOTA FINAL PARA CODEX

Construye como si este producto fuera a ser vendido a negocios reales.

No optimices solo para que “funcione”.

Optimiza para que:

- Se pueda vender.
- Se pueda mantener.
- Se pueda escalar.
- Se pueda demostrar.
- Se pueda confiar.
- Se pueda convertir en marca blanca.
- Se pueda presentar como producto serio de GoPlenty Global.

Plenty Barber debe sentirse como una plataforma por la que una barbería, salón o franquicia estaría dispuesta a pagar.
