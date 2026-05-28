alter table generations add column if not exists public_token text unique;
alter table generations add column if not exists is_public boolean default false;
alter table generations add column if not exists published_at timestamptz;
alter table generations add column if not exists views_count integer default 0;
alter table generations add column if not exists public_expires_at timestamptz;

create index if not exists generations_public_token_idx on generations(public_token);
