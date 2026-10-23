/** standalone = chat window served by THIS site, API on Dev. dev/local = chat window from that One-AI app. */
export type EnvKey = 'standalone' | 'dev' | 'local' | 'custom'
export type ScriptSource = 'local' | 'hosted'

export interface WidgetSettings {
  env: EnvKey
  apiUrl: string
  chatUrl: string
  widgetId: string
  previewToken: string
  /** local = the vendored /widget.js in this repo; hosted = {chatUrl}/widget.js */
  scriptSource: ScriptSource
  /** Install the widget automatically on every page load. */
  autoInit: boolean
  /** Re-install on each client-side navigation so page-targeted greetings re-resolve. */
  reinitOnNavigate: boolean
  /** BCP-47 tag to present as navigator.language ('' = real browser language). */
  simulatedLocale: string
}

export const ENVIRONMENTS: Record<Exclude<EnvKey, 'custom'>, { label: string; apiUrl: string; chatUrl: string }> = {
  standalone: {
    label: 'Standalone',
    apiUrl: 'https://one-ai-api-dev.aiimone.com',
    // Resolved to this site's origin in the browser (see resolveChatUrl).
    chatUrl: '',
  },
  dev: {
    label: 'Dev',
    apiUrl: 'https://one-ai-api-dev.aiimone.com',
    chatUrl: 'https://one-ai-dev.aiimone.com',
  },
  local: {
    label: 'Local',
    apiUrl: 'http://localhost:8000',
    chatUrl: 'http://localhost:3000',
  },
}

const defaultEnv = (process.env.NEXT_PUBLIC_DEFAULT_ENV as EnvKey | undefined) ?? 'standalone'
const startEnv: Exclude<EnvKey, 'custom'> = defaultEnv in ENVIRONMENTS ? (defaultEnv as Exclude<EnvKey, 'custom'>) : 'standalone'

/** Standalone mode serves the chat window from this very site. */
export const resolveChatUrl = (env: EnvKey, chatUrl: string) =>
  env === 'standalone' && typeof window !== 'undefined' ? window.location.origin : chatUrl

export const DEFAULT_SETTINGS: WidgetSettings = {
  env: startEnv,
  apiUrl: ENVIRONMENTS[startEnv].apiUrl,
  chatUrl: ENVIRONMENTS[startEnv].chatUrl,
  widgetId: process.env.NEXT_PUBLIC_DEFAULT_WIDGET_ID ?? '',
  previewToken: '',
  scriptSource: 'local',
  autoInit: true,
  reinitOnNavigate: true,
  simulatedLocale: '',
}

export const LOCALE_OPTIONS = [
  { value: '', label: 'Browser default' },
  { value: 'en-US', label: 'English (en-US)' },
  { value: 'es', label: 'Spanish (es)' },
  { value: 'fr', label: 'French (fr)' },
  { value: 'fr-CA', label: 'French – Canada (fr-CA)' },
  { value: 'de', label: 'German (de)' },
  { value: 'ar', label: 'Arabic (ar) – RTL' },
]

export const trimSlash = (url: string) => url.trim().replace(/\/+$/, '')

export const SETTINGS_STORAGE_KEY = 'oneai-playground:settings'
export const CHECKLIST_STORAGE_KEY = 'oneai-playground:checklist'
