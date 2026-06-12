'use client'

import { useEffect, useState } from 'react'

/**
 * Global singleton for the beforeinstallprompt event.
 *
 * WHY a singleton?
 * `beforeinstallprompt` fires once — very early in page load, often before
 * any React component has mounted.  If each component adds its own listener
 * inside useEffect, the event is already gone by the time the listener is
 * attached and the install button never works.
 *
 * This module captures the event at import time (before any component renders)
 * and distributes it to all subscribers via a simple pub/sub pattern.
 */

let _deferredPrompt = null
let _installed = false
let _installing = false
const _subscribers = new Set()

function notify() {
  _subscribers.forEach(fn => fn(_deferredPrompt))
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault()
    _deferredPrompt = e
    notify()
  })

  window.addEventListener('appinstalled', () => {
    _deferredPrompt = null
    _installed = true
    notify()
  })
}

/**
 * Hook that exposes the deferred install prompt.
 *
 * Returns:
 *   canInstall  — true when the native install prompt is available
 *   isInstalled — true once the app has been installed this session
 *   install()   — async fn; resolves true on accept, false on dismiss
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(() => _deferredPrompt)
  const [isInstalled, setIsInstalled] = useState(() => _installed)

  useEffect(() => {
    function onUpdate(prompt) {
      setDeferredPrompt(prompt)
      if (!prompt) setIsInstalled(true)
    }

    _subscribers.add(onUpdate)

    // Sync state in case the event fired between module load and first render
    if (_deferredPrompt !== deferredPrompt) setDeferredPrompt(_deferredPrompt)
    if (_installed !== isInstalled) setIsInstalled(_installed)

    return () => _subscribers.delete(onUpdate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function install() {
    if (!_deferredPrompt || _installing) return false
    _installing = true
    try {
      _deferredPrompt.prompt()
      const { outcome } = await _deferredPrompt.userChoice
      if (outcome === 'accepted') {
        _deferredPrompt = null
        _installed = true
        setDeferredPrompt(null)
        setIsInstalled(true)
        notify()
        return true
      }
    } finally {
      _installing = false
    }
    return false
  }

  return {
    canInstall: !!deferredPrompt,
    isInstalled,
    install,
  }
}
