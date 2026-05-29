-- Idempotency guard for payment crediting: at most one credit transaction per
-- external payment reference. Partial so non-payment rows (null reference) are unconstrained.
create unique index if not exists credit_transactions_payment_ref_key
  on credit_transactions (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

create or replace function create_generation_with_credit(
  p_business_id uuid,
  p_end_client_id uuid,
  p_created_by uuid,
  p_photo_urls text[],
  p_report_json jsonb,
  p_ai_provider text default 'placeholder',
  p_ai_model text default 'development-placeholder',
  p_input_tokens integer default 0,
  p_output_tokens integer default 0,
  p_cost_usd numeric default 0,
  p_image_provider text default null,
  p_illustration_urls text[] default array[]::text[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_generation_id uuid;
  v_is_member boolean;
begin
  select exists (
    select 1
    from business_users
    where business_id = p_business_id
      and id = p_created_by
      and auth_user_id = auth.uid()
      and active = true
  )
  into v_is_member;

  if not v_is_member then
    raise exception 'not authorized';
  end if;

  update businesses
  set credits_remaining = credits_remaining - 1
  where id = p_business_id
    and credits_remaining > 0;

  if not found then
    raise exception 'not enough credits';
  end if;

  insert into generations (
    business_id,
    end_client_id,
    created_by,
    photo_urls,
    ai_provider,
    ai_model,
    image_provider,
    tokens_used,
    cost_usd,
    report_json,
    illustration_urls,
    status
  )
  values (
    p_business_id,
    p_end_client_id,
    p_created_by,
    p_photo_urls,
    p_ai_provider,
    p_ai_model,
    coalesce(p_image_provider, p_ai_provider),
    p_input_tokens + p_output_tokens,
    p_cost_usd,
    p_report_json,
    coalesce(p_illustration_urls, array[]::text[]),
    'done'
  )
  returning id into v_generation_id;

  insert into credit_transactions (
    business_id,
    credits_delta,
    type,
    note
  )
  values (
    p_business_id,
    -1,
    'generation_use',
    'Credit consumed by report generation'
  );

  insert into ai_logs (
    business_id,
    generation_id,
    provider,
    model,
    request_type,
    input_tokens,
    output_tokens,
    cost_usd,
    status
  )
  values (
    p_business_id,
    v_generation_id,
    p_ai_provider,
    p_ai_model,
    'visagism_analysis',
    p_input_tokens,
    p_output_tokens,
    p_cost_usd,
    'done'
  );

  return v_generation_id;
end;
$$;

-- Atomically and idempotently apply credits from an approved payment webhook.
-- Returns true when credits were applied, false when the reference was already
-- processed (duplicate webhook delivery). Runs with service-role context, so it
-- does not depend on auth.uid().
create or replace function apply_payment_credits(
  p_business_id uuid,
  p_credits_to_add integer,
  p_reference text,
  p_provider text,
  p_price_usd numeric default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted_id uuid;
begin
  if p_business_id is null
    or p_credits_to_add is null
    or p_credits_to_add <= 0
    or p_reference is null
    or p_reference = '' then
    raise exception 'invalid payment input';
  end if;

  insert into credit_transactions (
    business_id,
    credits_delta,
    price_usd,
    stripe_payment_intent_id,
    type,
    note
  )
  values (
    p_business_id,
    p_credits_to_add,
    p_price_usd,
    p_reference,
    'payment_' || p_provider,
    'Approved ' || p_provider || ' payment'
  )
  on conflict (stripe_payment_intent_id) where stripe_payment_intent_id is not null
  do nothing
  returning id into v_inserted_id;

  -- Duplicate delivery: the reference already produced a transaction.
  if v_inserted_id is null then
    return false;
  end if;

  update businesses
  set credits_remaining = credits_remaining + p_credits_to_add
  where id = p_business_id;

  return true;
end;
$$;
