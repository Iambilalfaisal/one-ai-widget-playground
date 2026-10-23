import type { Metadata } from 'next'
import { SnippetsView } from '@/components/console/snippets-view'

export const metadata: Metadata = { title: 'Embed snippets' }

export default function SnippetsPage() {
  return <SnippetsView />
}
