'use client'

import { useEffect } from 'react'

/**
 * Drop this component into any page where you want to warn the user
 * before they close the tab / navigate away.
 * Pass `active={boolean}` — only shows the dialog when true
 * (e.g. when there are messages in the chat, or a plan has been generated).
 */
export default function LeaveConfirmation({ active = true }) {
  useEffect(() => {
    if (!active) return

    function handleBeforeUnload(e) {
      e.preventDefault()
      e.returnValue = '' // required for Chrome to show the dialog
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [active])

  return null
}
