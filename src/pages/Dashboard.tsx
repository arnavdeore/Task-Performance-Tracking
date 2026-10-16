import { useState } from 'react'
import StatTile from '../components/StatTile'
import ThoughtStrip from '../components/ThoughtStrip'
import { statTiles } from '../data/dashboard'
import { greeting, longDate } from '../lib/dates'

export default function Dashboard() {
  const [today] = useState(() => new Date())

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-[18px] px-1.5">
        <div className="min-w-0 flex-[1_1_320px]">
          <h1 className="m-0 text-[30px] font-extrabold tracking-[-0.015em]">{greeting(today)}, Arnav</h1>
          <p className="mb-0 mt-[7px] text-sm leading-[1.55] text-muted">
            Here is where your work stands today. {longDate(today)}
          </p>
        </div>
        <div className="flex flex-none flex-wrap gap-3">
          {statTiles.map((tile) => (
            <StatTile key={tile.label} {...tile} />
          ))}
        </div>
      </div>

      <ThoughtStrip />
    </>
  )
}
