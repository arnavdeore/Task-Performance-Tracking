import type { EodUpdate, Task } from '../data/tasks'
import { daysBetween } from './dates'

/** Tasks that are not done yet. */
export function openTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => task.status !== 'done')
}

/** Open tasks whose fixed date is before `today` (ISO dates compare correctly as text). */
export function overdueCount(tasks: Task[], today: string): number {
  return openTasks(tasks).filter((task) => task.fixed < today).length
}

/** Open tasks with a fixed date from today up to 6 days ahead (the next 7 days, today included). */
export function dueInWeekCount(tasks: Task[], today: string): number {
  return openTasks(tasks).filter((task) => {
    const days = daysBetween(today, task.fixed)
    return days >= 0 && days <= 6
  }).length
}

/** Hours written up on `date`, rounded to one decimal. */
export function hoursLoggedOn(log: EodUpdate[], date: string): number {
  const total = log.filter((entry) => entry.date === date).reduce((sum, entry) => sum + entry.hours, 0)
  return Math.round(total * 10) / 10
}

/** How many different tasks got an update on `date`. */
export function tasksLoggedOn(log: EodUpdate[], date: string): number {
  return new Set(log.filter((entry) => entry.date === date).map((entry) => entry.taskId)).size
}
