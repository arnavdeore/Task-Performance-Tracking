import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import type { CategoryPerformance } from '../data/performance'
import { hoursVariancePercent } from '../lib/performanceStats'

// Full class names are written out so Tailwind can see them.
const CHIP: Record<CategoryKey, string> = {
  dev: 'bg-blue-pastel text-blue-dark',
  clean: 'bg-green-pastel text-green-dark',
  mgmt: 'bg-lavender-pastel text-lavender-dark',
  bi: 'bg-amber-pastel text-amber-dark',
}

const COLUMNS = 'minmax(150px,1.6fr) 70px 90px minmax(170px,1.6fr)'

/** Over 10% = red, over plan = amber, on or under plan = green. */
function varianceColour(variance: number): string {
  if (variance > 10) return 'bg-red-pastel text-red-dark'
  if (variance > 0) return 'bg-amber-pastel text-amber-dark'
  return 'bg-green-pastel text-green-dark'
}

type CategoryTableProps = {
  /** This month's figures for each category (from `buildCategoryPerformance`). */
  rows: CategoryPerformance[]
  /** The selected category, or null for all. Lives in the page so the late list can follow it. */
  selected: CategoryKey | null
  onSelect: (category: CategoryKey | null) => void
}

/** "By category (this month)": done, on-time rate and planned vs actual hours per category. Layout from design/Performance.dc.html. */
export default function CategoryTable({ rows, selected, onSelect }: CategoryTableProps) {
  const planned = Math.round(rows.reduce((sum, row) => sum + row.plannedHours, 0) * 10) / 10
  const actual = Math.round(rows.reduce((sum, row) => sum + row.actualHours, 0) * 10) / 10

  return (
    <section className="glass box-border flex min-w-0 flex-[3_1_520px] flex-col gap-3 rounded-[34px] px-6 py-[22px]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-[21px] font-bold">By category (this month)</h2>
        <span className="text-xs text-muted">
          Hours: {actual}h actual vs {planned}h planned
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-[560px] flex-col gap-1">
          <div
            className="grid gap-3 px-3.5 py-1 text-xs font-semibold text-muted"
            style={{ gridTemplateColumns: COLUMNS }}
          >
            <span>Category</span>
            <span>Done</span>
            <span>On time</span>
            <span>Planned vs actual hours</span>
          </div>

          {rows.map((row) => {
            const on = selected === row.category
            const variance = hoursVariancePercent(row.plannedHours, row.actualHours)
            return (
              <button
                key={row.category}
                type="button"
                className={`rowb${on ? ' on' : ''}`}
                style={{ gridTemplateColumns: COLUMNS, fontSize: 14, padding: '12px 14px' }}
                aria-pressed={on}
                onClick={() => onSelect(on ? null : row.category)}
              >
                <span>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${CHIP[row.category]}`}>
                    {categoryNames[row.category]}
                  </span>
                </span>
                <span className="font-bold">{row.done}</span>
                <span className="font-bold">{row.done ? `${Math.round((row.onTime / row.done) * 100)}%` : '–'}</span>
                <span className="flex items-center gap-2.5">
                  {row.plannedHours === 0 && row.actualHours === 0 ? (
                    <span className="text-muted">No hours to compare</span>
                  ) : (
                    <>
                      <span>
                        {row.plannedHours}h to {row.actualHours}h
                      </span>
                      <span className={`rounded-full px-2.5 py-[3px] text-xs font-bold ${varianceColour(variance)}`}>
                        {variance > 0 ? '+' : ''}
                        {variance}%
                      </span>
                    </>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
