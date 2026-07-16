'use client'

/**
 * Thin wrapper around Google Analytics 4 custom events.
 *
 * All helpers use `sendGAEvent` from @next/third-parties, which pushes to the
 * GA dataLayer in the browser. They are safe no-ops on the server or when GA
 * has not been initialised (e.g. NEXT_PUBLIC_GA_ID is unset).
 *
 * PRIVACY: Never pass user IDs, emails, exact locations, or the raw text of a
 * user's health/food-safety question as event parameters. Keep params limited
 * to non-identifying category labels and event metadata.
 */
import { sendGAEvent } from '@next/third-parties/google'

function track(eventName, params = {}) {
  // Guard against SSR / GA not being loaded — dataLayer only exists in the browser.
  if (typeof window === 'undefined') return
  try {
    sendGAEvent('event', eventName, params)
  } catch {
    // Analytics must never break the app — swallow any errors.
  }
}

/**
 * Fired when a user's Pro subscription is confirmed.
 * @param {string} plan - Non-identifying billing label, e.g. 'monthly' or 'annual'.
 */
export function trackProSubscription(plan) {
  track('purchase_pro_subscription', {
    plan_type: plan || 'unknown',
    currency: 'USD',
  })
}

/** Fired when a user starts the 7-day free trial (Pro checkout). */
export function trackTrialStarted() {
  track('trial_started')
}

/** Fired when a user completes account creation (free signup). */
export function trackSignupCompleted() {
  track('signup_completed')
}

/**
 * Fired when a user submits a question to the AI advisor.
 * @param {string} category - A GENERAL, non-identifying label only
 *   (e.g. 'food_safety', 'travel_health'). Never pass the actual query
 *   text or any personal/health/location detail.
 */
export function trackAdviceQuery(category) {
  track('advice_query_submitted', {
    query_category: category || 'travel_health',
  })
}
