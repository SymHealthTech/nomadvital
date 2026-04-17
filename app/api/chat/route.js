export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { callClaude } from '@/lib/claude'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import GuestUsage from '@/models/GuestUsage'

const FREE_LIMIT         = 3   // AI Advisor questions / day
const FREE_PLANNER_LIMIT = 1   // Planner generations / day

export async function POST(request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { message, personaId, history, deviceId, source } = await request.json()
  const isPlanner = source === 'planner'

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }

  // Guest users — enforce daily limit tracked by persistent device ID
  // (falls back to IP when deviceId is absent so server-side tools still work)
  if (session.user.isGuest) {
    const identifier =
      (typeof deviceId === 'string' && deviceId.length > 4 ? deviceId : null) ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const today = new Date().toDateString()

    try {
      await connectDB()
    } catch {
      return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
    }

    let usage = await GuestUsage.findOne({ ip: identifier })
    if (!usage) {
      usage = new GuestUsage({ ip: identifier, count: 0, date: today })
    } else if (usage.date !== today) {
      // New day — reset the daily counter
      usage.count = 0
      usage.date = today
    }

    if (usage.count >= FREE_LIMIT) {
      return NextResponse.json(
        { error: 'daily_limit_reached', questionsUsed: usage.count, limit: FREE_LIMIT },
        { status: 429 }
      )
    }

    let reply
    try {
      reply = await callClaude(message.trim(), personaId || 'general', history || [])
    } catch {
      return NextResponse.json({ error: 'AI service unavailable. Please try again.' }, { status: 503 })
    }

    usage.count += 1
    await usage.save()

    return NextResponse.json({
      reply,
      questionsUsed: usage.count,
      questionsRemaining: Math.max(0, FREE_LIMIT - usage.count),
    })
  }

  let user
  try {
    await connectDB()
    user = await User.findById(session.user.id)
  } catch {
    return NextResponse.json({ error: 'Service temporarily unavailable. Please try again.' }, { status: 503 })
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 })
  }

  // Rate limiting for free users
  if (user.plan === 'free') {
    const today = new Date().toDateString()

    if (isPlanner) {
      // Planner has its own separate daily limit
      const lastPlannerDate = user.lastPlannerDate
        ? new Date(user.lastPlannerDate).toDateString()
        : null
      if (lastPlannerDate !== today) {
        user.dailyPlannerCount = 0
      }
      if (user.dailyPlannerCount >= FREE_PLANNER_LIMIT) {
        return NextResponse.json(
          {
            error: 'planner_limit_reached',
            message: `You've used your ${FREE_PLANNER_LIMIT} free planner generation today. Upgrade to Pro for unlimited plans.`,
            plannersUsed: user.dailyPlannerCount,
            limit: FREE_PLANNER_LIMIT,
          },
          { status: 429 }
        )
      }
    } else {
      // AI Advisor question limit
      const lastDate = user.lastQuestionDate
        ? new Date(user.lastQuestionDate).toDateString()
        : null
      if (lastDate !== today) {
        user.dailyQuestionCount = 0
        user.lastQuestionDate = new Date()
      }
      if (user.dailyQuestionCount >= FREE_LIMIT) {
        return NextResponse.json(
          {
            error: 'daily_limit_reached',
            message: `You've used your ${FREE_LIMIT} free questions today. Upgrade to Pro for unlimited questions.`,
            questionsUsed: user.dailyQuestionCount,
            limit: FREE_LIMIT,
          },
          { status: 429 }
        )
      }
    }
  }

  // Call Claude first — don't charge the user for a failed API call
  let reply
  try {
    reply = await callClaude(message.trim(), personaId || 'general', history || [])
  } catch {
    return NextResponse.json(
      { error: 'AI service unavailable. Please try again.' },
      { status: 503 }
    )
  }

  // Increment usage count after a successful response
  if (isPlanner) {
    if (user.plan === 'free') {
      user.dailyPlannerCount += 1
      user.lastPlannerDate = new Date()
      await user.save()
    }
  } else {
    // Track daily question count for ALL users (used in admin analytics)
    const todayStr = new Date().toDateString()
    const lastDateStr = user.lastQuestionDate ? new Date(user.lastQuestionDate).toDateString() : null
    if (lastDateStr !== todayStr) {
      user.dailyQuestionCount = 0
    }
    user.dailyQuestionCount += 1
    user.lastQuestionDate = new Date()

    // Track monthly question count for ALL users (used in admin cost analytics)
    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${now.getMonth()}`
    const storedMonth = user.lastMonthDate
      ? `${new Date(user.lastMonthDate).getFullYear()}-${new Date(user.lastMonthDate).getMonth()}`
      : null
    if (storedMonth !== thisMonth) {
      user.monthlyQuestionCount = 0
    }
    user.monthlyQuestionCount = (user.monthlyQuestionCount || 0) + 1
    user.lastMonthDate = now

    await user.save()
  }

  const questionsUsed = user.plan === 'free' ? user.dailyQuestionCount : 0
  const questionsRemaining =
    user.plan === 'pro' ? 'unlimited' : Math.max(0, FREE_LIMIT - questionsUsed)

  return NextResponse.json({ reply, questionsUsed, questionsRemaining })
}
