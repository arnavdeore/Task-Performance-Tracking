import { ESTIMATE_ACCURACY_PERCENT, FIXED_TARGET_PERCENT, periodPhrase } from '../data/performance'
import type { Period } from '../data/performance'
import type { PeriodSummary } from '../lib/performanceStats'
import HealthRings from './HealthRings'

type HealthCheckProps = {
  period: Period
  summary: PeriodSummary
}

/** "Health check": the three rings for the chosen period. Layout from design/Performance.dc.html. */
export default function HealthCheck({ period, summary }: HealthCheckProps) {
  return (
    <section className="glass box-border flex min-w-0 flex-[1_1_380px] flex-col gap-4 rounded-[34px] px-[26px] py-[22px]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="m-0 text-[21px] font-bold">Health check</h2>
        <span className="text-xs text-muted">{periodPhrase[period]}</span>
      </div>

      <HealthRings
        values={{
          fixed: summary.fixedPercent,
          tentative: summary.tentativePercent,
          estimate: ESTIMATE_ACCURACY_PERCENT,
        }}
      />

      <p className="m-0 text-xs text-muted">Target for fixed deadlines is {FIXED_TARGET_PERCENT}%.</p>
    </section>
  )
}
