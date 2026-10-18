import type { EodUpdate, Task } from '../data/tasks'

/*
 * A copy of the user's last-loaded tasks and EOD updates, kept in this browser (localStorage) so the pages can show something at
 * once on a refresh while the fresh data is still on its way from Supabase. It is private data, so:
 *  - it is stored per user id and wiped on sign-out (see AuthProvider);
 *  - it is only ever used to paint the screen first; the real data always replaces it a moment later;
 *  - anything unreadable or in the wrong shape is ignored, and every call is wrapped so private windows or blocked storage
 *    just mean "no saved copy", never an error.
 */

const PREFIX = 'slate:data:'
const VERSION = 1

export type CachedData = { tasks: Task[]; log: EodUpdate[] }

function looksLikeTask(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.fixed === 'string' &&
    typeof task.status === 'string' &&
    typeof task.estimateHours === 'number' &&
    typeof task.loggedHours === 'number'
  )
}

function looksLikeUpdate(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  return typeof entry.id === 'string' && typeof entry.date === 'string' && typeof entry.hours === 'number'
}

/** The saved copy for this user, or null when there is none (or it cannot be trusted). */
export function readCache(userId: string): CachedData | null {
  try {
    const raw = localStorage.getItem(PREFIX + userId)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const { version, tasks, log } = parsed as { version?: unknown; tasks?: unknown; log?: unknown }
    if (version !== VERSION || !Array.isArray(tasks) || !Array.isArray(log)) return null
    if (!tasks.every(looksLikeTask) || !log.every(looksLikeUpdate)) return null
    return { tasks: tasks as Task[], log: log as EodUpdate[] }
  } catch {
    return null
  }
}

export function writeCache(userId: string, data: CachedData): void {
  try {
    localStorage.setItem(PREFIX + userId, JSON.stringify({ version: VERSION, ...data }))
  } catch {
    // Storage full or blocked: the app simply loads without a saved copy next time.
  }
}

/** Removes every saved copy (all users). Called on sign-out. */
export function clearCache(): void {
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(PREFIX)) localStorage.removeItem(key)
    }
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
