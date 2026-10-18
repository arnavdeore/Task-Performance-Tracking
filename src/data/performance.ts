// Types and names for the Performance page. The figures are worked out from the user's tasks and EOD updates in
// src/lib/performanceData.ts (nothing here is stored separately).

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

/** Everything about the tasks that were finished (marked Done) in one calendar month. */
export type MonthStats = {
  month: string
  /** Tasks finished that month. */
  done: number
  /** Finished on or before the fixed date. */
  onTime: number
  /** Finished on or before the tentative date (the fixed date when a task has no tentative date). */
  tentativeHit: number
  /** Total days late, added up over the tasks that finished late. */
  lateDays: number
  /** Finished tasks that have both a time estimate and logged hours. Only these can be compared on time. */
  estimated: number
  /** Hours estimated and hours logged, over those tasks. */
  plannedHours: number
  loggedHours: number
  /** Of those tasks: finished within 10% of the estimate. */
  onEstimate: number
  /** Of those tasks: took more than 10% longer than estimated. The rest finished faster than planned. */
  tookLonger: number
}

export type WeekStats = {
  /** Date the week starts (a Monday), as shown under the capsules. */
  label: string
  /** Tasks whose fixed date falls in the week. */
  planned: number
  /** Of those, how many are done. */
  done: number
}

export type CategoryPerformance = {
  category: CategoryKey
  /** Tasks finished this month. */
  done: number
  /** Of those, finished on or before the fixed date. */
  onTime: number
  /** Estimated and logged hours of the finished tasks that have both. */
  plannedHours: number
  actualHours: number
}

export type LateTask = {
  id: string
  title: string
  category: CategoryKey
  /** Fixed date, already in the short "11 Oct" form. */
  fixed: string
  /** Shown on the right, e.g. "Done 1 day late". */
  tag: string
}

/** Fixed-deadline target, in percent. A setting in the database comes later (user_settings.fixed_target_percent). */
export const FIXED_TARGET_PERCENT = 90
