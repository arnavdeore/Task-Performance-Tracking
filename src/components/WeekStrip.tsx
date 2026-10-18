import { mondayIndex, shortDate, weekDates } from '../lib/dates'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type WeekStripProps = {
  today: Date
  /** Tasks due on each day, Monday first (see `weekCounts` in dashboardStats.ts). */
  planned: number[]
  /** Of those, how many are done. */
  done: number[]
}

/** "This week": seven day columns, Monday to Sunday. Layout from design/Main.dc.html. */
export default function WeekStrip({ today, planned: plannedPerDay, done: donePerDay }: WeekStripProps) {
  const todayIndex = mondayIndex(today)
  const dates = weekDates(today)

  const days = plannedPerDay.map((planned, i) => {
    const done = donePerDay[i]
    const percent = planned ? Math.round((done / planned) * 100) : 0
    return {
      name: DAY_NAMES[i],
      label: shortDate(dates[i]),
      planned,
      done,
      isToday: i === todayIndex,
      // Full class names so Tailwind can see them.
      track: i === todayIndex ? 'bg-[#DCE5F6]' : 'bg-[#EDF1F8]',
      fill: i > todayIndex ? 'bg-[#C3D0E4]' : percent === 100 ? 'bg-green' : 'bg-blue',
      // A small stub stays visible when a day has work but none done yet.
      height: planned ? Math.max(percent, 5) : 0,
      aria: `${DAY_NAMES[i]} ${dates[i].getDate()}: ${done} of ${planned} planned tasks done`,
    }
  })

  const totalPlanned = days.reduce((sum, day) => sum + day.planned, 0)
  const totalDone = days.reduce((sum, day) => sum + day.done, 0)
  const left = totalPlanned - totalDone

  return (
    <section className="white box-border flex min-w-0 flex-[1.3_1_480px] flex-col gap-[18px] rounded-[34px] px-6 py-[22px]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 className="m-0 text-[21px] font-bold">This week</h2>
        <span className="text-[13px] text-muted">
          {totalDone} of {totalPlanned} planned tasks done
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2.5">
        {days.map((day) => (
          <div key={day.name} className="flex flex-col items-center gap-2">
            <span className={`text-xs font-bold ${day.isToday ? 'text-navy' : 'text-muted'}`}>{day.name}</span>
            <div
              role="img"
              aria-label={day.aria}
              className={`flex h-32 w-full max-w-[38px] items-end overflow-hidden rounded-[14px] ${day.track}`}
            >
              <div className={`w-full rounded-[14px] ${day.fill}`} style={{ height: `${day.height}%` }} />
            </div>
            <span className="text-xs font-bold text-[#2E384D]">{day.planned ? `${day.done}/${day.planned}` : '—'}</span>
            <span className="text-[11px] text-muted">{day.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-[18px] gap-y-2 border-t border-[rgba(35,43,94,0.08)] pt-3.5 text-[12.5px] text-muted-2">
        <span className="font-bold text-[#2E384D]">
          {totalPlanned ? `${Math.round((totalDone / totalPlanned) * 100)}% of the week done` : 'Nothing due this week'}
        </span>
        <span>
          {left} {left === 1 ? 'task' : 'tasks'} left
        </span>
        <span>Monday to Sunday, by fixed date</span>
      </div>
    </section>
  )
}
