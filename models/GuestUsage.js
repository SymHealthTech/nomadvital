import mongoose from 'mongoose'

const guestUsageSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  date: { type: String, default: '' }, // stores toDateString() — resets each day
})

export default mongoose.models.GuestUsage ||
  mongoose.model('GuestUsage', guestUsageSchema)
