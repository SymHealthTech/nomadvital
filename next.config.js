const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',

  // Offline fallback — served when a navigation request fails (no network)
  fallbacks: {
    document: '/offline',
  },

  runtimeCaching: [
    // Google Fonts stylesheet — cache first, valid for 1 year
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    // Google Fonts files — cache first, valid for 1 year
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    // Next.js built static chunks (_next/static) — immutable, cache forever
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-assets',
        expiration: { maxEntries: 256, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    // Next.js image optimisation endpoint
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image-optimisation',
        expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    // App icons and static images in /public
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-images',
        expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    // External images (Unsplash, Pexels) — revalidate silently
    {
      urlPattern: /^https:\/\/(?:images\.unsplash\.com|images\.pexels\.com)\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'external-images',
        expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    // API routes — always go to network, never cache (auth, AI, payments)
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkOnly',
      options: { cacheName: 'api-routes' },
    },
    // All same-origin page navigations — network first, offline fallback kicks in
    {
      urlPattern: ({ request, url }) =>
        request.destination === 'document' &&
        url.origin === self.location.origin,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
  ],
})

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
})
