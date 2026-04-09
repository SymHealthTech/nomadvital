export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'

export async function GET() {
  try {
    await connectDB()
    const reviews = await Review.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json(reviews)
  } catch (err) {
    console.error('GET /api/admin/reviews:', err)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    await connectDB()
    const review = await Review.create(data)
    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/reviews:', err)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Review ID required' }, { status: 400 })

    await connectDB()
    const review = await Review.findByIdAndUpdate(id, updates, { new: true })
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })

    return NextResponse.json(review)
  } catch (err) {
    console.error('PATCH /api/admin/reviews:', err)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Review ID required' }, { status: 400 })

    await connectDB()
    const review = await Review.findByIdAndDelete(id)
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/reviews:', err)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
