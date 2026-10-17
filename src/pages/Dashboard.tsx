import { useState } from 'react'
import DeadlineWatch from '../components/DeadlineWatch'
import LatestUpdates from '../components/LatestUpdates'
import MonthCalendar from '../components/MonthCalendar'
import StatTile from '../components/StatTile'
import ThoughtStrip from '../components/ThoughtStrip'
import TodayTasks from '../components/TodayTasks'
import WeekStrip from '../components/WeekStrip'
import { statTiles } from '../data/dashboard'
import { greeting, longDate } from '../lib/dates'

/*
 * Desktop: the sections sit in rows (header, thought, then three rows of cards), as in design/Main.dc.html.
 * Phone (under 768px): the same sections stack in one column in a different order, taken from design/MobileHome.dc.html:
 * greeting, thought, 2x2 tiles, Due soon (Deadline watch), then the rest.
 * The rows and the small wrappers use `contents md:...` so on a phone every section becomes a direct item of the page
 * column and `order-N` can reorder it, while on desktop (`md:contents` / `md:order-none`) nothing changes.
 */
export default function Dashboard() {
  const [today] = useState(() => new Date())

  return (
    <>
      <div className="contents md:flex md:flex-wrap md:items-end md:justify-between md:gap-x-6 md:gap-y-[18px] md:px-1.5">
        <div className="order-1 min-w-0 px-1.5 md:order-none md:flex-[1_1_320px] md:px-0">
          <h1 className="m-0 text-[22px] font-extrabold tracking-[-0.015em] md:text-[30px]">
            {greeting(today)}, Arnav
          </h1>
          <p className="mb-0 mt-1.5 text-[13px] leading-[1.55] text-muted md:mt-[7px] md:text-sm">
            <span className="hidden md:inline">Here is where your work stands today. </span>
            {longDate(today)}
          </p>
        </div>
        <div className="order-3 grid grid-cols-2 gap-3 md:order-none md:flex md:flex-none md:flex-wrap">
          {statTiles.map((tile) => (
            <StatTile key={tile.label} {...tile} />
          ))}
        </div>
      </div>

      <div className="order-2 md:contents md:order-none">
        <ThoughtStrip />
      </div>

      {/* Row 2: Today's tasks. The full performance picture lives on the Performance tab. */}
      <div className="contents md:flex md:flex-wrap md:items-stretch md:gap-5">
        <div className="order-5 md:contents md:order-none">
          <TodayTasks />
        </div>
      </div>

      {/* Row 3: Deadline watch (it has its own category pills) and the month calendar. Category breakdowns live on Performance. */}
      <div className="contents md:flex md:flex-wrap md:items-stretch md:gap-5">
        <div className="order-4 md:contents md:order-none">
          <DeadlineWatch />
        </div>
        <div className="order-9 md:contents md:order-none">
          <MonthCalendar />
        </div>
      </div>

      {/* Row 4 (last row, so on desktop it grows to fill the frame): This week, then Latest updates beside it. */}
      <div className="contents md:flex md:flex-[1_1_auto] md:flex-wrap md:items-stretch md:gap-5">
        <div className="order-6 md:contents md:order-none">
          <WeekStrip today={today} />
        </div>
        <div className="order-10 md:contents md:order-none">
          <LatestUpdates />
        </div>
      </div>
    </>
  )
}
