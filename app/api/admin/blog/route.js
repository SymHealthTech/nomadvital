export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

export async function GET() {
  try {
    await connectDB()
    const posts = await BlogPost.find().sort({ createdAt: -1 })
    return NextResponse.json(posts)
  } catch (err) {
    console.error('GET /api/admin/blog:', err)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    await connectDB()
    const post = await BlogPost.create(data)
    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/blog:', err)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 })

    await connectDB()
    const post = await BlogPost.findByIdAndUpdate(id, updates, { new: true })
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    return NextResponse.json(post)
  } catch (err) {
    console.error('PATCH /api/admin/blog:', err)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 })

    await connectDB()
    const post = await BlogPost.findByIdAndDelete(id)
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/admin/blog:', err)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
