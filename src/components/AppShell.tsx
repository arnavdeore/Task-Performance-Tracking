import type { ReactNode } from 'react'

type AppShellProps = {
  /** The top bar (TopNav). Rendered as the first child of the frame. */
  header: ReactNode
  /** The page content. Rendered inside <main>. */
  children: ReactNode
}

/**
 * The page shell shared by Dashboard, Tasks and Performance.
 * Spacing and radii come from docs/design-notes.md, "The shared page shell".
 */
export default function AppShell({ header, children }: AppShellProps) {
  return (
    <div className="box-border flex min-h-screen flex-col bg-[linear-gradient(150deg,#D3E3F8_0%,#E2E1F6_52%,#DDEEEA_100%)] p-5 font-sans text-ink">
      <div className="box-border flex flex-1 flex-col gap-[26px] rounded-[44px] border-[1.5px] border-white/85 bg-white/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_40px_80px_-40px_rgba(36,50,120,0.45)]">
        {header}
        <main className="flex flex-1 flex-col gap-[26px]">{children}</main>
      </div>
    </div>
  )
}
