import { Callout } from '@/components/ui/callout'
import type { ReactNode } from 'react'

/** A "what to test on this page" box shown at the top of scenario pages. */
export function TestNote({ title = 'QA: what to test here', children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-8">
      <Callout tone="test" title={title}>
        {children}
      </Callout>
    </div>
  )
}
