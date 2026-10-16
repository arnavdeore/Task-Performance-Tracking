import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

const iconProps = {
  'aria-hidden': true,
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

type Tab = { label: string; to: string; end?: boolean; icon: ReactNode }

// Icons from the mobile designs. Stats opens the Performance page.
const LEFT_TABS: Tab[] = [
  {
    label: 'Home',
    to: '/',
    end: true,
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Tasks',
    to: '/tasks',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 12.5l3 3 5-6" />
      </svg>
    ),
  },
]

const RIGHT_TABS: Tab[] = [
  {
    label: 'Stats',
    to: '/performance',
    icon: (
      <svg {...iconProps}>
        <path d="M3 20h18M6 16l4-5 3 3 5-7" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </svg>
    ),
  },
]

function TabLink({ tab }: { tab: Tab }) {
  return (
    <NavLink
      to={tab.to}
      end={tab.end}
      className={({ isActive }) =>
        `flex min-h-[52px] min-w-[58px] flex-col items-center justify-center gap-[3px] rounded-[18px] px-2.5 text-[11px] no-underline transition-colors duration-150 ${
          isActive ? 'bg-navy font-bold text-white hover:text-white' : 'font-semibold text-muted-2 hover:text-navy'
        }`
      }
    >
      {tab.icon}
      {tab.label}
    </NavLink>
  )
}

/** The phone tab bar: Home, Tasks, a big round Add button, Stats and Settings. Hidden from 768px up, where the top nav takes over. */
export default function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="white fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 box-border flex items-center justify-around rounded-[28px] px-2 py-2 md:hidden"
    >
      {LEFT_TABS.map((tab) => (
        <TabLink key={tab.to} tab={tab} />
      ))}
      <Link
        to="/tasks/new"
        aria-label="Add task"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-navy text-white no-underline shadow-[0_12px_20px_-10px_rgba(35,43,94,0.7)] hover:text-white"
      >
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
      {RIGHT_TABS.map((tab) => (
        <TabLink key={tab.to} tab={tab} />
      ))}
    </nav>
  )
}
