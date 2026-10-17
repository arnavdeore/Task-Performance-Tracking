import { FIXED_TARGET_PERCENT, periodPhrase } from '../data/performance'
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

// The three ways a finished task can land. A task that hit its tentative date also met the fixed date.
const OUTCOMES = [
  { key: 'hit', label: 'Hit your own target date', colour: '#1E9E68' },
  { key: 'fixedOnly', label: 'Met the fixed date, missed your target', colour: '#DD9A22' },
  { key: 'late', label: 'Finished after the fixed date', colour: '#C23A3A' },
] as const

/** Half-circle gauge for the fixed-date score, with a tick at the target. */
function Gauge({ percent, target }: { percent: number; target: number }) {
  const angle = Math.PI * (1 - target / 100)
  const tick = (radius: number) => `${60 + radius * Math.cos(angle)} ${60 - radius * Math.sin(angle)}`
  const reached = percent >= target
  return (
    <svg
      role="img"
      aria-label={`${percent} percent of fixed dates met, target ${target} percent`}
      viewBox="0 0 120 68"
      className="mx-auto w-full max-w-[170px]"
    >
      <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="12" strokeLinecap="round" />
      <path
        d="M10 60 A50 50 0 0 1 110 60"
        fill="none"
        stroke={reached ? '#0F6B43' : '#232B5E'}
        strokeWidth="12"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray={`${percent} 100`}
      />
      <path d={`M${tick(40)} L${tick(66)}`} stroke="#A12B2B" strokeWidth="2.5" strokeLinecap="round" />
      <text x="60" y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="#3A455C">
        target {target}%
      </text>
    </svg>
  )
}

/** One dot per finished task (scaled down to at most 30). Filled = hit your own target date, dashed ring = missed it. */
function TaskDots({ done, hit }: { done: number; hit: number }) {
  const dots = Math.min(done, 30)
  const filled = done ? Math.round((hit / done) * dots) : 0
  return (
    <div className="flex flex-wrap gap-1" role="img" aria-label={`${hit} of ${done} finished tasks hit the tentative date`}>
      {Array.from({ length: dots }, (_, index) =>
        index < filled ? (
          <span key={index} className="h-[13px] w-[13px] rounded-full bg-blue" />
        ) : (
          <span key={index} className="h-[13px] w-[13px] rounded-full border-[1.5px] border-dashed border-blue bg-white/70" />
        ),
      )}
    </div>
  )
}

/** A ruler from 0 days to a few days late, with a marker at the average. */
function DelayRuler({ days }: { days: number }) {
  const max = Math.max(4, Math.ceil(days) + 1)
  const position = Math.min(100, (days / max) * 100)
  return (
    <div role="img" aria-label={`Average delay ${days.toFixed(1)} days on a scale of 0 to ${max} days`}>
      <div className="relative h-2.5 rounded-full bg-[linear-gradient(90deg,#3CC38C,#F0B44C,#C23A3A)]">
        <span
          className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-navy shadow-[0_3px_8px_-2px_rgba(35,43,94,0.6)]"
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-semibold text-[#3A455C]">
        <span>On time</span>
        <span>{max} days late</span>
      </div>
    </div>
  )
}

/**
 * "Deadline scorecard": where every finished task landed, then fixed met, tentative hit and average delay for the chosen period.
 * Goes beyond design/Performance.dc.html (Arnav asked for more visual, more meaningful graphics); the card colours are the design's.
 */
export default function DeadlineScorecard({ period, summary }: DeadlineScorecardProps) {
  const { done, onTime, tentativeHit, lateCount } = summary
  const counts = { hit: tentativeHit, fixedOnly: onTime - tentativeHit, late: lateCount }
  const gap = FIXED_TARGET_PERCENT - summary.fixedPercent

  return (
    <section className="white box-border flex min-w-0 flex-[1.75_1_560px] flex-col gap-[18px] rounded-[34px] px-6 py-[22px]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 text-[21px] font-bold">Deadline scorecard</h2>
        <span className="text-xs text-muted">Finished tasks, {periodPhrase[period]}</span>
      </div>

      {/* Where all finished tasks landed, as one bar. */}
      <div className="flex flex-col gap-2.5">
        <div className="text-[13px] font-semibold text-muted-2">
          Where your {done} finished {done === 1 ? 'task' : 'tasks'} landed
        </div>
        {done > 0 ? (
          <div
            className="flex h-[26px] gap-[3px] overflow-hidden rounded-full"
            role="img"
            aria-label={OUTCOMES.map((item) => `${counts[item.key]} ${item.label.toLowerCase()}`).join(', ')}
          >
            {OUTCOMES.map((item) =>
              counts[item.key] > 0 ? (
                <div
                  key={item.key}
                  className="flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ flex: counts[item.key], background: item.colour }}
                >
                  {counts[item.key]}
                </div>
              ) : null,
            )}
          </div>
        ) : (
          <div className="h-[26px] rounded-full bg-[#EEF1F6]" />
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-muted-2">
          {OUTCOMES.map((item) => (
            <span key={item.key} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.colour }} />
              {item.label}: <strong className="text-ink">{counts[item.key]}</strong>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
        <div className={`${CARD} bg-green-card`}>
          <span className={CHIP}>Fixed deadlines met</span>
          <span className={`${NUMBER} text-green-dark`}>{summary.fixedPercent}%</span>
          <Gauge percent={summary.fixedPercent} target={FIXED_TARGET_PERCENT} />
          <span className={SUB}>
            {onTime} of {done} finished tasks.{' '}
            {gap > 0 ? `${gap} points short of the target.` : 'On or above the target.'}
          </span>
        </div>

        <div className={`${CARD} bg-blue-card`}>
          <span className={CHIP}>Tentative dates hit</span>
          <span className={`${NUMBER} text-blue-dark`}>{summary.tentativePercent}%</span>
          <TaskDots done={done} hit={tentativeHit} />
          <span className={SUB}>
            {tentativeHit} of {done} finished by your own target
            {done > 30 ? '. Each dot is a share of your tasks.' : '. Filled dot = hit, dashed = missed.'}
          </span>
        </div>

        <div className={`${CARD} bg-red-card`}>
          <span className={CHIP}>Average delay when late</span>
          <span className={`${NUMBER} text-red-dark`}>{summary.averageDelayDays.toFixed(1)} days</span>
          {lateCount > 0 ? (
            <DelayRuler days={summary.averageDelayDays} />
          ) : (
            <span className="text-[13px] font-bold text-green-dark">Nothing finished late.</span>
          )}
          <span className={SUB}>
            {lateCount} {lateCount === 1 ? 'task' : 'tasks'} finished after the fixed date
          </span>
        </div>
      </div>
    </section>
  )
}
