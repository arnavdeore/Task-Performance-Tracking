import type { TaskStatus } from '../data/tasks'

// Chip colours for the four task statuses, shared by the EOD log and the EOD pop-up.
// Full class names are written out so Tailwind can see them.
export const STATUS_COLOUR: Record<TaskStatus, string> = {
  todo: 'bg-[#EEF1F6] text-muted-2',
  progress: 'bg-blue-pastel text-blue-dark',
  waiting: 'bg-lavender-pastel text-lavender-dark',
  done: 'bg-green-pastel text-green-dark',
}
