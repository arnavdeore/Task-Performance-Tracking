import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AddTaskModal from '../components/AddTaskModal'
import EodLog from '../components/EodLog'
import EodModal from '../components/EodModal'
import StaleBanner from '../components/StaleBanner'
import StatTile from '../components/StatTile'
import TaskBoard from '../components/TaskBoard'
import Toast from '../components/Toast'
import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import { statusNames } from '../data/tasks'
import type { NewEodUpdate, NewTask, TaskStatus } from '../data/tasks'
import { todayIso } from '../lib/dates'
import { errorMessage, insertTask, saveEodUpdate, setTaskStatus, sortTasks } from '../lib/tasksApi'
import { dueInWeekCount, hoursLoggedOn, openTasks, overdueCount, tasksLoggedOn } from '../lib/taskStats'
import { useTasksData } from '../lib/tasksDataContext'

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
  // The task list and the EOD log live here so the board and the pop-ups can share them. They are loaded from Supabase.
  const { tasks, setTasks, eodLog, load, loadError, refreshError, reload } = useTasksData()
  const [filter, setFilter] = useState<CategoryFilter>('all')
  // Phone only: the search box, and which status the board shows (design/MobileTasks.dc.html opens on In progress).
  const [query, setQuery] = useState('')
  const [phoneStatus, setPhoneStatus] = useState<TaskStatus>('progress')
  // The card last touched gets a blue ring.
  const [selectedId, setSelectedId] = useState('')
  // The EOD pop-up, and which task it opened on.
  const [eodOpen, setEodOpen] = useState(false)
  const [eodTaskId, setEodTaskId] = useState('')
  const [toast, setToast] = useState('')
  // Today on this device (local time), so an evening in India still counts as today.
  const today = todayIso()

  // The Add task pop-up is open whenever the address is /tasks/new. That way the phone's Back button closes it,
  // and the tab bar's Add button can open it from any page.
  const location = useLocation()
  const navigate = useNavigate()
  const addOpen = location.pathname === '/tasks/new'
  const openAdd = () => navigate('/tasks/new')
  const closeAdd = () => navigate('/tasks', { replace: true })

  // The confirmation message disappears by itself after a few seconds.
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3500)
    return () => clearTimeout(timer)
  }, [toast])

  // Saves the task, then shows it in its column. The filter resets to All so the new card is visible.
  // Resolves to null on success, or a message the Add task pop-up shows (it stays open so nothing typed is lost).
  async function addTask(newTask: NewTask): Promise<string | null> {
    try {
      const task = await insertTask(newTask, today)
      setTasks((all) => sortTasks([task, ...all]))
      setSelectedId(task.id)
      setFilter('all')
      closeAdd()
      setToast(`Added "${task.title}" to ${statusNames[task.status]}.`)
      return null
    } catch (error) {
      return errorMessage(error)
    }
  }

  function openEod(taskId: string) {
    setEodTaskId(taskId)
    setEodOpen(true)
  }

  // Saving an update logs the entry, then sets the status chosen and copies the text to the card note (Done stamps today's
  // date). It reloads afterwards so hours and statuses come from the database. Resolves to null, or a message for the pop-up.
  async function saveEod(update: NewEodUpdate): Promise<string | null> {
    const task = tasks.find((item) => item.id === update.taskId)
    if (!task) return 'That task could not be found. Reload the page.'
    try {
      const result = await saveEodUpdate(update, today)
      const refreshFailed = await reload(true)
      if (refreshFailed) setToast(refreshFailed)
      setSelectedId(task.id)
      setEodOpen(false)
      setToast(
        result === 'saved'
          ? `EOD update saved for "${task.title}".`
          : 'Update logged, but the task status could not be changed. Set it again from the card.',
      )
      return null
    } catch (error) {
      return errorMessage(error)
    }
  }

  // The card moves at once and the save runs behind it. If the save fails, say so and reload the true state.
  async function moveTask(id: string, to: TaskStatus) {
    setTasks((all) =>
      sortTasks(all.map((task) => (task.id === id ? { ...task, status: to, completedOn: to === 'done' ? today : '' } : task))),
    )
    setSelectedId(id)
    try {
      await setTaskStatus(id, to, today)
    } catch (error) {
      setToast(errorMessage(error))
      void reload(true)
    }
  }

  // Category pills and the phone search box both narrow the board.
  const needle = query.trim().toLowerCase()
  const visibleTasks = tasks.filter(
    (task) =>
      (filter === 'all' || task.category === filter) && (!needle || task.title.toLowerCase().includes(needle)),
  )
  const visibleCount = (status: TaskStatus) => visibleTasks.filter((task) => task.status === status).length

  const open = openTasks(tasks)
  const overdue = overdueCount(tasks, today)
  const dueWeek = dueInWeekCount(tasks, today)
  const hoursToday = hoursLoggedOn(eodLog, today)
  const tasksToday = tasksLoggedOn(eodLog, today)
  const countOf = (status: 'todo' | 'progress' | 'waiting') => tasks.filter((task) => task.status === status).length

  return (
    <>
      {load === 'ready' && refreshError && <StaleBanner message={refreshError} onRetry={() => void reload(true)} />}

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-[18px] px-1.5">
        <div className="min-w-0 md:flex-[1_1_320px]">
          <h1 className="m-0 text-[22px] font-extrabold tracking-[-0.015em] md:text-[30px]">Tasks</h1>
          <p className="mb-0 mt-[7px] hidden max-w-[48ch] text-sm leading-[1.55] text-muted md:block">
            Move cards across as work progresses, and log an update at the end of each day.
          </p>
        </div>
        {/* The three tiles are left out on a phone (the Dashboard shows them). */}
        <div className={`hidden flex-none flex-wrap items-center gap-3 ${load === 'ready' ? 'md:flex' : ''}`}>
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

      {/* Phone only: search box. */}
      <input
        type="search"
        aria-label="Search tasks"
        placeholder="Search tasks"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="fld md:hidden"
        style={{ height: 44 }}
      />

      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3.5 px-1.5">
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3.5">
          {/* On a phone the pills scroll sideways instead of wrapping. */}
          <div className="max-w-full overflow-x-auto md:overflow-visible">
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
          </div>
          <span className="rounded-full bg-[#FDECEC] px-[15px] py-[7px] text-[12.5px] font-bold text-red-dark">
            {overdue ? `${overdue} overdue` : 'None overdue'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="pillbtn light h-[50px] px-[26px] text-sm" onClick={() => openEod('')}>
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
          {/* The round + in the phone tab bar adds a task, so this button is desktop only. */}
          <div className="hidden md:block">
            <button type="button" className="pillbtn dark h-[50px] px-7 text-[15px]" onClick={openAdd}>
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
      </div>

      {/* Phone only: pick which status the board shows. The counts follow the category pills and the search. */}
      <div role="group" aria-label="Show status" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 md:hidden">
        {(Object.keys(statusNames) as TaskStatus[]).map((status) => {
          const on = phoneStatus === status
          return (
            <button
              key={status}
              type="button"
              aria-pressed={on}
              onClick={() => setPhoneStatus(status)}
              className={`h-11 flex-none cursor-pointer whitespace-nowrap rounded-full border px-3 font-sans text-[13px] ${
                on
                  ? 'border-blue bg-blue-pastel font-bold text-blue-dark'
                  : 'border-[#DDE4EF] bg-white font-semibold text-muted-2'
              }`}
            >
              {statusNames[status]} {visibleCount(status)}
            </button>
          )
        })}
      </div>

      {load === 'loading' && (
        <div role="status" className="glass rounded-[30px] px-8 py-12 text-center text-sm font-semibold text-muted">
          Loading your tasks…
        </div>
      )}

      {load === 'error' && (
        <div role="alert" className="glass flex flex-col items-center gap-4 rounded-[30px] px-8 py-12 text-center">
          <p className="m-0 max-w-[44ch] text-sm font-semibold leading-[1.6] text-red-dark">{loadError}</p>
          <button type="button" className="pillbtn dark h-11 px-6 text-sm" onClick={() => void reload(false)}>
            Try again
          </button>
        </div>
      )}

      {load === 'ready' && tasks.length === 0 && (
        <div className="glass flex flex-col items-center gap-3 rounded-[30px] px-8 py-12 text-center">
          <h2 className="m-0 text-[21px] font-bold">No tasks yet</h2>
          <p className="m-0 max-w-[44ch] text-sm leading-[1.6] text-muted">
            Add your first task with a tentative target and a fixed deadline, and it will show up here and on your Dashboard.
          </p>
          <button type="button" className="pillbtn dark mt-1 h-[50px] px-7 text-[15px]" onClick={openAdd}>
            Add your first task
          </button>
        </div>
      )}

      {load === 'ready' && tasks.length > 0 && (
        <TaskBoard
          tasks={visibleTasks}
          today={today}
          selectedId={selectedId}
          phoneStatus={phoneStatus}
          onMove={moveTask}
          onLog={openEod}
        />
      )}

      {load === 'ready' && <EodLog log={eodLog} today={today} />}

      {addOpen && <AddTaskModal onClose={closeAdd} onAdd={addTask} />}
      {eodOpen && (
        <EodModal tasks={tasks} initialTaskId={eodTaskId} onClose={() => setEodOpen(false)} onSave={saveEod} />
      )}
      {toast && <Toast message={toast} />}
    </>
  )
}
