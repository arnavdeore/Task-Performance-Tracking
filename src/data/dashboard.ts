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
