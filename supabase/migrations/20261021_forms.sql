-- Run in the Supabase SQL editor after exporting the current tables.
-- Existing RSVP rows without an email remain available in /admin for reconciliation.

begin;

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attending boolean,
  adults integer not null default 0,
  children integer not null default 0,
  dietary_restrictions text,
  song text,
  created_at timestamptz not null default now()
);

alter table public.rsvps add column if not exists email text;
alter table public.rsvps add column if not exists edit_token_hash text;
alter table public.rsvps add column if not exists updated_at timestamptz not null default now();
update public.rsvps set email = lower(trim(email)) where email is not null;
create unique index if not exists rsvps_email_unique on public.rsvps (email);

create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cost numeric not null default 0,
  picture_url text,
  link text,
  status text not null default 'Not Claimed',
  claimed_by_name text,
  claimed_by_email text,
  created_at timestamptz not null default now()
);

alter table public.gifts add column if not exists claimed_by_name text;
alter table public.gifts add column if not exists claimed_by_email text;
alter table public.gifts add column if not exists claimed_at timestamptz;
update public.gifts
set status = 'Claimed', claimed_at = coalesce(claimed_at, now())
where claimed_by_name is not null or claimed_by_email is not null;

create table if not exists public.form_rate_limits (
  request_key text primary key,
  attempts integer not null,
  expires_at timestamptz not null
);

-- These tables are accessed by server API routes with the service role key.
alter table public.rsvps enable row level security;
alter table public.gifts enable row level security;
alter table public.form_rate_limits enable row level security;
revoke all on public.rsvps, public.gifts, public.form_rate_limits from anon, authenticated;
grant select, insert, update, delete on public.rsvps, public.gifts, public.form_rate_limits to service_role;

create or replace function public.consume_form_attempt(p_key text, p_limit integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  current_attempts integer;
begin
  if length(p_key) <> 64 or p_limit < 1 then return false; end if;

  insert into public.form_rate_limits as limits (request_key, attempts, expires_at)
  values (p_key, 1, now() + interval '1 hour')
  on conflict (request_key) do update
  set attempts = case when limits.expires_at <= now() then 1 else limits.attempts + 1 end,
      expires_at = case when limits.expires_at <= now() then now() + interval '1 hour' else limits.expires_at end
  returning attempts into current_attempts;

  return current_attempts <= p_limit;
end;
$$;

create or replace function public.save_rsvp(
  p_name text, p_email text, p_attending boolean, p_adults integer,
  p_children integer, p_dietary text, p_song text, p_edit_token_hash text
)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  saved boolean;
begin
  insert into public.rsvps as existing
    (name, email, attending, adults, children, dietary_restrictions, song, edit_token_hash)
  values
    (p_name, p_email, p_attending, p_adults, p_children, p_dietary, p_song, p_edit_token_hash)
  on conflict (email) do update
  set name = excluded.name,
      attending = excluded.attending,
      adults = excluded.adults,
      children = excluded.children,
      dietary_restrictions = excluded.dietary_restrictions,
      song = excluded.song,
      updated_at = now()
  where existing.edit_token_hash = excluded.edit_token_hash
  returning true into saved;

  return coalesce(saved, false);
end;
$$;

create or replace function public.reserve_gift(p_gift_id text, p_name text, p_email text)
returns text language plpgsql security definer set search_path = public as $$
begin
  update public.gifts
  set status = 'Claimed', claimed_by_name = p_name,
      claimed_by_email = p_email, claimed_at = now()
  where id::text = p_gift_id
    and coalesce(status, 'Not Claimed') = 'Not Claimed'
    and claimed_by_name is null and claimed_by_email is null;

  if found then return 'reserved'; end if;
  if exists (select 1 from public.gifts where id::text = p_gift_id) then return 'unavailable'; end if;
  return 'not_found';
end;
$$;

revoke all on function public.consume_form_attempt(text, integer) from public, anon, authenticated;
revoke all on function public.save_rsvp(text, text, boolean, integer, integer, text, text, text) from public, anon, authenticated;
revoke all on function public.reserve_gift(text, text, text) from public, anon, authenticated;
grant execute on function public.consume_form_attempt(text, integer) to service_role;
grant execute on function public.save_rsvp(text, text, boolean, integer, integer, text, text, text) to service_role;
grant execute on function public.reserve_gift(text, text, text) to service_role;

commit;
