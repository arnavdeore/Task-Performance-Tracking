import { periodPhrase } from '../data/performance'
import type { Period } from '../data/performance'
import type { PeriodSummary } from '../lib/performanceStats'

type DeadlineScorecardProps = {
  period: Period
  summary: PeriodSummary
}

const CHIP = 'self-start rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#2E384D]'
const CARD =
  'box-border flex min-h-[190px] flex-col gap-3 rounded-[26px] p-4 transition duration-200 hover:-translate-y-[3px]'
const NUMBER = 'text-[42px] font-semibold leading-[1.05] tracking-[-0.02em]'
const SUB = 'mt-auto text-xs leading-[1.45] text-[#3A455C]'

function Bar({ percent }: { percent: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/75">
      <div className="h-full rounded-full bg-navy" style={{ width: `${percent}%` }} />
    </div>
  )
}

/** "Deadline scorecard": fixed met, tentative hit and average delay for the chosen period. Layout from design/Performance.dc.html. */
export default function DeadlineScorecard({ period, summary }: DeadlineScorecardProps) {
  const { done, onTime, tentativeHit, lateCount } = summary
  return (
    <section className="white box-border flex min-w-0 flex-[1.75_1_560px] flex-col gap-[18px] rounded-[34px] px-6 py-[22px]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-[21px] font-bold">Deadline scorecard</h2>
        <span className="text-xs text-muted">Finished tasks, {periodPhrase[period]}</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
        <div className={`${CARD} bg-green-card`}>
          <span className={CHIP}>Fixed deadlines met</span>
          <span className={`${NUMBER} text-green-dark`}>{summary.fixedPercent}%</span>
          <Bar percent={summary.fixedPercent} />
          <span className={SUB}>
            {onTime} of {done} finished tasks
          </span>
        </div>

        <div className={`${CARD} bg-blue-card`}>
          <span className={CHIP}>Tentative dates hit</span>
          <span className={`${NUMBER} text-blue-dark`}>{summary.tentativePercent}%</span>
          <Bar percent={summary.tentativePercent} />
          <span className={SUB}>
            {tentativeHit} of {done} finished by your own target
          </span>
        </div>

        <div className={`${CARD} bg-red-card`}>
          <span className={CHIP}>Average delay when late</span>
          <span className={`${NUMBER} text-red-dark`}>{summary.averageDelayDays.toFixed(1)} days</span>
          <div className="h-1.5" />
          <span className={SUB}>
            {lateCount} {lateCount === 1 ? 'task' : 'tasks'} finished after the fixed date
          </span>
        </div>
      </div>
    </section>
  )
}
