import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { sendEmail, verifyEmailHtml } from '@/lib/email'

export async function POST(request) {
  const { name, email, password } = await request.json()

  // Validate required fields
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  // Validate password length
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  try {
    await connectDB()

    // Check for existing account
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      // If unverified, resend the verification email instead of rejecting
      if (!existing.emailVerified && existing.emailVerificationToken) {
        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
        await User.findByIdAndUpdate(existing._id, {
          emailVerificationToken: token,
          emailVerificationExpires: expires,
        })
        const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
        await sendEmail({
          to: email.toLowerCase(),
          subject: 'Verify your NomadVital email',
          html: verifyEmailHtml({ name: existing.name, verifyUrl }),
        }).catch(() => {}) // non-fatal
        return NextResponse.json(
          { success: true, requiresVerification: true, resent: true },
          { status: 200 }
        )
      }
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const role = email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase() ? 'admin' : 'user'

    // Generate email verification token (expires in 24 h)
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      plan: 'free',
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    })

    // Send verification email (non-fatal — account is created regardless)
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`
    await sendEmail({
      to: email.toLowerCase(),
      subject: 'Verify your NomadVital email',
      html: verifyEmailHtml({ name, verifyUrl }),
    }).catch(err => {
      console.error('[Signup] Failed to send verification email:', err.message)
    })

    return NextResponse.json(
      { success: true, requiresVerification: true },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again.' },
      { status: 503 }
    )
  }
}
