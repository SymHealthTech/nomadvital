import { NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { sendEmail, resetPasswordHtml } from '@/lib/email'

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

  // Always return success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ success: true })
  }

  // Google-only accounts have no password to reset
  if (!user.password) {
    return NextResponse.json({ success: true })
  }

  // Generate a secure random token (expires in 1 hour)
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 60 * 60 * 1000)

  await User.findByIdAndUpdate(user._id, {
    resetPasswordToken: token,
    resetPasswordExpires: expires,
  })

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  try {
    await sendEmail({
      to: email.toLowerCase(),
      subject: 'Reset your NomadVital password',
      html: resetPasswordHtml({ name: user.name, resetUrl }),
    })
  } catch (err) {
    console.error('[ForgotPassword] Email send failed:', err.message)
    // Still return success — token is saved; user can contact support
  }

  return NextResponse.json({ success: true })
}
