// Mock data for the Tasks page (from design/Tasks.dc.html). Replaced by Supabase queries in Phase 3.
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

/** The design pretends it is 13 Oct 2026. Phase 3 uses the real date. */
export const MOCK_TODAY = '2026-10-13'

export const initialTasks: Task[] = [
  { id: 'c1', title: 'Refresh monthly report', category: 'bi', priority: 'medium', tentative: '2026-10-15', fixed: '2026-10-17', status: 'todo', estimateHours: 2, loggedHours: 0, completedOn: '', notes: '' },
  { id: 'c2', title: 'Validate branch codes list', category: 'clean', priority: 'low', tentative: '2026-10-19', fixed: '2026-10-22', status: 'todo', estimateHours: 1.5, loggedHours: 0, completedOn: '', notes: '' },
  { id: 'c3', title: 'Update master data tracker', category: 'mgmt', priority: 'medium', tentative: '2026-10-18', fixed: '2026-10-20', status: 'todo', estimateHours: 3, loggedHours: 0, completedOn: '', notes: '' },
  { id: 'c4', title: 'Document ETL steps', category: 'dev', priority: 'low', tentative: '2026-10-21', fixed: '2026-10-24', status: 'todo', estimateHours: 4, loggedHours: 0, completedOn: '', notes: '' },
  { id: 'c5', title: 'Review sales dashboard KPIs', category: 'bi', priority: 'high', tentative: '2026-10-10', fixed: '2026-10-11', status: 'progress', estimateHours: 3, loggedHours: 2, completedOn: '', notes: '' },
  { id: 'c6', title: 'Fix sync script bug', category: 'dev', priority: 'high', tentative: '2026-10-13', fixed: '2026-10-15', status: 'progress', estimateHours: 3, loggedHours: 2, completedOn: '', notes: 'EOD: Reproduced the bug. The date parser fails on blank rows in the export.' },
  { id: 'c7', title: 'Clean customer export file', category: 'clean', priority: 'medium', tentative: '2026-10-14', fixed: '2026-10-16', status: 'progress', estimateHours: 4, loggedHours: 1.5, completedOn: '', notes: 'EOD: Removed duplicates. Three columns still need mapping from the old template.' },
  { id: 'c8', title: 'Dashboard sign-off from manager', category: 'bi', priority: 'medium', tentative: '2026-10-14', fixed: '2026-10-16', status: 'waiting', estimateHours: 0.5, loggedHours: 0, completedOn: '', notes: 'Waiting on approval' },
  { id: 'c9', title: 'Data access request', category: 'mgmt', priority: 'low', tentative: '2026-10-15', fixed: '2026-10-17', status: 'waiting', estimateHours: 0.5, loggedHours: 0, completedOn: '', notes: 'Waiting on IT' },
  { id: 'c10', title: 'Weekly sales merge', category: 'clean', priority: 'medium', tentative: '2026-10-08', fixed: '2026-10-09', status: 'done', estimateHours: 2, loggedHours: 2, completedOn: '2026-10-08', notes: '' },
  { id: 'c11', title: 'Fix date filter bug', category: 'dev', priority: 'medium', tentative: '2026-10-09', fixed: '2026-10-10', status: 'done', estimateHours: 2, loggedHours: 2, completedOn: '2026-10-09', notes: '' },
  { id: 'c12', title: 'Outlet list cleanup', category: 'mgmt', priority: 'low', tentative: '2026-10-06', fixed: '2026-10-07', status: 'done', estimateHours: 1.5, loggedHours: 1.5, completedOn: '2026-10-08', notes: '' },
]

export const initialEodLog: EodUpdate[] = [
  { id: 'l1', date: '2026-10-12', taskId: 'c6', title: 'Fix sync script bug', hours: 2, mood: 'On track', statusAfter: 'progress', comment: 'Reproduced the bug. The date parser fails on blank rows in the export.', next: 'Patch the parser and rerun the sample file.' },
  { id: 'l2', date: '2026-10-12', taskId: 'c7', title: 'Clean customer export file', hours: 1.5, mood: 'At risk', statusAfter: 'progress', comment: 'Removed duplicates. Three columns still need mapping from the old template.', next: 'Get the column mapping confirmed.' },
]
