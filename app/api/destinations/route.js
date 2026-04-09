export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'

export async function GET() {
  try {
    await connectDB()
    const destinations = await Destination.find({ isPublished: true })
      .select('name slug country conditions isFree viewCount')
      .sort({ createdAt: -1 })

    return NextResponse.json(destinations)
  } catch (err) {
    console.error('GET /api/destinations:', err)
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 })
  }
}
