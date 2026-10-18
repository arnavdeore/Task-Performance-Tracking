-- ONE-OFF MIGRATION, step 1 of 2. Run this in the OLD Supabase project (SQL Editor > New query).
--
-- Before you run it, replace 4e088a49-05ea-4f7b-919a-71c96100ca62 (line 8) with the User UID of your login in the NEW project
-- (new project > Authentication > Users > click your user > "User UID"). Keep the quotes.
--
-- It does not change anything. It only builds ONE cell of text: ready-made INSERT statements for every task and
-- EOD update, plus your settings, with every row re-assigned to your new login. Copy that cell and run it in the
-- NEW project. Delete this folder when the move is finished.

with p(new_id) as (values ('4e088a49-05ea-4f7b-919a-71c96100ca62'::uuid)),

t as (
  select string_agg(
    format(
      'insert into public.tasks (id, user_id, title, category, priority, status, tentative_date, fixed_date, estimate_hours, completed_on, notes, created_at, updated_at) values (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L, %L);',
      x.id, p.new_id, x.title, x.category, x.priority, x.status, x.tentative_date, x.fixed_date,
      x.estimate_hours, x.completed_on, x.notes, x.created_at, x.updated_at
    ),
    E'\n' order by x.created_at
  ) as sql
  from public.tasks x cross join p
),

e as (
  select string_agg(
    format(
      'insert into public.eod_updates (id, user_id, task_id, entry_date, hours, mood, status_after, comment, next_step, created_at) values (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L);',
      x.id, p.new_id, x.task_id, x.entry_date, x.hours, x.mood, x.status_after, x.comment, x.next_step, x.created_at
    ),
    E'\n' order by x.created_at
  ) as sql
  from public.eod_updates x cross join p
),

s as (
  -- The new project already created your settings row when you added your login, so this UPDATES it.
  select string_agg(
    format(
      'update public.user_settings set display_name = %L, job_title = %L, fixed_target_percent = %L where user_id = %L;',
      x.display_name, x.job_title, x.fixed_target_percent, p.new_id
    ),
    E'\n'
  ) as sql
  from (select * from public.user_settings order by created_at limit 1) x cross join p
)

select
  'begin;' || E'\n' ||
  coalesce(t.sql, '') || E'\n' ||
  coalesce(e.sql, '') || E'\n' ||
  coalesce(s.sql, '') || E'\n' ||
  'commit;' as copy_this_cell
from t, e, s;
