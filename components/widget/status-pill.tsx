'use client'

import Link from 'next/link'
import { useWidget } from '@/components/widget/widget-provider'
import { cn } from '@/lib/utils'

const LABEL = {
  idle: 'Widget off',
  loading: 'Loading…',
  active: 'Widget active',
  error: 'Widget error',
} as const

const DOT = {
  idle: 'bg-zinc-400',
  loading: 'bg-amber-500 animate-pulse',
  active: 'bg-emerald-500',
  error: 'bg-red-500',
} as const

export function StatusPill({ className }: { className?: string }) {
  const { status, settings, hydrated } = useWidget()
  const state = hydrated ? status : 'idle'
  return (
    <Link
      href="/console"
      title="Open the Test Console"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-violet-300',
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', DOT[state])} />
      {LABEL[state]}
      {state === 'active' && <span className="text-zinc-400">· {settings.env}</span>}
    </Link>
  )
}
