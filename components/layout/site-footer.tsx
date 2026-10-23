import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-[13px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-medium text-zinc-700">Acme Cloud</span> is a fictional company. This site exists only to
          host the One-AI chat widget for testing.
        </p>
        <nav className="flex gap-5" aria-label="Test tools">
          <Link href="/console" className="hover:text-violet-700">Console</Link>
          <Link href="/console/checklist" className="hover:text-violet-700">Checklist</Link>
          <Link href="/console/diagnostics" className="hover:text-violet-700">Diagnostics</Link>
        </nav>
      </div>
    </footer>
  )
}
