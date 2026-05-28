insert into plans (name, monthly_price_usd, monthly_credits)
values
  ('Starter', 29, 100),
  ('Pro', 49, 200),
  ('Agency', 99, 500)
on conflict (name) do nothing;
