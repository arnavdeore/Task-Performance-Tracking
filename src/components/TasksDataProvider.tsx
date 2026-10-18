import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { EodUpdate, Task } from '../data/tasks'
import { readCache, writeCache } from '../lib/taskCache'
import { errorMessage, loadTasksAndLog } from '../lib/tasksApi'
import { TasksDataContext } from '../lib/tasksDataContext'
import type { LoadState, TasksData } from '../lib/tasksDataContext'

// Coming back to the tab refreshes the data, but not more than once a minute.
const REFRESH_AFTER_MS = 60_000

/**
 * Loads the signed-in user's tasks and EOD updates ONCE and shares them with every page, so moving between pages needs no new
 * request. On a refresh it first paints the saved copy from this device (see taskCache.ts), then replaces it with fresh data from
 * Supabase a moment later. Mounted inside RequireAuth, so it only exists while someone is signed in.
 */
export default function TasksDataProvider({ userId, children }: { userId: string; children: ReactNode }) {
  // Read the saved copy once, before the first paint.
  const [saved] = useState(() => readCache(userId))
  const [tasks, setTasksState] = useState<Task[]>(saved?.tasks ?? [])
  const [eodLog, setEodLog] = useState<EodUpdate[]>(saved?.log ?? [])
  const [load, setLoad] = useState<LoadState>(saved ? 'ready' : 'loading')
  const [loadError, setLoadError] = useState('')
  const [refreshError, setRefreshError] = useState('')
  const lastFetch = useRef(0)
  // Counts the edits pages make to the task list (a card moved, a task added). A refresh that was already on its way when
  // an edit happened carries older data, so its result is dropped instead of undoing the edit on screen.
  const edits = useRef(0)

  const setTasks = useCallback<TasksData['setTasks']>((update) => {
    edits.current += 1
    setTasksState(update)
  }, [])

  const reload = useCallback(async (background: boolean): Promise<string | null> => {
    if (!background) setLoad('loading')
    const startedAt = edits.current
    try {
      const data = await loadTasksAndLog()
      if (edits.current === startedAt) {
        setTasksState(data.tasks)
        setEodLog(data.log)
      }
      lastFetch.current = Date.now()
      setLoad('ready')
      setRefreshError('')
      return null
    } catch (error) {
      const message = errorMessage(error)
      if (background) {
        setRefreshError(message)
      } else {
        setLoadError(message)
        setLoad('error')
      }
      return message
    }
  }, [])

  // First load when the app opens. With a saved copy the screen is already showing, so a failure only sets the notice.
  useEffect(() => {
    let active = true
    const startedAt = edits.current
    loadTasksAndLog()
      .then((data) => {
        if (!active) return
        if (edits.current === startedAt) {
          setTasksState(data.tasks)
          setEodLog(data.log)
        }
        lastFetch.current = Date.now()
        setLoad('ready')
        setRefreshError('')
      })
      .catch((error: unknown) => {
        if (!active) return
        const message = errorMessage(error)
        if (saved) {
          setRefreshError(message)
        } else {
          setLoadError(message)
          setLoad('error')
        }
      })
    return () => {
      active = false
    }
  }, [saved])

  // Coming back to the tab after a while: refresh quietly, in case the data changed on another device.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible' && Date.now() - lastFetch.current > REFRESH_AFTER_MS) {
        void reload(true)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [reload])

  // Keep the saved copy up to date (after loads, saves and optimistic moves).
  useEffect(() => {
    if (load === 'ready') writeCache(userId, { tasks, log: eodLog })
  }, [userId, load, tasks, eodLog])

  const value = useMemo<TasksData>(
    () => ({ tasks, setTasks, eodLog, load, loadError, refreshError, reload }),
    [tasks, setTasks, eodLog, load, loadError, refreshError, reload],
  )

  return <TasksDataContext.Provider value={value}>{children}</TasksDataContext.Provider>
}
