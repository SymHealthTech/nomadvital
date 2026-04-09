export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import DestinationRating from '@/models/DestinationRating'
import Destination from '@/models/Destination'

async function recalculate(destinationSlug) {
  const ratings = await DestinationRating.find({ destinationSlug })
  if (ratings.length === 0) {
    await Destination.findOneAndUpdate({ slug: destinationSlug }, { averageRating: 0, totalRatings: 0 })
    return { newAverage: 0, totalRatings: 0 }
  }
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0)
  const avg = Math.round((sum / ratings.length) * 10) / 10
  await Destination.findOneAndUpdate(
    { slug: destinationSlug },
    { averageRating: avg, totalRatings: ratings.length }
  )
  return { newAverage: avg, totalRatings: ratings.length }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get('destination')

    if (!destination) {
      return NextResponse.json({ error: 'destination param required.', code: 'MISSING_PARAM' }, { status: 400 })
    }

    await connectDB()
    const dest = await Destination.findOne({ slug: destination.toLowerCase() }).select(
      'averageRating totalRatings'
    )

    let userRating = null
    const session = await auth()
    if (session?.user?.id) {
      const existing = await DestinationRating.findOne({
        destinationSlug: destination.toLowerCase(),
        userId: session.user.id,
      })
      if (existing) userRating = existing.rating
    }

    return NextResponse.json({
      averageRating: dest?.averageRating ?? 0,
      totalRatings: dest?.totalRatings ?? 0,
      userRating,
    })
  } catch (err) {
    console.error('GET /api/ratings:', err)
    return NextResponse.json({ error: 'Failed to fetch ratings.', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Sign in to rate destinations.', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    if (session.user?.plan !== 'pro') {
      return NextResponse.json(
        { error: 'Pro subscription required to rate destinations.', code: 'PRO_REQUIRED' },
        { status: 403 }
      )
    }

    const { destinationSlug, rating, comment } = await request.json()

    if (!destinationSlug || !rating) {
      return NextResponse.json({ error: 'destinationSlug and rating are required.', code: 'MISSING_FIELDS' }, { status: 400 })
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5.', code: 'INVALID_RATING' }, { status: 400 })
    }
    if (comment && comment.length > 120) {
      return NextResponse.json({ error: 'Comment must be 120 characters or fewer.', code: 'COMMENT_TOO_LONG' }, { status: 400 })
    }

    await connectDB()
    await DestinationRating.findOneAndUpdate(
      { destinationSlug: destinationSlug.toLowerCase(), userId: session.user.id },
      {
        destinationSlug: destinationSlug.toLowerCase(),
        userId: session.user.id,
        rating,
        comment: comment?.trim() ?? '',
      },
      { upsert: true, new: true }
    )

    const { newAverage, totalRatings } = await recalculate(destinationSlug.toLowerCase())

    return NextResponse.json({ success: true, newAverage, totalRatings })
  } catch (err) {
    console.error('POST /api/ratings:', err)
    return NextResponse.json({ error: 'Failed to save rating.', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
