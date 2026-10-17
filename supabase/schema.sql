-- Slate database schema (Phase 3, design approved by Arnav).
--
-- Run this ONCE in the Supabase dashboard: SQL Editor > New query > paste all > Run.
-- It creates three tables, locks every row to its owner (Row Level Security) and adds a few safety rules.
--
-- Decisions behind it:
--   * Only facts are stored (tasks, EOD updates, settings). Every tile, ring, chart and late list is calculated by the app.
--   * Categories are a fixed list of four (a check rule, not a table).
--   * Logged hours are NOT stored on the task; the app adds up eod_updates.hours per task.
--   * Deleting a task deletes its EOD updates too (the app has no delete button yet).
--   * Dates are plain `date` values. The app sends today's date from the device, because the database's own
--     "today" is UTC and would give the wrong day for an evening update in India.
--   * Holidays and Hindu festivals stay in src/lib/holidays.js, not in the database.

-- ---------------------------------------------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------------------------------------------

create table public.tasks (
  id             uuid primary key default gen_random_uuid(),
  -- Who owns the row. Filled in automatically from the signed-in user; the security rules below depend on it.
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title          text not null check (char_length(btrim(title)) between 1 and 120),
  category       text not null check (category in ('dev', 'clean', 'mgmt', 'bi')),
  priority       text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status         text not null default 'todo' check (status in ('todo', 'progress', 'waiting', 'done')),
  -- Tentative = your own target (optional, can move). Fixed = the commitment (required).
  tentative_date date,
  fixed_date     date not null,
  estimate_hours numeric(5, 2) not null default 0 check (estimate_hours >= 0 and estimate_hours <= 999),
  -- Empty until the task is Done.
  completed_on   date,
  notes          text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  -- The tentative date is never after the fixed date.
  constraint tasks_tentative_before_fixed check (tentative_date is null or tentative_date <= fixed_date),
  -- completed_on is set exactly when the status is Done.
  constraint tasks_done_has_completed_on check ((status = 'done') = (completed_on is not null))
);

create table public.eod_updates (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  task_id     uuid not null references public.tasks (id) on delete cascade,
  -- No default on purpose: the app sends the date from the device (see the note at the top).
  entry_date  date not null,
  hours       numeric(4, 2) not null default 0 check (hours >= 0 and hours <= 24),
  mood        text not null check (mood in ('On track', 'At risk', 'Blocked')),
  status_after text not null check (status_after in ('todo', 'progress', 'waiting', 'done')),
  comment     text not null default '',
  next_step   text not null default '',
  created_at  timestamptz not null default now()
);

-- One row per user: name shown in the app and the on-time target used by the Performance page.
create table public.user_settings (
  user_id              uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  display_name         text not null default 'Arnav' check (char_length(btrim(display_name)) between 1 and 60),
  job_title            text not null default 'Data analyst' check (char_length(job_title) <= 80),
  fixed_target_percent integer not null default 90 check (fixed_target_percent between 1 and 100),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ---------------------------------------------------------------------------------------------------------------
-- Indexes (the screens filter by owner plus status, fixed date or entry date)
-- ---------------------------------------------------------------------------------------------------------------

create index tasks_user_status_idx   on public.tasks (user_id, status);
create index tasks_user_fixed_idx    on public.tasks (user_id, fixed_date);
create index eod_user_date_idx       on public.eod_updates (user_id, entry_date desc);
create index eod_task_idx            on public.eod_updates (task_id);

-- ---------------------------------------------------------------------------------------------------------------
-- Keep updated_at honest
-- ---------------------------------------------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

create trigger user_settings_set_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------------------------------------------
-- A settings row is created automatically for every new user (you, when you add your login).
-- ---------------------------------------------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------------------------------------------
-- Row Level Security: the site is public, so every table is locked to its owner.
-- Signed-in users can touch only rows where user_id is their own ID. Anyone not signed in gets nothing.
-- ---------------------------------------------------------------------------------------------------------------

alter table public.tasks         enable row level security;
alter table public.eod_updates   enable row level security;
alter table public.user_settings enable row level security;

-- Belt and braces: the signed-out ("anon") role gets no table access at all.
revoke all on public.tasks, public.eod_updates, public.user_settings from anon;

-- The signed-in ("authenticated") role needs explicit table access for the Data API; the policies below then limit it to own rows.
-- user_settings gets no insert or delete: its row is created by the trigger and removed together with the user.
grant select, insert, update, delete on public.tasks, public.eod_updates to authenticated;
grant select, update on public.user_settings to authenticated;

-- handle_new_user is a trigger helper and must not be callable as an API function by anyone.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- tasks
create policy "tasks: read own"   on public.tasks for select to authenticated using (user_id = (select auth.uid()));
create policy "tasks: add own"    on public.tasks for insert to authenticated with check (user_id = (select auth.uid()));
create policy "tasks: change own" on public.tasks for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "tasks: delete own" on public.tasks for delete to authenticated using (user_id = (select auth.uid()));

-- eod_updates: an update can only point at one of your own tasks.
create policy "eod: read own" on public.eod_updates for select to authenticated using (user_id = (select auth.uid()));
create policy "eod: add own"  on public.eod_updates for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.tasks t where t.id = task_id and t.user_id = (select auth.uid()))
  );
create policy "eod: change own" on public.eod_updates for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.tasks t where t.id = task_id and t.user_id = (select auth.uid()))
  );
create policy "eod: delete own" on public.eod_updates for delete to authenticated using (user_id = (select auth.uid()));

-- user_settings: read and change only (the row is created by the trigger above, and goes when the user goes).
create policy "settings: read own"   on public.user_settings for select to authenticated using (user_id = (select auth.uid()));
create policy "settings: change own" on public.user_settings for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
