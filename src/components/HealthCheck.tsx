import { periodPhrase } from '../data/performance'
import type { Period } from '../data/performance'
import { hoursVariancePercent } from '../lib/performanceStats'
import type { PeriodSummary } from '../lib/performanceStats'

type HealthCheckProps = {
  period: Period
  summary: PeriodSummary
}

const LAVENDER = '#9A8BEA'
const RING_RADIUS = 52
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

/** Dates live in the Deadline scorecard; this card is only about time: how well your hour estimates match what you logged. */
function EstimateRing({ percent }: { percent: number }) {
  return (
    <svg
      role="img"
      aria-label={`Estimate accuracy ${percent} percent`}
      width="150"
      height="150"
      viewBox="0 0 140 140"
      className="flex-none"
    >
      <g fill="none" strokeWidth="14" strokeLinecap="round">
        <circle cx="70" cy="70" r={RING_RADIUS} stroke="#D6E2F2" />
        <circle
          cx="70"
          cy="70"
          r={RING_RADIUS}
          stroke={LAVENDER}
          strokeDasharray={`${(RING_LENGTH * percent) / 100} ${RING_LENGTH}`}
          transform="rotate(-90 70 70)"
        />
      </g>
      <text x="70" y="76" textAnchor="middle" fontSize="28" fontWeight="600" fill="#1B2438">
        {percent}%
      </text>
    </svg>
  )
}

/** Two bars on one scale: hours estimated and hours logged. The logged bar turns amber when it runs over. */
function HoursBars({ planned, logged }: { planned: number; logged: number }) {
  const scale = Math.max(planned, logged, 1)
  const over = logged > planned
  return (
    <div className="flex flex-col gap-2.5">
      {[
        { label: 'Estimated', hours: planned, colour: '#C9C0F4' },
        { label: 'Logged', hours: logged, colour: over ? '#DD9A22' : LAVENDER },
      ].map((bar) => (
        <div key={bar.label} className="flex items-center gap-3 text-[13px]">
          <span className="w-[72px] flex-none font-semibold text-muted-2">{bar.label}</span>
          <div className="h-3.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/80">
            <div className="h-full rounded-full" style={{ width: `${(bar.hours / scale) * 100}%`, background: bar.colour }} />
          </div>
          <strong className="w-11 flex-none text-right">{bar.hours}h</strong>
        </div>
      ))}
    </div>
  )
}

/** "Estimate check": estimate accuracy, hours estimated vs logged, and how many tasks ran long. Replaces the design's rings card, which repeated the scorecard. */
export default function HealthCheck({ period, summary }: HealthCheckProps) {
  const variance = hoursVariancePercent(summary.plannedHours, summary.loggedHours)
  const hoursOff = Math.abs(summary.loggedHours - summary.plannedHours)
  const outcomes = [
    { label: 'Took longer', count: summary.tookLonger, colour: 'bg-amber-pastel text-amber-dark' },
    { label: 'About right', count: summary.onEstimate, colour: 'bg-green-pastel text-green-dark' },
    { label: 'Faster', count: summary.faster, colour: 'bg-blue-pastel text-blue-dark' },
  ]

  return (
    <section className="glass box-border flex min-w-0 flex-[1_1_380px] flex-col gap-4 rounded-[34px] px-[26px] py-[22px]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="m-0 text-[21px] font-bold">Estimate check</h2>
        <span className="text-xs text-muted">{periodPhrase[period]}</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <EstimateRing percent={summary.estimatePercent} />
        <p className="m-0 min-w-[150px] flex-1 text-[13px] leading-[1.55] text-muted-2">
          <strong className="text-ink">Estimate accuracy.</strong> {summary.onEstimate} of {summary.done} finished tasks
          took within 10% of the time you expected.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-[20px] bg-white/70 p-4">
        <HoursBars planned={summary.plannedHours} logged={summary.loggedHours} />
        <p className="m-0 text-xs text-muted-2">
          {summary.loggedHours === summary.plannedHours
            ? 'Logged hours matched the estimate exactly.'
            : `You logged ${hoursOff}h ${summary.loggedHours > summary.plannedHours ? 'more' : 'less'} than estimated (${variance > 0 ? '+' : ''}${variance}%).`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {outcomes.map((item) => (
          <div key={item.label} className={`flex flex-col items-center gap-0.5 rounded-[18px] px-2 py-2.5 ${item.colour}`}>
            <span className="text-[22px] font-bold leading-none">{item.count}</span>
            <span className="text-[11px] font-semibold">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
