'use client'

import { useState } from 'react'
import { useWidget } from '@/components/widget/widget-provider'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import { Callout } from '@/components/ui/callout'
import { trimSlash } from '@/lib/config'
import { cn } from '@/lib/utils'

type Key = 'html' | 'react' | 'vue' | 'sdk'

const TABS: { key: Key; label: string }[] = [
  { key: 'html', label: 'HTML' },
  { key: 'react', label: 'React / Next.js' },
  { key: 'vue', label: 'Vue' },
  { key: 'sdk', label: 'npm package' },
]

function build(widgetId: string, apiUrl: string, chatUrl: string): Record<Key, string> {
  const args = `{
      widgetId: '${widgetId}',
      apiUrl: '${apiUrl}',
      chatUrl: '${chatUrl}'
    }`
  return {
    html: `<script src="${chatUrl}/widget.js" defer></script>
<script>
  window.addEventListener('load', function () {
    OneAIWidget.init(${args});
  });
</script>`,
    react: `'use client'

import { useEffect } from 'react'

export function OneAIChatWidget() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '${chatUrl}/widget.js'
    script.defer = true
    script.onload = () => {
      window.OneAIWidget?.init(${args})
    }
    document.body.appendChild(script)
    return () => {
      window.OneAIWidget?.destroy?.()
      script.remove()
    }
  }, [])

  return null
}`,
    vue: `<script setup>
import { onMounted, onUnmounted } from 'vue'

let script

onMounted(() => {
  script = document.createElement('script')
  script.src = '${chatUrl}/widget.js'
  script.defer = true
  script.onload = () => {
    window.OneAIWidget?.init(${args})
  }
  document.body.appendChild(script)
})

onUnmounted(() => {
  window.OneAIWidget?.destroy?.()
  script?.remove()
})
</script>

<template><!-- renders nothing; the widget attaches to <body> --></template>`,
    sdk: `import { initWidget, destroyWidget } from '@one-ai/widget'

const widget = await initWidget({
  widgetId: '${widgetId}',
  apiUrl: '${apiUrl}',
  chatUrl: '${chatUrl}',
})

widget.open()   // also: close(), toggle()
// on unmount:
destroyWidget()`,
  }
}

export function SnippetsView() {
  const { settings } = useWidget()
  const [tab, setTab] = useState<Key>('html')
  const snippets = build(settings.widgetId.trim() || 'YOUR_WIDGET_ID', trimSlash(settings.apiUrl), trimSlash(settings.chatUrl))

  return (
    <div className="space-y-6">
      <Callout tone="info">
        These are the snippets a customer would paste into their own site, filled in with the values from{' '}
        <strong>Setup & controls</strong>. This playground installs the widget through the same <code>OneAIWidget.init</code> call.
      </Callout>
      <Card>
        <CardHeader title="Embed code" />
        <CardBody className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'rounded-full border px-3 py-1 text-[13px] transition-colors',
                  tab === t.key
                    ? 'border-violet-500 bg-violet-50 font-medium text-violet-700'
                    : 'border-zinc-200 text-zinc-600 hover:border-violet-300',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <CodeBlock code={snippets[tab]} />
        </CardBody>
      </Card>
    </div>
  )
}
