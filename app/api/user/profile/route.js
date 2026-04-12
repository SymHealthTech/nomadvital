export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const dbUser = await User.findById(session.user.id).select('travelerType').lean()
    return NextResponse.json({ travelerType: dbUser?.travelerType || 'general' })
  } catch {
    return NextResponse.json({ travelerType: 'general' })
  }
}

export async function PATCH(request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { travelerType } = await request.json()

  if (!travelerType) {
    return NextResponse.json({ error: 'travelerType is required.' }, { status: 400 })
  }

  try {
    await connectDB()
    await User.findByIdAndUpdate(session.user.id, { travelerType })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Service temporarily unavailable. Please try again.' }, { status: 503 })
  }
}
