'use client'

import { Trash2 } from 'lucide-react'
import { useWidget } from '@/components/widget/widget-provider'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { LogEntry } from '@/lib/widget-types'

const KIND: Record<LogEntry['kind'], { label: string; tone: 'neutral' | 'brand' | 'success' | 'danger' }> = {
  lifecycle: { label: 'Widget', tone: 'neutral' },
  iframe: { label: 'Chat → page', tone: 'brand' },
  network: { label: 'API', tone: 'success' },
  error: { label: 'Error', tone: 'danger' },
}

const time = (at: number) => new Date(at).toLocaleTimeString([], { hour12: false })

export function EventLog() {
  const { logs, clearLogs } = useWidget()

  return (
    <Card>
      <CardHeader
        title="Live event log"
        description="Every widget API call and message from the chat window, newest first. Attach a screenshot of this to bug reports."
        action={
          <Button size="sm" variant="ghost" onClick={clearLogs} disabled={logs.length === 0}>
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        }
      />
      {logs.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-zinc-500">
          No events yet. Initialize the widget and open it to see activity here.
        </p>
      ) : (
        <ul className="max-h-[460px] divide-y divide-zinc-100 overflow-y-auto" aria-live="polite">
          {logs.map(entry => {
            const kind = KIND[entry.kind]
            const failed = entry.ok === false
            return (
              <li key={entry.id} className="flex items-start gap-3 px-5 py-2.5 text-[13px]">
                <span className="mt-0.5 w-16 shrink-0 font-mono text-xs text-zinc-400">{time(entry.at)}</span>
                <Badge tone={failed ? 'danger' : kind.tone} className="w-24 shrink-0 justify-center">{kind.label}</Badge>
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-800">{entry.title}</p>
                  {entry.detail && (
                    <p className={failed ? 'text-red-600' : 'text-zinc-500'}>{entry.detail}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
