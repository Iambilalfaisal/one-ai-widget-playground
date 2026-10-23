import type { Metadata } from 'next'
import { DiagnosticsView } from '@/components/console/diagnostics-view'

export const metadata: Metadata = { title: 'Diagnostics' }

export default function DiagnosticsPage() {
  return <DiagnosticsView />
}
