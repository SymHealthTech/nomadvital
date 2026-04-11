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

    const proUsers = await User.countDocuments({ isGuest: { $ne: true }, plan: 'pro' })
    const mrr = proUsers * 12
    const arr = proUsers * 99

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setHours(0, 0, 0, 0)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)

    const signupsAgg = await User.aggregate([
      { $match: { isGuest: { $ne: true }, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ])

    const countsByDate = new Map(signupsAgg.map((s) => [s._id, s.count]))

    const signupsByDay = []
    for (let i = 0; i < 30; i += 1) {
      const d = new Date(thirtyDaysAgo)
      d.setDate(thirtyDaysAgo.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      signupsByDay.push({ date: key, count: countsByDate.get(key) || 0 })
    }

    return NextResponse.json({ proUsers, mrr, arr, signupsByDay })
  } catch (err) {
    console.error('GET /api/admin/revenue:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}
