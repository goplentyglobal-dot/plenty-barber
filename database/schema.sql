create extension if not exists "pgcrypto";

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  monthly_price_usd numeric not null,
  monthly_credits integer not null,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  logo_url text,
  plan_id uuid references plans(id),
  credits_remaining integer default 0,
  credits_alert_threshold integer default 10,
  auto_reload boolean default false,
  preferred_ai_provider text default 'openai',
  preferred_image_provider text default 'openai',
  stripe_customer_id text,
  stripe_subscription_id text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists business_users (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  auth_user_id uuid unique,
  email text not null,
  role text check (role in ('owner','operator')),
  full_name text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists end_clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  end_client_id uuid references end_clients(id) on delete set null,
  created_by uuid references business_users(id) on delete set null,
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
);

create table if not exists credit_transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  credits_delta integer not null,
  price_usd numeric,
  stripe_payment_intent_id text,
  type text,
  note text,
  created_at timestamptz default now()
);

create table if not exists ai_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete set null,
  generation_id uuid references generations(id) on delete set null,
  provider text,
  model text,
  request_type text,
  input_tokens integer,
  output_tokens integer,
  cost_usd numeric,
  status text,
  error_message text,
  created_at timestamptz default now()
);

create table if not exists system_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
