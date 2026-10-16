import { Link } from 'react-router-dom'
import { latestUpdates } from '../data/dashboard'
import type { Mood } from '../data/dashboard'

// Full class names are written out so Tailwind can see them.
const MOOD_COLOUR: Record<Mood, string> = {
  'On track': 'bg-green-pastel text-green-dark',
  'At risk': 'bg-amber-pastel text-amber-dark',
  Blocked: 'bg-red-pastel text-red-dark',
}

/** "Latest updates": the two most recent EOD entries. Layout from design/Main.dc.html. */
export default function LatestUpdates() {
  return (
    <section className="glass box-border flex min-w-0 flex-[1_1_380px] flex-col gap-3.5 rounded-[34px] px-6 py-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h2 className="m-0 text-[21px] font-bold">Latest updates</h2>
        <Link to="/tasks" className="pillbtn light h-9 px-[18px] text-[12.5px]">
          Write an EOD update
        </Link>
      </div>

      {latestUpdates.map((update) => (
        <div key={update.id} className="flex flex-col gap-2 rounded-[22px] bg-white/[0.88] px-[18px] py-[15px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[14.5px] font-bold">{update.title}</span>
            <span className="rounded-full bg-[#EEF2FB] px-2.5 py-[3px] text-[11px] font-bold text-[#2E384D]">
              {update.hours}
            </span>
            <span className={`rounded-full px-2.5 py-[3px] text-[11px] font-bold ${MOOD_COLOUR[update.mood]}`}>
              {update.mood}
            </span>
          </div>
          <p className="m-0 text-[13px] leading-[1.6] text-[#3A455C]">{update.comment}</p>
          <span className="text-[11.5px] font-semibold text-muted">{update.when}</span>
        </div>
      ))}

      <p className="mb-0 mt-auto text-xs leading-[1.55] text-muted">
        Each update adds its hours to your performance report. Write one at the end of the day from the tasks board.
      </p>
    </section>
  )
}
