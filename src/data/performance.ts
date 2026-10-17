// Mock data for the Performance page (from design/Performance.dc.html). Replaced by Supabase queries in Phase 3.

import type { CategoryKey } from './dashboard'

export type Period = 'm1' | 'm3' | 'ytd'

export const periods: { key: Period; label: string }[] = [
  { key: 'm1', label: 'This month' },
  { key: 'm3', label: 'Last 3 months' },
  { key: 'ytd', label: 'Year to date' },
]

/** How the period reads in a sentence: "Finished tasks, this month". */
export const periodPhrase: Record<Period, string> = {
  m1: 'this month',
  m3: 'the last 3 months',
  ytd: 'this year',
}

export type MonthStats = {
  month: string
  /** Tasks finished that month. */
  done: number
  /** Finished on or before the fixed date. */
  onTime: number
  /** Finished on or before the tentative date. */
  tentativeHit: number
  /** Total days late, added up over the tasks that finished late. */
  lateDays: number
  /** Hours you estimated for the tasks finished that month. */
  plannedHours: number
  /** Hours you actually logged on them. */
  loggedHours: number
  /** Finished within 10% of the time estimate. */
  onEstimate: number
  /** Took more than 10% longer than estimated. The rest finished faster than planned. */
  tookLonger: number
}

// January to October 2026. October is the current month.
export const monthlyStats: MonthStats[] = [
  { month: 'Jan', done: 14, onTime: 10, tentativeHit: 8, lateDays: 7, plannedHours: 40, loggedHours: 46, onEstimate: 8, tookLonger: 4 },
  { month: 'Feb', done: 16, onTime: 12, tentativeHit: 10, lateDays: 6, plannedHours: 44, loggedHours: 48, onEstimate: 10, tookLonger: 4 },
  { month: 'Mar', done: 18, onTime: 14, tentativeHit: 11, lateDays: 6, plannedHours: 50, loggedHours: 57, onEstimate: 11, tookLonger: 4 },
  { month: 'Apr', done: 17, onTime: 13, tentativeHit: 10, lateDays: 5, plannedHours: 47, loggedHours: 52, onEstimate: 11, tookLonger: 4 },
  { month: 'May', done: 19, onTime: 15, tentativeHit: 12, lateDays: 7, plannedHours: 52, loggedHours: 58, onEstimate: 13, tookLonger: 4 },
  { month: 'Jun', done: 20, onTime: 16, tentativeHit: 13, lateDays: 6, plannedHours: 54, loggedHours: 59, onEstimate: 14, tookLonger: 5 },
  { month: 'Jul', done: 21, onTime: 17, tentativeHit: 14, lateDays: 5, plannedHours: 57, loggedHours: 62, onEstimate: 15, tookLonger: 4 },
  { month: 'Aug', done: 22, onTime: 19, tentativeHit: 15, lateDays: 4, plannedHours: 60, loggedHours: 65, onEstimate: 16, tookLonger: 4 },
  { month: 'Sep', done: 21, onTime: 19, tentativeHit: 15, lateDays: 3, plannedHours: 55, loggedHours: 58, onEstimate: 16, tookLonger: 3 },
  { month: 'Oct', done: 23, onTime: 20, tentativeHit: 16, lateDays: 4, plannedHours: 56, loggedHours: 62, onEstimate: 19, tookLonger: 3 },
]

export type WeekStats = {
  /** Date the week starts, as shown under the capsules. */
  label: string
  /** Tasks planned for the week (tentative or fixed date inside it; the exact rule is decided in Phase 3). */
  planned: number
  /** Planned tasks that were finished. */
  done: number
}

// The last ten weeks, oldest first. The final week is the current one.
export const weeklyStats: WeekStats[] = [
  { label: '10 Aug', planned: 8, done: 7 },
  { label: '17 Aug', planned: 9, done: 8 },
  { label: '24 Aug', planned: 7, done: 6 },
  { label: '31 Aug', planned: 10, done: 8 },
  { label: '7 Sep', planned: 8, done: 7 },
  { label: '14 Sep', planned: 9, done: 9 },
  { label: '21 Sep', planned: 7, done: 5 },
  { label: '28 Sep', planned: 10, done: 8 },
  { label: '5 Oct', planned: 9, done: 9 },
  { label: '12 Oct', planned: 10, done: 7 },
]

/** First week (index into `weeklyStats`) that falls inside each period; earlier weeks are faded. */
export const firstWeekOfPeriod: Record<Period, number> = { m1: 8, m3: 0, ytd: 0 }

export type CategoryPerformance = {
  category: CategoryKey
  /** Tasks finished this month. */
  done: number
  /** Of those, finished on or before the fixed date. */
  onTime: number
  plannedHours: number
  actualHours: number
}

// This month, by category. The Done column adds up to the 23 tasks on the Dashboard.
export const categoryPerformance: CategoryPerformance[] = [
  { category: 'dev', done: 7, onTime: 6, plannedHours: 18, actualHours: 22 },
  { category: 'clean', done: 6, onTime: 6, plannedHours: 14, actualHours: 12 },
  { category: 'mgmt', done: 4, onTime: 3, plannedHours: 8, actualHours: 8 },
  { category: 'bi', done: 6, onTime: 5, plannedHours: 16, actualHours: 20 },
]

export type LateTask = {
  id: string
  title: string
  category: CategoryKey
  /** Fixed date, already in the short "11 Oct" form. */
  fixed: string
  /** 'overdue' = still open past the fixed date; 'late' = finished after it. */
  kind: 'overdue' | 'late'
  /** Shown on the right, e.g. "Overdue 2 days" or "Done 1 day late". */
  tag: string
}

export const lateTasks: LateTask[] = [
  { id: 'x1', title: 'Review sales dashboard KPIs', category: 'bi', fixed: '11 Oct', kind: 'overdue', tag: 'Overdue 2 days' },
  { id: 'x2', title: 'Branch mapping fix', category: 'dev', fixed: '3 Oct', kind: 'late', tag: 'Done 2 days late' },
  { id: 'x3', title: 'Outlet list cleanup', category: 'mgmt', fixed: '7 Oct', kind: 'late', tag: 'Done 1 day late' },
  { id: 'x4', title: 'Weekly summary export', category: 'clean', fixed: '1 Oct', kind: 'late', tag: 'Done 1 day late' },
]

/** The year the monthly figures belong to. */
export const YEAR = 2026

/** Fixed-deadline target, in percent. */
export const FIXED_TARGET_PERCENT = 90
