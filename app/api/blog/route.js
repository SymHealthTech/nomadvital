export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

export async function GET() {
  try {
    await connectDB()
    const posts = await BlogPost.find({ isPublished: true })
      .select('title slug tag summary readTime viewCount createdAt')
      .sort({ createdAt: -1 })

    return NextResponse.json(posts, {
      headers: {
        // Blog list changes infrequently. CDN serves cached copies for 1 hour;
        // stale copies remain usable for up to 24 hours while revalidating.
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('GET /api/blog:', err)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
