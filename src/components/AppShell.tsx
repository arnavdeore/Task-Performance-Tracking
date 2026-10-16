import type { ReactNode } from 'react'

type AppShellProps = {
  /** The top bar (TopNav). Rendered as the first child of the frame. */
  header: ReactNode
  /** The phone tab bar (BottomNav). Fixed to the bottom of the screen, so it sits outside the frame. */
  bottomNav?: ReactNode
  /** The page content. Rendered inside <main>. */
  children: ReactNode
}

/**
 * The page shell shared by Dashboard, Tasks and Performance.
 * Spacing and radii come from docs/design-notes.md, "The shared page shell".
 * Below 768px the padding is tighter and there is room at the bottom for the tab bar.
 */
export default function AppShell({ header, bottomNav, children }: AppShellProps) {
  return (
    <div className="box-border flex min-h-screen flex-col bg-[linear-gradient(150deg,#D3E3F8_0%,#E2E1F6_52%,#DDEEEA_100%)] p-2.5 font-sans text-ink md:p-5">
      <div className="box-border flex flex-1 flex-col gap-4 rounded-[32px] border-[1.5px] border-white/85 bg-white/40 p-3.5 pb-[104px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_40px_80px_-40px_rgba(36,50,120,0.45)] md:gap-[26px] md:rounded-[44px] md:p-6">
        {header}
        <main className="flex flex-1 flex-col gap-4 md:gap-[26px]">{children}</main>
      </div>
      {bottomNav}
    </div>
  )
}
