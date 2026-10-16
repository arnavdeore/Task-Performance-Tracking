import { useEffect, useState } from 'react'
import { thoughtLib as lib } from '../lib/thoughtLib'

/** The rotating "thought of the moment". Changes every 10 minutes (at :00, :10, :20 ...). */
export default function ThoughtStrip() {
  const [now, setNow] = useState(() => Date.now())

  // Check the clock every 15 seconds; the thought itself only changes when the 10-minute slot does.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(timer)
  }, [])

  const thought = lib.thoughtAt(now)
  const panchang = lib.panchang(now)
  const meta = `${panchang.tithi} · ${panchang.month} · Vikram Samvat ${panchang.samvat} · ${panchang.vara}`

  return (
    <section
      aria-label="Thought of the moment"
      className="glass relative flex flex-wrap items-center gap-x-5 gap-y-3.5 overflow-hidden rounded-[32px] bg-[linear-gradient(120deg,rgba(243,240,253,0.9)_0%,rgba(234,241,253,0.85)_55%,rgba(230,246,238,0.9)_100%)] px-6 py-[18px]"
    >
      <div className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-[18px] bg-white text-[#7B6BD6] shadow-[0_12px_18px_-10px_rgba(76,58,166,0.45)]">
        <svg
          aria-hidden="true"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20c-3.6-1-6-3.6-6-7 2.4.3 4.6 1.5 6 3.5 1.4-2 3.6-3.2 6-3.5 0 3.4-2.4 6-6 7z" />
          <path d="M12 16.5C9.6 14.4 9 11 12 5c3 6 2.4 9.4 0 11.5z" />
        </svg>
      </div>

      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className="rounded-full bg-lavender-pastel px-2.5 py-[3px] text-[11px] font-bold text-lavender-dark shadow-[inset_0_1px_0_#FFFFFF,0_2px_0_#CFC7F0]">
            {thought.src}
          </span>
          {panchang.festival && (
            <span className="rounded-full bg-amber-pastel px-2.5 py-[3px] text-[11px] font-bold text-amber-dark shadow-[inset_0_1px_0_#FFFFFF,0_2px_0_#F0D9A0]">
              {panchang.festival}
            </span>
          )}
          <span className="text-xs text-muted">{meta}</span>
        </div>
        <p aria-live="polite" className="m-0 text-[17px] font-semibold leading-[1.55] text-[#2E2566]">
          {thought.text}
        </p>
      </div>
    </section>
  )
}
