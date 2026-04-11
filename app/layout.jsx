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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#085041" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NomadVital" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="font-inter min-h-screen flex flex-col">
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
                email: 'contact@nomadvital.com',
                contactType: 'customer support',
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
