export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

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
    const posts = await BlogPost.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json(posts)
  } catch (err) {
    console.error('GET /api/admin/blog:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}

export async function POST(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    if (!data.title || !data.slug) {
      return NextResponse.json({ error: 'title and slug are required' }, { status: 400 })
    }
    await connectDB()
    const post = await BlogPost.create(data)
    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/blog:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}

export async function PATCH(request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 })

    await connectDB()
    const post = await BlogPost.findByIdAndUpdate(id, updates, { new: true })
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    return NextResponse.json(post)
  } catch (err) {
    console.error('PATCH /api/admin/blog:', err)
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
    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 })

    await connectDB()
    const post = await BlogPost.findByIdAndDelete(id)
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/blog:', err)
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 })
  }
}
