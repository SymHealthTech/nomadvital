export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function PATCH(request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { travelerType } = await request.json()

  if (!travelerType) {
    return NextResponse.json({ error: 'travelerType is required.' }, { status: 400 })
  }

  await connectDB()
  await User.findByIdAndUpdate(session.user.id, { travelerType })

  return NextResponse.json({ success: true })
}
