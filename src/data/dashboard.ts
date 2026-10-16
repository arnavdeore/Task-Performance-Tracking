// Mock data for the Dashboard (from design/Main.dc.html). Replaced by Supabase queries in Phase 3.

export type Tone = 'blue' | 'green' | 'red'

export type StatTileData = {
  label: string
  value: string
  sub: string
  tone: Tone
  to: string
}

export const statTiles: StatTileData[] = [
  { label: 'Open tasks', value: '9', sub: '5 due this week', tone: 'blue', to: '/tasks' },
  { label: 'Done this month', value: '23', sub: '4 more than September', tone: 'green', to: '/performance' },
  { label: 'On time, fixed dates', value: '87%', sub: 'Target 90%', tone: 'green', to: '/performance' },
  { label: 'Overdue', value: '1', sub: 'Oldest 2 days late', tone: 'red', to: '/tasks' },
]

// ---- Today's tasks ----

export type CategoryKey = 'dev' | 'clean' | 'mgmt' | 'bi'

export const categoryNames: Record<CategoryKey, string> = {
  dev: 'Development',
  clean: 'Data Cleaning',
  mgmt: 'Data Management',
  bi: 'Power BI',
}

export type TodayTask = {
  id: string
  title: string
  priority: string
  category: CategoryKey
  /** Tentative deadline, already in the short "13 Oct" form. */
  tentative: string
  /** Fixed deadline, already in the short "15 Oct" form. */
  fixed: string
  estimateHours: number
  loggedHours: number
}

export const todayTasks: TodayTask[] = [
  {
    id: 't1',
    title: 'Review sales dashboard KPIs',
    priority: 'High priority',
    category: 'bi',
    tentative: '10 Oct',
    fixed: '11 Oct',
    estimateHours: 3,
    loggedHours: 2,
  },
  {
    id: 't2',
    title: 'Fix sync script bug',
    priority: 'High priority',
    category: 'dev',
    tentative: '13 Oct',
    fixed: '15 Oct',
    estimateHours: 3,
    loggedHours: 2,
  },
  {
    id: 't3',
    title: 'Clean customer export file',
    priority: 'Medium priority',
    category: 'clean',
    tentative: '14 Oct',
    fixed: '16 Oct',
    estimateHours: 4,
    loggedHours: 1.5,
  },
]

// ---- Performance card (this month) ----

export type PerformanceSummary = {
  /** Percent of fixed deadlines met. */
  fixedMetPercent: number
  /** Percent of tentative dates hit. */
  tentativeHitPercent: number
  /** How close the time estimates were to the time actually logged, in percent. */
  estimateAccuracyPercent: number
  /** Average days late, across tasks that finished late. */
  averageDelayDays: number
}

export const performanceSummary: PerformanceSummary = {
  fixedMetPercent: 87,
  tentativeHitPercent: 70,
  estimateAccuracyPercent: 82,
  averageDelayDays: 1.3,
}

// ---- Deadline watch ----

export type DeadlineStatus = 'todo' | 'progress' | 'overdue'

export type DeadlineRow = {
  id: string
  title: string
  category: CategoryKey
  tentative: string
  fixed: string
  status: DeadlineStatus
  /** Fixed date has passed. */
  overdue: boolean
  /** Fixed date falls in the next 7 days (an overdue task counts too when the "Next 7 days" filter is on). */
  dueSoon: boolean
}

export const deadlineRows: DeadlineRow[] = [
  { id: 'd1', title: 'Review sales dashboard KPIs', category: 'bi', tentative: '10 Oct', fixed: '11 Oct', status: 'overdue', overdue: true, dueSoon: false },
  { id: 'd2', title: 'Fix sync script bug', category: 'dev', tentative: '13 Oct', fixed: '15 Oct', status: 'progress', overdue: false, dueSoon: true },
  { id: 'd3', title: 'Clean customer export file', category: 'clean', tentative: '14 Oct', fixed: '16 Oct', status: 'progress', overdue: false, dueSoon: true },
  { id: 'd4', title: 'Refresh monthly report', category: 'bi', tentative: '15 Oct', fixed: '17 Oct', status: 'todo', overdue: false, dueSoon: true },
  { id: 'd5', title: 'Update master data tracker', category: 'mgmt', tentative: '18 Oct', fixed: '20 Oct', status: 'todo', overdue: false, dueSoon: false },
]

// ---- Month calendar ----

export type CalendarDeadline = {
  title: string
  /** ISO dates, YYYY-MM-DD */
  tentative: string
  fixed: string
}

export const calendarDeadlines: CalendarDeadline[] = [
  { title: 'Review sales dashboard KPIs', tentative: '2026-10-10', fixed: '2026-10-11' },
  { title: 'Fix sync script bug', tentative: '2026-10-13', fixed: '2026-10-15' },
  { title: 'Clean customer export file', tentative: '2026-10-14', fixed: '2026-10-16' },
  { title: 'Refresh monthly report', tentative: '2026-10-15', fixed: '2026-10-17' },
  { title: 'Update master data tracker', tentative: '2026-10-18', fixed: '2026-10-20' },
  { title: 'Quarter close data pack', tentative: '2026-10-26', fixed: '2026-10-30' },
  { title: 'Branch mapping refresh', tentative: '2026-11-03', fixed: '2026-11-05' },
]
