import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import SlateMark from './SlateMark'

const TABS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Tasks', to: '/tasks' },
  { label: 'Performance', to: '/performance' },
  { label: 'Reports', to: '/reports' },
  { label: 'Settings', to: '/settings' },
]

const iconProps = {
  'aria-hidden': true,
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** The top bar shared by every desktop page. Pass it to AppShell's `header` slot. */
export default function TopNav() {
  const { session, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // The profile menu closes on Esc or a click anywhere outside it.
  useEffect(() => {
    if (!menuOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    function onClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [menuOpen])

  return (
    <header className="white box-border flex flex-wrap items-center justify-between gap-x-5 gap-y-2.5 rounded-[28px] px-[18px] py-2.5">
      <NavLink
        to="/"
        aria-label="Slate home"
        className="flex flex-none items-center gap-2.5 whitespace-nowrap text-ink no-underline hover:text-ink"
      >
        <SlateMark />
        <span className="text-[22px] font-extrabold tracking-[-0.02em]">Slate</span>
      </NavLink>

      {/* On phones the bottom tab bar (BottomNav) replaces these tabs. */}
      <nav aria-label="Main" className="hidden flex-1 flex-wrap items-center justify-center gap-1 md:flex">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) => `nav3${isActive ? ' on' : ''}`}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-none items-center gap-1.5">
        <button type="button" className="icobtn" aria-label="Search">
          <svg {...iconProps}>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </button>
        <button type="button" className="icobtn" aria-label="Notifications">
          <svg {...iconProps}>
            <path d="M6 17V11a6 6 0 0112 0v6l1.5 2h-15z" />
            <path d="M10 21h4" />
          </svg>
        </button>
        <div ref={menuRef} className="relative ml-1.5">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Profile menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex cursor-pointer items-center gap-2.5 rounded-full border-0 bg-transparent p-0 text-left font-sans text-ink"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(160deg,#F3F0FD,#D9D2F7)] font-extrabold text-lavender-dark shadow-[inset_0_1px_0_#FFFFFF,0_8px_12px_-6px_rgba(76,58,166,0.45)]">
              A
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-[13px] font-bold">Arnav</span>
              <span className="text-[11px] text-muted">Data analyst</span>
            </span>
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="white absolute right-0 top-[calc(100%+10px)] z-50 flex w-60 flex-col gap-1 rounded-[22px] p-2"
            >
              <div className="px-3 py-2">
                <div className="text-xs text-muted">Signed in as</div>
                <div className="overflow-hidden text-ellipsis text-[13px] font-bold">{session?.user.email}</div>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => void signOut()}
                className="h-11 w-full cursor-pointer rounded-[16px] border-0 bg-[#F1F4FB] px-3 text-left font-sans text-[13px] font-bold text-navy hover:bg-[#E6ECF8]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
