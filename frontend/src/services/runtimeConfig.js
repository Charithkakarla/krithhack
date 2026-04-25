const DEFAULT_API_BASE = 'http://127.0.0.1:8000'

export function getRuntimeApiBase() {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }

  if (typeof window !== 'undefined') {
    const hash = window.location.hash || ''
    const match = hash.match(/[?&]api_base=([^&]+)/)
    if (match) {
      try {
        return decodeURIComponent(match[1])
      } catch {
        return match[1]
      }
    }
    
    if (window.location.origin && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(window.location.origin)) {
      return window.location.origin
    }
  }

  return DEFAULT_API_BASE
}