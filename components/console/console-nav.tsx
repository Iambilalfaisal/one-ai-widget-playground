'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/console', label: 'Setup & controls' },
  { href: '/console/checklist', label: 'Test checklist' },
  { href: '/console/diagnostics', label: 'Diagnostics' },
  { href: '/console/snippets', label: 'Embed snippets' },
]

export function ConsoleNav() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-zinc-200" aria-label="Console sections">
      {TABS.map(t => {
        const active = pathname === t.href
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              '-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              active ? 'border-violet-600 text-violet-700' : 'border-transparent text-zinc-600 hover:text-zinc-900',
            )}
          >
            {t.label}
          </Link>
        )
      })}
    </nav>
  )
}
