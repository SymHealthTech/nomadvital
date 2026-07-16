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

  let step = 'db'
  try {
    await connectDB()

    step = 'find_user'
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    // Create Dodo customer on first checkout
    if (!user.dodoCustomerId) {
      step = 'create_customer'
      const customer = await dodo.customers.create({
        email: user.email,
        name: user.name || user.email,
      })
      user.dodoCustomerId = customer.customer_id
      await user.save()
    }

    // Create checkout session — customer fills billing details on the Dodo-hosted page
    step = 'create_checkout'
    // Include the billing label so the client success handler can report a
    // non-identifying plan_type to analytics (monthly vs annual).
    const planLabel = billing === 'annual' ? 'annual' : 'monthly'
    const checkout = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { customer_id: user.dodoCustomerId },
      return_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success&plan=${planLabel}`,
    })

    if (!checkout.checkout_url) {
      console.error('Dodo checkout: no checkout_url in response', checkout)
      return NextResponse.json({ error: 'Service temporarily unavailable. Please try again.', detail: 'no checkout_url returned', step }, { status: 503 })
    }

    return NextResponse.json({ checkoutUrl: checkout.checkout_url })
  } catch (err) {
    console.error(`Dodo checkout error at step [${step}]:`, err)
    const body = err?.error ?? err?.body ?? null
    const detail = (typeof body === 'string' ? body : JSON.stringify(body)) || err?.message || String(err)
    const status = err?.status ?? err?.statusCode ?? 503
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again.', detail, step },
      { status: typeof status === 'number' ? status : 503 }
    )
  }
}
