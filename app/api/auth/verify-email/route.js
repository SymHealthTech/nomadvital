import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token || typeof token !== 'string' || token.length < 32) {
    return NextResponse.json({ error: 'Invalid verification link.' }, { status: 400 })
  }

  try {
    await connectDB()
  } catch {
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again.' },
      { status: 503 }
    )
  }

  const user = await User.findOne({ emailVerificationToken: token })

  if (!user) {
    return NextResponse.json({ error: 'Invalid or already-used verification link.' }, { status: 400 })
  }

  if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
    return NextResponse.json({ error: 'This verification link has expired. Please request a new one.' }, { status: 400 })
  }

  await User.findByIdAndUpdate(user._id, {
    emailVerified: true,
    $unset: { emailVerificationToken: '', emailVerificationExpires: '' },
  })

  return NextResponse.json({ success: true, email: user.email })
}
