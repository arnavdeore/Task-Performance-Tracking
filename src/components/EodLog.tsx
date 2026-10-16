import { statusNames } from '../data/tasks'
import type { EodUpdate } from '../data/tasks'
import { formatIso, weekdayOfIso } from '../lib/dates'
import { MOOD_COLOUR } from './moodColours'
import { STATUS_COLOUR } from './statusColours'

type EodLogProps = {
  log: EodUpdate[]
  today: string
}

/** "EOD updates": the log grouped by day, newest first, with the hours logged each day. */
export default function EodLog({ log, today }: EodLogProps) {
  // Today is always listed, even before the first update is written. ISO dates sort correctly as text.
  const dates = Array.from(new Set([today, ...log.map((entry) => entry.date)])).sort().reverse()

  return (
    <section className="white box-border flex flex-[1_1_auto] flex-col gap-5 rounded-[34px] px-[30px] py-[26px]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2 className="m-0 text-[21px] font-bold">EOD updates</h2>
        <span className="text-[13px] text-muted">Newest first. Hours here feed your performance report.</span>
      </div>

      {dates.map((date) => {
        const entries = log.filter((entry) => entry.date === date)
        const hours = Math.round(entries.reduce((sum, entry) => sum + entry.hours, 0) * 10) / 10
        return (
          <div key={date} className="flex flex-col gap-3">
            <div className="flex flex-wrap justify-between gap-2 px-1 text-[13px] font-bold text-muted">
              <span>
                {date === today ? 'Today, ' : ''}
                {weekdayOfIso(date)} {formatIso(date)}
              </span>
              <span>{hours ? `${hours}h logged` : 'No hours logged'}</span>
            </div>

            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-2.5 rounded-3xl border border-[#E7EDF7] bg-[#F4F7FD] px-[22px] py-[18px]"
              >
                <div className="flex flex-wrap items-center gap-[9px]">
                  <span className="mr-1.5 text-[15.5px] font-bold">{entry.title}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-[11.5px] font-bold text-ink">{entry.hours}h</span>
                  <span className={`rounded-full px-3 py-1 text-[11.5px] font-bold ${MOOD_COLOUR[entry.mood]}`}>
                    {entry.mood}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-[11.5px] font-bold ${STATUS_COLOUR[entry.statusAfter]}`}>
                    {statusNames[entry.statusAfter]}
                  </span>
                </div>
                <div className="max-w-[92ch] text-sm leading-[1.65] text-[#2E384D]">{entry.comment}</div>
                {entry.next && <div className="text-[13px] leading-[1.6] text-muted">Next: {entry.next}</div>}
              </div>
            ))}

            {entries.length === 0 && (
              <div className="rounded-[22px] border-[1.5px] border-dashed border-[#AEBBD3] p-[22px] text-[13.5px] text-muted">
                No update yet. Use the EOD update button to write one.
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}
