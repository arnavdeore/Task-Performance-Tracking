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

type BadgeIcon = 'clock' | 'alert' | 'check'

/** The badge above the progress bar: how close the fixed date is (or how it ended), with a colour that says how urgent it is. */
function statusBadge(task: Task, today: string): { text: string; colour: string; icon: BadgeIcon; late: boolean } {
  if (task.status === 'done') {
    const late = daysBetween(task.fixed, task.completedOn)
    return late > 0
      ? { text: `Done ${formatIso(task.completedOn)}, ${plural(late, 'day', 'days')} late`, colour: 'bg-red-pastel text-red-dark', icon: 'alert', late: false }
      : { text: `Done ${formatIso(task.completedOn)}, on time`, colour: 'bg-green-pastel text-green-dark', icon: 'check', late: false }
  }
  const left = daysBetween(today, task.fixed)
  if (left < 0) {
    return { text: `Overdue ${plural(-left, 'day', 'days')}`, colour: 'bg-red text-white', icon: 'alert', late: true }
  }
  if (left === 0) return { text: 'Due today', colour: 'bg-amber-pastel text-amber-dark', icon: 'clock', late: false }
  if (left === 1) return { text: 'Due tomorrow', colour: 'bg-amber-pastel text-amber-dark', icon: 'clock', late: false }
  return { text: `Due in ${left} days`, colour: 'bg-blue-pastel text-blue-dark', icon: 'clock', late: false }
}

function BadgeSymbol({ icon }: { icon: BadgeIcon }) {
  return (
    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      {icon === 'clock' && <path d="M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z" />}
      {icon === 'alert' && <path d="M12 8v5M12 17h.01M10.3 3.9L2.4 18a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />}
      {icon === 'check' && <path d="M5 12.5l4.5 4.5L19 7.5" />}
    </svg>
  )
}

type TaskCardProps = {
  task: Task
  today: string
  selected: boolean
  onMove: (id: string, to: TaskStatus) => void
  onLog?: (id: string) => void
  /** Opens the Edit task pop-up for this card. */
  onEdit?: (id: string) => void
  /** Opens the read-only Task details pop-up for this card. */
  onView?: (id: string) => void
}

/** One card on the Tasks board. Each status has its own look (see .tcard.st-* in index.css). Compact on purpose. Layout from design/Tasks.dc.html. */
export default function TaskCard({ task, today, selected, onMove, onLog, onEdit, onView }: TaskCardProps) {
  const category = CATEGORY_STYLE[task.category]
  const priority = PRIORITY_STYLE[task.priority]
  const badge = statusBadge(task, today)
  const finished = task.status === 'done'
  const move = MOVE[task.status]
  const percent = task.estimateHours ? Math.min(100, Math.round((task.loggedHours / task.estimateHours) * 100)) : 0
  const hoursText = task.estimateHours
    ? task.status === 'todo'
      ? `Est ${task.estimateHours}h`
      : `${task.loggedHours} of ${task.estimateHours}h`
    : task.loggedHours
      ? `${task.loggedHours}h`
      : 'No estimate'

  return (
    <article
      className={`tcard st-${task.status} border-l-[5px] transition duration-200 hover:-translate-y-0.5 ${category.stripe}${badge.late ? ' late' : ''}${selected ? ' sel' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`flex min-w-0 items-center gap-1.5 text-xs font-bold ${category.text}`}>
          <span className={`h-[7px] w-[7px] flex-none rounded-full ${category.dot}`} />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{categoryNames[task.category]}</span>
        </span>
        <span className="flex flex-none items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${priority.colour}`}>{priority.label}</span>
          {onView && (
            <button
              type="button"
              aria-label={`View details of "${task.title}"`}
              title="View details"
              className="-my-1.5 flex h-9 w-9 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-2 hover:bg-white/80 hover:text-navy"
              onClick={() => onView(task.id)}
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              aria-label={`Edit "${task.title}"`}
              title="Edit task"
              className="-my-1.5 -mr-1.5 flex h-9 w-9 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-muted-2 hover:bg-white/80 hover:text-navy"
              onClick={() => onEdit(task.id)}
            >
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.5 4.5l4 4L8 20l-5 1 1-5L15.5 4.5z" />
              </svg>
            </button>
          )}
        </span>
      </div>

      <h3 className="m-0 text-base font-semibold leading-[1.3] tracking-[-0.01em]">{task.title}</h3>

      <div className="flex flex-wrap gap-1.5">
        <span className="dchip tentc">Tentative {formatIso(task.tentative)}</span>
        <span className="dchip fixc">Fixed {formatIso(task.fixed)}</span>
      </div>

      {/* Waiting cards show the note as a callout (it says what they are waiting for); other open cards show one line. */}
      {task.notes && task.status === 'waiting' && (
        <p className="m-0 flex items-start gap-1.5 rounded-xl bg-white/70 px-2.5 py-1.5 text-xs leading-[1.5] text-lavender-dark">
          <svg aria-hidden="true" className="mt-[3px] flex-none" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="4" width="5" height="16" rx="1.5" />
            <rect x="14" y="4" width="5" height="16" rx="1.5" />
          </svg>
          <span className="line-clamp-2">{task.notes}</span>
        </p>
      )}
      {task.notes && (task.status === 'todo' || task.status === 'progress') && (
        <p className="m-0 line-clamp-1 text-xs leading-[1.5] text-muted-2">{task.notes}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${badge.colour}`}>
          <BadgeSymbol icon={badge.icon} />
          {badge.text}
        </span>
        {finished ? (
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent px-1 py-1 font-sans text-xs font-bold text-navy underline-offset-2 hover:underline"
            onClick={() => onMove(task.id, move.to)}
          >
            {move.label}
          </button>
        ) : (
          <span className="text-xs font-bold text-[#2E384D]">{hoursText}</span>
        )}
      </div>

      {/* To do cards have nothing logged yet, so they skip the bar. */}
      {(task.status === 'progress' || task.status === 'waiting') && (
        <div className="h-2 overflow-hidden rounded-full bg-white/80">
          <div className={`h-full rounded-full ${category.bar}`} style={{ width: `${percent}%` }} />
        </div>
      )}

      {!finished && (
        <div className="flex gap-2">
          <button
            type="button"
            className="pillbtn light h-11 flex-1 bg-white/80 px-3 text-[13px] shadow-none md:h-9 md:text-xs"
            onClick={() => onLog?.(task.id)}
          >
            EOD update
          </button>
          <button
            type="button"
            className="pillbtn dark h-11 flex-1 px-3 text-[13px] md:h-9 md:text-xs"
            onClick={() => onMove(task.id, move.to)}
          >
            {move.label}
          </button>
        </div>
      )}
    </article>
  )
}
