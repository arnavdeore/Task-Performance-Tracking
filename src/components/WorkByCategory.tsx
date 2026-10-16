import { categoryCounts, categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'

type WorkByCategoryProps = {
  /** The selected category, or null for all. Lives in Dashboard.tsx so Deadline watch can follow it. */
  selected: CategoryKey | null
  onSelect: (category: CategoryKey | null) => void
}

const TOTAL = categoryCounts.reduce((sum, item) => sum + item.count, 0)

// Build "colour from% to%" stops for the donut ring.
let running = 0
const RING = categoryCounts
  .map((item) => {
    const from = (running / TOTAL) * 100
    running += item.count
    const to = (running / TOTAL) * 100
    return `${item.color} ${from}% ${to}%`
  })
  .join(',')

/** "Work by category": donut of tasks done this month. Layout from design/Main.dc.html. */
export default function WorkByCategory({ selected, onSelect }: WorkByCategoryProps) {
  const hit = categoryCounts.find((item) => item.key === selected)
  const centreNumber = hit ? hit.count : TOTAL
  const centreLabel = hit ? categoryNames[hit.key] : 'done'

  return (
    <section className="glass box-border flex min-w-0 flex-[1_1_320px] flex-col gap-4 rounded-[34px] px-6 py-[22px]">
      <h2 className="m-0 text-[21px] font-bold">Work by category</h2>

      <div className="flex flex-wrap items-center justify-center gap-[18px]">
        <div
          role="img"
          aria-label={`Donut chart of ${TOTAL} tasks done this month, split by category`}
          className="relative h-[136px] w-[136px] flex-none rounded-full shadow-[0_16px_24px_-12px_rgba(35,43,94,0.4)]"
          style={{ background: `conic-gradient(${RING})` }}
        >
          <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-[inset_0_2px_6px_rgba(35,43,94,0.12)]">
            <span className="text-[26px] font-bold leading-none">{centreNumber}</span>
            <span className="max-w-16 text-[11px] text-muted">{centreLabel}</span>
          </div>
        </div>

        <div className="flex flex-[1_1_150px] flex-col gap-0.5">
          {categoryCounts.map((item) => {
            const on = selected === item.key
            return (
              <button
                key={item.key}
                type="button"
                className={`rowb${on ? ' on' : ''}`}
                style={{ gridTemplateColumns: '12px minmax(0,1fr) auto' }}
                aria-pressed={on}
                onClick={() => onSelect(on ? null : item.key)}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                <span>{categoryNames[item.key]}</span>
                <strong>{item.count}</strong>
              </button>
            )
          })}
        </div>
      </div>

      <p className="m-0 text-xs text-muted">Pick a category to filter the deadline list and the donut centre.</p>
    </section>
  )
}
