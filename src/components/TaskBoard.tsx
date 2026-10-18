import { statusNames } from '../data/tasks'
import type { Task, TaskStatus } from '../data/tasks'
import TaskCard from './TaskCard'

const COLUMNS: { status: TaskStatus; dot: string }[] = [
  { status: 'todo', dot: 'bg-[#8A94A8]' },
  { status: 'progress', dot: 'bg-blue' },
  { status: 'waiting', dot: 'bg-lavender' },
  { status: 'done', dot: 'bg-green' },
]

type TaskBoardProps = {
  /** Tasks already narrowed by the category filter. */
  tasks: Task[]
  today: string
  selectedId: string
  /** On a phone only this status is shown (the page's status chips pick it); desktop shows all four columns. */
  phoneStatus: TaskStatus
  onMove: (id: string, to: TaskStatus) => void
  onLog?: (id: string) => void
  onEdit?: (id: string) => void
  onView?: (id: string) => void
}

/** The four-column board. On a phone it shows one status at a time. Layout from design/Tasks.dc.html. */
export default function TaskBoard({ tasks, today, selectedId, phoneStatus, onMove, onLog, onEdit, onView }: TaskBoardProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(292px,1fr))] items-start gap-[18px]">
      {COLUMNS.map((column) => {
        const cards = tasks.filter((task) => task.status === column.status)
        const name = statusNames[column.status]
        const overdue = column.status === 'done' ? 0 : cards.filter((task) => task.fixed < today).length
        // Open columns say how much work is left; Done says how much was logged.
        const hours =
          column.status === 'done'
            ? cards.reduce((sum, task) => sum + task.loggedHours, 0)
            : cards.reduce((sum, task) => sum + Math.max(0, task.estimateHours - task.loggedHours), 0)
        const hoursText = `${Math.round(hours * 10) / 10}h ${column.status === 'done' ? 'logged' : 'still to do'}`
        return (
          <section
            key={column.status}
            aria-label={name}
            className={`glass-md box-border flex-col gap-3.5 rounded-[30px] md:flex md:px-4 md:py-[18px] ${
              column.status === phoneStatus ? 'flex' : 'hidden'
            }`}
          >
            {/* The status chips above the board show the name and count on a phone. */}
            <div className="hidden items-start justify-between gap-2.5 px-1.5 md:flex">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-[9px] text-[16.5px] font-bold">
                  <span className={`h-[11px] w-[11px] rounded-full ${column.dot}`} />
                  {name}
                </span>
                {cards.length > 0 && (
                  <span className="ml-5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                    {hoursText}
                    {overdue > 0 && <strong className="text-red-dark">{overdue} overdue</strong>}
                  </span>
                )}
              </div>
              <span className="min-w-[30px] rounded-full bg-white px-3 py-[5px] text-center text-[13px] font-bold shadow-[0_6px_10px_-6px_rgba(35,43,94,0.4)]">
                {cards.length}
              </span>
            </div>

            {cards.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                today={today}
                selected={task.id === selectedId}
                onMove={onMove}
                onLog={onLog}
                onEdit={onEdit}
                onView={onView}
              />
            ))}

            {cards.length === 0 && (
              <div className="rounded-[22px] border-[1.5px] border-dashed border-[#AEBBD3] px-[18px] py-[26px] text-center text-[13px] text-muted">
                Nothing here
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
