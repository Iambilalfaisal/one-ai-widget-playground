import type { Metadata } from 'next'
import { ConfigPanel } from '@/components/console/config-panel'
import { ControlsPanel } from '@/components/console/controls-panel'
import { EventLog } from '@/components/console/event-log'
import { Callout } from '@/components/ui/callout'

export const metadata: Metadata = { title: 'Test Console' }

export default function ConsolePage() {
  return (
    <div className="space-y-6">
      <Callout tone="info" title="Before you start">
        The widget only works on origins in its <strong>Allowed origins</strong> list. <code>localhost</code> is always
        allowed; for any deployed copy of this site, add its URL to the widget in the One-AI dashboard first.
      </Callout>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ConfigPanel />
        <ControlsPanel />
      </div>
      <EventLog />
    </div>
  )
}
