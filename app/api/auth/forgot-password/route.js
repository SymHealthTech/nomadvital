import { NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  try {
    await connectDB()
  } catch {
    return NextResponse.json({ error: 'Service temporarily unavailable. Please try again.' }, { status: 503 })
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

  // TODO: Replace this console.log with your email service (Resend, SendGrid, etc.)
  // The reset link is logged here so you can test it during development.
  console.log(`\n🔑 Password reset link for ${email}:\n${resetUrl}\n`)

  // Example with Resend (install with: npm install resend):
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'NomadVital <noreply@nomadvital.com>',
  //   to: email,
  //   subject: 'Reset your NomadVital password',
  //   html: `<p>Click the link below to reset your password. It expires in 1 hour.</p>
  //          <a href="${resetUrl}">${resetUrl}</a>`,
  // })

  return NextResponse.json({ success: true })
}
