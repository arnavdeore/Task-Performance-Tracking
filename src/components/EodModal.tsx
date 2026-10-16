import { useState } from 'react'
import type { Mood } from '../data/dashboard'
import { statusNames } from '../data/tasks'
import type { NewEodUpdate, Task, TaskStatus } from '../data/tasks'
import Modal from './Modal'
import { SHEET_FOOTER } from './sheetFooter'
import { STATUS_COLOUR } from './statusColours'

const MOODS: Mood[] = ['On track', 'At risk', 'Blocked']
const STATUS_KEYS = Object.keys(statusNames) as TaskStatus[]

type Form = {
  taskId: string
  /** Kept as text while typing; turned into a number when the form is checked. */
  hours: string
  /** '' until a task is picked or the status is changed by hand; then the task's own status is used. */
  status: TaskStatus | ''
  mood: Mood
  comment: string
  next: string
}

/** The rules from docs/design-notes.md ("Validation"). Returns the messages to show, empty when the form is fine. */
function check(form: Form, task: Task | undefined): string[] {
  const errors: string[] = []
  if (!task) errors.push('Pick the task this update is about.')
  if (!form.comment.trim()) errors.push('Write a short update about the task.')
  const hours = form.hours === '' ? 0 : Number(form.hours)
  if (Number.isNaN(hours) || hours < 0 || hours > 24) errors.push('Hours today should be between 0 and 24.')
  return errors
}

type EodModalProps = {
  /** All tasks; only the ones that are not done can be picked. */
  tasks: Task[]
  /** The task to preselect (when opened from a card's "Log update"), or '' for none. */
  initialTaskId: string
  onClose: () => void
  onSave: (update: NewEodUpdate) => void
}

/** The "EOD update" pop-up. Layout from design/Tasks.dc.html. */
export default function EodModal({ tasks, initialTaskId, onClose, onSave }: EodModalProps) {
  const openTasks = tasks.filter((task) => task.status !== 'done')
  const first = tasks.find((task) => task.id === initialTaskId)
  const [form, setForm] = useState<Form>({
    taskId: first ? first.id : '',
    hours: '',
    status: first ? first.status : '',
    mood: 'On track',
    comment: '',
    next: '',
  })
  const [errors, setErrors] = useState<string[]>([])

  const task = tasks.find((item) => item.id === form.taskId)

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function reset() {
    setForm({ taskId: '', hours: '', status: '', mood: 'On track', comment: '', next: '' })
    setErrors([])
  }

  function submit() {
    const problems = check(form, task)
    setErrors(problems)
    if (problems.length > 0 || !task) return
    onSave({
      taskId: task.id,
      hours: form.hours === '' ? 0 : Number(form.hours),
      mood: form.mood,
      statusAfter: form.status || task.status,
      comment: form.comment.trim(),
      next: form.next.trim(),
    })
  }

  return (
    <Modal
      title="EOD update"
      subtitle="Log what you did today. Hours here feed your performance report."
      onClose={onClose}
    >
      <div className="flex flex-col gap-[18px]">
        {errors.length > 0 && (
          <div
            role="alert"
            className="flex flex-col gap-1.5 rounded-[18px] bg-red-pastel px-[18px] py-4 text-[13.5px] font-semibold leading-[1.5] text-red-dark"
          >
            {errors.map((message) => (
              <span key={message}>{message}</span>
            ))}
          </div>
        )}

        <div className="grp">
          <span className="grph">Which task is this about?</span>
          <div className="flex max-h-[252px] flex-col gap-2.5 overflow-y-auto px-0.5 pb-1.5 pt-0.5">
            {openTasks.map((item) => {
              const on = item.id === form.taskId
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`pickrow${on ? ' on' : ''}`}
                  aria-pressed={on}
                  onClick={() => setForm((current) => ({ ...current, taskId: item.id, status: item.status }))}
                >
                  <span className="min-w-0">{item.title}</span>
                  <span
                    className={`flex-none rounded-full px-[11px] py-1 text-[11.5px] font-bold ${STATUS_COLOUR[item.status]}`}
                  >
                    {statusNames[item.status]}
                  </span>
                </button>
              )
            })}
            {openTasks.length === 0 && <span className="text-[13px] text-muted">No open tasks to update.</span>}
          </div>
        </div>

        <div className="grp">
          <span className="grph">Today</span>
          <div className="grid grid-cols-2 gap-3 md:gap-[18px]">
            <label className="lbl">
              Hours spent today
              <input
                className="fld"
                type="number"
                min="0"
                max="24"
                step="0.5"
                placeholder="0"
                value={form.hours}
                onChange={(event) => set('hours', event.target.value)}
              />
            </label>
            <label className="lbl">
              Status after today
              <select
                className="fld"
                value={form.status || 'progress'}
                onChange={(event) => set('status', event.target.value as TaskStatus)}
              >
                {STATUS_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {statusNames[key]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="lbl">
            How did it go?
            <div className="seg" role="group" aria-label="How did it go">
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  className={`segb${form.mood === mood ? ' on' : ''}`}
                  aria-pressed={form.mood === mood}
                  onClick={() => set('mood', mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grp">
          <span className="grph">Your update</span>
          <label className="lbl">
            Today’s update
            <textarea
              className="fld"
              rows={4}
              placeholder="What did you finish, and what is left?"
              value={form.comment}
              onChange={(event) => set('comment', event.target.value)}
            />
          </label>
          <label className="lbl">
            Tomorrow or blockers (optional)
            <input
              className="fld"
              type="text"
              placeholder="What comes next, or what is stopping you?"
              value={form.next}
              onChange={(event) => set('next', event.target.value)}
            />
          </label>
        </div>

        <div className={`flex flex-wrap gap-3.5 ${SHEET_FOOTER}`}>
          <button
            type="button"
            className="pillbtn light h-[54px] flex-[1_1_160px] bg-[#F1F4FB] text-[15px] shadow-none"
            onClick={reset}
          >
            Clear
          </button>
          <button type="button" className="pillbtn dark h-[54px] flex-[2_1_260px] text-[15px]" onClick={submit}>
            Save EOD update
          </button>
        </div>
      </div>
    </Modal>
  )
}
