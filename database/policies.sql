alter table businesses enable row level security;
alter table business_users enable row level security;
alter table end_clients enable row level security;
alter table generations enable row level security;
alter table credit_transactions enable row level security;
alter table ai_logs enable row level security;

create or replace function current_user_business_ids()
returns setof uuid
language sql
security definer
set search_path = public
as $$
  select business_id
  from business_users
  where auth_user_id = auth.uid()
    and active = true;
$$;

create policy "business users can read their business"
on businesses for select
using (id in (select current_user_business_ids()));

create policy "business users can read teammates"
on business_users for select
using (business_id in (select current_user_business_ids()));

create policy "business users can manage clients"
on end_clients for all
using (business_id in (select current_user_business_ids()))
with check (business_id in (select current_user_business_ids()));

create policy "business users can read generations"
on generations for select
using (business_id in (select current_user_business_ids()));

create policy "business users can create generations"
on generations for insert
with check (business_id in (select current_user_business_ids()));

create policy "business users can read credit transactions"
on credit_transactions for select
using (business_id in (select current_user_business_ids()));
