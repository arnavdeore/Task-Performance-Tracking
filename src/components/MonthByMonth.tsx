import { useState } from 'react'
import { FIXED_TARGET_PERCENT } from '../data/performance'
import type { MonthStats } from '../data/performance'
import { monthPercent } from '../lib/performanceStats'

type View = 'pct' | 'done'

const VIEWS: { key: View; label: string }[] = [
  { key: 'pct', label: 'On-time %' },
  { key: 'done', label: 'Tasks done' },
]

// Pixel scale of the 190px chart: 100% is 140px tall, so the 90% target line sits at 126px.
const PX_PER_PERCENT = 1.4
const PX_PER_TASK = 5.6

type MonthByMonthProps = {
  months: MonthStats[]
  /** The year the months belong to (shown after the month name). */
  year: number
  /** First and last month (inclusive) of the chosen period; capsules inside it are blue, outside it striped. */
  first: number
  last: number
}

/** "Month by month": a capsule per month with an On-time % / Tasks done toggle. Layout from design/Performance.dc.html. */
export default function MonthByMonth({ months, year, first, last }: MonthByMonthProps) {
  const [view, setView] = useState<View>('pct')
  // Starts on the last month of the period. The page re-creates this component when the period changes.
  const [selected, setSelected] = useState(last)

  const month = months[selected]
  const percent = monthPercent(month)
  const lateCount = month.done - month.onTime
  const lateText = lateCount
    ? `${lateCount} ${lateCount === 1 ? 'task' : 'tasks'} late, avg ${(month.lateDays / lateCount).toFixed(1)} days`
    : 'No late tasks'

  return (
    <section className="glass box-border flex min-w-0 flex-[2_1_520px] flex-col gap-4 rounded-[34px] px-[26px] py-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-[21px] font-bold">Month by month</h2>
        <div className="seg" role="group" aria-label="Chart view">
          {VIEWS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`segb${view === item.key ? ' on' : ''}`}
              aria-pressed={view === item.key}
              onClick={() => setView(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        aria-live="polite"
        className="flex flex-wrap items-baseline gap-x-[18px] gap-y-1.5 rounded-[20px] bg-white/85 px-[18px] py-3"
      >
        <span className="text-sm font-bold">
          {month.month} {year}
        </span>
        <span className="text-[22px] font-bold text-green-dark">{percent}% on time</span>
        <span className="text-[13px] text-muted-2">
          {month.onTime} of {month.done} finished by the fixed date
        </span>
        <span className="text-[13px] text-muted-2">{month.tentativeHit} hit the tentative date</span>
        <span className="text-[13px] font-semibold text-red-dark">{lateText}</span>
      </div>

      <div>
        <div className="relative flex h-[190px] items-end justify-between gap-1.5">
          {view === 'pct' && (
            <div
              className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-[#E2674B]"
              style={{ bottom: FIXED_TARGET_PERCENT * PX_PER_PERCENT }}
            >
              <span className="absolute -top-[22px] right-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-red-dark">
                {FIXED_TARGET_PERCENT}% target
              </span>
            </div>
          )}
          {months.map((item, i) => {
            const value = view === 'pct' ? monthPercent(item) : item.done
            const height = Math.round(view === 'pct' ? value * PX_PER_PERCENT : value * PX_PER_TASK)
            const colour = i === selected ? 'green' : i >= first && i <= last ? 'blue' : 'hatch'
            return (
              <button
                key={item.month}
                type="button"
                className="pick flex flex-1 items-end justify-center"
                aria-label={`${item.month}: ${value}${view === 'pct' ? '% on time' : ' tasks done'}`}
                aria-pressed={i === selected}
                onClick={() => setSelected(i)}
              >
                <div className={`cap ${colour}`} style={{ height }} />
              </button>
            )
          })}
        </div>
        <div className="mt-2.5 flex justify-between gap-1.5">
          {months.map((item, i) => (
            <div
              key={item.month}
              className={`flex-1 text-center text-xs text-muted ${i === selected ? 'font-extrabold' : 'font-medium'}`}
            >
              {item.month}
            </div>
          ))}
        </div>
        <p className="mb-0 mt-3 text-xs text-muted">
          Click a capsule to see that month. Blue capsules are inside your period, striped ones are outside it, and
          green is the month shown above.
        </p>
      </div>
    </section>
  )
}
