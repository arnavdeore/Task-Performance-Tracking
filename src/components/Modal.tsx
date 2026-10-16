import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type ModalProps = {
  title: string
  subtitle: string
  onClose: () => void
  children: ReactNode
}

/**
 * A centred pop-up over a dim backdrop. Click outside, Esc or the close button dismisses it. Layout from design/Tasks.dc.html.
 * On a phone (under 768px) it becomes a full-screen sheet with a Back button, as in design/MobileAdd.dc.html.
 * Forms put `SHEET_FOOTER` (sheetFooter.ts) on their button row to pin it to the bottom of the sheet on a phone.
 */
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
      className="fixed inset-0 z-50 box-border flex items-center justify-center overflow-y-auto bg-[rgba(27,36,56,0.45)] p-6 max-md:p-0"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="dlg m-auto box-border flex max-h-[calc(100vh-48px)] w-full max-w-[780px] flex-col gap-[22px] overflow-y-auto rounded-[36px] border-[1.5px] border-white bg-white px-[34px] py-8 shadow-[0_40px_80px_-20px_rgba(27,36,56,0.55),0_12px_24px_-8px_rgba(36,87,197,0.3)] outline-none max-md:m-0 max-md:h-full max-md:max-h-none max-md:max-w-none max-md:gap-4 max-md:rounded-none max-md:border-0 max-md:px-4 max-md:py-0 max-md:shadow-none"
      >
        <div className="flex items-start justify-between gap-4 max-md:sticky max-md:top-0 max-md:z-10 max-md:-mx-4 max-md:items-center max-md:justify-start max-md:gap-2 max-md:border-b max-md:border-[#DDE4EF] max-md:bg-white max-md:px-3 max-md:py-3">
          {/* Phone only: Back replaces the round close button. */}
          <button
            type="button"
            aria-label="Back"
            onClick={onClose}
            className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center border-0 bg-transparent text-ink md:hidden"
          >
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h2 className="m-0 text-[25px] font-extrabold tracking-[-0.01em] max-md:text-xl">{title}</h2>
            <p className="mb-0 mt-2 hidden max-w-[58ch] text-sm leading-[1.6] text-muted md:block">{subtitle}</p>
          </div>
          <div className="ml-auto hidden md:block">
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
        </div>
        {children}
      </div>
    </div>
  )
}
