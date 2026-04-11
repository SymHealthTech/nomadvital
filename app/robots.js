export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/dashboard', '/planner'],
      },
    ],
    sitemap: 'https://nomadvital.com/sitemap.xml',
  }
}
