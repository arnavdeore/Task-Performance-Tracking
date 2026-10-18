import { useCallback, useEffect, useState } from 'react'
import type { EodUpdate, Task } from '../data/tasks'
import { errorMessage, loadTasksAndLog } from './tasksApi'

export type LoadState = 'loading' | 'ready' | 'error'

/**
 * Loads the signed-in user's tasks and EOD updates from Supabase when a page opens. The Dashboard and the Tasks page both use
 * this, so they read the same data the same way.
 *
 * `reload(false)` shows the loading state again (the "Try again" button). `reload(true)` refreshes quietly behind a screen that
 * is already showing data; it never replaces that screen, and resolves to an error message (or null) so the caller can toast it.
 */
export function useTasksData() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [eodLog, setEodLog] = useState<EodUpdate[]>([])
  const [load, setLoad] = useState<LoadState>('loading')
  const [loadError, setLoadError] = useState('')

  const reload = useCallback(async (background: boolean): Promise<string | null> => {
    if (!background) setLoad('loading')
    try {
      const data = await loadTasksAndLog()
      setTasks(data.tasks)
      setEodLog(data.log)
      setLoad('ready')
      return null
    } catch (error) {
      const message = errorMessage(error)
      if (!background) {
        setLoadError(message)
        setLoad('error')
      }
      return message
    }
  }, [])

  // First load when the page opens (the state already starts as 'loading'). Ignored if the page is left before it finishes.
  useEffect(() => {
    let active = true
    loadTasksAndLog()
      .then((data) => {
        if (!active) return
        setTasks(data.tasks)
        setEodLog(data.log)
        setLoad('ready')
      })
      .catch((error: unknown) => {
        if (!active) return
        setLoadError(errorMessage(error))
        setLoad('error')
      })
    return () => {
      active = false
    }
  }, [])

  return { tasks, setTasks, eodLog, load, loadError, reload }
}
