import mongoose from 'mongoose'

const TravelerTipSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  destinationName: { type: String, required: true },
  authorName: { type: String, required: true },
  authorCity: { type: String, required: true },
  healthCondition: { type: String, required: true },
  tipText: { type: String, required: true, maxlength: 280 },
  isApproved: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  submittedViaEmail: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.TravelerTip || mongoose.model('TravelerTip', TravelerTipSchema)
