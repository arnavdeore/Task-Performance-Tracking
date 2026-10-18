import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categoryNames } from '../data/dashboard'
import type { CategoryKey, DeadlineRow, DeadlineStatus } from '../data/dashboard'

type Filter = 'all' | 'overdue' | 'soon'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'soon', label: 'Next 7 days' },
]

// Full class names are written out so Tailwind can see them.
const BADGE: Record<CategoryKey, { initial: string; colour: string }> = {
  dev: { initial: 'D', colour: 'bg-blue-pastel text-blue-dark' },
  clean: { initial: 'C', colour: 'bg-green-pastel text-green-dark' },
  mgmt: { initial: 'M', colour: 'bg-lavender-pastel text-lavender-dark' },
  bi: { initial: 'P', colour: 'bg-amber-pastel text-amber-dark' },
}

const STATUS: Record<DeadlineStatus, { label: string; colour: string }> = {
  todo: { label: 'To do', colour: 'bg-[#EEF1F6] text-muted-2' },
  progress: { label: 'In progress', colour: 'bg-blue-pastel text-blue-dark' },
  waiting: { label: 'Waiting', colour: 'bg-lavender-pastel text-lavender-dark' },
  overdue: { label: 'Overdue', colour: 'bg-red text-white' },
}

// The list stays short on the Dashboard; the Tasks page has everything.
const MAX_ROWS = 8

function matches(row: DeadlineRow, filter: Filter, category: CategoryKey | null): boolean {
  if (category && row.category !== category) return false
  if (filter === 'overdue') return row.overdue
  if (filter === 'soon') return row.dueSoon || row.overdue
  return true
}

type DeadlineWatchProps = {
  /** Every open task, soonest fixed date first (from `deadlineRows` in dashboardStats.ts). */
  rows: DeadlineRow[]
}

/** "Deadline watch": upcoming and overdue tasks with a three-way filter and category pills. Layout from design/Main.dc.html. */
export default function DeadlineWatch({ rows: allRows }: DeadlineWatchProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [category, setCategory] = useState<CategoryKey | null>(null)
  const matching = allRows.filter((row) => matches(row, filter, category))
  const rows = matching.slice(0, MAX_ROWS)
  const hidden = matching.length - rows.length

  return (
    <section className="glass box-border flex min-w-0 flex-[1_1_380px] flex-col gap-3 rounded-[34px] px-6 py-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h2 className="m-0 text-[21px] font-bold">Deadline watch</h2>
        <div className="seg" role="group" aria-label="Filter deadlines">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`segb${filter === item.key ? ' on' : ''}`}
              aria-pressed={filter === item.key}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills: scroll sideways on a phone, as on the Tasks page. */}
      <div className="-mx-1 overflow-x-auto px-1 pb-0.5">
        <div className="seg" role="group" aria-label="Filter by category">
          <button
            type="button"
            className={`segb${category === null ? ' on' : ''}`}
            aria-pressed={category === null}
            onClick={() => setCategory(null)}
          >
            All work
          </button>
          {(Object.keys(categoryNames) as CategoryKey[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`segb${category === key ? ' on' : ''}`}
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
            >
              {categoryNames[key]}
            </button>
          ))}
        </div>
      </div>

      <div>
        {rows.map((row) => {
          const badge = BADGE[row.category]
          const status = STATUS[row.status]
          return (
            <div key={row.id} className="flex items-center gap-3 border-t border-[rgba(35,43,94,0.08)] py-[11px]">
              <div
                aria-hidden="true"
                className={`flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-extrabold ${badge.colour}`}
              >
                {badge.initial}
              </div>
              <div className="flex min-w-0 flex-[1_1_auto] flex-col gap-0.5">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold">{row.title}</span>
                <span className="text-xs text-muted">
                  {categoryNames[row.category]}
                  {row.tentative ? `, T ${row.tentative}` : ''}
                </span>
              </div>
              <div className="flex flex-none flex-col items-end gap-1">
                <span className="rounded-full border border-[#F3BFBF] bg-red-pastel px-[9px] py-[3px] text-[11px] font-semibold text-red-dark">
                  F {row.fixed}
                </span>
                <span className={`rounded-full px-[9px] py-0.5 text-[11px] font-bold ${status.colour}`}>
                  {status.label}
                </span>
              </div>
            </div>
          )
        })}
        {rows.length === 0 && (
          <div className="border-t border-[rgba(35,43,94,0.08)] py-3.5 text-[13px] font-semibold text-green-dark">
            {allRows.length === 0 ? 'No open tasks. Add one from the Tasks page.' : 'Nothing in this view.'}
          </div>
        )}
        {hidden > 0 && (
          <div className="border-t border-[rgba(35,43,94,0.08)] py-3 text-[12.5px] text-muted">
            {hidden} more.{' '}
            <Link to="/tasks" className="font-bold text-navy hover:text-navy">
              See all on the Tasks page
            </Link>
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[rgba(35,43,94,0.08)] pt-2.5 text-[11px] text-muted-2">
        <span className="flex items-center gap-1.5">
          <span className="rounded-full border-[1.5px] border-dashed border-blue px-[7px] py-px font-bold text-blue">T</span>
          Tentative, can move
        </span>
        <span className="flex items-center gap-1.5">
          <span className="rounded-full border border-[#F3BFBF] bg-red-pastel px-[7px] py-0.5 font-bold text-red-dark">F</span>
          Fixed, counts toward on-time
        </span>
      </div>
    </section>
  )
}
