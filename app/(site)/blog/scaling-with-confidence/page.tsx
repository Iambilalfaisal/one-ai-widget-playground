import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'
import { TestNote } from '@/components/layout/test-note'

export const metadata: Metadata = { title: 'Scaling with confidence' }

const SECTIONS = [
  {
    title: 'Start with the failure modes',
    body: [
      'Every system fails eventually. The teams that scale well are not the ones that avoid failure, but the ones that decided in advance what failure looks like and how quickly they want to know about it.',
      'Write down the three most likely ways your service degrades, and give each one a dashboard, an alert, and an owner. If a failure has none of those three, it is a surprise waiting to happen.',
    ],
  },
  {
    title: 'Make capacity boring',
    body: [
      'Capacity planning should be a calendar event, not an emergency. Review growth numbers monthly, project forward a quarter, and add headroom before you need it. Boring capacity is cheap capacity.',
      'Load test against the numbers you project, not the numbers you have. The gap between those two figures is the work you still owe your future self.',
    ],
  },
  {
    title: 'Automate the runbook, not just the deploy',
    body: [
      'Most teams automate deployment and stop there. The bigger win is automating the response: restart, roll back, fail over, scale out. Each automated step is one less decision at three in the morning.',
      'Start by taking your noisiest runbook and turning its first three steps into a script. Run the script by hand for a month before you let it run on its own.',
    ],
  },
  {
    title: 'Keep the feedback loop short',
    body: [
      'A change you can observe in minutes is a change you can make confidently. Invest in fast pipelines, progressive rollouts and rapid rollback. Speed of recovery matters more than speed of release.',
      'Measure how long it takes from merging a change to seeing its effect in production. Then cut that number in half, twice.',
    ],
  },
  {
    title: 'Share what you learn',
    body: [
      'Postmortems only pay off when other teams read them. Publish them internally, keep them blameless, and end each one with owners and dates for the follow-ups.',
      'Over time, the archive becomes your most valuable training material: a record of real decisions made under real pressure.',
    ],
  },
  {
    title: 'Plan for the people, too',
    body: [
      'Scaling systems means scaling the team that runs them. Rotate on-call fairly, protect time for improvement work, and treat burnout as a reliability risk, because it is one.',
      'The healthiest engineering organisations make it easy to say “I do not understand this yet” and just as easy to get the answer.',
    ],
  },
]

export default function LongReadPage() {
  return (
    <>
      <PageHero eyebrow="Engineering blog" title="Scaling with confidence" description="Six practical habits for growing a system without losing sleep. A long page, on purpose." />
      <TestNote>
        <p>
          <strong>Scroll trigger:</strong> with “Open on scroll” set in the dashboard (e.g. 50%), scroll down slowly. The
          widget should open once when you pass that depth, and stay closed if you dismiss it and keep scrolling.
          This page is deliberately long so every percentage is reachable.
        </p>
      </TestNote>
      <article className="mx-auto max-w-2xl px-5 py-12">
        {SECTIONS.map((s, i) => (
          <section key={s.title} className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-zinc-900">
              <span className="mr-2 text-violet-500">{i + 1}.</span>
              {s.title}
            </h2>
            {/* Repeated so the page is long enough to scroll through at any trigger depth. */}
            {[...s.body, ...s.body].map((p, j) => (
              <p key={j} className="mb-5 text-[16px] leading-8 text-zinc-700">{p}</p>
            ))}
          </section>
        ))}
        <p className="border-t border-zinc-200 pt-6 text-[13px] text-zinc-500">End of article — you reached 100%.</p>
      </article>
    </>
  )
}
