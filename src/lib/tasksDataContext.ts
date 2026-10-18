import { createContext, useContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { EodUpdate, Task } from '../data/tasks'

export type LoadState = 'loading' | 'ready' | 'error'

export type TasksData = {
  tasks: Task[]
  setTasks: Dispatch<SetStateAction<Task[]>>
  eodLog: EodUpdate[]
  /** 'ready' as soon as there is anything to show (a saved copy counts); 'error' only when nothing could be loaded at all. */
  load: LoadState
  /** Why nothing could be loaded (only meaningful when `load` is 'error'). */
  loadError: string
  /** Set when the screen is showing a saved copy because the latest refresh failed; empty otherwise. */
  refreshError: string
  /**
   * `reload(false)` shows the loading state again (the "Try again" button on a screen with nothing to show).
   * `reload(true)` refreshes quietly behind data that is already on screen. Both resolve to an error message, or null on success.
   */
  reload: (background: boolean) => Promise<string | null>
}

export const TasksDataContext = createContext<TasksData | null>(null)

/** The signed-in user's tasks and EOD updates, shared by every page. Must be used under `TasksDataProvider`. */
export function useTasksData(): TasksData {
  const value = useContext(TasksDataContext)
  if (!value) throw new Error('useTasksData must be used inside TasksDataProvider')
  return value
}
