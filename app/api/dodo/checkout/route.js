export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dodo } from '@/lib/dodo'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Resolve product ID from billing period — never trust a raw ID from the client
  const { billing } = await request.json().catch(() => ({}))
  const productId = billing === 'annual'
    ? process.env.DODO_PRO_ANNUAL_PRODUCT_ID
    : process.env.DODO_PRO_MONTHLY_PRODUCT_ID

  await connectDB()
  const user = await User.findById(session.user.id)

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  // Create Dodo customer on first checkout
  if (!user.dodoCustomerId) {
    const customer = await dodo.customers.create({
      email: user.email,
      name: user.name,
    })
    user.dodoCustomerId = customer.customer_id
    await user.save()
  }

  // Create checkout / subscription session
  const checkout = await dodo.subscriptions.create({
    billing: {
      city: 'N/A',
      country: 'IN',
      state: 'N/A',
      street: 'N/A',
      zipcode: 0,
    },
    customer: { customer_id: user.dodoCustomerId },
    product_id: productId,
    quantity: 1,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
    payment_link: true,
  })

  // Store pending subscription ID so sync-plan can retrieve it quickly
  const subId = checkout.subscription_id ?? checkout.id ?? null
  if (subId) {
    await User.findByIdAndUpdate(user._id, { dodoSubscriptionId: subId })
  }

  return NextResponse.json({ checkoutUrl: checkout.payment_link })
}
