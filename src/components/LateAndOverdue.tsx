import { Link } from 'react-router-dom'
import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import type { LateTask } from '../data/performance'

// A history list stays short; the Tasks page has everything.
const MAX_ROWS = 8

type LateAndOverdueProps = {
  /** Tasks finished after their fixed date in the chosen period, newest first (from `buildLateTasks`). */
  tasks: LateTask[]
  /** Open tasks that are past their fixed date right now. They are not listed here (the Dashboard and Tasks show them). */
  overdueNow: number
  /** The category picked in the table, or null for all. */
  category: CategoryKey | null
}

/** "Finished late": a history of tasks that missed a fixed date, filtered by the category chosen in the table. Layout from design/Performance.dc.html. */
export default function LateAndOverdue({ tasks, overdueNow, category }: LateAndOverdueProps) {
  const matching = tasks.filter((task) => !category || task.category === category)
  const rows = matching.slice(0, MAX_ROWS)
  const hidden = matching.length - rows.length

  return (
    <section className="glass box-border flex min-w-0 flex-[2_1_320px] flex-col gap-1.5 rounded-[34px] px-6 py-[22px]">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="m-0 text-[21px] font-bold">Finished late</h2>
        <span className="text-xs font-semibold text-navy">
          {category ? `${categoryNames[category]} (click row again to clear)` : 'All categories'}
        </span>
      </div>

      {rows.map((task) => (
        <div
          key={task.id}
          className="flex flex-wrap items-center justify-between gap-2 border-t border-[rgba(35,43,94,0.08)] py-3"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">{task.title}</span>
            <span className="text-xs text-muted">
              {categoryNames[task.category]}, fixed {task.fixed}
            </span>
          </div>
          <span className="rounded-full bg-red-pastel px-2.5 py-1 text-xs font-semibold text-red-dark">{task.tag}</span>
        </div>
      ))}

      {rows.length === 0 && (
        <p className="m-0 border-t border-[rgba(35,43,94,0.08)] py-3 text-[13px] font-semibold text-green-dark">
          {category ? 'Nothing finished late in this category. Nice.' : 'Nothing finished late in this period. Nice.'}
        </p>
      )}
      {hidden > 0 && <p className="m-0 border-t border-[rgba(35,43,94,0.08)] py-2.5 text-xs text-muted">{hidden} more finished late.</p>}

      {overdueNow > 0 && (
        <p className="m-0 mt-auto border-t border-[rgba(35,43,94,0.08)] pt-3 text-xs leading-[1.55] text-muted">
          {overdueNow} {overdueNow === 1 ? 'task is' : 'tasks are'} still overdue right now.{' '}
          <Link to="/tasks" className="font-bold text-navy hover:text-navy">
            See {overdueNow === 1 ? 'it' : 'them'} on the Tasks page
          </Link>
          .
        </p>
      )}
    </section>
  )
}
