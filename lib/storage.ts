export function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) -- state just won't persist */
  }
}

export function removeKey(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
