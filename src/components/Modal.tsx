import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type ModalProps = {
  title: string
  subtitle: string
  onClose: () => void
  children: ReactNode
}

/** A centred pop-up over a dim backdrop. Click outside, Esc or the close button dismisses it. Layout from design/Tasks.dc.html. */
export default function Modal({ title, subtitle, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Move keyboard focus into the pop-up when it opens.
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 box-border flex items-center justify-center overflow-y-auto bg-[rgba(27,36,56,0.45)] p-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="dlg m-auto box-border flex max-h-[calc(100vh-48px)] w-full max-w-[780px] flex-col gap-[22px] overflow-y-auto rounded-[36px] border-[1.5px] border-white bg-white px-[34px] py-8 shadow-[0_40px_80px_-20px_rgba(27,36,56,0.55),0_12px_24px_-8px_rgba(36,87,197,0.3)] outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-[25px] font-extrabold tracking-[-0.01em]">{title}</h2>
            <p className="mb-0 mt-2 max-w-[58ch] text-sm leading-[1.6] text-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="pillbtn light h-[46px] w-[46px] flex-none rounded-full bg-[#F1F4FB] shadow-none"
          >
            <svg
              aria-hidden="true"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
