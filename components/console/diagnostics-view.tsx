'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, CircleAlert, Loader2, Play, XCircle } from 'lucide-react'
import { useWidget } from '@/components/widget/widget-provider'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CodeBlock } from '@/components/ui/code-block'
import { trimSlash } from '@/lib/config'

type CheckState = 'pending' | 'running' | 'pass' | 'fail' | 'warn'

interface Check {
  id: string
  label: string
  state: CheckState
  detail?: string
  hint?: string
}

interface WidgetConfigJson {
  branding?: { theme_color?: string; position?: string; locales?: Record<string, unknown> }
  triggers?: { auto_open?: boolean; auto_open_delay_ms?: number; open_on_scroll_percent?: number | null; targeted_greetings?: { path_pattern: string }[] }
  behavior?: { allow_attachments?: boolean; welcome_sound?: boolean }
  lead_fields?: unknown[]
  layout?: { mobile_full_screen?: boolean; animation_style?: string }
}

const INITIAL: Check[] = [
  { id: 'settings', label: 'Configuration is complete', state: 'pending' },
  { id: 'script', label: 'Widget script loads', state: 'pending' },
  { id: 'config', label: 'Widget configuration loads from the API', state: 'pending' },
  { id: 'chat', label: 'Chat window page is reachable', state: 'pending' },
]

const ICON = {
  pending: <span className="h-5 w-5 rounded-full border-2 border-zinc-200" />,
  running: <Loader2 className="h-5 w-5 animate-spin text-violet-500" />,
  pass: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  fail: <XCircle className="h-5 w-5 text-red-500" />,
  warn: <CircleAlert className="h-5 w-5 text-amber-500" />,
}

export function DiagnosticsView() {
  const { settings, status } = useWidget()
  const [checks, setChecks] = useState<Check[]>(INITIAL)
  const [running, setRunning] = useState(false)
  const [config, setConfig] = useState<WidgetConfigJson | null>(null)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const patch = (id: string, next: Partial<Check>) =>
    setChecks(prev => prev.map(c => (c.id === id ? { ...c, ...next } : c)))

  const run = useCallback(async () => {
    setRunning(true)
    setConfig(null)
    setChecks(INITIAL.map(c => ({ ...c, state: 'pending' })))

    const widgetId = settings.widgetId.trim()
    const api = trimSlash(settings.apiUrl)
    const chat = trimSlash(settings.chatUrl)

    patch('settings', { state: 'running' })
    if (!widgetId || !api || !chat) {
      patch('settings', { state: 'fail', detail: 'Widget ID, API URL or Chat URL is missing.', hint: 'Fill them in on the Setup & controls tab.' })
      setRunning(false)
      return
    }
    patch('settings', { state: 'pass', detail: `${widgetId} · ${api}` })

    // Widget script
    patch('script', { state: 'running' })
    const scriptUrl = settings.scriptSource === 'local' ? '/widget.js' : `${chat}/widget.js`
    try {
      const res = await fetch(scriptUrl, { cache: 'no-store', mode: settings.scriptSource === 'local' ? 'same-origin' : 'no-cors' })
      const ok = res.ok || res.type === 'opaque'
      patch('script', ok ? { state: 'pass', detail: scriptUrl } : { state: 'fail', detail: `HTTP ${res.status} from ${scriptUrl}` })
    } catch {
      patch('script', { state: 'fail', detail: `Could not reach ${scriptUrl}`, hint: 'Check the Chat URL, or switch the widget script to Local.' })
    }

    // Config endpoint (also the CORS / allowed-origin test)
    patch('config', { state: 'running' })
    const query = settings.previewToken.trim() ? `?preview_token=${encodeURIComponent(settings.previewToken.trim())}` : ''
    try {
      const res = await fetch(`${api}/widget/${encodeURIComponent(widgetId)}/config${query}`)
      if (res.ok) {
        setConfig((await res.json()) as WidgetConfigJson)
        patch('config', { state: 'pass', detail: `HTTP ${res.status}` })
      } else {
        const body = (await res.json().catch(() => ({}))) as { detail?: string }
        patch('config', {
          state: 'fail',
          detail: `HTTP ${res.status}${body.detail ? ` — ${body.detail}` : ''}`,
          hint:
            res.status === 404
              ? 'The Widget ID does not exist, or the widget is disabled or deleted.'
              : res.status === 403
                ? `This origin (${window.location.origin}) is probably not in the widget's Allowed origins.`
                : undefined,
        })
      }
    } catch {
      patch('config', {
        state: 'fail',
        detail: 'The request was blocked or the API is unreachable.',
        hint: `Most likely this origin (${window.location.origin}) is not in the widget's Allowed origins, or the API URL is wrong. Add the origin in the dashboard, wait about a minute, then run the checks again.`,
      })
    }

    // Chat iframe page
    patch('chat', { state: 'running' })
    try {
      await fetch(`${chat}/embed/${encodeURIComponent(widgetId)}`, { mode: 'no-cors', cache: 'no-store' })
      patch('chat', { state: 'pass', detail: `${chat}/embed/${widgetId}` })
    } catch {
      patch('chat', { state: 'fail', detail: `Could not reach ${chat}`, hint: 'Check the Chat URL and your network or VPN.' })
    }

    setRunning(false)
  }, [settings])

  const summary: [string, string][] = config
    ? [
        ['Theme colour', config.branding?.theme_color ?? '—'],
        ['Position', config.branding?.position ?? '—'],
        ['Auto-open', config.triggers?.auto_open ? `Yes (${(config.triggers.auto_open_delay_ms ?? 4000) / 1000}s)` : 'No'],
        ['Open on scroll', config.triggers?.open_on_scroll_percent != null ? `${config.triggers.open_on_scroll_percent}%` : 'Off'],
        ['Page-targeted greetings', String(config.triggers?.targeted_greetings?.length ?? 0)],
        ['Lead form fields', String(config.lead_fields?.length ?? 0)],
        ['Attachments', config.behavior?.allow_attachments ? 'Allowed' : 'Off'],
        ['Translations', Object.keys(config.branding?.locales ?? {}).join(', ') || 'None'],
        ['Full screen on mobile', config.layout?.mobile_full_screen ? 'Yes' : 'No'],
        ['Animation', config.layout?.animation_style ?? '—'],
      ]
    : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Connection checks"
          description="Run these first when the widget does not appear or behave as expected."
          action={
            <Button variant="primary" onClick={() => void run()} disabled={running}>
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run checks
            </Button>
          }
        />
        <CardBody className="space-y-4">
          <dl className="grid gap-x-8 gap-y-1 text-[13px] sm:grid-cols-2">
            <div className="flex gap-2"><dt className="text-zinc-500">This site’s origin:</dt><dd className="font-mono text-zinc-800">{origin}</dd></div>
            <div className="flex gap-2"><dt className="text-zinc-500">Widget status:</dt><dd><Badge tone={status === 'active' ? 'success' : status === 'error' ? 'danger' : 'neutral'}>{status}</Badge></dd></div>
          </dl>

          <ul className="divide-y divide-zinc-100 rounded-lg border border-zinc-200">
            {checks.map(c => (
              <li key={c.id} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 shrink-0">{ICON[c.state]}</span>
                <div className="min-w-0 text-[13px]">
                  <p className="font-medium text-zinc-900">{c.label}</p>
                  {c.detail && <p className="break-words text-zinc-600">{c.detail}</p>}
                  {c.hint && <p className="mt-1 text-amber-700">{c.hint}</p>}
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {config && (
        <Card>
          <CardHeader title="What the widget is configured to do" description="Read from the live configuration, so you know which scenarios apply." />
          <CardBody className="space-y-5">
            <dl className="grid gap-x-8 gap-y-2 text-[13px] sm:grid-cols-2">
              {summary.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-zinc-100 pb-2">
                  <dt className="text-zinc-500">{k}</dt>
                  <dd className="text-right font-medium text-zinc-900">{v}</dd>
                </div>
              ))}
            </dl>
            <details>
              <summary className="cursor-pointer text-[13px] font-medium text-violet-600">Show raw configuration</summary>
              <div className="mt-3"><CodeBlock code={JSON.stringify(config, null, 2)} /></div>
            </details>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
