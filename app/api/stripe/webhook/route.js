// DEPRECATED: NomadVital now uses Dodo Payments (see app/api/dodo/*).
// This webhook route is kept for legacy reference and is not configured in production.
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  try {
    await connectDB()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId

        if (userId) {
          await User.findByIdAndUpdate(userId, {
            plan: 'pro',
            stripeSubscriptionId: session.subscription,
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await User.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          { plan: 'free', stripeSubscriptionId: null }
        )
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        await User.findOneAndUpdate(
          { stripeCustomerId: invoice.customer },
          { plan: 'free' }
        )
        break
      }
    }
  } catch (err) {
    console.error('Webhook DB error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
