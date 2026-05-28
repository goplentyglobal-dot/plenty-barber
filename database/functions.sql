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
  p_cost_usd numeric default 0
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
    p_ai_provider,
    p_input_tokens + p_output_tokens,
    p_cost_usd,
    p_report_json,
    array[]::text[],
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
