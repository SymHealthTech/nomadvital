export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import TravelerTip from '@/models/TravelerTip'

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') return null
  return session
}

export async function GET(request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const destination = searchParams.get('destination')
    const status = searchParams.get('status') // 'pending' | 'approved' | null (all)

    const query = {}
    if (destination) query.destination = destination.toLowerCase()
    if (status === 'pending') query.isApproved = false
    else if (status === 'approved') query.isApproved = true

    await connectDB()
    const tips = await TravelerTip.find(query).sort({ createdAt: -1 })

    const pendingCount = await TravelerTip.countDocuments({ isApproved: false })
    const approvedCount = await TravelerTip.countDocuments({ isApproved: true })

    return NextResponse.json({ tips, pendingCount, approvedCount, total: pendingCount + approvedCount })
  } catch (err) {
    console.error('GET /api/admin/tips:', err)
    return NextResponse.json({ error: 'Failed to fetch tips.', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { destination, destinationName, authorName, authorCity, healthCondition, tipText, submittedViaEmail } =
      await request.json()

    if (!destination || !destinationName || !authorName || !authorCity || !healthCondition || !tipText) {
      return NextResponse.json({ error: 'All fields are required.', code: 'MISSING_FIELDS' }, { status: 400 })
    }

    if (tipText.length > 280) {
      return NextResponse.json({ error: 'Tip must be 280 characters or fewer.', code: 'TIP_TOO_LONG' }, { status: 400 })
    }

    await connectDB()
    const tip = await TravelerTip.create({
      destination: destination.toLowerCase(),
      destinationName,
      authorName: authorName.trim(),
      authorCity: authorCity.trim(),
      healthCondition: healthCondition.trim(),
      tipText: tipText.trim(),
      isApproved: true,
      isVisible: true,
      submittedViaEmail: !!submittedViaEmail,
    })

    return NextResponse.json(tip, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/tips:', err)
    return NextResponse.json({ error: 'Failed to create tip.', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { tipId, action } = await request.json()
    if (!tipId || !action) {
      return NextResponse.json({ error: 'tipId and action are required.', code: 'MISSING_FIELDS' }, { status: 400 })
    }

    await connectDB()

    let update = {}
    if (action === 'approve') update = { isApproved: true, isVisible: true }
    else if (action === 'hide') update = { isVisible: false }
    else if (action === 'show') update = { isVisible: true }
    else {
      return NextResponse.json({ error: 'Invalid action.', code: 'INVALID_ACTION' }, { status: 400 })
    }

    const tip = await TravelerTip.findByIdAndUpdate(tipId, update, { new: true })
    if (!tip) return NextResponse.json({ error: 'Tip not found.', code: 'NOT_FOUND' }, { status: 404 })

    return NextResponse.json(tip)
  } catch (err) {
    console.error('PATCH /api/admin/tips:', err)
    return NextResponse.json({ error: 'Failed to update tip.', code: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { tipId } = await request.json()
    if (!tipId) {
      return NextResponse.json({ error: 'tipId is required.', code: 'MISSING_FIELDS' }, { status: 400 })
    }

    await connectDB()
    const tip = await TravelerTip.findByIdAndDelete(tipId)
    if (!tip) return NextResponse.json({ error: 'Tip not found.', code: 'NOT_FOUND' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/tips:', err)
    return NextResponse.json({ error: 'Failed to delete tip.', code: 'SERVER_ERROR' }, { status: 500 })
  }
}
