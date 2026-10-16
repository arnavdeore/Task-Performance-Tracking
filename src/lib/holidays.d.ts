export const HOL_FIXED: Record<string, string>
export const HOL_BY_YEAR: Record<number, Record<string, string>>

/** iso: 'YYYY-MM-DD'. Returns the holiday name, or '' for an ordinary day. */
export function holidayName(iso: string): string
/** True when banks are shut for the second or fourth Saturday of the month. */
export function isBankSaturday(iso: string): boolean
export function bankSaturdayWhich(iso: string): 'second' | 'fourth' | ''
export function holidaysInMonth(year: number, monthIndex: number): { date: string; day: number; name: string }[]

export const FESTIVALS_BY_YEAR: Record<number, Record<string, string>>
/** Hindu festival (not a public holiday) on this ISO date, or ''. */
export function festivalName(iso: string): string
export function festivalsInMonth(year: number, monthIndex: number): { date: string; day: number; name: string }[]
