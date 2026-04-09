import mongoose from 'mongoose'

const DestinationRatingSchema = new mongoose.Schema({
  destinationSlug: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 120, default: '' },
  createdAt: { type: Date, default: Date.now },
})

DestinationRatingSchema.index({ destinationSlug: 1, userId: 1 }, { unique: true })

export default mongoose.models.DestinationRating ||
  mongoose.model('DestinationRating', DestinationRatingSchema)
