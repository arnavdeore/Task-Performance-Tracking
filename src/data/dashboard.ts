// Mock data for the Dashboard (from design/Main.dc.html). Replaced by Supabase queries in Phase 3.

export type Tone = 'blue' | 'green' | 'red'

export type StatTileData = {
  label: string
  value: string
  sub: string
  tone: Tone
  to: string
}

export const statTiles: StatTileData[] = [
  { label: 'Open tasks', value: '9', sub: '5 due this week', tone: 'blue', to: '/tasks' },
  { label: 'Done this month', value: '23', sub: '4 more than September', tone: 'green', to: '/performance' },
  { label: 'On time, fixed dates', value: '87%', sub: 'Target 90%', tone: 'green', to: '/performance' },
  { label: 'Overdue', value: '1', sub: 'Oldest 2 days late', tone: 'red', to: '/tasks' },
]

// ---- Today's tasks ----

export type CategoryKey = 'dev' | 'clean' | 'mgmt' | 'bi'

export const categoryNames: Record<CategoryKey, string> = {
  dev: 'Development',
  clean: 'Data Cleaning',
  mgmt: 'Data Management',
  bi: 'Power BI',
}

export type TodayTask = {
  id: string
  title: string
  priority: string
  category: CategoryKey
  /** Tentative deadline, already in the short "13 Oct" form. */
  tentative: string
  /** Fixed deadline, already in the short "15 Oct" form. */
  fixed: string
  estimateHours: number
  loggedHours: number
}

export const todayTasks: TodayTask[] = [
  {
    id: 't1',
    title: 'Review sales dashboard KPIs',
    priority: 'High priority',
    category: 'bi',
    tentative: '10 Oct',
    fixed: '11 Oct',
    estimateHours: 3,
    loggedHours: 2,
  },
  {
    id: 't2',
    title: 'Fix sync script bug',
    priority: 'High priority',
    category: 'dev',
    tentative: '13 Oct',
    fixed: '15 Oct',
    estimateHours: 3,
    loggedHours: 2,
  },
  {
    id: 't3',
    title: 'Clean customer export file',
    priority: 'Medium priority',
    category: 'clean',
    tentative: '14 Oct',
    fixed: '16 Oct',
    estimateHours: 4,
    loggedHours: 1.5,
  },
]
