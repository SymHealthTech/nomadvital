export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { callClaude } from '@/lib/claude'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

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

  // Guest users have no DB record — allow questions without rate-limit tracking
  if (session.user.isGuest) {
    let reply
    try {
      reply = await callClaude(message.trim(), personaId || 'general', history || [])
    } catch {
      return NextResponse.json(
        { error: 'AI service unavailable. Please try again.' },
        { status: 503 }
      )
    }
    return NextResponse.json({ reply })
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
