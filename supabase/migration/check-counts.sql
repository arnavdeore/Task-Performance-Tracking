-- Run this in BOTH projects (old first, then new) and compare the numbers. They must match exactly.
select
  (select count(*) from public.tasks)                             as tasks,
  (select count(*) from public.tasks where status = 'done')       as done_tasks,
  (select count(*) from public.eod_updates)                       as eod_updates,
  (select coalesce(sum(hours), 0) from public.eod_updates)        as total_hours,
  (select count(*) from public.user_settings)                     as user_settings;
