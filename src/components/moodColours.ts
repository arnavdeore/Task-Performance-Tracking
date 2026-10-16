import type { Mood } from '../data/dashboard'

// Chip colours for the three moods, shared by Latest updates (Dashboard) and the EOD log (Tasks).
// Full class names are written out so Tailwind can see them.
export const MOOD_COLOUR: Record<Mood, string> = {
  'On track': 'bg-green-pastel text-green-dark',
  'At risk': 'bg-amber-pastel text-amber-dark',
  Blocked: 'bg-red-pastel text-red-dark',
}
