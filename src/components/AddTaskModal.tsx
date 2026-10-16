import { useState } from 'react'
import { categoryNames } from '../data/dashboard'
import type { CategoryKey } from '../data/dashboard'
import { statusNames } from '../data/tasks'
import type { NewTask, Priority, TaskStatus } from '../data/tasks'
import Modal from './Modal'

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

type AddTaskModalProps = {
  onClose: () => void
  onAdd: (task: NewTask) => void
}

/** The "Add task" pop-up. Layout from design/Tasks.dc.html. */
export default function AddTaskModal({ onClose, onAdd }: AddTaskModalProps) {
  const [form, setForm] = useState<Form>(BLANK)
  const [errors, setErrors] = useState<string[]>([])

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function submit() {
    const problems = check(form)
    setErrors(problems)
    if (problems.length > 0) return
    onAdd({
      title: form.title.trim(),
      category: form.category,
      priority: form.priority,
      tentative: form.tentative,
      fixed: form.fixed,
      status: form.status,
      estimateHours: form.estimate === '' ? 0 : Number(form.estimate),
      notes: form.notes.trim(),
    })
  }

  return (
    <Modal
      title="Add task"
      subtitle="Set a tentative target and a fixed commitment. The fixed date drives your on-time score."
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[18px]">
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[18px]">
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

        <div className="flex flex-wrap gap-3.5">
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
          <button type="button" className="pillbtn dark h-[54px] flex-[2_1_260px] text-[15px]" onClick={submit}>
            Add task
          </button>
        </div>
      </div>
    </Modal>
  )
}
