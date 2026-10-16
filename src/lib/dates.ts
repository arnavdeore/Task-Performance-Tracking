const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Index of a date's weekday with Monday = 0 … Sunday = 6 (the week starts Monday). */
export function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7
}

/** The seven days of the week that contains `date`, Monday first. */
export function weekDates(date: Date): Date[] {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayIndex(date))
  return Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i))
}

/** "16 Oct" */
export function shortDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

/** "Good morning" / "Good afternoon" / "Good evening" from the clock. */
export function greeting(date: Date): string {
  const hour = date.getHours()
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

/** "Fri, 16 Oct 2026" */
export function longDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}
