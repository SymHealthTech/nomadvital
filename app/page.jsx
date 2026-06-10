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

export const metadata = {
  title: 'NomadVital — AI Health Advisor for Travelers | Food Safety & Nutrition',
  description:
    'AI-powered food safety and nutrition guidance for every traveler. Get personalized health advice for diabetes, gluten-free diets, allergies and more — free to try, no card needed.',
  keywords: [
    'AI travel health advisor',
    'food safety app for travelers',
    'travel nutrition app',
    'AI meal planner for travelers',
    'healthy eating while traveling',
    'travel health app',
    'food allergy travel guide',
    'personalized travel meal plan',
    'AI health advisor for travelers',
    'travel app for dietary conditions',
    'AI travel nutrition app',
    'AI food safety app for travelers',
    'AI-powered travel health guide',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is this real medical advice?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "No — and we're clear about that. NomadVital provides general health and nutrition information for educational purposes only. Think of us as a knowledgeable travel companion who knows a lot about food safety and nutrition. For any specific medical condition or medication, always consult your doctor.",
                },
              },
              {
                '@type': 'Question',
                name: 'Which countries and destinations do you cover?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We currently have detailed guides for 50+ countries across Asia, Europe, the Americas, and the Middle East — with new destinations added every month. Pro subscribers get access to all destinations. Free users can access 5 guides.',
                },
              },
              {
                '@type': 'Question',
                name: 'Can I really cancel anytime?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Absolutely. There are no contracts, no lock-in periods, and no cancellation fees. You can cancel your Pro subscription from your account dashboard in one click. You will keep access until the end of your billing period.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the difference between the Free and Pro plans?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Free gives you 3 AI questions per day and access to 5 destination guides — enough to explore the platform. Pro gives you unlimited AI questions, all 50+ destination guides, the personalised diet travel planner, and PDF downloads for offline use.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is my personal health information private?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. We do not sell or share your health data with anyone. Your information is used only to personalise your experience. We follow strict data privacy standards and our full privacy policy is available on the site.',
                },
              },
            ],
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
