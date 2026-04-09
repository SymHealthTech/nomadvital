export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'

export async function GET() {
  try {
    await connectDB()
    const destinations = await Destination.find().sort({ createdAt: -1 })
    return NextResponse.json(destinations)
  } catch (err) {
    console.error('GET /api/admin/destinations:', err)
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    await connectDB()
    const destination = await Destination.create(data)
    return NextResponse.json(destination, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/destinations:', err)
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Destination ID required' }, { status: 400 })

    await connectDB()
    const destination = await Destination.findByIdAndUpdate(id, updates, { new: true })
    if (!destination) return NextResponse.json({ error: 'Destination not found' }, { status: 404 })

    return NextResponse.json(destination)
  } catch (err) {
    console.error('PATCH /api/admin/destinations:', err)
    return NextResponse.json({ error: 'Failed to update destination' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Destination ID required' }, { status: 400 })

    await connectDB()
    const destination = await Destination.findByIdAndDelete(id)
    if (!destination) return NextResponse.json({ error: 'Destination not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/destinations:', err)
    return NextResponse.json({ error: 'Failed to delete destination' }, { status: 500 })
  }
}
