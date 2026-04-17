export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') return null
  return session
}

async function verifyAdminOtp(otp) {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
  if (!adminEmail) return { ok: false, error: 'ADMIN_EMAIL not configured.' }

  const admin = await User.findOne({ email: adminEmail }).select('adminOtpCode adminOtpExpires')
  if (!admin || !admin.adminOtpCode) return { ok: false, error: 'No OTP found. Request a new code.' }
  if (!admin.adminOtpExpires || admin.adminOtpExpires < new Date()) {
    return { ok: false, error: 'OTP has expired. Request a new code.' }
  }
  if (admin.adminOtpCode !== String(otp)) return { ok: false, error: 'Incorrect code.' }

  // Invalidate the OTP after successful use
  await User.findOneAndUpdate({ email: adminEmail }, { $unset: { adminOtpCode: '', adminOtpExpires: '' } })
  return { ok: true }
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const users = await User.find({ isGuest: { $ne: true } })
      .select('-password -resetPasswordToken -resetPasswordExpires -adminOtpCode -adminOtpExpires')
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json(users)
  } catch (err) {
    console.error('GET /api/admin/users:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}

export async function PATCH(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const body = await request.json()
    const userId = body.userId || body.id
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    // Plan changes always require OTP
    if (body.plan) {
      if (!body.otp) {
        return NextResponse.json({ error: 'OTP required to change plan.', requiresOtp: true }, { status: 403 })
      }
      const otpResult = await verifyAdminOtp(body.otp)
      if (!otpResult.ok) {
        return NextResponse.json({ error: otpResult.error, requiresOtp: true }, { status: 403 })
      }
    }

    const updates = {}
    if (body.plan && ['free', 'pro'].includes(body.plan)) {
      updates.plan = body.plan
      // Sync planType when manually setting plan via admin
      if (body.plan === 'free') {
        updates.planType = 'free'
        updates.planExpiryDate = null
      } else if (body.plan === 'pro' && body.planType) {
        updates.planType = body.planType
      } else if (body.plan === 'pro') {
        updates.planType = 'pro-monthly' // default when manually upgrading
      }
    }
    if (body.role && ['user', 'admin'].includes(body.role)) updates.role = body.role
    if (typeof body.name === 'string') updates.name = body.name

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true })
      .select('-password -resetPasswordToken -resetPasswordExpires -adminOtpCode -adminOtpExpires')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json(user)
  } catch (err) {
    console.error('PATCH /api/admin/users:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}

export async function DELETE(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()

    let body = {}
    try {
      body = await request.json()
    } catch {
      // fall through to query param
    }

    let userId = body?.userId || body?.id || null
    if (!userId) {
      const { searchParams } = new URL(request.url)
      userId = searchParams.get('id') || searchParams.get('userId')
    }
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    // Find the user to check their plan
    const targetUser = await User.findById(userId).select('plan name email')
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Pro users require OTP; free users only need the browser confirmation (no server OTP)
    if (targetUser.plan === 'pro') {
      if (!body.otp) {
        return NextResponse.json({ error: 'OTP required to delete a Pro user.', requiresOtp: true }, { status: 403 })
      }
      const otpResult = await verifyAdminOtp(body.otp)
      if (!otpResult.ok) {
        return NextResponse.json({ error: otpResult.error, requiresOtp: true }, { status: 403 })
      }
    }

    await User.findByIdAndDelete(userId)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/users:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}
