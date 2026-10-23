/** Browser-state simulators so QA can exercise widget paths that are awkward to
 * trigger by hand. They override read-only navigator getters on the instance and
 * are fully reversible. */

export function simulateOnline(online: boolean) {
  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => online })
  window.dispatchEvent(new Event(online ? 'online' : 'offline'))
}

export function resetOnline() {
  // Deleting the own property restores the prototype getter.
  delete (navigator as unknown as Record<string, unknown>).onLine
}

export function simulateLocale(tag: string) {
  if (!tag) {
    delete (navigator as unknown as Record<string, unknown>).language
    return
  }
  Object.defineProperty(navigator, 'language', { configurable: true, get: () => tag })
}
