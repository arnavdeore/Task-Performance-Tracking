import { useEffect, useRef, useState } from 'react'
import type { WeekStats } from '../data/performance'
import { readWeek, weekPercent } from '../lib/performanceStats'

const PX_PER_TASK = 16

type WeeklyCompletionProps = {
  weeks: WeekStats[]
  /** Weeks before this index fall outside the chosen period and are faded. */
  firstInPeriod: number
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

const LEGEND = [
  { label: 'Planned', colour: 'bg-[#B9C8DE]' },
  { label: 'Completed', colour: 'bg-blue' },
  { label: 'Week shown', colour: 'bg-green' },
]

/** "Weekly completion": planned and completed capsules for ten weeks, plus a readout for the chosen week. Layout from design/Performance.dc.html. */
export default function WeeklyCompletion({ weeks, firstInPeriod }: WeeklyCompletionProps) {
  // Starts on the latest week. The page re-creates this component when the period changes.
  const [selected, setSelected] = useState(weeks.length - 1)
  const week = weeks[selected]
  const read = readWeek(weeks, selected)

  // On a phone the chart is wider than the screen and scrolls sideways; start at the latest week, on the right.
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const box = scrollRef.current
    if (box) box.scrollLeft = box.scrollWidth
  }, [])

  const change =
    read.changePoints === null
      ? { text: 'First week shown', colour: 'text-muted-2' }
      : read.changePoints === 0
        ? { text: 'No change', colour: 'text-muted-2' }
        : read.changePoints > 0
          ? { text: `Up ${read.changePoints} points`, colour: 'text-green-dark' }
          : { text: `Down ${Math.abs(read.changePoints)} points`, colour: 'text-red-dark' }

  return (
    <section className="glass box-border flex min-w-0 flex-[1_1_100%] flex-col gap-4 rounded-[34px] px-[26px] py-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-[21px] font-bold">Weekly completion</h2>
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-muted-2">
          {LEGEND.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1">
              <span className={`h-[9px] w-[9px] rounded-[3px] ${item.colour}`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-x-[26px] gap-y-5">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-2.5">
          <div ref={scrollRef} className="overflow-x-auto">
            <div className="flex min-w-[600px] flex-col gap-2.5">
              <div className="grid h-[200px] grid-cols-10 items-end gap-2">
                {weeks.map((item, i) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`pick flex h-full items-end justify-center gap-1 ${i >= firstInPeriod ? '' : 'opacity-45'}`}
                    aria-label={`Week of ${item.label}: ${item.done} of ${item.planned} planned tasks finished, ${weekPercent(item)} percent`}
                    aria-pressed={i === selected}
                    onClick={() => setSelected(i)}
                  >
                    <div className="cap pair hatch" style={{ height: item.planned * PX_PER_TASK }} />
                    <div
                      className={`cap pair ${i === selected ? 'green' : 'blue'}`}
                      style={{ height: item.done * PX_PER_TASK }}
                    />
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-10 gap-2">
                {weeks.map((item, i) => (
                  <div
                    key={item.label}
                    className={`text-center text-xs text-muted ${i === selected ? 'font-extrabold' : 'font-medium'}`}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mb-0 mt-1 text-xs leading-[1.5] text-muted">
            Each pair is one week: the striped capsule is what you planned, the solid one is what you finished. Click a
            week to read it on the right. Weeks outside the selected period are faded.
          </p>
        </div>

        <div className="flex min-w-[230px] flex-[0_1_280px] flex-col gap-2.5">
          <div
            aria-live="polite"
            className="box-border flex flex-col gap-1 rounded-3xl bg-white px-5 py-[18px] shadow-[0_10px_18px_-14px_rgba(35,43,94,0.4)]"
          >
            <span className="text-xs font-semibold text-muted">Week of {week.label}</span>
            <span className="text-[38px] font-semibold leading-[1.1] tracking-[-0.02em] text-blue-dark">
              {read.percent}%
            </span>
            <span className="text-[13px] leading-[1.45] text-muted-2">
              {week.done} of {week.planned} planned tasks finished
            </span>
          </div>
          <div className="flex flex-col gap-[9px] rounded-3xl bg-white/85 px-[18px] py-4 text-[13px]">
            <div className="flex items-baseline justify-between gap-2.5">
              <span className="text-muted-2">vs previous week</span>
              <strong className={change.colour}>{change.text}</strong>
            </div>
            <div className="flex items-baseline justify-between gap-2.5">
              <span className="text-muted-2">4-week average</span>
              <strong>{read.fourWeekAverage}%</strong>
            </div>
            <div className="flex items-baseline justify-between gap-2.5">
              <span className="text-muted-2">Best week</span>
              <strong>
                {read.bestLabel} ({read.bestPercent}%)
              </strong>
            </div>
            <div className="flex items-baseline justify-between gap-2.5">
              <span className="text-muted-2">Carried over</span>
              <strong>{read.carriedOver === 0 ? 'Nothing' : plural(read.carriedOver, 'task', 'tasks')}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
