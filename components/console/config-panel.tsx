'use client'

import { useState } from 'react'
import { Link2, Play, Power, RotateCcw } from 'lucide-react'
import { useWidget } from '@/components/widget/widget-provider'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Toggle } from '@/components/ui/field'
import { Callout } from '@/components/ui/callout'
import { ENVIRONMENTS, LOCALE_OPTIONS, type EnvKey } from '@/lib/config'
import { cn } from '@/lib/utils'

const ENV_TABS: { key: EnvKey; label: string }[] = [
  { key: 'dev', label: ENVIRONMENTS.dev.label },
  { key: 'local', label: ENVIRONMENTS.local.label },
  { key: 'custom', label: 'Custom' },
]

export function ConfigPanel() {
  const { settings, updateSettings, selectEnv, resetSettings, init, destroy, status, error } = useWidget()
  const [linkCopied, setLinkCopied] = useState(false)
  const isCustom = settings.env === 'custom'

  const copyLink = async () => {
    const params = new URLSearchParams({ env: settings.env, widgetId: settings.widgetId })
    if (isCustom) {
      params.set('apiUrl', settings.apiUrl)
      params.set('chatUrl', settings.chatUrl)
    }
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/console?${params}`)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Card>
      <CardHeader
        title="Widget configuration"
        description="Point the site at a widget, then install it. Settings are remembered in this browser."
      />
      <CardBody className="space-y-5">
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-zinc-700">Environment</span>
          <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1" role="tablist">
            {ENV_TABS.map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={settings.env === t.key}
                onClick={() => selectEnv(t.key)}
                className={cn(
                  'rounded-md px-4 py-1.5 text-[13px] font-medium transition-colors',
                  settings.env === t.key ? 'bg-white text-violet-700 shadow-sm' : 'text-zinc-600 hover:text-zinc-900',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Field label="Widget ID" hint="From the One-AI dashboard: Widgets → your widget → Embed Code.">
          <Input
            value={settings.widgetId}
            onChange={e => updateSettings({ widgetId: e.target.value })}
            placeholder="e.g. 66f1c0a2b7…"
            spellCheck={false}
            autoComplete="off"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="API URL" hint="Backend that serves /widget/* endpoints.">
            <Input
              value={settings.apiUrl}
              disabled={!isCustom}
              onChange={e => updateSettings({ apiUrl: e.target.value })}
              spellCheck={false}
            />
          </Field>
          <Field label="Chat URL" hint="One-AI app that hosts the chat iframe.">
            <Input
              value={settings.chatUrl}
              disabled={!isCustom}
              onChange={e => updateSettings({ chatUrl: e.target.value })}
              spellCheck={false}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Widget script" hint="Local = widget.js bundled in this repo. Hosted = served by the Chat URL.">
            <Select
              value={settings.scriptSource}
              onChange={e => updateSettings({ scriptSource: e.target.value as 'local' | 'hosted' })}
            >
              <option value="local">Local (this repo)</option>
              <option value="hosted">Hosted (Chat URL)</option>
            </Select>
          </Field>
          <Field label="Visitor language" hint="Simulates the browser language to test translated copy.">
            <Select value={settings.simulatedLocale} onChange={e => updateSettings({ simulatedLocale: e.target.value })}>
              {LOCALE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Draft preview token (optional)" hint="Loads the unpublished draft config instead of the published one.">
          <Input
            value={settings.previewToken}
            onChange={e => updateSettings({ previewToken: e.target.value })}
            placeholder="Leave empty for the published widget"
            spellCheck={false}
            autoComplete="off"
          />
        </Field>

        <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3">
          <Toggle
            checked={settings.autoInit}
            onChange={v => updateSettings({ autoInit: v })}
            label="Install automatically on page load"
            description="Like a real site: the widget appears on every page without pressing a button."
          />
          <Toggle
            checked={settings.reinitOnNavigate}
            onChange={v => updateSettings({ reinitOnNavigate: v })}
            label="Re-install on every page navigation"
            description="Mimics a multi-page site. Needed to see page-targeted greetings change between pages."
          />
        </div>

        {status === 'error' && error && (
          <Callout tone="warning" title="Widget could not start">
            {error}
          </Callout>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" onClick={() => void init()} disabled={!settings.widgetId.trim() || status === 'loading'}>
            <Play className="h-4 w-4" />
            {status === 'active' ? 'Re-initialize widget' : 'Initialize widget'}
          </Button>
          <Button onClick={destroy} disabled={status !== 'active'}>
            <Power className="h-4 w-4" />
            Remove widget
          </Button>
          <Button variant="ghost" onClick={copyLink} disabled={!settings.widgetId.trim()}>
            <Link2 className="h-4 w-4" />
            {linkCopied ? 'Link copied' : 'Copy shareable link'}
          </Button>
          <Button variant="ghost" onClick={resetSettings} className="ml-auto">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
