import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'
import { PageHero } from '@/components/layout/page-hero'
import { TestNote } from '@/components/layout/test-note'
import { FAQ } from '@/lib/site-content'

export const metadata: Metadata = { title: 'Support' }

export default function SupportPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="How can we help?" description="Browse common questions, or ask our assistant in the chat window." />
      <TestNote>
        <p>
          Good place to test real conversations: ask the assistant the questions below and compare its answers to the
          FAQ. Also confirm this page shows the <strong>default</strong> greeting when only <code>/pricing</code> and{' '}
          <code>/products*</code> are targeted.
        </p>
      </TestNote>
      <div className="mx-auto max-w-3xl space-y-3 px-5 py-10">
        {FAQ.map(item => (
          <details key={item.q} className="group rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm open:border-violet-300">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium text-zinc-900">
              {item.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-[13px] leading-relaxed text-zinc-600">{item.a}</p>
          </details>
        ))}
      </div>
    </>
  )
}
