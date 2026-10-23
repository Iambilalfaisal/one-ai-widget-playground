import type { Metadata } from 'next'
import { ChecklistView } from '@/components/console/checklist-view'
import { Callout } from '@/components/ui/callout'

export const metadata: Metadata = { title: 'Test checklist' }

export default function ChecklistPage() {
  return (
    <div className="space-y-6">
      <Callout tone="info" title="How this works">
        Work through each scenario, mark it Pass or Fail, and add a note. Progress is saved in this browser. Items marked
        <strong> Setup</strong> need that option switched on for the widget in the One-AI dashboard first. When you are
        done, use <strong>Copy report</strong> and paste it into the Jira ticket.
      </Callout>
      <ChecklistView />
    </div>
  )
}
