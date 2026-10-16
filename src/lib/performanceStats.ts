import type { MonthStats, Period, WeekStats } from '../data/performance'

export type PeriodSummary = {
  done: number
  onTime: number
  tentativeHit: number
  lateCount: number
  /** Percent of finished tasks that met the fixed date. */
  fixedPercent: number
  /** Percent of finished tasks that met the tentative date. */
  tentativePercent: number
  /** Average days late, over the tasks that finished late. 0 when none were late. */
  averageDelayDays: number
}

/** First and last month index (inclusive) that a period covers, given the index of the current month. */
export function periodRange(period: Period, currentIndex: number): [number, number] {
  if (period === 'm1') return [currentIndex, currentIndex]
  if (period === 'm3') return [Math.max(0, currentIndex - 2), currentIndex]
  return [0, currentIndex]
}

function percent(part: number, whole: number): number {
  return whole ? Math.round((part / whole) * 100) : 0
}

/** On-time percent of one month. */
export function monthPercent(month: MonthStats): number {
  return percent(month.onTime, month.done)
}

export type InsightTone = 'green' | 'red' | 'amber' | 'blue'

export type Insight = {
  tag: string
  tone: InsightTone
  title: string
  text: string
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

/**
 * Plain-language readout of the numbers for "What this means".
 * `when` is the period as a phrase ("this month"); `first` and `last` are the month range it covers.
 */
export function buildInsights(
  months: MonthStats[],
  first: number,
  last: number,
  summary: PeriodSummary,
  when: string,
  target: number,
): Insight[] {
  const { fixedPercent, tentativePercent, lateCount, averageDelayDays } = summary
  const insights: Insight[] = []

  insights.push(
    fixedPercent >= target
      ? {
          tag: 'On track',
          tone: 'green',
          title: 'Fixed deadlines',
          text: `You met ${fixedPercent}% of your committed dates in ${when}, at or above your ${target}% target.`,
        }
      : {
          tag: 'Watch',
          tone: 'red',
          title: 'Fixed deadlines',
          text: `You are ${target - fixedPercent} points under your ${target}% target in ${when}. ${plural(lateCount, 'task', 'tasks')} finished late, by ${averageDelayDays.toFixed(1)} days on average.`,
        },
  )

  const gap = fixedPercent - tentativePercent
  insights.push(
    gap >= 15
      ? {
          tag: 'Tip',
          tone: 'amber',
          title: 'Tentative dates run tight',
          text: `You hit ${tentativePercent}% of your own targets but ${fixedPercent}% of fixed dates. Add a day of buffer when you set tentative dates.`,
        }
      : {
          tag: 'On track',
          tone: 'green',
          title: 'Tentative dates are realistic',
          text: `Your own targets and your commitments are within ${gap} points of each other.`,
        },
  )

  // Compare with the month before a one-month period, or with the first month of a longer one.
  const compare = first === last ? first - 1 : first
  if (compare >= 0) {
    const change = monthPercent(months[last]) - monthPercent(months[compare])
    const range = `${months[compare].month} (${monthPercent(months[compare])}% to ${monthPercent(months[last])}%)`
    insights.push(
      change >= 0
        ? {
            tag: 'Trend',
            tone: 'blue',
            title: 'Moving the right way',
            text: `On-time rate is ${change === 0 ? 'unchanged' : `up ${change} points`} since ${range}.`,
          }
        : {
            tag: 'Trend',
            tone: 'amber',
            title: 'Slipped a little',
            text: `On-time rate is down ${Math.abs(change)} points since ${range}.`,
          },
    )
  }

  return insights
}

/** How far actual hours ran over (+) or under (-) the plan, in percent. 0 when nothing was planned. */
export function hoursVariancePercent(planned: number, actual: number): number {
  return planned ? Math.round(((actual - planned) / planned) * 100) : 0
}

/** Completion percent of one week. */
export function weekPercent(week: WeekStats): number {
  return percent(week.done, week.planned)
}

export type WeekReadout = {
  percent: number
  /** Percentage points up (positive) or down (negative) against the week before; null for the first week shown. */
  changePoints: number | null
  /** Average completion over this week and the three before it. */
  fourWeekAverage: number
  bestLabel: string
  bestPercent: number
  /** Planned tasks that were not finished. */
  carriedOver: number
}

/** Everything the readout column shows for the selected week. */
export function readWeek(weeks: WeekStats[], selected: number): WeekReadout {
  const percents = weeks.map(weekPercent)
  let sum = 0
  let count = 0
  for (let i = Math.max(0, selected - 3); i <= selected; i++) {
    sum += percents[i]
    count++
  }
  let best = 0
  for (let i = 1; i < weeks.length; i++) {
    if (percents[i] > percents[best]) best = i
  }
  return {
    percent: percents[selected],
    changePoints: selected === 0 ? null : percents[selected] - percents[selected - 1],
    fourWeekAverage: Math.round(sum / count),
    bestLabel: weeks[best].label,
    bestPercent: percents[best],
    carriedOver: weeks[selected].planned - weeks[selected].done,
  }
}

/** Adds up the months from `first` to `last` and works out the three headline numbers. */
export function summarise(months: MonthStats[], first: number, last: number): PeriodSummary {
  let done = 0
  let onTime = 0
  let tentativeHit = 0
  let lateDays = 0
  for (let i = first; i <= last; i++) {
    done += months[i].done
    onTime += months[i].onTime
    tentativeHit += months[i].tentativeHit
    lateDays += months[i].lateDays
  }
  const lateCount = done - onTime
  return {
    done,
    onTime,
    tentativeHit,
    lateCount,
    fixedPercent: percent(onTime, done),
    tentativePercent: percent(tentativeHit, done),
    averageDelayDays: lateCount ? Math.round((lateDays / lateCount) * 10) / 10 : 0,
  }
}
