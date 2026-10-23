import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { PageHero } from '@/components/layout/page-hero'
import { TestNote } from '@/components/layout/test-note'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PLANS } from '@/lib/site-content'

export const metadata: Metadata = { title: 'Pricing' }

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Simple pricing that scales with you" description="Start free. Upgrade when your team is ready." />
      <TestNote>
        <p>
          Page-targeted greetings: add a greeting with path <code>/pricing</code> in the dashboard (for example “Questions
          about plans? Ask me!”). Open the widget here and confirm that exact greeting shows.
        </p>
      </TestNote>
      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-10 md:grid-cols-3">
        {PLANS.map(plan => (
          <div
            key={plan.name}
            className={cn(
              'flex flex-col rounded-xl border bg-white p-6 shadow-sm',
              plan.highlighted ? 'border-violet-400 ring-2 ring-violet-100' : 'border-zinc-200',
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900">{plan.name}</h2>
              {plan.highlighted && <Badge tone="brand">Most popular</Badge>}
            </div>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tracking-tight text-zinc-900">{plan.price}</span>
              <span className="text-[13px] text-zinc-500">{plan.period}</span>
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-zinc-600">{plan.description}</p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-[13px] text-zinc-800">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={cn(
                'mt-6 h-10 rounded-lg text-sm font-medium transition-colors',
                plan.highlighted ? 'bg-violet-600 text-white hover:bg-violet-700' : 'border border-zinc-200 text-zinc-800 hover:bg-zinc-50',
              )}
            >
              {plan.name === 'Enterprise' ? 'Contact sales' : 'Get started'}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
