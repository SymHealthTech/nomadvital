export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { sendEmail, adminOtpHtml } from '@/lib/email'

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') return null
  return session
}

export async function POST(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { action, targetUserId, targetUserName } = body
  if (!action || !['plan-change', 'delete'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 })
  }
  if (!targetUserId) {
    return NextResponse.json({ error: 'targetUserId required.' }, { status: 400 })
  }

  // Generate a 6-digit numeric OTP
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  try {
    await connectDB()

    // Store OTP on the admin user record
    await User.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL?.toLowerCase() },
      { adminOtpCode: code, adminOtpExpires: expires }
    )

    // Send OTP to admin email
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      return NextResponse.json({ error: 'ADMIN_EMAIL not configured.' }, { status: 500 })
    }

    await sendEmail({
      to: adminEmail,
      subject: `NomadVital Admin — Confirmation Code: ${code}`,
      html: adminOtpHtml({ code, action, targetUser: targetUserName || targetUserId }),
    })

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error('POST /api/admin/request-otp:', err)
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 })
  }
}
