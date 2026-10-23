'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import {
  DEFAULT_SETTINGS,
  ENVIRONMENTS,
  SETTINGS_STORAGE_KEY,
  resolveChatUrl,
  trimSlash,
  type EnvKey,
  type WidgetSettings,
} from '@/lib/config'
import { readJson, removeKey, writeJson } from '@/lib/storage'
import { resetOnline, simulateLocale, simulateOnline } from '@/lib/simulate'
import type {
  LogEntry,
  LogKind,
  OneAIWidgetGlobal,
  OneAIWidgetInstance,
  WidgetStatus,
} from '@/lib/widget-types'

const SCRIPT_ID = 'oneai-widget-script'
const MAX_LOGS = 200

interface WidgetContextValue {
  hydrated: boolean
  settings: WidgetSettings
  updateSettings: (patch: Partial<WidgetSettings>) => void
  selectEnv: (env: EnvKey) => void
  resetSettings: () => void
  status: WidgetStatus
  error: string | null
  init: () => Promise<void>
  destroy: () => void
  open: () => void
  close: () => void
  toggle: () => void
  offline: boolean
  setOffline: (offline: boolean) => void
  logs: LogEntry[]
  clearLogs: () => void
}

const WidgetContext = createContext<WidgetContextValue | null>(null)

export function useWidget() {
  const ctx = useContext(WidgetContext)
  if (!ctx) throw new Error('useWidget must be used inside <WidgetProvider>')
  return ctx
}

let scriptLoad: { src: string; promise: Promise<OneAIWidgetGlobal> } | null = null

function loadWidgetScript(src: string): Promise<OneAIWidgetGlobal> {
  if (scriptLoad?.src === src && window.OneAIWidget) return Promise.resolve(window.OneAIWidget)
  if (scriptLoad?.src === src) return scriptLoad.promise

  // Different source (local <-> hosted) or first load: start from a clean slate.
  document.getElementById(SCRIPT_ID)?.remove()
  window.OneAIWidget?.destroy()
  delete window.OneAIWidget

  const promise = new Promise<OneAIWidgetGlobal>((resolve, reject) => {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = src
    script.async = true
    script.onload = () =>
      window.OneAIWidget
        ? resolve(window.OneAIWidget)
        : reject(new Error('widget.js loaded but window.OneAIWidget is missing.'))
    script.onerror = () => {
      scriptLoad = null
      script.remove()
      reject(new Error(`Could not load the widget script from ${src}`))
    }
    document.body.appendChild(script)
  })
  scriptLoad = { src, promise }
  return promise
}

function summarizePayload(type: string, payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined
  const p = payload as Record<string, unknown>
  if (type === 'oneai:send-message' && typeof p.text === 'string') return `"${p.text.slice(0, 80)}"`
  if (type === 'oneai:lead-submit') {
    const values = (p.values ?? {}) as Record<string, unknown>
    return `fields: ${Object.keys(values).join(', ') || '(none)'}`
  }
  if (type === 'oneai:feedback') return `rating: ${String(p.rating)}`
  if (type === 'oneai:upload-request') {
    const file = p.file as { name?: string; size?: number } | undefined
    return file?.name ? `${file.name} (${file.size ?? '?'} bytes)` : undefined
  }
  return undefined
}

export function WidgetProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [hydrated, setHydrated] = useState(false)
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULT_SETTINGS)
  const [status, setStatus] = useState<WidgetStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [offline, setOfflineState] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const settingsRef = useRef(settings)
  const instanceRef = useRef<OneAIWidgetInstance | null>(null)
  const initToken = useRef(0)
  const logId = useRef(0)

  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  const addLog = useCallback((kind: LogKind, title: string, detail?: string, ok?: boolean) => {
    setLogs(prev => {
      const entry: LogEntry = { id: ++logId.current, at: Date.now(), kind, title, detail, ok }
      return [entry, ...prev].slice(0, MAX_LOGS)
    })
  }, [])

  // ── hydrate settings: stored values, then URL params (shareable links) win ──
  useEffect(() => {
    const stored = readJson<Partial<WidgetSettings>>(SETTINGS_STORAGE_KEY)
    const merged: WidgetSettings = { ...DEFAULT_SETTINGS, ...stored }
    const params = new URLSearchParams(window.location.search)
    const env = params.get('env') as EnvKey | null
    if (env && (env === 'custom' || env in ENVIRONMENTS)) {
      merged.env = env
      if (env !== 'custom') {
        merged.apiUrl = ENVIRONMENTS[env].apiUrl
        merged.chatUrl = resolveChatUrl(env, ENVIRONMENTS[env].chatUrl)
      }
    }
    if (merged.env === 'standalone') merged.chatUrl = window.location.origin
    if (params.get('apiUrl')) merged.apiUrl = params.get('apiUrl')!
    if (params.get('chatUrl')) merged.chatUrl = params.get('chatUrl')!
    if (params.get('widgetId')) merged.widgetId = params.get('widgetId')!
    if (params.get('previewToken')) merged.previewToken = params.get('previewToken')!
    // A shared link's values should stick, so later page loads keep using them.
    if (params.has('widgetId') || params.has('env')) writeJson(SETTINGS_STORAGE_KEY, merged)
    setSettings(merged)
    setHydrated(true)
  }, [])

  const updateSettings = useCallback((patch: Partial<WidgetSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      writeJson(SETTINGS_STORAGE_KEY, next)
      return next
    })
  }, [])

  const selectEnv = useCallback(
    (env: EnvKey) => {
      if (env === 'custom') updateSettings({ env })
      else updateSettings({ env, apiUrl: ENVIRONMENTS[env].apiUrl, chatUrl: resolveChatUrl(env, ENVIRONMENTS[env].chatUrl) })
    },
    [updateSettings],
  )

  const resetSettings = useCallback(() => {
    removeKey(SETTINGS_STORAGE_KEY)
    setSettings(DEFAULT_SETTINGS)
  }, [])

  // ── lifecycle ──
  const destroy = useCallback(() => {
    initToken.current++
    window.OneAIWidget?.destroy()
    instanceRef.current = null
    setStatus('idle')
    setError(null)
    addLog('lifecycle', 'Widget destroyed')
  }, [addLog])

  const init = useCallback(async () => {
    const s = settingsRef.current
    const widgetId = s.widgetId.trim()
    const apiUrl = trimSlash(s.apiUrl)
    const chatUrl = trimSlash(resolveChatUrl(s.env, s.chatUrl))
    const token = ++initToken.current

    if (!widgetId || !apiUrl || !chatUrl) {
      setStatus('error')
      setError('Widget ID, API URL and Chat URL are all required.')
      return
    }

    setStatus('loading')
    setError(null)
    try {
      simulateLocale(s.simulatedLocale)
      const src = s.scriptSource === 'local' ? '/widget.js' : `${chatUrl}/widget.js`
      const widget = await loadWidgetScript(src)
      if (token !== initToken.current) return // superseded by a newer init/destroy
      instanceRef.current = widget.init({
        widgetId,
        apiUrl,
        chatUrl,
        previewToken: s.previewToken.trim() || undefined,
      })
      setStatus('active')
      addLog(
        'lifecycle',
        'Widget initialized',
        `${widgetId} · script: ${s.scriptSource}${s.simulatedLocale ? ` · locale: ${s.simulatedLocale}` : ''}`,
      )
    } catch (e) {
      if (token !== initToken.current) return
      const message = e instanceof Error ? e.message : 'Failed to initialize the widget.'
      setStatus('error')
      setError(message)
      addLog('error', 'Initialization failed', message, false)
    }
  }, [addLog])

  const withInstance = useCallback(
    (action: 'open' | 'close' | 'toggle') => {
      const instance = instanceRef.current
      if (!instance) {
        addLog('error', `Cannot ${action}: widget is not initialized`, undefined, false)
        return
      }
      instance[action]()
      addLog('lifecycle', `widget.${action}()`)
    },
    [addLog],
  )

  const open = useCallback(() => withInstance('open'), [withInstance])
  const close = useCallback(() => withInstance('close'), [withInstance])
  const toggle = useCallback(() => withInstance('toggle'), [withInstance])

  const setOffline = useCallback(
    (value: boolean) => {
      simulateOnline(!value)
      setOfflineState(value)
      addLog('lifecycle', value ? 'Simulating offline' : 'Back online')
    },
    [addLog],
  )

  // ── auto-init, and re-init per navigation so page-targeted greetings re-resolve ──
  useEffect(() => {
    if (!hydrated) return
    const s = settingsRef.current
    if (!s.autoInit || !s.widgetId.trim()) return
    if (instanceRef.current && !s.reinitOnNavigate) return
    void init()
  }, [hydrated, pathname, init])

  // ── observe widget traffic: iframe -> host messages and widget API calls ──
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: unknown; payload?: unknown } | null
      if (!data || typeof data.type !== 'string' || !data.type.startsWith('oneai:')) return
      addLog('iframe', data.type.replace('oneai:', ''), summarizePayload(data.type, data.payload))
    }
    window.addEventListener('message', onMessage)

    const originalFetch = window.fetch
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const api = trimSlash(settingsRef.current.apiUrl)
      if (!api || !url.startsWith(api + '/widget/')) return originalFetch(input, init)
      const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
      const path = url.slice(api.length).replace(/\/[0-9a-f-]{20,}/gi, '/{id}')
      const started = performance.now()
      try {
        const res = await originalFetch(input, init)
        addLog('network', `${method} ${path}`, `${res.status} · ${Math.round(performance.now() - started)} ms`, res.ok)
        return res
      } catch (e) {
        addLog('network', `${method} ${path}`, 'Request failed (network error or origin not allowed)', false)
        throw e
      }
    }

    return () => {
      window.removeEventListener('message', onMessage)
      window.fetch = originalFetch
      resetOnline()
    }
  }, [addLog])

  const clearLogs = useCallback(() => setLogs([]), [])

  const value = useMemo<WidgetContextValue>(
    () => ({
      hydrated,
      settings,
      updateSettings,
      selectEnv,
      resetSettings,
      status,
      error,
      init,
      destroy,
      open,
      close,
      toggle,
      offline,
      setOffline,
      logs,
      clearLogs,
    }),
    [hydrated, settings, updateSettings, selectEnv, resetSettings, status, error, init, destroy, open, close, toggle, offline, setOffline, logs, clearLogs],
  )

  return <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
}
