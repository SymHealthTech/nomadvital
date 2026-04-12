import HeroSection from '@/components/public/HeroSection'
import TrustBar from '@/components/public/TrustBar'
import FeaturesSection from '@/components/public/FeaturesSection'
import HowItWorksSection from '@/components/public/HowItWorksSection'
import ChatDemo from '@/components/public/ChatDemo'
import DestinationsSection from '@/components/public/DestinationsSection'
import BlogSection from '@/components/public/BlogSection'
import ReviewsSection from '@/components/public/ReviewsSection'
import FAQSection from '@/components/public/FAQSection'
import PricingSection from '@/components/public/PricingSection'
import FadeInSection from '@/components/public/FadeInSection'
import AppInstallSection from '@/components/public/AppInstallSection'

export const metadata = {
  title: 'NomadVital — AI Health Advisor for Travelers | Food Safety & Nutrition',
  description:
    'AI-powered food safety and nutrition guidance for every traveler. Get personalized health advice for diabetes, gluten-free diets, allergies and more — free to try, no card needed.',
  keywords: [
    'travel health app',
    'food safety travelers',
    'AI nutrition advisor travel',
    'healthy eating while traveling',
    'travel meal planning',
  ],
  openGraph: {
    title: 'NomadVital — AI Health Advisor for Travelers',
    description:
      'Stay healthy everywhere you go. AI-powered nutrition and food safety for every kind of traveler.',
    url: 'https://nomadvital.com',
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
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
              'AI-powered food safety and nutrition guidance for travelers with dietary conditions.',
            url: 'https://nomadvital.com',
          }),
        }}
      />
      <HeroSection />
      <FadeInSection delay={0}>
        <TrustBar />
      </FadeInSection>
      <FadeInSection delay={100}>
        <FeaturesSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <HowItWorksSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <AppInstallSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <ChatDemo />
      </FadeInSection>
      <FadeInSection delay={100}>
        <DestinationsSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <BlogSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <ReviewsSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <PricingSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <FAQSection />
      </FadeInSection>
    </>
  )
}
