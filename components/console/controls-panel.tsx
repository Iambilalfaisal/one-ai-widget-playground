'use client'

import { Activity, ChevronsUpDown, DoorClosed, DoorOpen, RefreshCw, UserRoundX } from 'lucide-react'
import { useWidget } from '@/components/widget/widget-provider'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/field'
import { removeKey } from '@/lib/storage'

export function ControlsPanel() {
  const { status, settings, open, close, toggle, offline, setOffline, init, logs } = useWidget()
  const active = status === 'active'

  const newVisitor = () => {
    // Same key widget.js uses to remember the visitor's session + history.
    removeKey(`oneai_widget_session_${settings.widgetId.trim()}`)
    void init()
  }

  return (
    <Card>
      <CardHeader title="Widget controls" description="Drive the widget the way a host page would." />
      <CardBody className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Button onClick={open} disabled={!active}>
            <DoorOpen className="h-4 w-4" /> Open
          </Button>
          <Button onClick={close} disabled={!active}>
            <DoorClosed className="h-4 w-4" /> Close
          </Button>
          <Button onClick={toggle} disabled={!active}>
            <ChevronsUpDown className="h-4 w-4" /> Toggle
          </Button>
        </div>

        <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3">
          <Toggle
            checked={offline}
            onChange={setOffline}
            label="Simulate offline"
            description="Messages sent while offline are queued and delivered when you go back online."
          />
        </div>

        <div className="space-y-2">
          <Button onClick={newVisitor} disabled={!active} className="w-full justify-start">
            <UserRoundX className="h-4 w-4" />
            Start as a brand-new visitor
          </Button>
          <p className="text-xs text-zinc-500">
            Clears the stored visitor session (conversation history and lead form state), then re-installs the widget.
          </p>
          <Button variant="ghost" onClick={() => window.location.reload()} className="w-full justify-start">
            <RefreshCw className="h-4 w-4" />
            Reload the page
          </Button>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Activity className="h-3.5 w-3.5" />
          {logs.length} event{logs.length === 1 ? '' : 's'} captured this session
        </p>
      </CardBody>
    </Card>
  )
}
