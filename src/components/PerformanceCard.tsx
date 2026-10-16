import { Link } from 'react-router-dom'
import { performanceSummary } from '../data/dashboard'
import HealthRings from './HealthRings'

/** "Performance" card: three progress rings, their values, and the average delay. Layout from design/Main.dc.html. */
export default function PerformanceCard() {
  const values = {
    fixed: performanceSummary.fixedMetPercent,
    tentative: performanceSummary.tentativeHitPercent,
    estimate: performanceSummary.estimateAccuracyPercent,
  }

  return (
    <section className="glass box-border flex min-w-0 flex-[1_1_380px] flex-col gap-4 rounded-[34px] px-[26px] py-[22px]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="m-0 text-[21px] font-bold">Performance</h2>
        <span className="text-xs text-muted">This month</span>
      </div>

      <HealthRings values={values} />

      <div className="flex items-center justify-between rounded-[18px] bg-[#FBE3DF] px-4 py-3 text-[13px]">
        <span className="font-semibold text-red-dark">Average delay on late tasks</span>
        <strong>{performanceSummary.averageDelayDays} days</strong>
      </div>

      <Link to="/performance" className="text-[13px] font-bold text-navy no-underline hover:text-navy">
        Open full performance report
      </Link>
    </section>
  )
}
