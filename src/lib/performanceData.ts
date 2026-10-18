import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import type { CategoryPerformance, LateTask, MonthStats, Period, WeekStats } from '../data/performance'
import type { Task } from '../data/tasks'
import { daysBetween, formatIso, mondayIndex, todayIso } from './dates'

/*
 * Everything the Performance page shows is worked out here from the user's tasks (whose `loggedHours` already add up their EOD
 * updates). `today` is an ISO date (YYYY-MM-DD) from the device. All of this is plain maths, so it can be tested on its own in
 * Phase 4. The rules:
 *  - A task counts in the month it was marked Done (`completedOn`).
 *  - On time = finished on or before its fixed date. Tentative hit = finished on or before its tentative date, or its fixed
 *    date when it has none (so a hit is never worse than being on time).
 *  - Estimates: only finished tasks with BOTH an estimate and logged hours are compared. Within 10% of the estimate is "about
 *    right", more than 10% over is "took longer", the rest are "faster".
 */

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const ESTIMATE_TOLERANCE = 0.1
const WEEKS_SHOWN = 10

const pad = (value: number) => String(value).padStart(2, '0')
const round1 = (value: number) => Math.round(value * 10) / 10

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

function comparable(task: Task): boolean {
  return task.estimateHours > 0 && task.loggedHours > 0
}

/** Tasks marked Done in the month with this key ("2026-10"). */
function finishedIn(tasks: Task[], monthKey: string): Task[] {
  return tasks.filter((task) => task.status === 'done' && task.completedOn.startsWith(monthKey))
}

function monthStats(finished: Task[], name: string): MonthStats {
  const late = finished.filter((task) => task.completedOn > task.fixed)
  const timed = finished.filter(comparable)
  return {
    month: name,
    done: finished.length,
    onTime: finished.length - late.length,
    tentativeHit: finished.filter((task) => task.completedOn <= (task.tentative || task.fixed)).length,
    lateDays: late.reduce((sum, task) => sum + daysBetween(task.fixed, task.completedOn), 0),
    estimated: timed.length,
    plannedHours: round1(timed.reduce((sum, task) => sum + task.estimateHours, 0)),
    loggedHours: round1(timed.reduce((sum, task) => sum + task.loggedHours, 0)),
    onEstimate: timed.filter((task) => Math.abs(task.loggedHours - task.estimateHours) <= task.estimateHours * ESTIMATE_TOLERANCE).length,
    tookLonger: timed.filter((task) => task.loggedHours > task.estimateHours * (1 + ESTIMATE_TOLERANCE)).length,
  }
}

/**
 * One entry per month of this year, from the first month that has a finished task up to the current month (so a new user
 * does not see nine empty months). The last entry is always the current month.
 */
export function buildMonthlyStats(tasks: Task[], today: string): { year: number; months: MonthStats[] } {
  const year = Number(today.slice(0, 4))
  const currentMonth = Number(today.slice(5, 7)) - 1
  let first = currentMonth
  for (const task of tasks) {
    if (task.status === 'done' && task.completedOn.startsWith(`${year}-`)) {
      first = Math.min(first, Number(task.completedOn.slice(5, 7)) - 1)
    }
  }
  const months: MonthStats[] = []
  for (let month = first; month <= currentMonth; month++) {
    months.push(monthStats(finishedIn(tasks, `${year}-${pad(month + 1)}`), MONTH_NAMES[month]))
  }
  return { year, months }
}

function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number)
  return todayIso(new Date(year, month - 1, day + days))
}

function mondayOf(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return addDays(iso, -mondayIndex(new Date(year, month - 1, day)))
}

/** The last ten weeks (Monday to Sunday), oldest first; the last one is the current week. `starts` holds each Monday as an ISO date. */
export function buildWeeklyStats(tasks: Task[], today: string): { weeks: WeekStats[]; starts: string[] } {
  const thisMonday = mondayOf(today)
  const starts: string[] = []
  for (let back = WEEKS_SHOWN - 1; back >= 0; back--) starts.push(addDays(thisMonday, -7 * back))
  const weeks = starts.map((start) => {
    const end = addDays(start, 6)
    const due = tasks.filter((task) => task.fixed >= start && task.fixed <= end)
    return { label: formatIso(start), planned: due.length, done: due.filter((task) => task.status === 'done').length }
  })
  return { weeks, starts }
}

/** The first day of the chosen period, as an ISO date. */
export function periodStartIso(period: Period, today: string): string {
  const year = Number(today.slice(0, 4))
  const month = Number(today.slice(5, 7))
  if (period === 'ytd') return `${year}-01-01`
  const start = new Date(year, month - 1 - (period === 'm3' ? 2 : 0), 1)
  return `${start.getFullYear()}-${pad(start.getMonth() + 1)}-01`
}

/** Index of the first week that touches the period (earlier weeks are faded in the chart). */
export function firstWeekInPeriod(starts: string[], periodStart: string): number {
  const index = starts.findIndex((start) => addDays(start, 6) >= periodStart)
  return index === -1 ? 0 : index
}

/** This month's figures per category (all four categories are always listed, even with nothing finished). */
export function buildCategoryPerformance(tasks: Task[], today: string): CategoryPerformance[] {
  const finished = finishedIn(tasks, today.slice(0, 7))
  return (Object.keys(categoryNames) as CategoryKey[]).map((category) => {
    const mine = finished.filter((task) => task.category === category)
    const timed = mine.filter(comparable)
    return {
      category,
      done: mine.length,
      onTime: mine.filter((task) => task.completedOn <= task.fixed).length,
      plannedHours: round1(timed.reduce((sum, task) => sum + task.estimateHours, 0)),
      actualHours: round1(timed.reduce((sum, task) => sum + task.loggedHours, 0)),
    }
  })
}

/** Tasks that were finished after their fixed date, on or after the period start, newest first. A history, not a to-do list. */
export function buildLateTasks(tasks: Task[], periodStart: string): LateTask[] {
  return tasks
    .filter((task) => task.status === 'done' && task.completedOn > task.fixed && task.completedOn >= periodStart)
    .sort((a, b) => b.completedOn.localeCompare(a.completedOn) || a.title.localeCompare(b.title))
    .map((task) => ({
      id: task.id,
      title: task.title,
      category: task.category,
      fixed: formatIso(task.fixed),
      tag: `Done ${plural(daysBetween(task.fixed, task.completedOn), 'day', 'days')} late`,
    }))
}
