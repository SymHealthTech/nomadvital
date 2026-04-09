export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import TravelerTip from '@/models/TravelerTip'

// In-memory rate limit: { ip -> { count, dateStr } }
const rateLimitMap = new Map()

function checkRateLimit(ip) {
  const today = new Date().toDateString()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.dateStr !== today) {
    rateLimitMap.set(ip, { count: 1, dateStr: today })
    return true
  }
  if (entry.count >= 3) return false
  entry.count += 1
  return true
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Try again tomorrow.', code: 'RATE_LIMIT' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { destination, destinationName, authorName, authorCity, healthCondition, tipText } = body

    if (!destination || !destinationName || !authorName || !authorCity || !healthCondition || !tipText) {
      return NextResponse.json(
        { error: 'All fields are required.', code: 'MISSING_FIELDS' },
        { status: 400 }
      )
    }

    if (typeof tipText !== 'string' || tipText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tip text is required.', code: 'INVALID_TIP' },
        { status: 400 }
      )
    }

    if (tipText.length > 280) {
      return NextResponse.json(
        { error: 'Tip must be 280 characters or fewer.', code: 'TIP_TOO_LONG' },
        { status: 400 }
      )
    }

    await connectDB()
    await TravelerTip.create({
      destination: destination.toLowerCase(),
      destinationName,
      authorName: authorName.trim(),
      authorCity: authorCity.trim(),
      healthCondition: healthCondition.trim(),
      tipText: tipText.trim(),
      isApproved: false,
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your tip will be reviewed.',
    })
  } catch (err) {
    console.error('POST /api/tips/submit:', err)
    return NextResponse.json(
      { error: 'Failed to submit tip. Please try again.', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
