import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

const CONTROL =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 ' +
  'focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:bg-zinc-50 disabled:text-zinc-500'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-zinc-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(CONTROL, 'h-10', className)} />
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(CONTROL, 'h-10', className)} />
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  description?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 rounded-lg px-1 py-2 text-left"
    >
      <span>
        <span className="block text-[13px] font-medium text-zinc-800">{label}</span>
        {description && <span className="block text-xs text-zinc-500">{description}</span>}
      </span>
      <span
        className={cn(
          'mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors',
          checked ? 'bg-violet-600' : 'bg-zinc-300',
        )}
      >
        <span className={cn('h-4 w-4 rounded-full bg-white shadow transition-transform', checked && 'translate-x-4')} />
      </span>
    </button>
  )
}
