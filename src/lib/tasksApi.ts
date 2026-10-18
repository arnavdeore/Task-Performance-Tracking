import type { CategoryKey, Mood } from '../data/dashboard'
import type { EodUpdate, NewEodUpdate, NewTask, Priority, Task, TaskEdits, TaskStatus } from '../data/tasks'
import { supabase } from './supabase'

/*
 * Every Supabase call for the Tasks page lives here. The database stores facts (see supabase/schema.sql):
 *  - a task has no "logged hours"; they are the sum of that task's EOD updates, worked out in `loadTasksAndLog`;
 *  - an empty tentative or completed date is NULL in the database and '' in the app;
 *  - an EOD update has no title; it is taken from the task.
 * Row Level Security limits every query to the signed-in user, and `user_id` fills itself in.
 */

type TaskRow = {
  id: string
  title: string
  category: CategoryKey
  priority: Priority
  status: TaskStatus
  tentative_date: string | null
  fixed_date: string
  estimate_hours: number | string
  completed_on: string | null
  notes: string
}

type EodRow = {
  id: string
  task_id: string
  entry_date: string
  hours: number | string
  mood: Mood
  status_after: TaskStatus
  comment: string
  next_step: string
}

/** A message that is safe to show for any caught error. */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Try again.'
}

/** What the screens need to know about a failed request, in words that are safe to show. */
function failure(error: { code?: string; message?: string; status?: number }): Error {
  if (error.code === '42501' || error.code === 'PGRST301' || error.status === 401) {
    return new Error('You were signed out. Sign in again and retry.')
  }
  if (error.code === '23514' || error.code === '22003') {
    return new Error('One of the values is not allowed (for example hours outside 0 to 24). Check the form and retry.')
  }
  if (/fetch|network|timeout/i.test(error.message ?? '')) {
    return new Error('Could not reach the server. Check your internet connection and try again.')
  }
  return new Error('Could not save that. Try again in a moment.')
}

function toTask(row: TaskRow, loggedHours: number): Task {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    priority: row.priority,
    tentative: row.tentative_date ?? '',
    fixed: row.fixed_date,
    status: row.status,
    estimateHours: Number(row.estimate_hours),
    loggedHours: Math.round(loggedHours * 100) / 100,
    completedOn: row.completed_on ?? '',
    notes: row.notes,
  }
}

/** Open tasks by fixed date (most urgent first); finished tasks after them, newest first. Same order as a reload gives. */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aDone = a.status === 'done'
    const bDone = b.status === 'done'
    if (aDone !== bDone) return aDone ? 1 : -1
    if (aDone) return b.completedOn.localeCompare(a.completedOn)
    return a.fixed.localeCompare(b.fixed) || a.title.localeCompare(b.title)
  })
}

/** Loads all of the user's tasks and EOD updates (newest first), with each task's logged hours added up. */
export async function loadTasksAndLog(): Promise<{ tasks: Task[]; log: EodUpdate[] }> {
  const [taskResult, eodResult] = await Promise.all([
    supabase.from('tasks').select('*'),
    supabase
      .from('eod_updates')
      .select('*')
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false }),
  ])
  if (taskResult.error) throw failure(taskResult.error)
  if (eodResult.error) throw failure(eodResult.error)

  const taskRows = (taskResult.data ?? []) as TaskRow[]
  const eodRows = (eodResult.data ?? []) as EodRow[]

  const hoursByTask = new Map<string, number>()
  for (const row of eodRows) hoursByTask.set(row.task_id, (hoursByTask.get(row.task_id) ?? 0) + Number(row.hours))

  const tasks = sortTasks(taskRows.map((row) => toTask(row, hoursByTask.get(row.id) ?? 0)))
  const titles = new Map(tasks.map((task) => [task.id, task.title]))
  const log: EodUpdate[] = eodRows.map((row) => ({
    id: row.id,
    date: row.entry_date,
    taskId: row.task_id,
    title: titles.get(row.task_id) ?? 'Deleted task',
    hours: Number(row.hours),
    mood: row.mood,
    statusAfter: row.status_after,
    comment: row.comment,
    next: row.next_step,
  }))
  return { tasks, log }
}

/** Adds a task and returns it as saved. `today` stamps the completed date when the task is added already Done. */
export async function insertTask(newTask: NewTask, today: string): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      status: newTask.status,
      tentative_date: newTask.tentative || null,
      fixed_date: newTask.fixed,
      estimate_hours: newTask.estimateHours,
      completed_on: newTask.status === 'done' ? today : null,
      notes: newTask.notes,
    })
    .select()
    .single()
  if (error) throw failure(error)
  return toTask(data as TaskRow, 0)
}

/**
 * Changes a task's details and status. `completedOn` is the date the task was finished, or '' when the new status is not Done
 * (the database requires a completed date exactly when the status is Done).
 */
export async function updateTask(id: string, edits: TaskEdits, completedOn: string): Promise<void> {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      status: edits.status,
      completed_on: completedOn || null,
      title: edits.title,
      category: edits.category,
      priority: edits.priority,
      tentative_date: edits.tentative || null,
      fixed_date: edits.fixed,
      estimate_hours: edits.estimateHours,
      notes: edits.notes,
    })
    .eq('id', id)
    .select('id')
  if (error) throw failure(error)
  if (!data || data.length === 0) throw new Error('That task could not be found. Reload the page.')
}

/** Deletes a task. Its EOD updates are deleted with it (the database does this, see supabase/schema.sql). */
export async function deleteTask(id: string): Promise<void> {
  const { data, error } = await supabase.from('tasks').delete().eq('id', id).select('id')
  if (error) throw failure(error)
  if (!data || data.length === 0) throw new Error('That task could not be found. Reload the page.')
}

/** Moves a task to another status. Done stamps today's date as completed; any other status clears it. */
export async function setTaskStatus(id: string, status: TaskStatus, today: string): Promise<void> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status, completed_on: status === 'done' ? today : null })
    .eq('id', id)
    .select('id')
  if (error) throw failure(error)
  // Row Level Security answers "0 rows" (not an error) when a row is not yours or no longer exists.
  if (!data || data.length === 0) throw new Error('That task could not be found. Reload the page.')
}

/**
 * Saves an end-of-day update: adds the log entry, then sets the task's status and note to match.
 * Two requests (the entry first). Resolves to 'saved', or to 'logged-only' when the entry was saved but the task could not be
 * changed (the hours still count). Throws when nothing was saved.
 */
export async function saveEodUpdate(update: NewEodUpdate, today: string): Promise<'saved' | 'logged-only'> {
  const { error: logError } = await supabase.from('eod_updates').insert({
    task_id: update.taskId,
    entry_date: today,
    hours: update.hours,
    mood: update.mood,
    status_after: update.statusAfter,
    comment: update.comment,
    next_step: update.next,
  })
  if (logError) throw failure(logError)

  const { error: taskError } = await supabase
    .from('tasks')
    .update({
      status: update.statusAfter,
      completed_on: update.statusAfter === 'done' ? today : null,
      notes: `EOD: ${update.comment}`,
    })
    .eq('id', update.taskId)
  return taskError ? 'logged-only' : 'saved'
}
