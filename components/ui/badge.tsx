import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'brand'

const TONES: Record<Tone, string> = {
  neutral: 'bg-zinc-100 text-zinc-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  brand: 'bg-violet-50 text-violet-700',
}

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', TONES[tone], className)}>
      {children}
    </span>
  )
}
