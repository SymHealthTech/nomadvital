export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') return null
  return session
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const reviews = await Review.find().sort({ order: 1, createdAt: -1 }).lean()
    return NextResponse.json(reviews)
  } catch (err) {
    console.error('GET /api/admin/reviews:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}

export async function POST(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    if (!data.name || !data.quote) {
      return NextResponse.json({ error: 'name and quote are required' }, { status: 400 })
    }
    await connectDB()
    const review = await Review.create(data)
    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/reviews:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}

export async function PATCH(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Review ID required' }, { status: 400 })

    await connectDB()
    const review = await Review.findByIdAndUpdate(id, updates, { new: true })
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })

    return NextResponse.json(review)
  } catch (err) {
    console.error('PATCH /api/admin/reviews:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}

export async function DELETE(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    let id = null
    try {
      const body = await request.json()
      id = body?.id || null
    } catch {
      // fall through
    }
    if (!id) {
      const { searchParams } = new URL(request.url)
      id = searchParams.get('id')
    }
    if (!id) return NextResponse.json({ error: 'Review ID required' }, { status: 400 })

    await connectDB()
    const review = await Review.findByIdAndDelete(id)
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/reviews:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}
