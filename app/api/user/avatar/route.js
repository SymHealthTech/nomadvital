import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'

// Max allowed size: 2MB base64 string (~1.5MB image)
const MAX_SIZE = 2 * 1024 * 1024

export async function POST(req) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { image } = await req.json()

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Only allow data URLs (base64 JPEG/PNG/WebP)
    if (!image.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }

    if (image.length > MAX_SIZE) {
      return NextResponse.json({ error: 'Image too large (max 1.5MB)' }, { status: 413 })
    }

    await connectDB()
    await User.findByIdAndUpdate(session.user.id, { profileImage: image })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    await User.findByIdAndUpdate(session.user.id, { profileImage: null })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
