import { useState } from 'react'
import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import { statusNames } from '../data/tasks'
import type { NewTask, Priority, Task, TaskStatus } from '../data/tasks'
import Modal from './Modal'
import { SHEET_FOOTER } from './sheetFooter'

const PRIORITIES: { key: Priority; label: string }[] = [
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
]

const CATEGORY_KEYS = Object.keys(categoryNames) as CategoryKey[]
const STATUS_KEYS = Object.keys(statusNames) as TaskStatus[]

type Form = {
  title: string
  category: CategoryKey
  priority: Priority
  tentative: string
  fixed: string
  /** Kept as text while typing; turned into a number when the form is checked. */
  estimate: string
  status: TaskStatus
  notes: string
}

const BLANK: Form = {
  title: '',
  category: 'dev',
  priority: 'medium',
  tentative: '',
  fixed: '',
  estimate: '',
  status: 'todo',
  notes: '',
}

/** The rules from docs/design-notes.md ("Validation"). Returns the messages to show, empty when the form is fine. */
function check(form: Form): string[] {
  const errors: string[] = []
  if (!form.title.trim()) errors.push('Add a task title.')
  if (!form.fixed) errors.push('Pick a fixed deadline. It drives your on-time score.')
  if (form.tentative && form.fixed && form.tentative > form.fixed) {
    errors.push('The tentative date should not be after the fixed date.')
  }
  const estimate = form.estimate === '' ? 0 : Number(form.estimate)
  if (Number.isNaN(estimate) || estimate < 0) errors.push('Estimated hours must be zero or more.')
  return errors
}

/** The form filled in with an existing task, for editing. */
function formFrom(task: Task): Form {
  return {
    title: task.title,
    category: task.category,
    priority: task.priority,
    tentative: task.tentative,
    fixed: task.fixed,
    estimate: task.estimateHours ? String(task.estimateHours) : '',
    status: task.status,
    notes: task.notes,
  }
}

type AddTaskModalProps = {
  onClose: () => void
  /** Saves the task (a new one, or the changes when `editing` is set). Resolves to null on success (the page closes the pop-up) or a message to show if it failed. */
  onAdd: (task: NewTask) => Promise<string | null>
  /** When set, the pop-up edits this task instead of adding a new one. */
  editing?: Task
  /** Edit mode only: deletes the task. Resolves to null on success or a message to show. */
  onDelete?: () => Promise<string | null>
  /** Edit mode only: how many EOD updates are logged on the task (they are deleted with it). */
  updateCount?: number
}

/** The "Add task" pop-up, also used as "Edit task". Layout from design/Tasks.dc.html. */
export default function AddTaskModal({ onClose, onAdd, editing, onDelete, updateCount = 0 }: AddTaskModalProps) {
  const [form, setForm] = useState<Form>(() => (editing ? formFrom(editing) : BLANK))
  const [errors, setErrors] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  // Edit mode: the first press on Delete only asks "are you sure?".
  const [confirming, setConfirming] = useState(false)

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit() {
    if (busy) return
    const problems = check(form)
    setErrors(problems)
    if (problems.length > 0) return
    setBusy(true)
    const failure = await onAdd({
      title: form.title.trim(),
      category: form.category,
      priority: form.priority,
      tentative: form.tentative,
      fixed: form.fixed,
      status: form.status,
      estimateHours: form.estimate === '' ? 0 : Number(form.estimate),
      notes: form.notes.trim(),
    })
    setBusy(false)
    // On success the page closes this pop-up; on failure it stays open with the form as typed.
    if (failure) setErrors([failure])
  }

  async function remove() {
    if (busy || !onDelete) return
    setBusy(true)
    const failure = await onDelete()
    setBusy(false)
    // On success the page closes this pop-up; on failure it stays open and says why.
    if (failure) {
      setConfirming(false)
      setErrors([failure])
    }
  }

  return (
    <Modal
      title={editing ? 'Edit task' : 'Add task'}
      subtitle={
        editing
          ? 'Fix a title, a date or an estimate, or change the status (for example, set a task on hold to Waiting).'
          : 'Set a tentative target and a fixed commitment. The fixed date drives your on-time score.'
      }
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
          <span className="grph">The task</span>
          <label className="lbl">
            Task title
            <input
              className="fld"
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(event) => set('title', event.target.value)}
            />
          </label>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[18px]">
            <label className="lbl">
              Category
              <select
                className="fld"
                value={form.category}
                onChange={(event) => set('category', event.target.value as CategoryKey)}
              >
                {CATEGORY_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {categoryNames[key]}
                  </option>
                ))}
              </select>
            </label>
            <div className="lbl">
              Priority
              <div className="seg" role="group" aria-label="Priority">
                {PRIORITIES.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`segb${form.priority === item.key ? ' on' : ''}`}
                    aria-pressed={form.priority === item.key}
                    onClick={() => set('priority', item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grp">
          <span className="grph">Deadlines</span>
          <div className="grid grid-cols-2 gap-3 md:gap-[18px]">
            <label className="lbl">
              Tentative deadline
              <input
                className="fld tent"
                type="date"
                value={form.tentative}
                onChange={(event) => set('tentative', event.target.value)}
              />
            </label>
            <label className="lbl">
              Fixed deadline
              <input
                className="fld fixd"
                type="date"
                value={form.fixed}
                onChange={(event) => set('fixed', event.target.value)}
              />
            </label>
          </div>
          <p className="m-0 text-[13px] leading-[1.6] text-muted">
            Tentative is your own target and can move. Fixed is the committed date and drives your on-time score.
          </p>
        </div>

        <div className="grp">
          <span className="grph">Effort and notes</span>
          <div className="grid grid-cols-2 gap-3 md:gap-[18px]">
            <label className="lbl">
              Estimated hours
              <input
                className="fld"
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={form.estimate}
                onChange={(event) => set('estimate', event.target.value)}
              />
            </label>
            <label className="lbl">
              Status
              <select
                className="fld"
                value={form.status}
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
          <label className="lbl">
            Notes
            <textarea
              className="fld"
              rows={3}
              placeholder="Optional details"
              value={form.notes}
              onChange={(event) => set('notes', event.target.value)}
            />
          </label>
        </div>

        {editing && confirming && (
          <p role="alert" className="m-0 rounded-[18px] bg-red-pastel px-[18px] py-4 text-[13.5px] font-semibold leading-[1.5] text-red-dark">
            Delete "{editing.title}"?
            {updateCount > 0 &&
              ` Its ${updateCount} logged ${updateCount === 1 ? 'update goes' : 'updates go'} with it and your Performance figures will change.`}{' '}
            This cannot be undone.
          </p>
        )}

        <div className={`flex flex-wrap gap-3.5 ${SHEET_FOOTER}`}>
          {editing && confirming ? (
            <>
              <button
                type="button"
                className="pillbtn light h-[54px] flex-[1_1_160px] bg-[#F1F4FB] text-[15px] shadow-none"
                onClick={() => setConfirming(false)}
                disabled={busy}
              >
                Keep task
              </button>
              <button
                type="button"
                className="pillbtn dark h-[54px] flex-[2_1_260px] text-[15px]"
                style={{ background: 'var(--color-red-dark)' }}
                onClick={remove}
                disabled={busy}
                aria-busy={busy}
              >
                {busy ? 'Deleting…' : 'Yes, delete it'}
              </button>
            </>
          ) : (
            <>
              {editing ? (
                <button
                  type="button"
                  className="pillbtn light h-[54px] flex-[1_1_160px] bg-[#F1F4FB] text-[15px] shadow-none"
                  style={{ color: 'var(--color-red-dark)' }}
                  onClick={() => setConfirming(true)}
                  disabled={busy}
                >
                  Delete task
                </button>
              ) : (
                <button
                  type="button"
                  className="pillbtn light h-[54px] flex-[1_1_160px] bg-[#F1F4FB] text-[15px] shadow-none"
                  onClick={() => {
                    setForm(BLANK)
                    setErrors([])
                  }}
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                className="pillbtn dark h-[54px] flex-[2_1_260px] text-[15px]"
                onClick={submit}
                disabled={busy}
                aria-busy={busy}
              >
                {busy ? 'Saving…' : editing ? 'Save changes' : 'Add task'}
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
