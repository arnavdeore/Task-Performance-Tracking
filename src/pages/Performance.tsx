import { useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryTable from '../components/CategoryTable'
import DeadlineScorecard from '../components/DeadlineScorecard'
import HealthCheck from '../components/HealthCheck'
import LateAndOverdue from '../components/LateAndOverdue'
import MonthByMonth from '../components/MonthByMonth'
import StaleBanner from '../components/StaleBanner'
import WeeklyCompletion from '../components/WeeklyCompletion'
import WhatThisMeans from '../components/WhatThisMeans'
import type { CategoryKey } from '../data/dashboard'
import { FIXED_TARGET_PERCENT, periodPhrase, periods } from '../data/performance'
import type { Period } from '../data/performance'
import { todayIso } from '../lib/dates'
import {
  buildCategoryPerformance,
  buildLateTasks,
  buildMonthlyStats,
  buildWeeklyStats,
  firstWeekInPeriod,
  periodStartIso,
} from '../lib/performanceData'
import { buildInsights, periodRange, summarise } from '../lib/performanceStats'
import { overdueCount } from '../lib/taskStats'
import { useTasksData } from '../lib/tasksDataContext'

/**
 * The Performance page. Layout from design/Performance.dc.html. Every figure is worked out from the user's tasks and EOD updates
 * (see lib/performanceData.ts), loaded once for the whole app by TasksDataProvider.
 */
export default function Performance() {
  // The period chosen here drives every section on the page.
  const [period, setPeriod] = useState<Period>('m1')
  // The category picked in the By category table; it also filters the Finished late list.
  const [category, setCategory] = useState<CategoryKey | null>(null)
  const { tasks, load, loadError, refreshError, reload } = useTasksData()

  // Today on this device (local time), so an evening in India still counts as today.
  const today = todayIso()
  const { year, months } = buildMonthlyStats(tasks, today)
  // The last month is always the current one, so "this month" is the last entry.
  const [first, last] = periodRange(period, months.length - 1)
  const summary = summarise(months, first, last)
  const insights = buildInsights(months, first, last, summary, periodPhrase[period], FIXED_TARGET_PERCENT)
  const { weeks, starts } = buildWeeklyStats(tasks, today)
  const periodStart = periodStartIso(period, today)
  // The month charts only cover this year, so the late list does too (in January, 'Last 3 months' is just January).
  const lateStart = periodStart < `${year}-01-01` ? `${year}-01-01` : periodStart

  return (
    <>
      {load === 'ready' && refreshError && <StaleBanner message={refreshError} onRetry={() => void reload(true)} />}

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-[18px] px-1.5">
        <div className="min-w-0 flex-[1_1_320px]">
          <h1 className="m-0 text-[30px] font-extrabold tracking-[-0.015em]">Performance</h1>
          <p className="mb-0 mt-[7px] max-w-[48ch] text-sm leading-[1.55] text-muted">
            How you are doing against your tentative and fixed deadlines.
          </p>
        </div>
        <div className="flex min-w-0 max-w-full flex-none flex-wrap items-center gap-3">
          {/* On a phone the three buttons are wider than the screen, so they scroll sideways instead of overflowing. */}
          <div className="max-w-full overflow-x-auto md:overflow-visible">
            <div className="seg" role="group" aria-label="Period">
              {periods.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`segb${period === item.key ? ' on' : ''}`}
                  aria-pressed={period === item.key}
                  onClick={() => setPeriod(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="pillbtn dark h-[50px] px-7 text-[15px]">
            Export report
          </button>
        </div>
      </div>

      {load === 'loading' && (
        <div role="status" className="glass rounded-[30px] px-8 py-12 text-center text-sm font-semibold text-muted">
          Loading your performance…
        </div>
      )}

      {load === 'error' && (
        <div role="alert" className="glass flex flex-col items-center gap-4 rounded-[30px] px-8 py-12 text-center">
          <p className="m-0 max-w-[44ch] text-sm font-semibold leading-[1.6] text-red-dark">{loadError}</p>
          <button type="button" className="pillbtn dark h-11 px-6 text-sm" onClick={() => void reload(false)}>
            Try again
          </button>
        </div>
      )}

      {load === 'ready' && summary.done === 0 && (
        <div className="glass flex flex-col items-center gap-3 rounded-[30px] px-8 py-12 text-center">
          <h2 className="m-0 text-[21px] font-bold">Nothing finished {periodPhrase[period]} yet</h2>
          <p className="m-0 max-w-[48ch] text-sm leading-[1.6] text-muted">
            This page is worked out from the tasks you mark Done. Finish a task on the Tasks page and your on-time rate, estimate
            check and charts will appear here.
            {period !== 'ytd' && ' You can also try a longer period above.'}
          </p>
          <Link to="/tasks" className="pillbtn dark mt-1 h-[50px] px-7 text-[15px]">
            Go to Tasks
          </Link>
        </div>
      )}

      {load === 'ready' && summary.done > 0 && (
        <>
          <div className="flex flex-wrap items-stretch gap-5">
            <DeadlineScorecard period={period} summary={summary} />
            <HealthCheck period={period} summary={summary} />
          </div>

          <div className="flex flex-wrap items-stretch gap-5">
            {/* key={period}: picking another period starts the chart fresh, on the last month of that period. */}
            <MonthByMonth key={period} months={months} year={year} first={first} last={last} />
            <WhatThisMeans insights={insights} />
          </div>

          <div className="flex flex-wrap items-stretch gap-5">
            <WeeklyCompletion key={period} weeks={weeks} firstInPeriod={firstWeekInPeriod(starts, periodStart)} />
          </div>

          {/* Last row, so it grows to fill the frame. The category picked in the table filters the late list. */}
          <div className="flex flex-[1_1_auto] flex-wrap items-stretch gap-5">
            <CategoryTable rows={buildCategoryPerformance(tasks, today)} selected={category} onSelect={setCategory} />
            <LateAndOverdue
              tasks={buildLateTasks(tasks, lateStart)}
              overdueNow={overdueCount(tasks, today)}
              category={category}
            />
          </div>
        </>
      )}
    </>
  )
}
