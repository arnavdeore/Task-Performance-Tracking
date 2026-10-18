import type { CalendarDeadline, DeadlineRow, LatestUpdate, StatTileData } from '../data/dashboard'
import { FIXED_TARGET_PERCENT } from '../data/performance'
import type { EodUpdate, Task } from '../data/tasks'
import { daysBetween, formatIso, weekdayOfIso } from './dates'
import { dueInWeekCount, openTasks, overdueCount } from './taskStats'

/*
 * Everything the Dashboard shows is worked out here from the user's tasks and EOD updates (nothing is stored separately).
 * `today` is an ISO date (YYYY-MM-DD) from the device. All of this is plain maths, so it can be tested on its own in Phase 4.
 */

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

function hours(value: number): number {
  return Math.round(value * 10) / 10
}

/** The four tiles at the top. "This month" means the calendar month that `today` is in. */
export function statTiles(tasks: Task[], today: string): StatTileData[] {
  const [year, month] = today.split('-').map(Number)
  const thisKey = today.slice(0, 7)
  const previous = new Date(year, month - 2, 1)
  const previousKey = `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, '0')}`
  const previousName = previous.toLocaleString('en-GB', { month: 'long' })

  const doneIn = (key: string) => tasks.filter((task) => task.status === 'done' && task.completedOn.startsWith(key))
  const doneNow = doneIn(thisKey)
  const donePrevious = doneIn(previousKey)
  const onTime = doneNow.filter((task) => task.completedOn <= task.fixed).length

  const diff = doneNow.length - donePrevious.length
  const doneSub =
    doneNow.length === 0 && donePrevious.length === 0
      ? 'Finish a task to see this'
      : diff > 0
        ? `${diff} more than ${previousName}`
        : diff < 0
          ? `${-diff} fewer than ${previousName}`
          : `Same as ${previousName}`

  const overdue = overdueCount(tasks, today)
  const oldest = Math.max(0, ...openTasks(tasks).map((task) => daysBetween(task.fixed, today)))

  return [
    {
      label: 'Open tasks',
      value: String(openTasks(tasks).length),
      sub: `${dueInWeekCount(tasks, today)} due this week`,
      tone: 'blue',
      to: '/tasks',
    },
    { label: 'Done this month', value: String(doneNow.length), sub: doneSub, tone: 'green', to: '/performance' },
    {
      label: 'On time, fixed dates',
      value: doneNow.length ? `${Math.round((onTime / doneNow.length) * 100)}%` : '–',
      sub: `Target ${FIXED_TARGET_PERCENT}%`,
      tone: 'green',
      to: '/performance',
    },
    {
      label: 'Overdue',
      value: String(overdue),
      sub: overdue ? `Oldest ${plural(oldest, 'day', 'days')} late` : 'Nothing overdue',
      tone: overdue ? 'red' : 'green',
      to: '/tasks',
    },
  ]
}

/**
 * "Today's tasks": up to three open tasks to work on now. A task qualifies when it is in progress, or when its tentative or
 * fixed date is today or already passed (waiting tasks are left out unless they are in progress). Most urgent first.
 */
export function todayFocus(tasks: Task[], today: string): Task[] {
  return openTasks(tasks)
    .filter(
      (task) =>
        task.status === 'progress' ||
        (task.status !== 'waiting' && ((task.tentative !== '' && task.tentative <= today) || task.fixed <= today)),
    )
    .sort((a, b) => a.fixed.localeCompare(b.fixed) || a.title.localeCompare(b.title))
    .slice(0, 3)
}

/** The Deadline watch list: every open task, soonest fixed date first. */
export function deadlineRows(tasks: Task[], today: string): DeadlineRow[] {
  return openTasks(tasks)
    .sort((a, b) => a.fixed.localeCompare(b.fixed) || a.title.localeCompare(b.title))
    .map((task) => {
      const left = daysBetween(today, task.fixed)
      const overdue = left < 0
      return {
        id: task.id,
        title: task.title,
        category: task.category,
        tentative: task.tentative ? formatIso(task.tentative) : '',
        fixed: formatIso(task.fixed),
        status: overdue ? 'overdue' : task.status === 'done' ? 'todo' : task.status,
        overdue,
        dueSoon: left >= 0 && left <= 6,
      }
    })
}

/** For each ISO date (Monday first): tasks due that day (by fixed date) and how many of them are done. */
export function weekCounts(tasks: Task[], weekIso: string[]): { planned: number[]; done: number[] } {
  const planned = weekIso.map((iso) => tasks.filter((task) => task.fixed === iso).length)
  const done = weekIso.map((iso) => tasks.filter((task) => task.fixed === iso && task.status === 'done').length)
  return { planned, done }
}

/** Calendar dots: the tentative and fixed dates of open tasks. */
export function calendarDeadlines(tasks: Task[]): CalendarDeadline[] {
  return openTasks(tasks).map((task) => ({ title: task.title, tentative: task.tentative, fixed: task.fixed }))
}

/** The newest EOD updates (already newest first), worded for the Dashboard card. */
export function latestUpdates(log: EodUpdate[], today: string, limit = 3): LatestUpdate[] {
  return log.slice(0, limit).map((entry) => {
    const gap = daysBetween(entry.date, today)
    const when =
      gap === 0
        ? `Today, ${formatIso(entry.date)}`
        : gap === 1
          ? `Yesterday, ${formatIso(entry.date)}`
          : `${weekdayOfIso(entry.date)} ${formatIso(entry.date)}`
    return { id: entry.id, title: entry.title, hours: `${hours(entry.hours)}h`, mood: entry.mood, comment: entry.comment, when }
  })
}
