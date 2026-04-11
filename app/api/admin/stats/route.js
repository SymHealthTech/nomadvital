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
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalUsers, proUsers, questionsAgg, newSignupsThisWeek, recentSignupsRaw] = await Promise.all([
      User.countDocuments({ isGuest: { $ne: true } }),
      User.countDocuments({ isGuest: { $ne: true }, plan: 'pro' }),
      User.aggregate([
        { $match: { lastQuestionDate: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: '$dailyQuestionCount' } } },
      ]),
      User.countDocuments({ isGuest: { $ne: true }, createdAt: { $gte: sevenDaysAgo } }),
      User.find({ isGuest: { $ne: true } })
        .select('name email plan createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ])

    const questionsToday = questionsAgg[0]?.total || 0
    const monthlyRevenue = proUsers * 12
    const apiCostToday = questionsToday * 0.004

    return NextResponse.json({
      totalUsers,
      proUsers,
      monthlyRevenue,
      questionsToday,
      apiCostToday,
      newSignupsThisWeek,
      recentSignups: recentSignupsRaw.map((u) => ({
        name: u.name,
        email: u.email,
        plan: u.plan,
        createdAt: u.createdAt,
      })),
    })
  } catch (err) {
    console.error('GET /api/admin/stats:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}
