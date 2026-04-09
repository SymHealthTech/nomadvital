import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
  },
  quote: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    default: 5,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema)
