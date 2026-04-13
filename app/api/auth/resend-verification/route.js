import { NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { sendEmail, verifyEmailHtml } from '@/lib/email'

export async function POST(request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  try {
    await connectDB()
  } catch {
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again.' },
      { status: 503 }
    )
  }

  const user = await User.findOne({ email: email.toLowerCase() })

  // Always return success to prevent enumeration
  if (!user || user.emailVerified) {
    return NextResponse.json({ success: true })
  }

  // Rate-limit: don't resend more than once per 60 seconds
  if (
    user.emailVerificationExpires &&
    user.emailVerificationExpires > new Date(Date.now() + 23 * 60 * 60 * 1000) // less than 1h old
  ) {
    return NextResponse.json({ success: true }) // silently succeed
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await User.findByIdAndUpdate(user._id, {
    emailVerificationToken: token,
    emailVerificationExpires: expires,
  })

  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
  await sendEmail({
    to: email.toLowerCase(),
    subject: 'Verify your NomadVital email',
    html: verifyEmailHtml({ name: user.name, verifyUrl }),
  }).catch(err => console.error('[ResendVerification]', err.message))

  return NextResponse.json({ success: true })
}
