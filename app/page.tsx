import Link from 'next/link'
import { ArrowRight, BarChart3, ClipboardCheck, Cog, HardDrive, Stethoscope, SlidersHorizontal } from 'lucide-react'
import { PageHero } from '@/components/layout/page-hero'
import { Card, CardBody } from '@/components/ui/card'
import { PRODUCTS } from '@/lib/site-content'

const ICONS = { analytics: BarChart3, automation: Cog, storage: HardDrive } as const

const STEPS = [
  { n: 1, title: 'Add your widget', body: 'Open the Test Console and paste the Widget ID from the One-AI dashboard.' },
  { n: 2, title: 'Install it', body: 'Click “Initialize widget”. The chat launcher appears on every page of this site.' },
  { n: 3, title: 'Work the checklist', body: 'Follow the guided scenarios, mark Pass or Fail, and copy the report to Jira.' },
]

const TOOLS = [
  { href: '/console', icon: SlidersHorizontal, title: 'Setup & controls', body: 'Environment, widget ID, language, offline simulation and a live event log.' },
  { href: '/console/checklist', icon: ClipboardCheck, title: 'Test checklist', body: 'Step-by-step scenarios with expected results, saved as you go.' },
  { href: '/console/diagnostics', icon: Stethoscope, title: 'Diagnostics', body: 'One click to find out why the widget is not loading.' },
]

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Acme Cloud"
        title="Build, automate and store — all in one cloud."
        description="This is a fictional company website with the One-AI chat widget installed, exactly as a customer would add it to their own site. Use it to test every widget feature end to end."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/console" className="inline-flex h-11 items-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-medium text-white shadow-sm hover:bg-violet-700">
            Open the Test Console <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/pricing" className="inline-flex h-11 items-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
            See pricing
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-xl font-semibold text-zinc-900">Start testing in three steps</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map(s => (
            <li key={s.n}>
              <Card className="h-full">
                <CardBody>
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">{s.n}</span>
                  <h3 className="font-semibold text-zinc-900">{s.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{s.body}</p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="text-xl font-semibold text-zinc-900">Testing tools</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TOOLS.map(t => (
              <Link key={t.href} href={t.href} className="group rounded-xl border border-zinc-200 p-5 transition-colors hover:border-violet-300 hover:bg-violet-50/40">
                <t.icon className="mb-3 h-5 w-5 text-violet-600" />
                <h3 className="font-semibold text-zinc-900 group-hover:text-violet-700">{t.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{t.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-xl font-semibold text-zinc-900">Our products</h2>
        <p className="mt-1 text-[13px] text-zinc-500">Realistic pages for testing page-targeted greetings and navigation.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PRODUCTS.map(p => {
            const Icon = ICONS[p.slug as keyof typeof ICONS]
            return (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-violet-300">
                <Icon className="mb-3 h-5 w-5 text-violet-600" />
                <h3 className="font-semibold text-zinc-900 group-hover:text-violet-700">{p.name}</h3>
                <p className="mt-1 text-[13px] text-zinc-600">{p.tagline}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
