import { NavLink } from 'react-router-dom'

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
  return (
    <header className="white box-border flex flex-wrap items-center justify-between gap-x-5 gap-y-2.5 rounded-[28px] px-[18px] py-2.5">
      <NavLink
        to="/"
        aria-label="Slate home"
        className="flex flex-none items-center gap-2.5 whitespace-nowrap text-ink no-underline hover:text-ink"
      >
        <span className="relative flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[13px] bg-[linear-gradient(160deg,#4C86F0_0%,#2457C5_55%,#1A3F94_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_14px_-8px_rgba(36,87,197,0.7)]">
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3.5l8.5 4.2L12 12 3.5 7.7z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" />
            <path d="M3.5 12l8.5 4.2 8.5-4.2" stroke="#CFE0FB" strokeWidth="2" />
            <path d="M3.5 16.2l8.5 4.3 8.5-4.3" stroke="#93B4F0" strokeWidth="2" />
          </svg>
          <span className="absolute -bottom-[3px] -right-1 box-border h-3 w-3 rounded-full border-[2.5px] border-white bg-green" />
        </span>
        <span className="text-[22px] font-extrabold tracking-[-0.02em]">Slate</span>
      </NavLink>

      <nav aria-label="Main" className="flex flex-1 flex-wrap items-center justify-center gap-1">
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
        <div className="ml-1.5 flex items-center gap-2.5">
          <div
            role="img"
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(160deg,#F3F0FD,#D9D2F7)] font-extrabold text-lavender-dark shadow-[inset_0_1px_0_#FFFFFF,0_8px_12px_-6px_rgba(76,58,166,0.45)]"
          >
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold">Arnav</span>
            <span className="text-[11px] text-muted">Data analyst</span>
          </div>
        </div>
      </div>
    </header>
  )
}
