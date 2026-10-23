import { cn } from '@/lib/utils'
import { AlertTriangle, Info, FlaskConical } from 'lucide-react'
import type { ReactNode } from 'react'

type Tone = 'info' | 'warning' | 'test'

const STYLES: Record<Tone, { box: string; icon: ReactNode }> = {
  info: { box: 'border-sky-200 bg-sky-50 text-sky-900', icon: <Info className="h-4 w-4 text-sky-600" /> },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-900', icon: <AlertTriangle className="h-4 w-4 text-amber-600" /> },
  test: { box: 'border-violet-200 bg-violet-50 text-violet-900', icon: <FlaskConical className="h-4 w-4 text-violet-600" /> },
}

export function Callout({ tone = 'info', title, children, className }: { tone?: Tone; title?: string; children: ReactNode; className?: string }) {
  const s = STYLES[tone]
  return (
    <div className={cn('flex gap-3 rounded-lg border px-4 py-3 text-[13px] leading-relaxed', s.box, className)}>
      <span className="mt-0.5 shrink-0">{s.icon}</span>
      <div>
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        <div className="[&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px]">{children}</div>
      </div>
    </div>
  )
}
