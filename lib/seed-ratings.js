/**
 * Seed script — initialises realistic rating data for the 4 core destinations.
 * Run once: node lib/seed-ratings.js
 *
 * Replace with real ratings as users submit them.
 * Safe to re-run — uses upsert so it won't duplicate.
 */

import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env.local')
  process.exit(1)
}

const DestinationSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  country: String,
  content: String,
  conditions: [String],
  isFree: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const Destination =
  mongoose.models.Destination || mongoose.model('Destination', DestinationSchema)

const seeds = [
  { slug: 'thailand', name: 'Thailand', country: 'Thailand', averageRating: 4.7, totalRatings: 38 },
  { slug: 'japan',    name: 'Japan',    country: 'Japan',    averageRating: 4.9, totalRatings: 52 },
  { slug: 'italy',    name: 'Italy',    country: 'Italy',    averageRating: 4.6, totalRatings: 29 },
  { slug: 'mexico',   name: 'Mexico',   country: 'Mexico',   averageRating: 4.5, totalRatings: 21 },
]

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false })
  console.log('Connected to MongoDB')

  for (const { slug, name, country, averageRating, totalRatings } of seeds) {
    await Destination.findOneAndUpdate(
      { slug },
      { $set: { name, country, slug, averageRating, totalRatings, isPublished: true } },
      { upsert: true, new: true }
    )
    console.log(`✓  ${name}: ${averageRating} avg / ${totalRatings} ratings`)
  }

  console.log('\nSeeding complete.')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
