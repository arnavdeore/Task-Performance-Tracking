import { useState } from 'react'
import { calendarDeadlines } from '../data/dashboard'
import { bankSaturdayWhich, festivalName, festivalsInMonth, holidayName, holidaysInMonth, isBankSaturday } from '../lib/holidays.js'
import { thoughtLib } from '../lib/thoughtLib'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** "2026-10-07" from a year, a month index (0 = January) and a day. */
function isoDate(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Hindu calendar line for a day, read at about sunrise (6 am), like a printed panchang: "Shukla Dashami, Ashvina". */
function tithiLine(year: number, monthIndex: number, day: number): string {
  const p = thoughtLib.panchang(new Date(year, monthIndex, day, 6, 0).getTime())
  return `${p.tithi}, ${p.month}`
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

const iconProps = {
  'aria-hidden': true,
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/**
 * Month calendar for the Dashboard: fixed deadlines (red dot), tentative dates (blue ring),
 * Indian holidays and bank closures. Behaviour and layout from design/Main.dc.html.
 */
export default function MonthCalendar() {
  const [now] = useState(() => new Date())
  const [monthOffset, setMonthOffset] = useState(0)
  const [selected, setSelected] = useState('') // ISO date of the clicked day, or ''

  const todayKey = isoDate(now.getFullYear(), now.getMonth(), now.getDate())
  const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const year = first.getFullYear()
  const month = first.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthHolidays = holidaysInMonth(year, month)
  const monthFestivals = festivalsInMonth(year, month)

  let fixedCount = 0
  let tentativeCount = 0
  const cells = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    const key = isoDate(year, month, day)
    const fixed = calendarDeadlines.filter((item) => item.fixed === key)
    const tentative = calendarDeadlines.filter((item) => item.tentative === key)
    fixedCount += fixed.length
    tentativeCount += tentative.length
    const holiday = holidayName(key)
    const festival = festivalName(key)
    const tithi = tithiLine(year, month, day)
    const bankSaturday = isBankSaturday(key)
    const isToday = key === todayKey
    const isSelected = key === selected
    const parts = [...fixed.map((i) => `${i.title}, fixed`), ...tentative.map((i) => `${i.title}, tentative`)]
    const kind = holiday ? 'hol ' : bankSaturday ? 'sat ' : ''
    return {
      day,
      key,
      column: ((new Date(year, month, day).getDay() + 6) % 7) + 1,
      className: `day ${kind}${isToday ? 'today ' : ''}${isSelected ? 'sel' : ''}`,
      isSelected,
      hasHoliday: Boolean(holiday),
      hasFestival: Boolean(festival),
      tooltip: `${tithi}${festival ? ` · ${festival}` : ''}${holiday ? ` · ${holiday}` : ''}`,
      hasFixed: fixed.length > 0,
      hasTentative: tentative.length > 0,
      label:
        `${day} ${MONTH_NAMES[month]} ${year}` +
        (isToday ? ', today' : '') +
        `. ${tithi}` +
        (festival ? `. ${festival}` : '') +
        (holiday ? `. Holiday, ${holiday}` : bankSaturday ? '. Banks closed' : '') +
        (parts.length ? `. ${parts.join('. ')}` : '. Nothing due'),
    }
  })

  let note: string
  const selectedDay = selected.startsWith(isoDate(year, month, 1).slice(0, 7)) ? Number(selected.slice(8)) : 0
  if (selectedDay) {
    const items = calendarDeadlines.filter((item) => item.fixed === selected || item.tentative === selected)
    const holiday = holidayName(selected)
    const festival = festivalName(selected)
    const bits: string[] = []
    if (festival) bits.push(festival)
    if (holiday) bits.push(`holiday, ${holiday}`)
    else if (isBankSaturday(selected)) bits.push(`banks closed, ${bankSaturdayWhich(selected)} Saturday`)
    items.forEach((item) => bits.push(`${item.title} (${item.fixed === selected ? 'fixed' : 'tentative'})`))
    note = `${selectedDay} ${MONTH_NAMES[month]} · ${tithiLine(year, month, selectedDay)}: ${bits.length ? bits.join('; ') : 'nothing due'}`
  } else {
    note =
      `${MONTH_NAMES[month]} has ${plural(fixedCount, 'fixed deadline', 'fixed deadlines')}, ` +
      `${plural(tentativeCount, 'tentative date', 'tentative dates')} and ` +
      `${plural(monthHolidays.length, 'holiday', 'holidays')}. Click a date to see it with its Hindu calendar tithi.`
  }

  function goToMonth(offset: number) {
    setMonthOffset(offset)
    setSelected('')
  }

  return (
    <section className="glass box-border flex min-w-0 flex-[1_1_380px] flex-col gap-3 rounded-[34px] px-6 py-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <h2 className="m-0 text-[21px] font-bold">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="icobtn"
            aria-label="Previous month"
            style={{ width: 32, height: 32 }}
            onClick={() => goToMonth(monthOffset - 1)}
          >
            <svg {...iconProps}>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className={`segb${monthOffset === 0 && !selected ? ' on' : ''}`}
            style={{ height: 30, padding: '0 12px' }}
            onClick={() => goToMonth(0)}
          >
            Today
          </button>
          <button
            type="button"
            className="icobtn"
            aria-label="Next month"
            style={{ width: 32, height: 32 }}
            onClick={() => goToMonth(monthOffset + 1)}
          >
            <svg {...iconProps}>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div aria-hidden="true" className="grid grid-cols-7 gap-[5px]">
        {WEEKDAYS.map((name) => (
          <div key={name} className="wkh">
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[5px]">
        {cells.map((cell) => (
          <button
            key={cell.key}
            type="button"
            className={cell.className}
            aria-label={cell.label}
            aria-pressed={cell.isSelected}
            title={cell.tooltip}
            style={{ gridColumnStart: cell.column }}
            onClick={() => setSelected(cell.isSelected ? '' : cell.key)}
          >
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-[5px] h-[5px] w-[5px] rounded-full"
              style={{ background: cell.hasHoliday ? '#E0A124' : 'transparent' }}
            />
            <span
              aria-hidden="true"
              className="absolute left-1.5 top-[5px] h-[5px] w-[5px] rounded-full"
              style={{ background: cell.hasFestival ? '#8B7BE0' : 'transparent' }}
            />
            <span>{cell.day}</span>
            <span aria-hidden="true" className="flex h-[7px] items-center gap-[3px]">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: cell.hasFixed ? '#C23A3A' : 'transparent' }}
              />
              <span
                className="box-border h-[7px] w-[7px] rounded-full border-[1.5px] border-solid"
                style={{ borderColor: cell.hasTentative ? '#2457C5' : 'transparent' }}
              />
            </span>
          </button>
        ))}
      </div>

      <div aria-live="polite" className="rounded-2xl bg-white/80 px-3.5 py-2.5 text-[12.5px] leading-normal text-[#2E384D]">
        {note}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {monthHolidays.map((holiday) => (
          <span key={holiday.date} className="rounded-full bg-holiday-cell px-[11px] py-1 text-[11.5px] font-bold text-[#6B4A07]">
            {holiday.day} {MONTH_NAMES[month].slice(0, 3)} · {holiday.name}
          </span>
        ))}
        {monthFestivals.map((festival) => (
          <span
            key={festival.date}
            className="rounded-full bg-lavender-pastel px-[11px] py-1 text-[11.5px] font-bold text-lavender-dark"
          >
            {festival.day} {MONTH_NAMES[month].slice(0, 3)} · {festival.name}
          </span>
        ))}
        {monthHolidays.length === 0 && monthFestivals.length === 0 && (
          <span className="text-[11.5px] text-muted">No holidays or festivals listed for this month.</span>
        )}
      </div>

      <div className="mt-auto flex flex-wrap gap-x-3.5 gap-y-1.5 border-t border-[rgba(35,43,94,0.08)] pt-2.5 text-[11px] text-muted-2">
        <span className="flex items-center gap-1.5">
          <span className="box-border h-[9px] w-[9px] rounded-full border-[1.5px] border-solid border-blue" />
          Tentative date
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[9px] w-[9px] rounded-full bg-red" />
          Fixed deadline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[9px] w-[9px] rounded-[3px] bg-holiday-cell shadow-[inset_0_0_0_1px_#E0A124]" />
          Holiday
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[9px] w-[9px] rounded-full bg-lavender" />
          Hindu festival
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[9px] w-[9px] rounded-[3px] bg-bank-cell" />
          Banks closed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[9px] w-[9px] rounded-[3px] bg-navy" />
          Today
        </span>
      </div>
    </section>
  )
}
