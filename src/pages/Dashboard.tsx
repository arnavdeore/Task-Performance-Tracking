import { useState } from 'react'
import DeadlineWatch from '../components/DeadlineWatch'
import LatestUpdates from '../components/LatestUpdates'
import MonthCalendar from '../components/MonthCalendar'
import StaleBanner from '../components/StaleBanner'
import StatTile from '../components/StatTile'
import ThoughtStrip from '../components/ThoughtStrip'
import TodayTasks from '../components/TodayTasks'
import WeekStrip from '../components/WeekStrip'
import type { StatTileData } from '../data/dashboard'
import { calendarDeadlines, deadlineRows, latestUpdates, statTiles, todayFocus, weekCounts } from '../lib/dashboardStats'
import { greeting, longDate, todayIso, weekDates } from '../lib/dates'
import { useTasksData } from '../lib/tasksDataContext'

// Shown in place of the real tiles until the data has loaded.
const LOADING_TILES: StatTileData[] = [
  { label: 'Open tasks', value: '–', sub: 'Loading…', tone: 'blue' },
  { label: 'Done this month', value: '–', sub: 'Loading…', tone: 'green' },
  { label: 'On time, fixed dates', value: '–', sub: 'Loading…', tone: 'green' },
  { label: 'Overdue', value: '–', sub: 'Loading…', tone: 'ink' },
]

/*
 * Desktop: the sections sit in rows (header, thought, then rows of cards), as in design/Main.dc.html.
 * Phone (under 768px): the same sections stack in one column in a different order, taken from design/MobileHome.dc.html:
 * greeting, thought, 2x2 tiles, Due soon (Deadline watch), then the rest.
 * The rows and the small wrappers use `contents md:...` so on a phone every section becomes a direct item of the page
 * column and `order-N` can reorder it, while on desktop (`md:contents` / `md:order-none`) nothing changes.
 *
 * Every number comes from the user's tasks and EOD updates in Supabase (see lib/dashboardStats.ts), loaded by useTasksData.
 */
export default function Dashboard() {
  const [now] = useState(() => new Date())
  const { tasks, eodLog, load, loadError, refreshError, reload } = useTasksData()
  // Today on this device (local time), so an evening in India still counts as today.
  const today = todayIso(now)
  const ready = load === 'ready'

  const tiles = ready ? statTiles(tasks, today) : LOADING_TILES
  const week = weekCounts(
    tasks,
    weekDates(now).map((day) => todayIso(day)),
  )

  return (
    <>
      {/* No order class: on a phone it sorts first (order 0), above the greeting. */}
      {ready && refreshError && <StaleBanner message={refreshError} onRetry={() => void reload(true)} />}

      <div className="contents md:flex md:flex-wrap md:items-end md:justify-between md:gap-x-6 md:gap-y-[18px] md:px-1.5">
        <div className="order-1 min-w-0 px-1.5 md:order-none md:flex-[1_1_320px] md:px-0">
          <h1 className="m-0 text-[22px] font-extrabold tracking-[-0.015em] md:text-[30px]">
            {greeting(now)}, Arnav
          </h1>
          <p className="mb-0 mt-1.5 text-[13px] leading-[1.55] text-muted md:mt-[7px] md:text-sm">
            <span className="hidden md:inline">Here is where your work stands today. </span>
            {longDate(now)}
          </p>
        </div>
        <div className="order-3 grid grid-cols-2 gap-3 md:order-none md:flex md:flex-none md:flex-wrap">
          {tiles.map((tile) => (
            <StatTile key={tile.label} {...tile} />
          ))}
        </div>
      </div>

      <div className="order-2 md:contents md:order-none">
        <ThoughtStrip />
      </div>

      {/* Row 2: Today's tasks (or the loading / error message while the data is not ready). */}
      <div className="contents md:flex md:flex-wrap md:items-stretch md:gap-5">
        <div className="order-5 md:contents md:order-none">
          {ready ? (
            <TodayTasks tasks={todayFocus(tasks, today)} />
          ) : load === 'loading' ? (
            <section
              role="status"
              className="glass box-border flex min-w-0 flex-[1_1_380px] items-center justify-center rounded-[34px] px-6 py-14 text-sm font-semibold text-muted"
            >
              Loading your dashboard…
            </section>
          ) : (
            <section
              role="alert"
              className="glass box-border flex min-w-0 flex-[1_1_380px] flex-col items-center gap-4 rounded-[34px] px-6 py-12 text-center"
            >
              <p className="m-0 max-w-[44ch] text-sm font-semibold leading-[1.6] text-red-dark">{loadError}</p>
              <button type="button" className="pillbtn dark h-11 px-6 text-sm" onClick={() => void reload(false)}>
                Try again
              </button>
            </section>
          )}
        </div>
      </div>

      {/* Row 3: Deadline watch (it has its own category pills) and the month calendar. Category breakdowns live on Performance. */}
      <div className="contents md:flex md:flex-wrap md:items-stretch md:gap-5">
        {ready && (
          <div className="order-4 md:contents md:order-none">
            <DeadlineWatch rows={deadlineRows(tasks, today)} />
          </div>
        )}
        <div className="order-9 md:contents md:order-none">
          <MonthCalendar deadlines={ready ? calendarDeadlines(tasks) : []} />
        </div>
      </div>

      {/* Row 4 (last row, so on desktop it grows to fill the frame): This week, then Latest updates beside it. */}
      {ready && (
        <div className="contents md:flex md:flex-[1_1_auto] md:flex-wrap md:items-stretch md:gap-5">
          <div className="order-6 md:contents md:order-none">
            <WeekStrip today={now} planned={week.planned} done={week.done} />
          </div>
          <div className="order-10 md:contents md:order-none">
            <LatestUpdates updates={latestUpdates(eodLog, today)} total={eodLog.length} />
          </div>
        </div>
      )}
    </>
  )
}
