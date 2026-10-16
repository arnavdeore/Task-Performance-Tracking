import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import type { Priority, Task, TaskStatus } from '../data/tasks'
import { daysBetween, formatIso } from '../lib/dates'

// Full class names are written out so Tailwind can see them.
const CATEGORY_STYLE: Record<CategoryKey, { stripe: string; dot: string; bar: string; text: string }> = {
  dev: { stripe: 'border-l-blue', dot: 'bg-blue', bar: 'bg-blue', text: 'text-blue-dark' },
  clean: { stripe: 'border-l-green', dot: 'bg-green', bar: 'bg-green', text: 'text-green-dark' },
  mgmt: { stripe: 'border-l-lavender', dot: 'bg-lavender', bar: 'bg-lavender', text: 'text-lavender-dark' },
  bi: { stripe: 'border-l-amber', dot: 'bg-amber', bar: 'bg-amber', text: 'text-amber-dark' },
}

const PRIORITY_STYLE: Record<Priority, { label: string; colour: string }> = {
  high: { label: 'High priority', colour: 'bg-red-pastel text-red-dark' },
  medium: { label: 'Medium priority', colour: 'bg-[#EEF2FB] text-[#3A455C]' },
  low: { label: 'Low priority', colour: 'bg-[#F2F5F9] text-muted' },
}

/** What the dark button does, and where the card goes when it is pressed. */
const MOVE: Record<TaskStatus, { to: TaskStatus; label: string }> = {
  todo: { to: 'progress', label: 'Start' },
  progress: { to: 'done', label: 'Mark done' },
  waiting: { to: 'progress', label: 'Resume' },
  done: { to: 'progress', label: 'Reopen' },
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

/** The status line above the progress bar, with its colour. */
function footLine(task: Task, today: string): { text: string; colour: string } {
  if (task.status === 'done') {
    const late = daysBetween(task.fixed, task.completedOn)
    return {
      text: `Done ${formatIso(task.completedOn)}${late > 0 ? `, ${plural(late, 'day', 'days')} late` : ', on time'}`,
      colour: late > 0 ? 'text-red-dark' : 'text-green-dark',
    }
  }
  if (task.fixed < today) {
    return { text: `Overdue by ${plural(daysBetween(task.fixed, today), 'day', 'days')}`, colour: 'text-red-dark' }
  }
  const estimate = task.estimateHours ? `Est ${task.estimateHours}h` : 'No estimate'
  return { text: estimate + (task.loggedHours ? `, ${task.loggedHours}h logged` : ''), colour: 'text-muted' }
}

type TaskCardProps = {
  task: Task
  today: string
  selected: boolean
  onMove: (id: string, to: TaskStatus) => void
  onLog?: (id: string) => void
}

/** One card on the Tasks board. Layout from design/Tasks.dc.html. */
export default function TaskCard({ task, today, selected, onMove, onLog }: TaskCardProps) {
  const category = CATEGORY_STYLE[task.category]
  const priority = PRIORITY_STYLE[task.priority]
  const foot = footLine(task, today)
  const move = MOVE[task.status]
  const percent =
    task.status === 'done'
      ? 100
      : task.estimateHours
        ? Math.min(100, Math.round((task.loggedHours / task.estimateHours) * 100))
        : 0
  const hoursText = task.estimateHours
    ? `${task.loggedHours}/${task.estimateHours}h`
    : task.loggedHours
      ? `${task.loggedHours}h`
      : 'No estimate'

  return (
    <article
      className={`tcard border-l-[6px] transition duration-200 hover:-translate-y-[3px] ${category.stripe}${selected ? ' sel' : ''}`}
    >
      <div className="flex items-center justify-between gap-2.5">
        <span className={`flex min-w-0 items-center gap-[7px] text-[12.5px] font-bold ${category.text}`}>
          <span className={`h-2 w-2 flex-none rounded-full ${category.dot}`} />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{categoryNames[task.category]}</span>
        </span>
        <span className={`flex-none rounded-full px-3 py-1 text-[11.5px] font-bold ${priority.colour}`}>
          {priority.label}
        </span>
      </div>

      <h3 className="m-0 text-lg font-semibold leading-[1.35] tracking-[-0.01em]">{task.title}</h3>

      <div className="flex flex-wrap gap-2">
        <span className="dchip tentc">Tentative {formatIso(task.tentative)}</span>
        <span className="dchip fixc">Fixed {formatIso(task.fixed)}</span>
      </div>

      {task.notes && (
        <p className="m-0 line-clamp-2 text-[13px] leading-[1.6] text-muted-2">{task.notes}</p>
      )}

      <div className="flex flex-col gap-2 pt-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2.5 gap-y-1">
          <span className={`text-[12.5px] font-bold ${foot.colour}`}>{foot.text}</span>
          <span className="text-[12.5px] font-bold text-[#2E384D]">{hoursText}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#EDF1F8]">
          <div className={`h-full rounded-full ${category.bar}`} style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="flex gap-2.5 pt-0.5">
        <button
          type="button"
          className="pillbtn light h-11 flex-1 bg-[#F1F4FB] px-3 text-[13px] shadow-none md:h-[42px]"
          onClick={() => onLog?.(task.id)}
        >
          Log update
        </button>
        <button
          type="button"
          className="pillbtn dark h-11 flex-1 px-3 text-[13px] md:h-[42px]"
          onClick={() => onMove(task.id, move.to)}
        >
          {move.label}
        </button>
      </div>
    </article>
  )
}
