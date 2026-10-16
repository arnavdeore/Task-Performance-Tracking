import { useEffect, useState } from 'react'
import AddTaskModal from '../components/AddTaskModal'
import EodLog from '../components/EodLog'
import StatTile from '../components/StatTile'
import TaskBoard from '../components/TaskBoard'
import Toast from '../components/Toast'
import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import { initialEodLog, initialTasks, MOCK_TODAY, statusNames } from '../data/tasks'
import type { NewTask, Task, TaskStatus } from '../data/tasks'
import { dueInWeekCount, hoursLoggedOn, openTasks, overdueCount, tasksLoggedOn } from '../lib/taskStats'

export type CategoryFilter = CategoryKey | 'all'

const FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  ...(Object.keys(categoryNames) as CategoryKey[]).map((key) => ({ key, label: categoryNames[key] })),
]

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`
}

/** The Tasks page. Layout from design/Tasks.dc.html. */
export default function Tasks() {
  // The task list and the EOD log live here so the board and the pop-ups can share them. Phase 3 loads them from Supabase.
  const [tasks, setTasks] = useState(initialTasks)
  const [eodLog] = useState(initialEodLog)
  const [filter, setFilter] = useState<CategoryFilter>('all')
  // The card last touched gets a blue ring.
  const [selectedId, setSelectedId] = useState('')
  // Which pop-up is open. The EOD update pop-up joins in the next step.
  const [panel, setPanel] = useState<'add' | null>(null)
  const [toast, setToast] = useState('')
  const today = MOCK_TODAY

  // The confirmation message disappears by itself after a few seconds.
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  // A new task goes to the top of its column. The filter resets to All so the new card is visible.
  function addTask(newTask: NewTask) {
    const task: Task = {
      ...newTask,
      id: `n${Date.now()}`,
      loggedHours: 0,
      completedOn: newTask.status === 'done' ? today : '',
    }
    setTasks((all) => [task, ...all])
    setSelectedId(task.id)
    setFilter('all')
    setPanel(null)
    setToast(`Added "${task.title}" to ${statusNames[task.status]}.`)
  }

  // Moving a card to Done stamps today's date as the completed date; moving it anywhere else clears it.
  function moveTask(id: string, to: TaskStatus) {
    setTasks((all) =>
      all.map((task) => (task.id === id ? { ...task, status: to, completedOn: to === 'done' ? today : '' } : task)),
    )
    setSelectedId(id)
  }

  const visibleTasks = filter === 'all' ? tasks : tasks.filter((task) => task.category === filter)

  const open = openTasks(tasks)
  const overdue = overdueCount(tasks, today)
  const dueWeek = dueInWeekCount(tasks, today)
  const hoursToday = hoursLoggedOn(eodLog, today)
  const tasksToday = tasksLoggedOn(eodLog, today)
  const countOf = (status: 'todo' | 'progress' | 'waiting') => tasks.filter((task) => task.status === status).length

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-[18px] px-1.5">
        <div className="min-w-0 flex-[1_1_320px]">
          <h1 className="m-0 text-[30px] font-extrabold tracking-[-0.015em]">Tasks</h1>
          <p className="mb-0 mt-[7px] max-w-[48ch] text-sm leading-[1.55] text-muted">
            Move cards across as work progresses, and log an update at the end of each day.
          </p>
        </div>
        <div className="flex flex-none flex-wrap items-center gap-3">
          <StatTile
            label="Open tasks"
            value={String(open.length)}
            sub={`${countOf('todo')} to do · ${countOf('progress')} in progress · ${countOf('waiting')} waiting`}
            tone="blue"
          />
          <StatTile
            label="Fixed dates, next 7 days"
            value={String(dueWeek)}
            sub={overdue ? `${overdue} ${overdue === 1 ? 'is' : 'are'} already overdue` : 'Nothing overdue'}
            tone="ink"
          />
          <StatTile
            label="Logged today"
            value={`${hoursToday}h`}
            sub={tasksToday ? `Across ${plural(tasksToday, 'task', 'tasks')}` : 'No update written yet'}
            tone="green"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3.5 px-1.5">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="seg" role="group" aria-label="Filter by category">
            {FILTERS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`segb${filter === item.key ? ' on' : ''}`}
                aria-pressed={filter === item.key}
                onClick={() => setFilter(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="rounded-full bg-[#FDECEC] px-[15px] py-[7px] text-[12.5px] font-bold text-red-dark">
            {overdue ? `${overdue} overdue` : 'None overdue'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="pillbtn light h-[50px] px-[26px] text-sm">
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5.5h16M4 12h10M4 18.5h7" />
              <path d="M15.5 19.5l5.5-5.5-2-2-5.5 5.5-.5 2.5z" />
            </svg>
            EOD update
          </button>
          <button type="button" className="pillbtn dark h-[50px] px-7 text-[15px]" onClick={() => setPanel('add')}>
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add task
          </button>
        </div>
      </div>

      <TaskBoard tasks={visibleTasks} today={today} selectedId={selectedId} onMove={moveTask} />

      <EodLog log={eodLog} today={today} />

      {panel === 'add' && <AddTaskModal onClose={() => setPanel(null)} onAdd={addTask} />}
      {toast && <Toast message={toast} />}
    </>
  )
}
