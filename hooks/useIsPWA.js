'use client'

import { useEffect, useState } from 'react'

/**
 * Detects whether the app is running as an installed PWA in standalone display mode.
 *
 * Three signals, in order of reliability:
 *   1. CSS Media Query — standard, works on all platforms
 *   2. navigator.standalone — iOS Safari only (deprecated but still fires)
 *   3. Android intent referrer — android-app:// referrer in WebAPK
 *
 * On the first client render we read `window.__NV_PWA__`, which is set
 * synchronously by the inline script in app/layout.jsx before React hydrates.
 * This ensures the hook returns the correct value immediately without waiting
 * for a useEffect tick, preventing any layout flash.
 *
 * Returns:
 *   null    — SSR / not yet hydrated (cannot know)
 *   true    — running as installed PWA (standalone display mode)
 *   false   — running in a regular browser tab
 */

function detectStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    !!window.navigator.standalone ||
    document.referrer.includes('android-app://')
  )
}

export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(() => {
    if (typeof window === 'undefined') return null
    // Fast path: read the flag set synchronously by app/layout.jsx's inline script.
    if (typeof window.__NV_PWA__ === 'boolean') return window.__NV_PWA__
    // Fallback for edge cases where the inline script didn't run yet.
    return detectStandalone()
  })

  useEffect(() => {
    // Confirm value on mount (covers timing edge cases on some browsers).
    const value = detectStandalone()
    setIsPWA(value)

    // Keep in sync if the user installs/uninstalls while the tab is open.
    const mq = window.matchMedia('(display-mode: standalone)')
    const handleChange = () => setIsPWA(detectStandalone())
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  return isPWA
}
