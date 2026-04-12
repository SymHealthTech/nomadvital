export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { callClaude } from '@/lib/claude'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import GuestUsage from '@/models/GuestUsage'

const FREE_LIMIT = 3

export async function POST(request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { message, personaId, history } = await request.json()

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }

  // Guest users — enforce daily limit tracked by IP address
  if (session.user.isGuest) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const today = new Date().toDateString()

    try {
      await connectDB()
    } catch {
      return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
    }

    let usage = await GuestUsage.findOne({ ip })
    if (!usage) {
      usage = new GuestUsage({ ip, count: 0, date: today })
    } else if (usage.date !== today) {
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
    const lastDate = user.lastQuestionDate
      ? new Date(user.lastQuestionDate).toDateString()
      : null

    // Reset counter on a new day
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
  if (user.plan === 'free') {
    user.dailyQuestionCount += 1
    user.lastQuestionDate = new Date()
    await user.save()
  }

  const questionsUsed = user.plan === 'free' ? user.dailyQuestionCount : 0
  const questionsRemaining =
    user.plan === 'pro' ? 'unlimited' : Math.max(0, FREE_LIMIT - questionsUsed)

  return NextResponse.json({ reply, questionsUsed, questionsRemaining })
}
