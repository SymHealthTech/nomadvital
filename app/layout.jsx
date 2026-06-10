import './globals.css'
import { Playfair_Display, Inter } from 'next/font/google'
import ConditionalLayout from '@/components/public/ConditionalLayout'
import Providers from '@/components/public/Providers'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata = {
  metadataBase: new URL('https://nomadvital.com'),
  title: {
    default: 'NomadVital — AI Health Advisor for Travelers',
    template: '%s | NomadVital',
  },
  description:
    'AI-powered food safety and nutrition guidance for travelers. Personalized health advice for dietary conditions — diabetes, gluten-free, allergies and more.',
  keywords: [
    'travel health app',
    'food safety travelers',
    'AI nutrition advisor',
    'dietary conditions travel',
    'gluten free travel guide',
    'diabetes travel food',
    'travel allergy guide',
    'healthy eating abroad',
    'destination health guide',
    'travel nutrition',
  ],
  authors: [{ name: 'NomadVital' }],
  creator: 'NomadVital',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nomadvital.com',
    siteName: 'NomadVital',
    title: 'NomadVital — AI Health Advisor for Travelers',
    description:
      'AI-powered food safety and nutrition guidance for travelers with dietary conditions.',
    images: [{ url: '/icons/icon-512.png', width: 512, height: 512, alt: 'NomadVital' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NomadVital — AI Health Advisor for Travelers',
    description: 'AI-powered food safety and nutrition guidance for travelers.',
    images: ['/icons/icon-512.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Viewport — viewport-fit=cover is required for env(safe-area-inset-*) on iOS notch devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Theme colour shown in browser chrome and Android task switcher */}
        <meta name="theme-color" content="#085041" />

        {/* iOS standalone / home-screen app */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* black-translucent lets the status bar overlay the app (transparent),
            which pairs correctly with the env(safe-area-inset-top) offset in globals.css */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="NomadVital" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
      </head>
      <body className="font-inter min-h-screen flex flex-col">
        {/* Detect PWA mode BEFORE React hydrates — sets .pwa-mode on body immediately */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var s=window.matchMedia('(display-mode: standalone)').matches||!!window.navigator.standalone||document.referrer.indexOf('android-app://')!==-1;if(s){document.body.classList.add('pwa-mode');window.__NV_PWA__=true;}}catch(e){}})();` }} />
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'NomadVital',
              url: 'https://nomadvital.com',
              description: 'AI-powered health and nutrition guidance for travelers',
              logo: 'https://nomadvital.com/icons/icon-512.png',
              sameAs: [],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'admin.nomadvital@gmail.com',
                contactType: 'customer support',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MobileApplication',
              name: 'NomadVital',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web, iOS, Android',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free plan available',
              },
              description:
                'AI-powered food safety and nutrition guidance for travelers. Install as a PWA on iOS and Android.',
              url: 'https://nomadvital.com',
            }),
          }}
        />
      </body>
    </html>
  )
}
