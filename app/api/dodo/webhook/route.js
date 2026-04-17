export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { Webhook } from 'standardwebhooks'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

const wh = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_SECRET ?? '')

export async function POST(request) {
  // Read raw body for signature verification
  const rawBody = await request.text()

  const webhookHeaders = {
    'webhook-id': request.headers.get('webhook-id') ?? '',
    'webhook-signature': request.headers.get('webhook-signature') ?? '',
    'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
  }

  // Verify signature — throws if invalid
  try {
    await wh.verify(rawBody, webhookHeaders)
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventType = payload.type

  try {
    await connectDB()
  } catch {
    // Return 200 so Dodo doesn't keep retrying — we'll rely on the next delivery
    return NextResponse.json({ received: true })
  }

  if (
    eventType === 'subscription.active' ||
    eventType === 'subscription.activated' ||
    eventType === 'payment.succeeded' ||
    eventType === 'subscription.trialing'
  ) {
    const email = payload.data?.customer?.email
    const subscriptionId = payload.data?.subscription_id
    const productId = payload.data?.product_id || payload.data?.items?.[0]?.product_id

    // Determine plan type from product ID
    const planType =
      productId === process.env.DODO_PRO_ANNUAL_PRODUCT_ID ? 'pro-annually' : 'pro-monthly'

    // Determine plan expiry from billing period end if provided
    const periodEnd =
      payload.data?.current_period_end ||
      payload.data?.next_billing_date ||
      payload.data?.billing_period_end
    const planExpiryDate = periodEnd ? new Date(periodEnd) : null

    if (email) {
      await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          plan: 'pro',
          planType,
          ...(planExpiryDate && { planExpiryDate }),
          dodoSubscriptionId: subscriptionId ?? null,
        }
      )
    }
  }

  if (eventType === 'subscription.cancelled' || eventType === 'subscription.expired') {
    const email = payload.data?.customer?.email
    const subscriptionId = payload.data?.subscription_id

    const filter = email
      ? { email: email.toLowerCase() }
      : { dodoSubscriptionId: subscriptionId }

    if (email || subscriptionId) {
      await User.findOneAndUpdate(filter, {
        plan: 'free',
        planType: 'free',
        planExpiryDate: null,
        dodoSubscriptionId: null,
      })
    }
  }

  return NextResponse.json({ received: true })
}
