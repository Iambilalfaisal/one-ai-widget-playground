import type { ReactNode } from 'react'

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <section className="border-b border-zinc-200 bg-gradient-to-b from-violet-50/70 to-transparent">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        {eyebrow && <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-violet-600">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}
