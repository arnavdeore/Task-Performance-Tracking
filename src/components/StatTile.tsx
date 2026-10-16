import { Link } from 'react-router-dom'
import type { StatTileData, Tone } from '../data/dashboard'

const NUMBER_COLOUR: Record<Tone, string> = {
  blue: 'text-blue-dark',
  green: 'text-green-dark',
  red: 'text-red-dark',
}

/** Label, big number and a sub-line that adds information. The whole tile is a link. */
export default function StatTile({ label, value, sub, tone, to }: StatTileData) {
  return (
    <Link
      to={to}
      className="white box-border flex min-w-[172px] flex-col gap-[3px] rounded-[24px] px-5 py-4 text-ink no-underline transition duration-200 hover:-translate-y-[3px] hover:text-ink"
    >
      <span className="text-[12.5px] font-semibold text-muted">{label}</span>
      <span className={`text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] ${NUMBER_COLOUR[tone]}`}>
        {value}
      </span>
      <span className="text-[11.5px] font-semibold text-muted">{sub}</span>
    </Link>
  )
}
