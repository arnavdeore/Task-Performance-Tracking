import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import { lateTasks } from '../data/performance'

type LateAndOverdueProps = {
  /** The category picked in the table, or null for all. */
  category: CategoryKey | null
}

/** "Late and overdue": tasks that missed a fixed date, filtered by the category chosen in the table. Layout from design/Performance.dc.html. */
export default function LateAndOverdue({ category }: LateAndOverdueProps) {
  const rows = lateTasks.filter((task) => !category || task.category === category)

  return (
    <section className="glass box-border flex min-w-0 flex-[2_1_320px] flex-col gap-1.5 rounded-[34px] px-6 py-[22px]">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="m-0 text-[21px] font-bold">Late and overdue</h2>
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
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              task.kind === 'overdue' ? 'bg-red text-white' : 'bg-red-pastel text-red-dark'
            }`}
          >
            {task.tag}
          </span>
        </div>
      ))}

      {rows.length === 0 && (
        <p className="m-0 border-t border-[rgba(35,43,94,0.08)] py-3 text-[13px] font-semibold text-green-dark">
          Nothing late in this category. Nice.
        </p>
      )}
    </section>
  )
}
