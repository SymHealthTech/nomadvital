export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  await connectDB()
  const proUsersCount = await User.countDocuments({ plan: 'pro' })

  let stripeData = { totalRevenue: 0, activeSubscriptions: 0 }

  try {
    const subscriptions = await stripe.subscriptions.list({ status: 'active', limit: 100 })
    stripeData.activeSubscriptions = subscriptions.data.length

    const charges = await stripe.charges.list({ limit: 100 })
    stripeData.totalRevenue = charges.data
      .filter((c) => c.paid && !c.refunded)
      .reduce((sum, c) => sum + c.amount, 0)
  } catch {
    // Stripe not configured — return zeros
  }

  return NextResponse.json({
    proUsers: proUsersCount,
    ...stripeData,
  })
}
