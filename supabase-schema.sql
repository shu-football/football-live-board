-- Run in Supabase SQL Editor

-- ============================================
-- Season column: add to existing data tables
-- ============================================
alter table public.matches add column if not exists season text not null default '2026';
alter table public.scorers add column if not exists season text not null default '2026';
alter table public.cards add column if not exists season text not null default '2026';
alter table public.cards add column if not exists suspended boolean not null default false;
alter table public.knockout_matches add column if not exists season text not null default '2026';
alter table public.season_config add column if not exists card_rules jsonb;

-- ============================================
-- Tables (create if not exists)
-- ============================================
create table if not exists public.matches (
  id text,
  match_date date not null,
  round_no int not null,
  group_code text not null,
  home_team text not null,
  away_team text not null,
  home_score int null,
  away_score int null,
  updated_at timestamptz not null default now(),
  primary key (id, season)
);

create table if not exists public.scorers (
  id text,
  player_name text not null,
  team_name text not null,
  goals int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (id, season)
);

create table if not exists public.cards (
  id text,
  player_name text not null,
  team_name text not null,
  yellow_cards int not null default 0,
  red_cards int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (id, season)
);

create table if not exists public.admin_users (
  email text primary key,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================
-- New: Player pool table
-- ============================================
create table if not exists public.players (
  id text,
  player_name text not null,
  jersey_number int,
  team_name text not null,
  season text not null default '2026',
  created_at timestamptz not null default now(),
  primary key (id, season)
);

-- ============================================
-- New: Season config table
-- ============================================
create table if not exists public.season_config (
  season text primary key,
  group_a_teams text[] not null default '{}',
  group_b_teams text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- ============================================
-- Knockout matches table
-- ============================================
create table if not exists public.knockout_matches (
  id text,
  round text not null check (round in ('QF', 'SF', 'Third', 'Final')),
  home_seed text,
  away_seed text,
  home_from text,
  away_from text,
  home_team text,
  away_team text,
  home_score int null,
  away_score int null,
  penalty int[] null,
  updated_at timestamptz not null default now(),
  primary key (id, season)
);

-- ============================================
-- Admin role support
-- ============================================
alter table public.admin_users add column if not exists role text;
alter table public.admin_users alter column role set default 'admin';
update public.admin_users set role = 'admin' where role is null;

-- 允许 media_editor 角色（只能上传图片/视频，不能编辑比分等数据）
alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users add constraint admin_users_role_check check (role in ('owner', 'admin', 'media_editor'));

-- ============================================
-- Media editor role (upload images/videos only, no other admin access)
-- ============================================
create or replace function public.is_media_editor(user_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = user_email and is_active = true
      and role in ('owner', 'admin', 'media_editor')
  );
$$;

revoke all on function public.is_media_editor(text) from public;
grant execute on function public.is_media_editor(text) to authenticated;

-- ============================================
-- Helper functions
-- ============================================
create or replace function public.is_admin(user_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = user_email and is_active = true
  );
$$;

revoke all on function public.is_admin(text) from public;
grant execute on function public.is_admin(text) to authenticated;

create or replace function public.is_owner(user_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = user_email
      and is_active = true
      and role = 'owner'
  );
$$;

revoke all on function public.is_owner(text) from public;
grant execute on function public.is_owner(text) to authenticated;

-- ============================================
-- RLS: enable on all tables
-- ============================================
alter table public.matches enable row level security;
alter table public.scorers enable row level security;
alter table public.cards enable row level security;
alter table public.admin_users enable row level security;
alter table public.knockout_matches enable row level security;
alter table public.players enable row level security;
alter table public.season_config enable row level security;

-- ============================================
-- RLS: public read policies
-- ============================================
drop policy if exists "public read matches" on public.matches;
create policy "public read matches" on public.matches
for select using (true);

drop policy if exists "public read scorers" on public.scorers;
create policy "public read scorers" on public.scorers
for select using (true);

drop policy if exists "public read cards" on public.cards;
create policy "public read cards" on public.cards
for select using (true);

drop policy if exists "public read knockout_matches" on public.knockout_matches;
create policy "public read knockout_matches" on public.knockout_matches
for select using (true);

drop policy if exists "public read players" on public.players;
create policy "public read players" on public.players
for select using (true);

drop policy if exists "public read season_config" on public.season_config;
create policy "public read season_config" on public.season_config
for select using (true);

-- ============================================
-- RLS: admin_users (authenticated only)
-- ============================================
drop policy if exists "auth read admin_users" on public.admin_users;
create policy "auth read admin_users" on public.admin_users
for select using (auth.role() = 'authenticated');

drop policy if exists "owner manage admin_users" on public.admin_users;
create policy "owner manage admin_users" on public.admin_users
for all
using (public.is_owner(auth.jwt() ->> 'email'))
with check (public.is_owner(auth.jwt() ->> 'email'));

-- ============================================
-- RLS: admin write policies (matches, scorers, cards, knockout, players, season_config)
-- ============================================
drop policy if exists "admin write matches" on public.matches;
create policy "admin write matches" on public.matches
for all
using (public.is_admin(auth.jwt() ->> 'email'))
with check (public.is_admin(auth.jwt() ->> 'email'));

drop policy if exists "admin write scorers" on public.scorers;
create policy "admin write scorers" on public.scorers
for all
using (public.is_admin(auth.jwt() ->> 'email'))
with check (public.is_admin(auth.jwt() ->> 'email'));

drop policy if exists "admin write cards" on public.cards;
create policy "admin write cards" on public.cards
for all
using (public.is_admin(auth.jwt() ->> 'email'))
with check (public.is_admin(auth.jwt() ->> 'email'));

drop policy if exists "admin write knockout_matches" on public.knockout_matches;
create policy "admin write knockout_matches" on public.knockout_matches
for all
using (public.is_admin(auth.jwt() ->> 'email'))
with check (public.is_admin(auth.jwt() ->> 'email'));

drop policy if exists "admin write players" on public.players;
create policy "admin write players" on public.players
for all
using (public.is_admin(auth.jwt() ->> 'email'))
with check (public.is_admin(auth.jwt() ->> 'email'));

drop policy if exists "admin write season_config" on public.season_config;
create policy "admin write season_config" on public.season_config
for all
using (public.is_admin(auth.jwt() ->> 'email'))
with check (public.is_admin(auth.jwt() ->> 'email'));

-- ============================================
-- Match media: today's match images & videos
-- ============================================
create table if not exists public.match_media (
  id text,
  season text not null default '2026',
  media_date date not null,
  media_type text not null check (media_type in ('image', 'video')),
  storage_path text not null unique,
  public_url text,
  description text,
  created_at timestamptz not null default now(),
  primary key (id, season)
);

-- RLS for match_media
alter table public.match_media enable row level security;

drop policy if exists "public read match_media" on public.match_media;
create policy "public read match_media" on public.match_media
for select using (true);

drop policy if exists "admin write match_media" on public.match_media;
create policy "admin write match_media" on public.match_media
for all
using (public.is_media_editor(auth.jwt() ->> 'email'))
with check (public.is_media_editor(auth.jwt() ->> 'email'));

-- ============================================
-- Storage bucket policies for match-media
-- 注意: 需先在 Supabase Dashboard → Storage 中创建名为 "match-media" 的公开 bucket
-- ============================================
-- drop policy if exists "public read match-media" on storage.objects;
-- create policy "public read match-media" on storage.objects
-- for select using (bucket_id = 'match-media');

-- drop policy if exists "admin insert match-media" on storage.objects;
-- create policy "admin insert match-media" on storage.objects
-- for insert with check (bucket_id = 'match-media' and public.is_media_editor(auth.jwt() ->> 'email'));

-- drop policy if exists "admin delete match-media" on storage.objects;
-- create policy "admin delete match-media" on storage.objects
-- for delete using (bucket_id = 'match-media' and public.is_media_editor(auth.jwt() ->> 'email'));

-- ============================================
-- Seed data
-- ============================================
insert into public.admin_users(email, role, is_active)
values ('w2564139064@163.com', 'owner', true)
on conflict (email) do update
set role = excluded.role, is_active = excluded.is_active;

insert into public.season_config (season, group_a_teams, group_b_teams)
values ('2026',
  array['材料','计算机','机自','力工','中欧','延长','悉商'],
  array['未来技术','管外生','文法体','国交','钱院','通济','理学院']
)
on conflict (season) do nothing;
