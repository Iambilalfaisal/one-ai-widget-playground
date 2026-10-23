import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('rounded-xl border border-zinc-200 bg-white shadow-sm', className)} />
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
      <div>
        <h2 className="text-[15px] font-semibold text-zinc-900">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-zinc-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('px-5 py-4', className)} />
}
