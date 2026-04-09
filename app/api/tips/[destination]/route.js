export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import TravelerTip from '@/models/TravelerTip'

export async function GET(request, { params }) {
  try {
    const { destination } = params

    await connectDB()
    const tips = await TravelerTip.find({
      destination: destination.toLowerCase(),
      isApproved: true,
      isVisible: true,
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('authorName authorCity healthCondition tipText createdAt')

    return NextResponse.json(tips)
  } catch (err) {
    console.error('GET /api/tips/[destination]:', err)
    return NextResponse.json(
      { error: 'Failed to fetch tips.', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
