import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

// Used by LoginForm to detect "email not verified" state after a failed login attempt
export async function POST(request) {
  const { email } = await request.json()

  if (!email) return NextResponse.json({})

  try {
    await connectDB()
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('emailVerified emailVerificationToken')
      .lean()

    if (user && !user.emailVerified && user.emailVerificationToken) {
      return NextResponse.json({ unverified: true })
    }
  } catch { /* non-fatal */ }

  return NextResponse.json({})
}
