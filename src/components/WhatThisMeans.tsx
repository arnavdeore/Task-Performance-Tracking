import type { Insight, InsightTone } from '../lib/performanceStats'

// Full class names are written out so Tailwind can see them.
const TAG_COLOUR: Record<InsightTone, string> = {
  green: 'bg-green-pastel text-green-dark',
  red: 'bg-red-pastel text-red-dark',
  amber: 'bg-amber-pastel text-amber-dark',
  blue: 'bg-blue-pastel text-blue-dark',
}

/** "What this means": plain-language insights worked out from the numbers. Layout from design/Performance.dc.html. */
export default function WhatThisMeans({ insights }: { insights: Insight[] }) {
  return (
    <section className="glass box-border flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-[34px] px-6 py-[22px]">
      <h2 className="m-0 text-[21px] font-bold">What this means</h2>
      {insights.map((insight) => (
        <div
          key={insight.title}
          className="flex items-start gap-3 rounded-[22px] bg-white px-4 py-3.5 shadow-[0_10px_18px_-14px_rgba(35,43,94,0.4)]"
        >
          <div className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-bold ${TAG_COLOUR[insight.tone]}`}>
            {insight.tag}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">{insight.title}</span>
            <span className="text-[13px] leading-[1.55] text-muted-2">{insight.text}</span>
          </div>
        </div>
      ))}
    </section>
  )
}
