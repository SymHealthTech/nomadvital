import connectDB from '@/lib/mongodb'
import Destination from '@/models/Destination'
import BlogPost from '@/models/BlogPost'

export default async function sitemap() {
  const baseUrl = 'https://nomadvital.com'
  const now = new Date()

  const staticRoutes = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/ask`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/destinations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/for/runner`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/for/mountaineer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/for/tourist`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/for/business`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/for/wellness`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/for/adventure`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  let destinationRoutes = []
  let blogRoutes = []

  try {
    await connectDB()
    const destinations = await Destination.find({ isPublished: true })
      .select('slug updatedAt')
      .lean()
    destinationRoutes = destinations.map((d) => ({
      url: `${baseUrl}/destinations/${d.slug}`,
      lastModified: d.updatedAt || now,
      changeFrequency: 'monthly',
      priority: 0.85,
    }))
    const posts = await BlogPost.find({ isPublished: true })
      .select('slug updatedAt')
      .lean()
    blogRoutes = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt || now,
      changeFrequency: 'monthly',
      priority: 0.75,
    }))
  } catch {
    /* fallback to static only */
  }

  return [...staticRoutes, ...destinationRoutes, ...blogRoutes]
}
