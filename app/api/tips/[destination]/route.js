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

    return NextResponse.json(tips, {
      headers: {
        // Tips are community content approved by admin — refreshes slowly.
        // CDN caches for 10 minutes; background revalidation window is 30 minutes.
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1800',
      },
    })
  } catch (err) {
    console.error('GET /api/tips/[destination]:', err)
    return NextResponse.json(
      { error: 'Failed to fetch tips.', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
