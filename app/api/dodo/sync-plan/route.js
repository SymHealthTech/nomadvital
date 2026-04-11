export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dodo } from '@/lib/dodo'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

/**
 * Called from the client after a successful payment redirect.
 * Queries Dodo directly (no webhook dependency) to confirm subscription status,
 * then upgrades the user's plan in MongoDB so the session refresh picks it up.
 */
export async function POST() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const user = await User.findById(session.user.id)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Already on pro in DB — nothing to do
  if (user.plan === 'pro') {
    return NextResponse.json({ plan: 'pro', alreadyPro: true })
  }

  try {
    // ── Path 1: retrieve specific subscription by stored ID (fastest) ──
    if (user.dodoSubscriptionId) {
      try {
        const sub = await dodo.subscriptions.retrieve(user.dodoSubscriptionId)
        if (sub && (sub.status === 'active' || sub.status === 'trialing')) {
          await User.findByIdAndUpdate(user._id, { plan: 'pro' })
          return NextResponse.json({ plan: 'pro', updated: true })
        }
      } catch {
        // subscription not found or error — fall through to list lookup
      }
    }

    // ── Path 2: list active subscriptions by customer ID ──
    if (user.dodoCustomerId) {
      const subs = await dodo.subscriptions.list({
        customer_id: user.dodoCustomerId,
        status: 'active',
      })
      const items = subs?.items ?? subs?.data ?? []
      if (items.length > 0) {
        const sub = items[0]
        await User.findByIdAndUpdate(user._id, {
          plan: 'pro',
          dodoSubscriptionId: sub.subscription_id ?? sub.id ?? user.dodoSubscriptionId,
        })
        return NextResponse.json({ plan: 'pro', updated: true })
      }
    }

    // ── Path 3: match by email across all recent active subs ──
    const allSubs = await dodo.subscriptions.list({ status: 'active' })
    const allItems = allSubs?.items ?? allSubs?.data ?? []
    const match = allItems.find(
      s => s.customer?.email?.toLowerCase() === user.email.toLowerCase()
    )
    if (match) {
      await User.findByIdAndUpdate(user._id, {
        plan: 'pro',
        dodoCustomerId: match.customer?.customer_id ?? user.dodoCustomerId,
        dodoSubscriptionId: match.subscription_id ?? match.id ?? user.dodoSubscriptionId,
      })
      return NextResponse.json({ plan: 'pro', updated: true })
    }

    return NextResponse.json({ plan: 'free', updated: false })
  } catch (err) {
    console.error('sync-plan error:', err)
    return NextResponse.json({ error: 'Failed to check subscription', detail: String(err) }, { status: 500 })
  }
}
