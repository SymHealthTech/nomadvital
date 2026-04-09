import HeroSection from '@/components/public/HeroSection'
import TrustBar from '@/components/public/TrustBar'
import FeaturesSection from '@/components/public/FeaturesSection'
import WhoIsItForSection from '@/components/public/WhoIsItForSection'
import HowItWorksSection from '@/components/public/HowItWorksSection'
import ChatDemo from '@/components/public/ChatDemo'
import DestinationsSection from '@/components/public/DestinationsSection'
import BlogSection from '@/components/public/BlogSection'
import ReviewsSection from '@/components/public/ReviewsSection'
import FAQSection from '@/components/public/FAQSection'
import PricingSection from '@/components/public/PricingSection'
import FadeInSection from '@/components/public/FadeInSection'

export const metadata = {
  title: 'NomadVital — Stay Healthy Everywhere You Go',
  description:
    'AI-powered health and nutrition guidance for international travelers. Manage diabetes, allergies, dietary conditions abroad.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FadeInSection delay={0}>
        <TrustBar />
      </FadeInSection>
      <FadeInSection delay={100}>
        <FeaturesSection />
      </FadeInSection>
      <WhoIsItForSection />
      <FadeInSection delay={100}>
        <HowItWorksSection />
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
