import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import { statusNames } from '../data/tasks'
import type { EodUpdate, Priority, Task } from '../data/tasks'
import { daysBetween, formatIso, weekdayOfIso } from '../lib/dates'
import { MOOD_COLOUR } from './moodColours'
import Modal from './Modal'
import { SHEET_FOOTER } from './sheetFooter'
import { STATUS_COLOUR } from './statusColours'

// Full class names are written out so Tailwind can see them.
const CATEGORY_TEXT: Record<CategoryKey, { dot: string; text: string; bar: string }> = {
  dev: { dot: 'bg-blue', text: 'text-blue-dark', bar: 'bg-blue' },
  clean: { dot: 'bg-green', text: 'text-green-dark', bar: 'bg-green' },
  mgmt: { dot: 'bg-lavender', text: 'text-lavender-dark', bar: 'bg-lavender' },
  bi: { dot: 'bg-amber', text: 'text-amber-dark', bar: 'bg-amber' },
}

const PRIORITY_STYLE: Record<Priority, { label: string; colour: string }> = {
  high: { label: 'High priority', colour: 'bg-red-pastel text-red-dark' },
  medium: { label: 'Medium priority', colour: 'bg-[#EEF2FB] text-[#3A455C]' },
  low: { label: 'Low priority', colour: 'bg-[#F2F5F9] text-muted' },
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

/** One line under the fixed date: how it ended, or how close it is. */
function fixedNote(task: Task, today: string): string {
  if (task.status === 'done') {
    const late = daysBetween(task.fixed, task.completedOn)
    return late > 0
      ? `Finished ${formatIso(task.completedOn)}, ${plural(late, 'day', 'days')} late`
      : `Finished ${formatIso(task.completedOn)}, on time`
  }
  const left = daysBetween(today, task.fixed)
  if (left < 0) return `Overdue by ${plural(-left, 'day', 'days')}`
  if (left === 0) return 'Due today'
  if (left === 1) return 'Due tomorrow'
  return `Due in ${left} days`
}

type ViewTaskModalProps = {
  task: Task
  /** This task's EOD updates, newest first. */
  updates: EodUpdate[]
  today: string
  onClose: () => void
  onEdit: () => void
  onLog: () => void
}

/** A read-only pop-up with everything about one task: dates, hours, the full notes and its EOD updates. */
export default function ViewTaskModal({ task, updates, today, onClose, onEdit, onLog }: ViewTaskModalProps) {
  const category = CATEGORY_TEXT[task.category]
  const priority = PRIORITY_STYLE[task.priority]
  const finished = task.status === 'done'
  const percent = task.estimateHours ? Math.min(100, Math.round((task.loggedHours / task.estimateHours) * 100)) : 0
  const over = task.estimateHours > 0 && task.loggedHours > task.estimateHours

  return (
    <Modal title="Task details" subtitle="Everything about this task in one place." onClose={onClose}>
      <div className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`flex items-center gap-1.5 text-[13px] font-bold ${category.text}`}>
              <span className={`h-2 w-2 rounded-full ${category.dot}`} />
              {categoryNames[task.category]}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${priority.colour}`}>{priority.label}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOUR[task.status]}`}>
              {statusNames[task.status]}
            </span>
          </div>
          <h3 className="m-0 break-words text-[22px] font-bold leading-[1.3] tracking-[-0.01em]">{task.title}</h3>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
          <div className="flex flex-col gap-2 rounded-[20px] bg-[#F4F7FD] px-[18px] py-[14px]">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-muted">Tentative target</span>
            {task.tentative ? (
              <span className="dchip tentc self-start">{formatIso(task.tentative)}</span>
            ) : (
              <span className="text-sm text-muted">Not set</span>
            )}
            <span className="text-xs text-muted">Your own target. It can move.</span>
          </div>
          <div className="flex flex-col gap-2 rounded-[20px] bg-[#F4F7FD] px-[18px] py-[14px]">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-muted">Fixed deadline</span>
            <span className="dchip fixc self-start">{formatIso(task.fixed)}</span>
            <span className="text-xs text-muted">{fixedNote(task, today)}</span>
          </div>
          <div className="flex flex-col gap-2 rounded-[20px] bg-[#F4F7FD] px-[18px] py-[14px]">
            <span className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-muted">Hours</span>
            <span className="text-[15px] font-bold text-[#2E384D]">
              {task.estimateHours ? `${task.loggedHours} of ${task.estimateHours}h` : task.loggedHours ? `${task.loggedHours}h logged` : 'No estimate'}
            </span>
            {task.estimateHours > 0 && (
              <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className={`h-full rounded-full ${over ? 'bg-amber' : category.bar}`} style={{ width: `${percent}%` }} />
              </div>
            )}
            <span className="text-xs text-muted">
              {over ? 'More time than estimated' : task.estimateHours ? 'Logged against the estimate' : 'Add an estimate with Edit task'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="px-1 text-[13px] font-bold text-muted">Notes</span>
          {task.notes ? (
            <div className="max-h-[260px] overflow-y-auto whitespace-pre-wrap break-words rounded-[20px] bg-[#F4F7FD] px-[18px] py-[14px] text-sm leading-[1.65] text-[#2E384D]">
              {task.notes}
            </div>
          ) : (
            <div className="rounded-[20px] border-[1.5px] border-dashed border-[#AEBBD3] px-[18px] py-[16px] text-[13.5px] text-muted">
              No notes on this task.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="px-1 text-[13px] font-bold text-muted">
            EOD updates{updates.length > 0 ? ` (${updates.length})` : ''}
          </span>
          {updates.length === 0 && (
            <div className="rounded-[20px] border-[1.5px] border-dashed border-[#AEBBD3] px-[18px] py-[16px] text-[13.5px] text-muted">
              No updates logged yet.
            </div>
          )}
          {updates.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-2 rounded-[20px] border border-[#E7EDF7] bg-white px-[18px] py-[14px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[13px] font-bold">
                  {weekdayOfIso(entry.date)} {formatIso(entry.date)}
                </span>
                <span className="rounded-full bg-[#F4F7FD] px-3 py-1 text-[11.5px] font-bold text-ink">{entry.hours}h</span>
                <span className={`rounded-full px-3 py-1 text-[11.5px] font-bold ${MOOD_COLOUR[entry.mood]}`}>{entry.mood}</span>
                <span className={`rounded-full px-3 py-1 text-[11.5px] font-bold ${STATUS_COLOUR[entry.statusAfter]}`}>
                  {statusNames[entry.statusAfter]}
                </span>
              </div>
              <div className="whitespace-pre-wrap break-words text-sm leading-[1.65] text-[#2E384D]">{entry.comment}</div>
              {entry.next && <div className="text-[13px] leading-[1.6] text-muted">Next: {entry.next}</div>}
            </div>
          ))}
        </div>

        <div className={`flex flex-wrap gap-3.5 ${SHEET_FOOTER}`}>
          <button
            type="button"
            className="pillbtn light h-[54px] flex-[1_1_140px] bg-[#F1F4FB] text-[15px] shadow-none"
            onClick={onEdit}
          >
            Edit task
          </button>
          {!finished && (
            <button type="button" className="pillbtn dark h-[54px] flex-[2_1_220px] text-[15px]" onClick={onLog}>
              EOD update
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
