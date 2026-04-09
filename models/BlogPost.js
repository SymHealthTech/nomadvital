import mongoose from 'mongoose'

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  tag: {
    type: String,
  },
  content: {
    type: String,
  },
  summary: {
    type: String,
  },
  readTime: {
    type: Number,
  },
  metaDescription: {
    type: String,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)
