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
    return NextResponse.json({ error: 'No subscription found. Please contact support.' }, { status: 404 })
  }

  try {
    const portal = await dodo.customers.customerPortal.create(user.dodoCustomerId, {
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    })
    return NextResponse.json({ portalUrl: portal.link })
  } catch (err) {
    console.error('Portal error:', err)
    return NextResponse.json({ error: 'Could not open billing portal. Please try again.' }, { status: 500 })
  }
}
