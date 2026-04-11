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

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const users = await User.find({ isGuest: { $ne: true } })
      .select('-password -resetPasswordToken -resetPasswordExpires')
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
    const body = await request.json()
    const userId = body.userId || body.id
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const updates = {}
    if (body.plan && ['free', 'pro'].includes(body.plan)) updates.plan = body.plan
    if (body.role && ['user', 'admin'].includes(body.role)) updates.role = body.role
    if (typeof body.name === 'string') updates.name = body.name

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findByIdAndUpdate(userId, updates, { new: true })
      .select('-password -resetPasswordToken -resetPasswordExpires')
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
    let userId = null
    try {
      const body = await request.json()
      userId = body?.userId || body?.id || null
    } catch {
      // fall through to query param
    }
    if (!userId) {
      const { searchParams } = new URL(request.url)
      userId = searchParams.get('id') || searchParams.get('userId')
    }
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    await connectDB()
    const user = await User.findByIdAndDelete(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/users:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}
