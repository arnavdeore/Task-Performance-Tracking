import { Link } from 'react-router-dom'
import { categoryNames, todayTasks } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'

// Full class names are written out so Tailwind can see them (it cannot find names built from pieces).
const CARD_COLOUR: Record<CategoryKey, { card: string; chip: string }> = {
  dev: { card: 'bg-blue-card', chip: 'text-blue-dark' },
  clean: { card: 'bg-green-card', chip: 'text-green-dark' },
  mgmt: { card: 'bg-lavender-card', chip: 'text-lavender-dark' },
  bi: { card: 'bg-amber-card', chip: 'text-amber-dark' },
}

/** 1.5 -> "1.5", 3 -> "3", 4.499999 -> "4.5" */
function hours(value: number): string {
  return String(Math.round(value * 10) / 10)
}

/** "Today's tasks": up to three task cards plus the focus footer. Layout from design/Main.dc.html. */
export default function TodayTasks() {
  const planned = todayTasks.reduce((sum, task) => sum + task.estimateHours, 0)
  const logged = todayTasks.reduce((sum, task) => sum + task.loggedHours, 0)
  const focusPercent = planned === 0 ? 0 : Math.round((logged / planned) * 100)

  return (
    <section className="white box-border flex min-w-0 flex-[1.6_1_560px] flex-col gap-[18px] rounded-[34px] px-6 py-[22px]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-[21px] font-bold">Today&rsquo;s tasks</h2>
        <Link
          to="/tasks"
          className="inline-flex h-9 items-center justify-center rounded-full bg-[#F1F4FB] px-5 text-[13px] font-bold text-navy no-underline transition hover:-translate-y-px hover:text-navy"
        >
          See all
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
        {todayTasks.map((task) => {
          const colour = CARD_COLOUR[task.category]
          const percent = task.estimateHours === 0 ? 0 : Math.round((task.loggedHours / task.estimateHours) * 100)
          return (
            <Link
              key={task.id}
              to="/tasks"
              className={`box-border flex min-h-[200px] flex-col gap-3 rounded-[26px] p-4 text-ink no-underline transition duration-200 hover:-translate-y-[3px] hover:text-ink ${colour.card}`}
            >
              <span className="self-start rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#2E384D]">
                {task.priority}
              </span>
              <span className="text-xl font-semibold leading-[1.25] tracking-[-0.01em]">{task.title}</span>
              <div className="flex flex-wrap gap-1.5">
                <span className={`rounded-full bg-white px-2.5 py-[3px] text-[11px] font-bold ${colour.chip}`}>
                  {categoryNames[task.category]}
                </span>
                <span className="rounded-full border-[1.5px] border-dashed border-blue bg-white px-[9px] py-0.5 text-[11px] font-semibold text-blue">
                  T {task.tentative}
                </span>
                <span className="rounded-full border border-[#F3BFBF] bg-red-pastel px-[9px] py-[3px] text-[11px] font-semibold text-red-dark">
                  F {task.fixed}
                </span>
              </div>
              <div className="mt-auto flex items-center gap-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/75">
                  <div className="h-full rounded-full bg-navy" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-xs font-bold text-[#2E384D]">
                  {hours(task.loggedHours)}/{hours(task.estimateHours)}h
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-[18px] gap-y-2.5 rounded-[22px] bg-[#F4F7FD] px-[18px] py-3.5">
        <span className="text-[13px] font-bold text-[#2E384D]">
          {hours(logged)}h logged of {hours(planned)}h planned today
        </span>
        <div className="h-2 min-w-[120px] flex-[1_1_160px] overflow-hidden rounded-full bg-[#E3E9F4]">
          <div className="h-full rounded-full bg-navy" style={{ width: `${focusPercent}%` }} />
        </div>
        <span className="text-[12.5px] text-muted">{hours(planned - logged)}h still to put in</span>
      </div>
    </section>
  )
}
