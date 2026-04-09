export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Destination from '@/models/Destination'
import BlogPost from '@/models/BlogPost'

export async function GET() {
  try {
    await connectDB()

    const [totalUsers, proUsers, totalDestinations, publishedDestinations, totalPosts, publishedPosts] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ plan: 'pro' }),
        Destination.countDocuments(),
        Destination.countDocuments({ isPublished: true }),
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ isPublished: true }),
      ])

    return NextResponse.json({
      users: { total: totalUsers, pro: proUsers },
      destinations: { total: totalDestinations, published: publishedDestinations },
      posts: { total: totalPosts, published: publishedPosts },
    })
  } catch (err) {
    console.error('GET /api/admin/stats:', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
