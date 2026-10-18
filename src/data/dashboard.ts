// Types and names for the Dashboard. The numbers are worked out from the user's tasks and EOD updates in src/lib/dashboardStats.ts.

export type Tone = 'blue' | 'green' | 'red' | 'ink'

export type StatTileData = {
  label: string
  value: string
  sub: string
  tone: Tone
  /** Where the tile links to. Leave out for a plain, non-clickable tile. */
  to?: string
}

export type CategoryKey = 'dev' | 'clean' | 'mgmt' | 'bi'

export const categoryNames: Record<CategoryKey, string> = {
  dev: 'Development',
  clean: 'Data Cleaning',
  mgmt: 'Data Management',
  bi: 'Power BI',
}

// ---- Deadline watch ----

export type DeadlineStatus = 'todo' | 'progress' | 'waiting' | 'overdue'

export type DeadlineRow = {
  id: string
  title: string
  category: CategoryKey
  /** Already in the short "13 Oct" form; empty when the task has no tentative date. */
  tentative: string
  /** Already in the short "15 Oct" form. */
  fixed: string
  status: DeadlineStatus
  /** Fixed date has passed. */
  overdue: boolean
  /** Fixed date falls in the next 7 days (an overdue task counts too when the "Next 7 days" filter is on). */
  dueSoon: boolean
}

// ---- Latest updates ----

export type Mood = 'On track' | 'At risk' | 'Blocked'

export type LatestUpdate = {
  id: string
  title: string
  /** For example "2h" or "1.5h". */
  hours: string
  mood: Mood
  comment: string
  /** Shown as written, e.g. "Yesterday, 12 Oct". */
  when: string
}

// ---- Month calendar ----

export type CalendarDeadline = {
  title: string
  /** ISO dates, YYYY-MM-DD. Tentative is '' when the task has none. */
  tentative: string
  fixed: string
}
