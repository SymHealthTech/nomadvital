export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dodo } from '@/lib/dodo'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST() {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const user = await User.findById(session.user.id).select('dodoCustomerId')

  if (!user?.dodoCustomerId) {
    return NextResponse.json({ error: 'No subscription found.' }, { status: 404 })
  }

  // Create a customer portal session
  const portal = await dodo.customers.customerPortal(user.dodoCustomerId)

  return NextResponse.json({ portalUrl: portal.url ?? portal.link ?? portal })
}
