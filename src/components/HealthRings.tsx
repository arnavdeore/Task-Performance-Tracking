// Ring colours from docs/design-notes.md. Outer ring first.
const RINGS = [
  { key: 'fixed', label: 'Fixed deadlines met', colour: '#1E9E68', radius: 88 },
  { key: 'tentative', label: 'Tentative dates hit', colour: '#2457C5', radius: 66 },
  { key: 'estimate', label: 'Estimate accuracy', colour: '#9A8BEA', radius: 44 },
] as const

const TRACK = '#D6E2F2'

export type HealthValues = {
  fixed: number
  tentative: number
  estimate: number
}

/** Three percentages on the left and the three concentric rings on the right. Used by the Dashboard and Performance pages. */
export default function HealthRings({ values }: { values: HealthValues }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-3.5">
        {RINGS.map((ring) => (
          <div key={ring.key} className="flex flex-col gap-0.5">
            <span className="flex items-center gap-2 text-[13px] text-muted-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: ring.colour }} />
              {ring.label}
            </span>
            <span className="ml-[18px] text-[26px] font-semibold">{values[ring.key]}%</span>
          </div>
        ))}
      </div>

      <svg
        role="img"
        aria-label={`Rings: fixed deadlines met ${values.fixed} percent, tentative dates hit ${values.tentative} percent, estimate accuracy ${values.estimate} percent`}
        width="190"
        height="190"
        viewBox="0 0 200 200"
        className="flex-none"
      >
        <g fill="none" strokeWidth="14" strokeLinecap="round">
          {RINGS.map((ring) => (
            <circle key={`${ring.key}-track`} cx="100" cy="100" r={ring.radius} stroke={TRACK} />
          ))}
          {RINGS.map((ring) => {
            const circumference = 2 * Math.PI * ring.radius
            const filled = (circumference * values[ring.key]) / 100
            return (
              <circle
                key={ring.key}
                cx="100"
                cy="100"
                r={ring.radius}
                stroke={ring.colour}
                strokeDasharray={`${filled} ${circumference}`}
                transform="rotate(-90 100 100)"
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
