'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { StatusPill } from '@/components/widget/status-pill'
import { cn } from '@/lib/utils'

const SITE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/support', label: 'Support' },
  { href: '/blog/scaling-with-confidence', label: 'Long read' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const inConsole = pathname.startsWith('/console')

  const linkClass = (active: boolean) =>
    cn(
      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
      active ? 'bg-violet-50 text-violet-700' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
    )

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          Acme Cloud
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Site">
          {SITE_LINKS.map(l => (
            <Link key={l.href} href={l.href} className={linkClass(pathname === l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <StatusPill />
          <Link
            href="/console"
            className={cn(
              'rounded-lg px-3.5 py-2 text-sm font-medium text-white transition-colors',
              inConsole ? 'bg-violet-800' : 'bg-violet-600 hover:bg-violet-700',
            )}
          >
            Test Console
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="space-y-1 border-t border-zinc-200 bg-white px-5 py-3 md:hidden">
          {[...SITE_LINKS, { href: '/console', label: 'Test Console' }].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={cn('block', linkClass(pathname === l.href))}>
              {l.label}
            </Link>
          ))}
          <StatusPill className="mt-2" />
        </div>
      )}
    </header>
  )
}
