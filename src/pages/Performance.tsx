import { useState } from 'react'
import CategoryTable from '../components/CategoryTable'
import DeadlineScorecard from '../components/DeadlineScorecard'
import HealthCheck from '../components/HealthCheck'
import LateAndOverdue from '../components/LateAndOverdue'
import MonthByMonth from '../components/MonthByMonth'
import WeeklyCompletion from '../components/WeeklyCompletion'
import WhatThisMeans from '../components/WhatThisMeans'
import type { CategoryKey } from '../data/dashboard'
import {
  firstWeekOfPeriod,
  FIXED_TARGET_PERCENT,
  monthlyStats,
  periodPhrase,
  periods,
  weeklyStats,
} from '../data/performance'
import type { Period } from '../data/performance'
import { buildInsights, periodRange, summarise } from '../lib/performanceStats'

// October is the last month in the sample data and counts as "this month".
const CURRENT_MONTH = monthlyStats.length - 1

/** The Performance page. Layout from design/Performance.dc.html. */
export default function Performance() {
  // The period chosen here drives every section on the page.
  const [period, setPeriod] = useState<Period>('m1')
  // The category picked in the By category table; it also filters the Late and overdue list.
  const [category, setCategory] = useState<CategoryKey | null>(null)

  const [first, last] = periodRange(period, CURRENT_MONTH)
  const summary = summarise(monthlyStats, first, last)
  const insights = buildInsights(monthlyStats, first, last, summary, periodPhrase[period], FIXED_TARGET_PERCENT)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-[18px] px-1.5">
        <div className="min-w-0 flex-[1_1_320px]">
          <h1 className="m-0 text-[30px] font-extrabold tracking-[-0.015em]">Performance</h1>
          <p className="mb-0 mt-[7px] max-w-[48ch] text-sm leading-[1.55] text-muted">
            How you are doing against your tentative and fixed deadlines.
          </p>
        </div>
        <div className="flex flex-none flex-wrap items-center gap-3">
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
          <button type="button" className="pillbtn dark h-[50px] px-7 text-[15px]">
            Export report
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-5">
        <DeadlineScorecard period={period} summary={summary} />
        <HealthCheck period={period} summary={summary} />
      </div>

      <div className="flex flex-wrap items-stretch gap-5">
        {/* key={period}: picking another period starts the chart fresh, on the last month of that period. */}
        <MonthByMonth key={period} months={monthlyStats} first={first} last={last} />
        <WhatThisMeans insights={insights} />
      </div>

      <div className="flex flex-wrap items-stretch gap-5">
        <WeeklyCompletion key={period} weeks={weeklyStats} firstInPeriod={firstWeekOfPeriod[period]} />
      </div>

      {/* Last row, so it grows to fill the frame. The category picked in the table filters the late list. */}
      <div className="flex flex-[1_1_auto] flex-wrap items-stretch gap-5">
        <CategoryTable selected={category} onSelect={setCategory} />
        <LateAndOverdue category={category} />
      </div>
    </>
  )
}
