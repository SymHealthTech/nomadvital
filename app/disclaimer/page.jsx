export const metadata = {
  title: 'Medical Disclaimer — NomadVital',
  description: 'Important medical disclaimer for NomadVital health and nutrition guidance.',
  alternates: { canonical: 'https://nomadvital.com/disclaimer' },
}

const P_STYLE = {
  fontSize: '14px',
  color: '#444441',
  lineHeight: '1.85',
  marginBottom: '14px',
  fontFamily: 'var(--font-inter, Inter, sans-serif)',
}

const H2_STYLE = {
  fontFamily: 'var(--font-playfair, Georgia, serif)',
  fontSize: '20px',
  fontWeight: '600',
  color: '#085041',
  marginBottom: '12px',
  marginTop: '36px',
  letterSpacing: '0.01em',
}

export default function DisclaimerPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ background: '#085041', color: '#fff', padding: '52px 24px', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair, Georgia, serif)',
          fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
          fontWeight: '700',
          letterSpacing: '0.01em',
          marginBottom: '10px',
        }}>
          Medical Disclaimer
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: '14px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Please read before using NomadVital
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 64px' }}>

        {/* Prominent disclaimer box */}
        <div style={{
          background: '#FFF3E0',
          border: '1.5px solid #F59E0B',
          borderRadius: '14px',
          padding: '24px 22px',
          marginBottom: '40px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: '14px', color: '#92400E', lineHeight: '1.75', margin: 0, fontFamily: 'var(--font-inter, Inter, sans-serif)', fontWeight: '500' }}>
            NomadVital provides general health and nutrition information for educational purposes only. Nothing on this website constitutes medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making dietary changes or traveling with a medical condition.
          </p>
        </div>

        <h2 style={{ ...H2_STYLE, marginTop: 0 }}>Not a Medical Service</h2>
        <p style={P_STYLE}>
          NomadVital is an information platform, not a medical service. The content on this website — including articles, destination guides, AI-generated responses, and community tips — is provided for general informational and educational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment.
        </p>
        <p style={P_STYLE}>
          NomadVital does not employ doctors, dietitians, or medical professionals to create its content. Our guidance is based on publicly available nutritional and food safety information and is intended to give travelers a starting point for their own research and conversations with their healthcare team.
        </p>

        <h2 style={H2_STYLE}>AI-Generated Responses</h2>
        <p style={P_STYLE}>
          The AI advisor feature uses large language models to generate responses to your health and nutrition questions. These responses are generated automatically and are not reviewed by a medical professional before delivery. AI-generated content can contain errors, omissions, or outdated information.
        </p>
        <p style={P_STYLE}>
          AI responses should be treated as a starting point for research — not as clinical guidance. Do not make medication changes, change your diabetes management plan, or make other significant health decisions based solely on AI-generated advice from NomadVital.
        </p>

        <h2 style={H2_STYLE}>Individual Medical Conditions</h2>
        <p style={P_STYLE}>
          Medical conditions vary enormously between individuals. A food that is generally considered safe for people with Type 2 diabetes may not be appropriate for your specific situation, medication regimen, or level of control. Information about nut allergies, celiac disease, lactose intolerance, and other conditions is provided in general terms and cannot account for the severity or specific nature of your personal condition.
        </p>
        <p style={P_STYLE}>
          If you have a severe allergy (particularly anaphylaxis risk), celiac disease, poorly controlled diabetes, or any other serious medical condition, please consult your doctor or specialist before traveling internationally, and do not rely on any website — including NomadVital — as your primary safety resource.
        </p>

        <h2 style={H2_STYLE}>Community Traveler Tips</h2>
        <p style={P_STYLE}>
          Community tips submitted by users reflect personal experiences and are not verified for medical accuracy. A tip from another traveler describing their experience with a particular food or restaurant does not guarantee the same outcome for you. Individual tolerance, food preparation methods, and cross-contamination risks vary.
        </p>

        <h2 style={H2_STYLE}>Destination Information</h2>
        <p style={P_STYLE}>
          Destination guide content reflects general conditions and may not account for local variations, seasonal changes, or changes in restaurant practices since the guide was written. Food labeling laws, ingredient availability, and food safety standards change over time and vary within countries. Always verify critical allergy information directly with the establishment serving you food.
        </p>

        <h2 style={H2_STYLE}>Emergency Situations</h2>
        <p style={P_STYLE}>
          If you experience a medical emergency while traveling — including anaphylaxis, diabetic emergency, or any acute health crisis — seek immediate local emergency medical care. Do not consult NomadVital or any website during a medical emergency. Call the local emergency services number immediately.
        </p>

        <h2 style={H2_STYLE}>Travel Health Preparation</h2>
        <p style={P_STYLE}>
          We strongly recommend that all travelers with medical conditions consult a travel medicine physician or their own specialist before international travel. Many countries have travel medicine clinics that can provide destination-specific vaccination advice, medication (including emergency antibiotics), and condition-specific travel guidance.
        </p>

        <h2 style={H2_STYLE}>Limitation of Liability</h2>
        <p style={P_STYLE}>
          NomadVital and its operators, employees, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of, or reliance on, information provided on this website. Your use of NomadVital is at your own risk.
        </p>

        <h2 style={H2_STYLE}>Changes to This Disclaimer</h2>
        <p style={P_STYLE}>
          We may update this disclaimer from time to time to reflect changes in our service or applicable regulations. Continued use of NomadVital following any changes constitutes your acceptance of the updated disclaimer.
        </p>

        <div style={{ background: '#E1F5EE', border: '1px solid #5DCAA5', borderRadius: '12px', padding: '20px 22px', marginTop: '8px' }}>
          <p style={{ ...P_STYLE, margin: 0, color: '#085041' }}>
            <strong>Questions about this disclaimer?</strong>{' '}
            Contact us at{' '}
            <a href="mailto:contact@nomadvital.com" style={{ color: '#1D9E75', textDecoration: 'underline' }}>
              contact@nomadvital.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
