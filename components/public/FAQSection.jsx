'use client'
import { useState } from 'react'

const faqs = [
  {
    question: 'Is this real medical advice?',
    answer:
      'No — and we\'re clear about that. NomadVital provides general health and nutrition information for educational purposes only. Think of us as a knowledgeable travel companion who knows a lot about food safety and nutrition. For any specific medical condition or medication, always consult your doctor.',
  },
  {
    question: 'Which countries and destinations do you cover?',
    answer:
      'We currently have detailed guides for 50+ countries across Asia, Europe, the Americas, and the Middle East — with new destinations added every month. Pro subscribers get access to all destinations. Free users can access 5 guides.',
  },
  {
    question: 'Can I really cancel anytime?',
    answer:
      'Absolutely. There are no contracts, no lock-in periods, and no cancellation fees. You can cancel your Pro subscription from your account dashboard in one click. You will keep access until the end of your billing period.',
  },
  {
    question: 'What is the difference between the Free and Pro plans?',
    answer:
      'Free gives you 3 AI questions per day and access to 5 destination guides — enough to explore the platform. Pro gives you unlimited AI questions, all 50+ destination guides, the personalised diet travel planner, and PDF downloads for offline use.',
  },
  {
    question: 'Is my personal health information private?',
    answer:
      'Yes. We do not sell or share your health data with anyone. Your information is used only to personalise your experience. We follow strict data privacy standards and our full privacy policy is available on the site.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section style={{ background: '#fff', padding: '72px 16px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '2.5px',
              color: '#1D9E75',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            COMMON QUESTIONS
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: '700',
              color: '#085041',
              margin: 0,
              lineHeight: '1.3',
            }}
          >
            Everything you need to know
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                style={{
                  borderBottom: '0.5px solid #C0DD97',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#085041',
                      lineHeight: '1.4',
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#E1F5EE',
                      borderRadius: '50%',
                      transition: 'transform 0.3s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="#085041"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: isOpen ? '200px' : '0',
                    transition: 'max-height 0.3s ease',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#5F5E5A',
                      lineHeight: '1.7',
                      padding: '0 0 20px 0',
                      margin: 0,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
