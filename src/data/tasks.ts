// Types and names for the Tasks page. The data itself comes from Supabase (see src/lib/tasksApi.ts).
import type { CategoryKey, Mood } from './dashboard'

export type TaskStatus = 'todo' | 'progress' | 'waiting' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export const statusNames: Record<TaskStatus, string> = {
  todo: 'To do',
  progress: 'In progress',
  waiting: 'Waiting',
  done: 'Done',
}

export type Task = {
  id: string
  title: string
  category: CategoryKey
  priority: Priority
  /** ISO dates, YYYY-MM-DD. Tentative can be empty (it is optional); fixed is required. */
  tentative: string
  fixed: string
  status: TaskStatus
  estimateHours: number
  loggedHours: number
  /** ISO date the task was finished, or '' while it is open. */
  completedOn: string
  notes: string
}

/** What the Add task form hands over; the page adds the id, the logged hours and the completed date. */
export type NewTask = Omit<Task, 'id' | 'loggedHours' | 'completedOn'>

/** What the EOD update form hands over; the page adds the id, the date and the task title. */
export type NewEodUpdate = Omit<EodUpdate, 'id' | 'date' | 'title'>

export type EodUpdate = {
  id: string
  /** ISO date */
  date: string
  taskId: string
  title: string
  hours: number
  mood: Mood
  statusAfter: TaskStatus
  comment: string
  next: string
}
