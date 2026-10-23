export interface OneAIWidgetOptions {
  widgetId: string
  apiUrl: string
  chatUrl: string
  previewToken?: string
}

export interface OneAIWidgetInstance {
  open(): void
  close(): void
  toggle(): void
  destroy(): void
}

export interface OneAIWidgetGlobal {
  init(opts: OneAIWidgetOptions): OneAIWidgetInstance
  destroy(): void
}

declare global {
  interface Window {
    OneAIWidget?: OneAIWidgetGlobal
  }
}

export type WidgetStatus = 'idle' | 'loading' | 'active' | 'error'

export type LogKind = 'lifecycle' | 'iframe' | 'network' | 'error'

export interface LogEntry {
  id: number
  at: number
  kind: LogKind
  title: string
  detail?: string
  /** Network entries only */
  ok?: boolean
}
