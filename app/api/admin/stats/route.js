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
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      proUsers,
      proAnnuallyUsers,
      questionsAgg,
      monthlyQuestionsAgg,
      newSignupsThisWeek,
      newProThisMonth,
      recentSignupsRaw,
    ] = await Promise.all([
      User.countDocuments({ isGuest: { $ne: true } }),
      // Count ALL pro users regardless of planType (handles legacy users set before planType field existed)
      User.countDocuments({ isGuest: { $ne: true }, plan: 'pro' }),
      // Annually is distinct; everything else (pro-monthly or unset) counts as monthly for billing
      User.countDocuments({ isGuest: { $ne: true }, plan: 'pro', planType: 'pro-annually' }),
      // Today's questions: users who asked a question today
      User.aggregate([
        { $match: { lastQuestionDate: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: '$dailyQuestionCount' } } },
      ]),
      // This month's questions: users whose lastMonthDate is in the current month
      User.aggregate([
        { $match: { lastMonthDate: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$monthlyQuestionCount' } } },
      ]),
      User.countDocuments({ isGuest: { $ne: true }, createdAt: { $gte: sevenDaysAgo } }),
      // New pro subscriptions started this month
      User.countDocuments({ isGuest: { $ne: true }, plan: 'pro', createdAt: { $gte: startOfMonth } }),
      User.find({ isGuest: { $ne: true } })
        .select('name email plan planType createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ])

    const proMonthlyUsers = proUsers - proAnnuallyUsers
    const questionsToday = questionsAgg[0]?.total || 0
    const questionsThisMonth = monthlyQuestionsAgg[0]?.total || 0

    // Monthly Recurring Revenue: pro-monthly × $12 + pro-annually × ($99/12 ≈ $8.25)
    const monthlyRevenue = proMonthlyUsers * 12 + proAnnuallyUsers * 8.25

    // API costs: $0.004 per question
    const apiCostToday = questionsToday * 0.004
    const apiCostThisMonth = questionsThisMonth * 0.004

    return NextResponse.json({
      totalUsers,
      proUsers,
      proMonthlyUsers,
      proAnnuallyUsers,
      monthlyRevenue,
      questionsToday,
      questionsThisMonth,
      apiCostToday,
      apiCostThisMonth,
      newSignupsThisWeek,
      newProThisMonth,
      recentSignups: recentSignupsRaw.map((u) => ({
        name: u.name,
        email: u.email,
        plan: u.plan,
        planType: u.planType,
        createdAt: u.createdAt,
      })),
    })
  } catch (err) {
    console.error('GET /api/admin/stats:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}
