import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String, // null for Google OAuth users
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },

  // Dodo Payments fields
  dodoCustomerId: {
    type: String,
  },
  dodoSubscriptionId: {
    type: String,
  },

  // AI usage tracking
  dailyQuestionCount: {
    type: Number,
    default: 0,
  },
  lastQuestionDate: {
    type: Date,
  },

  // Selected traveler persona
  travelerType: {
    type: String,
    default: 'general',
  },

  // Password reset
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
