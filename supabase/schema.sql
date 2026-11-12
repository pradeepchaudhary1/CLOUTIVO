-- Cloutivo schema v2. Run once in Supabase -> SQL Editor (safe to re-run).
create extension if not exists pgcrypto;

-- ───────────── tables ─────────────
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  url text not null,
  host text not null,
  title text not null,
  tagline text not null default '',
  category text not null default 'other',
  discount text,                                   -- e.g. "30% off first project" (optional deal)
  coupon_code text,                                -- e.g. "NEXUS30"
  deal_verified boolean not null default false,    -- YOU set this to true after testing the code
  is_demo boolean not null default false,          -- sample rows: never ranked, never paid, always labelled
  total_cents bigint not null default 0 check (total_cents >= 0),
  click_count bigint not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_paid_at timestamptz not null default now()
);
create index if not exists listings_rank_idx on public.listings (total_cents desc, created_at asc) where is_active and not is_demo;
create index if not exists listings_category_idx on public.listings (category, total_cents desc) where is_active and not is_demo;
create index if not exists listings_created_idx on public.listings (created_at desc);
create index if not exists listings_deal_idx on public.listings (total_cents desc) where discount is not null and is_active and not is_demo;

create table if not exists public.pending_orders (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  url text not null,
  host text not null,
  title text not null,
  tagline text not null default '',
  category text not null default 'other',
  discount text,
  coupon_code text,
  charge_cents bigint not null check (charge_cents > 0),
  provider text not null check (provider in ('stripe','razorpay')),
  provider_amount bigint not null,
  provider_currency text not null,
  provider_order_ref text,
  provider_ref text,
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists pending_orders_ref_idx on public.pending_orders (provider_order_ref);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.pending_orders(id),
  listing_id uuid not null references public.listings(id) on delete cascade,
  provider text not null,
  provider_ref text not null,
  amount_cents bigint not null,
  created_at timestamptz not null default now(),
  unique (provider, provider_ref)
);
create index if not exists payments_created_idx on public.payments (created_at desc);

create table if not exists public.daily_spend (
  listing_id uuid not null references public.listings(id) on delete cascade,
  day date not null,
  amount_cents bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (listing_id, day)
);
create index if not exists daily_spend_day_idx on public.daily_spend (day, amount_cents desc);

create table if not exists public.click_events (
  listing_id uuid not null references public.listings(id) on delete cascade,
  visitor_hash text not null,
  bucket bigint not null,
  primary key (listing_id, visitor_hash, bucket)
);

-- Backlink Booster requests: you collect the request first, deliver a payment link after confirming scope.
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  plan text not null check (plan in ('starter','growth','scale')),
  email text not null,
  site_url text not null,
  note text,
  status text not null default 'requested' check (status in ('requested','quoted','paid','delivered','cancelled')),
  created_at timestamptz not null default now()
);

-- ───────────── security ─────────────
alter table public.listings enable row level security;
alter table public.pending_orders enable row level security;
alter table public.payments enable row level security;
alter table public.daily_spend enable row level security;
alter table public.click_events enable row level security;
alter table public.service_requests enable row level security;

drop policy if exists "public read active listings" on public.listings;
create policy "public read active listings" on public.listings for select using (is_active);

-- ───────────── public views (real data only; sample rows are excluded from every rank) ─────────────
create or replace view public.ranked_listings as
select
  l.id, l.slug, l.url, l.host, l.title, l.tagline, l.category,
  l.discount, l.coupon_code, l.deal_verified,
  l.total_cents, l.click_count, l.created_at, l.updated_at,
  row_number() over (order by l.total_cents desc, l.created_at asc) as rank,
  row_number() over (partition by l.category order by l.total_cents desc, l.created_at asc) as category_rank
from public.listings l
where l.is_active and not l.is_demo;

create or replace view public.today_ranked as
select
  l.id, l.slug, l.url, l.host, l.title, l.tagline, l.category,
  l.discount, l.coupon_code, l.deal_verified,
  l.total_cents, l.click_count, l.created_at,
  d.amount_cents as day_cents,
  row_number() over (order by d.amount_cents desc, d.updated_at asc) as day_rank
from public.daily_spend d
join public.listings l on l.id = d.listing_id
where l.is_active and not l.is_demo and d.day = (now() at time zone 'utc')::date;

create or replace view public.daily_archive as
select * from (
  select
    d.day, l.slug, l.title, l.host, l.category,
    d.amount_cents as day_cents,
    row_number() over (partition by d.day order by d.amount_cents desc, d.updated_at asc) as pos,
    count(*) over (partition by d.day) as listings_that_day
  from public.daily_spend d
  join public.listings l on l.id = d.listing_id
  where l.is_active and not l.is_demo and d.day >= (now() at time zone 'utc')::date - 30
) t where pos <= 5;

create or replace view public.recent_activity as
select l.slug, l.title, p.amount_cents, p.created_at
from public.payments p
join public.listings l on l.id = p.listing_id
where l.is_active and not l.is_demo
order by p.created_at desc
limit 20;

create or replace view public.site_stats as
select count(*)::bigint as listings,
       coalesce(sum(total_cents),0)::bigint as total_cents,
       coalesce(sum(click_count),0)::bigint as clicks
from public.listings where is_active and not is_demo;

create or replace view public.category_stats as
select category,
       count(*)::bigint as listings,
       max(total_cents)::bigint as top_cents,
       coalesce(sum(click_count),0)::bigint as clicks
from public.listings where is_active and not is_demo group by category;

create or replace view public.paid_by_day as
select d.day, sum(d.amount_cents)::bigint as cents, count(distinct d.listing_id)::bigint as listings
from public.daily_spend d join public.listings l on l.id = d.listing_id
where l.is_active and not l.is_demo and d.day >= (now() at time zone 'utc')::date - 13
group by d.day order by d.day;

-- Sample listings (is_demo = true): shown only while the real board is nearly empty, with no rank,
-- no price, no clicks and no outbound link. Loaded by supabase/sample-listings.sql.
create or replace view public.sample_listings as
select slug, title, tagline, category, host from public.listings where is_demo and is_active;

grant select on public.ranked_listings, public.today_ranked, public.daily_archive, public.recent_activity,
  public.site_stats, public.category_stats, public.paid_by_day, public.sample_listings to anon, authenticated;

-- ───────────── atomic, idempotent payment fulfilment ─────────────
create or replace function public.fulfill_order(p_order_id uuid, p_provider text, p_ref text, p_paid bigint)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.pending_orders%rowtype;
  l_id uuid;
begin
  select * into o from public.pending_orders where id = p_order_id for update;
  if not found then return 'not_found'; end if;
  if o.status = 'paid' then return 'ok:' || o.slug; end if;
  if o.provider <> p_provider then return 'provider_mismatch'; end if;
  if p_paid < o.provider_amount then return 'underpaid'; end if;

  insert into public.listings (slug, url, host, title, tagline, category, discount, coupon_code, total_cents)
  values (o.slug, o.url, o.host, o.title, o.tagline, o.category, o.discount, o.coupon_code, o.charge_cents)
  on conflict (slug) do update
    set total_cents = public.listings.total_cents + o.charge_cents,
        updated_at = now(),
        last_paid_at = now(),
        is_active = true
  returning id into l_id;

  insert into public.payments (order_id, listing_id, provider, provider_ref, amount_cents)
  values (o.id, l_id, o.provider, p_ref, o.charge_cents);

  insert into public.daily_spend (listing_id, day, amount_cents)
  values (l_id, (now() at time zone 'utc')::date, o.charge_cents)
  on conflict (listing_id, day) do update
    set amount_cents = public.daily_spend.amount_cents + excluded.amount_cents, updated_at = now();

  update public.pending_orders set status = 'paid', provider_ref = p_ref, paid_at = now() where id = o.id;
  return 'ok:' || o.slug;
end $$;

create or replace function public.register_click(p_slug text, p_hash text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare l_id uuid; n int;
begin
  select id into l_id from public.listings where slug = p_slug and is_active and not is_demo;
  if not found then return false; end if;
  insert into public.click_events (listing_id, visitor_hash, bucket)
  values (l_id, p_hash, floor(extract(epoch from now()) / 3600)::bigint)
  on conflict do nothing;
  get diagnostics n = row_count;
  if n > 0 then update public.listings set click_count = click_count + 1 where id = l_id; end if;
  return n > 0;
end $$;

revoke all on function public.fulfill_order(uuid, text, text, bigint) from public, anon, authenticated;
revoke all on function public.register_click(text, text) from public, anon, authenticated;
grant execute on function public.fulfill_order(uuid, text, text, bigint) to service_role;
grant execute on function public.register_click(text, text) to service_role;

-- Optional housekeeping (enable pg_cron first):
-- select cron.schedule('prune-clicks', '15 3 * * *', $$ delete from public.click_events where bucket < floor(extract(epoch from now())/3600) - 72 $$);
-- select cron.schedule('prune-orders', '30 3 * * *', $$ delete from public.pending_orders where status <> 'paid' and created_at < now() - interval '3 days' $$);
