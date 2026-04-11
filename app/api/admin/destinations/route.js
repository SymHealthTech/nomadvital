export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'

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
    const destinations = await Destination.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(destinations)
  } catch (err) {
    console.error('GET /api/admin/destinations:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}

export async function POST(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
    }
    if (!data.country) data.country = data.name
    await connectDB()
    const destination = await Destination.create(data)
    return NextResponse.json(destination, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/destinations:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}

export async function PATCH(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Destination ID required' }, { status: 400 })

    await connectDB()
    const destination = await Destination.findByIdAndUpdate(id, updates, { new: true })
    if (!destination) return NextResponse.json({ error: 'Destination not found' }, { status: 404 })

    return NextResponse.json(destination)
  } catch (err) {
    console.error('PATCH /api/admin/destinations:', err)
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
    if (!id) return NextResponse.json({ error: 'Destination ID required' }, { status: 400 })

    await connectDB()
    const destination = await Destination.findByIdAndDelete(id)
    if (!destination) return NextResponse.json({ error: 'Destination not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/destinations:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}
