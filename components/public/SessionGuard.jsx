'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'

/**
 * Detects when the current session has been superseded by a login on another
 * device (session.user.invalidated = true) and automatically signs out,
 * redirecting to the login page with an explanatory message.
 *
 * This prevents the PWA / other browser from continuing to make authenticated
 * requests after a newer session has taken over on a different device.
 */
export default function SessionGuard() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.invalidated) {
      signOut({ callbackUrl: '/login?reason=other_device' })
    }
  }, [session])

  return null
}
