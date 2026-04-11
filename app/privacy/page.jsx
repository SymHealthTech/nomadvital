export const metadata = {
  title: 'Privacy Policy — NomadVital',
  description: 'How NomadVital collects, uses, and protects your personal data.',
  alternates: { canonical: 'https://nomadvital.com/privacy' },
}

const SECTION_STYLE = {
  marginBottom: '36px',
}

const H2_STYLE = {
  fontFamily: 'var(--font-playfair, Georgia, serif)',
  fontSize: '20px',
  fontWeight: '600',
  color: '#085041',
  marginBottom: '12px',
  letterSpacing: '0.01em',
}

const P_STYLE = {
  fontSize: '14px',
  color: '#444441',
  lineHeight: '1.8',
  marginBottom: '12px',
  fontFamily: 'var(--font-inter, Inter, sans-serif)',
}

const UL_STYLE = {
  listStyle: 'none',
  padding: 0,
  margin: '0 0 12px',
}

function Li({ children }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px', fontSize: '14px', color: '#444441', lineHeight: '1.7', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '3px' }}>
        <path d="M20 6L9 17l-5-5" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {children}
    </li>
  )
}

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: '14px', fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>
          Last updated: 8 April 2025
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 64px' }}>

        <p style={{ ...P_STYLE, marginBottom: '36px' }}>
          NomadVital ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using NomadVital, you agree to the practices described here.
        </p>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>1. Information We Collect</h2>
          <p style={P_STYLE}><strong style={{ color: '#085041' }}>Account information.</strong> When you create an account, we collect your name, email address, and (if you sign up with a password) a securely hashed version of your password. We never store your password in plain text.</p>
          <p style={P_STYLE}><strong style={{ color: '#085041' }}>Usage data.</strong> We record your daily AI question count, your selected traveler persona, and the date of your last question. This is used solely to enforce free-tier limits and personalise your experience.</p>
          <p style={P_STYLE}><strong style={{ color: '#085041' }}>Payment information.</strong> If you upgrade to Pro, payment is handled entirely by Dodo Payments. We store only your Dodo customer ID and subscription ID — we never see or store your card number, expiry date, or CVV.</p>
          <p style={P_STYLE}><strong style={{ color: '#085041' }}>Traveler tips.</strong> If you submit a community tip, we store your name, city, health condition, and tip text. These may be published publicly after review.</p>
          <p style={P_STYLE}><strong style={{ color: '#085041' }}>Destination ratings.</strong> If you submit a star rating, we store your user ID, the destination slug, your rating, and an optional comment.</p>
          <p style={P_STYLE}><strong style={{ color: '#085041' }}>Log data.</strong> Our servers automatically record standard web log data including IP addresses, browser type, pages visited, and timestamps. This data is used for security and to diagnose technical issues.</p>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>2. How We Use Your Information</h2>
          <ul style={UL_STYLE}>
            <Li>To provide and improve the NomadVital service</Li>
            <Li>To enforce daily question limits for free-tier users</Li>
            <Li>To personalise AI responses based on your selected traveler persona</Li>
            <Li>To process subscription payments via Dodo Payments</Li>
            <Li>To send password reset emails when you request them</Li>
            <Li>To publish approved community traveler tips</Li>
            <Li>To monitor for abuse, spam, and security threats</Li>
            <Li>To comply with applicable laws and regulations</Li>
          </ul>
          <p style={P_STYLE}>We do not sell your personal data. We do not use your data to train AI models. We do not send marketing emails unless you have explicitly opted in.</p>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>3. AI Conversations</h2>
          <p style={P_STYLE}>
            Your questions to the NomadVital AI advisor are sent to Anthropic's Claude API for processing. We do not store the full text of your AI conversations in our database — only your question count and the date are recorded. Anthropic's use of your data is governed by their own privacy policy and API terms of service. We recommend you do not share sensitive personal health information (such as specific medication names or medical history) in your AI questions.
          </p>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>4. Cookies and Tracking</h2>
          <p style={P_STYLE}>
            NomadVital uses a session cookie to keep you logged in. This is a functional cookie required for the service to work — it is not used for advertising tracking. We do not currently use third-party analytics cookies, advertising pixels, or cross-site trackers.
          </p>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>5. Data Sharing</h2>
          <p style={P_STYLE}>We share your data only in the following limited circumstances:</p>
          <ul style={UL_STYLE}>
            <Li><strong style={{ color: '#085041' }}>Dodo Payments</strong> — to process subscription payments. They receive your email and name to create a customer record.</Li>
            <Li><strong style={{ color: '#085041' }}>Anthropic</strong> — the text of your AI questions is processed via their API.</Li>
            <Li><strong style={{ color: '#085041' }}>MongoDB Atlas</strong> — our database provider stores your account data on encrypted servers.</Li>
            <Li><strong style={{ color: '#085041' }}>Legal compliance</strong> — we may disclose data if required by law or to protect the rights, property, or safety of NomadVital, our users, or the public.</Li>
          </ul>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>6. Data Retention</h2>
          <p style={P_STYLE}>
            We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or compliance reasons. Approved community tips may remain published after account deletion (attributed to your name as originally submitted).
          </p>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>7. Your Rights</h2>
          <p style={P_STYLE}>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul style={UL_STYLE}>
            <Li><strong style={{ color: '#085041' }}>Access</strong> — request a copy of the data we hold about you</Li>
            <Li><strong style={{ color: '#085041' }}>Correction</strong> — ask us to correct inaccurate data</Li>
            <Li><strong style={{ color: '#085041' }}>Deletion</strong> — request that we delete your account and associated data</Li>
            <Li><strong style={{ color: '#085041' }}>Portability</strong> — receive your data in a machine-readable format</Li>
            <Li><strong style={{ color: '#085041' }}>Objection</strong> — object to certain types of data processing</Li>
          </ul>
          <p style={P_STYLE}>
            To exercise any of these rights, email us at <a href="mailto:contact@nomadvital.com" style={{ color: '#1D9E75', textDecoration: 'underline' }}>contact@nomadvital.com</a>. We will respond within 30 days.
          </p>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>8. Security</h2>
          <p style={P_STYLE}>
            We implement industry-standard security measures including HTTPS encryption for all data in transit, bcrypt password hashing, and access controls on our database. No method of internet transmission is 100% secure — if you believe your account has been compromised, please contact us immediately.
          </p>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>9. Children's Privacy</h2>
          <p style={P_STYLE}>
            NomadVital is not directed at children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with their data, please contact us and we will delete it promptly.
          </p>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>10. Changes to This Policy</h2>
          <p style={P_STYLE}>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by email (if you have an account) or by posting a notice on the website. Your continued use of NomadVital after changes take effect constitutes your acceptance of the updated policy.
          </p>
        </div>

        <div style={{ background: '#F1EFE8', borderRadius: '12px', padding: '20px 22px' }}>
          <p style={{ ...P_STYLE, margin: 0 }}>
            <strong style={{ color: '#085041' }}>Questions?</strong>{' '}
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
