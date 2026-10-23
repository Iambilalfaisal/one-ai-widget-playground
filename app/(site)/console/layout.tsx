import type { ReactNode } from 'react'
import { ConsoleNav } from '@/components/console/console-nav'

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8">
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-violet-600">QA tools</p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Widget Test Console</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-zinc-600">
          Configure the widget, drive it, and record results. The widget stays installed while you move between pages.
        </p>
      </div>
      <ConsoleNav />
      <div className="mt-6">{children}</div>
    </div>
  )
}
