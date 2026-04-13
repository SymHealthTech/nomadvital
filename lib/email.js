/**
 * Send transactional emails via Resend REST API.
 * No extra package required — uses native fetch.
 *
 * Setup:
 *  1. Sign up at https://resend.com (free: 3,000 emails/month)
 *  2. Add a verified domain (or use the sandbox address during dev)
 *  3. Add RESEND_API_KEY and RESEND_FROM to .env.local
 *
 * If RESEND_API_KEY is not set, emails are logged to the console only.
 */
export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY
  const from   = process.env.RESEND_FROM || 'NomadVital <noreply@nomadvital.com>'

  if (!apiKey) {
    console.log('\n📧 [EMAIL — set RESEND_API_KEY to send real emails]')
    console.log('To:     ', to)
    console.log('Subject:', subject)
    console.log('Body (HTML stripped):',
      html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300))
    console.log('')
    return { ok: true, dev: true }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => 'unknown')
    throw new Error(`Resend API error (${res.status}): ${err}`)
  }

  return res.json()
}

/* ── Email templates ─────────────────────────────────────────── */

export function verifyEmailHtml({ name, verifyUrl }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1EFE8;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#fff;border-radius:16px;border:1px solid #D3D1C7;overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:#085041;padding:24px 32px;text-align:center;">
          <span style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px;">
            Nomad<span style="font-weight:400;font-style:italic;color:#5DCAA5;">Vital</span>
          </span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#085041;">
            Verify your email
          </h1>
          <p style="margin:0 0 8px;font-size:14px;color:#5F5E5A;line-height:1.6;">
            Hi ${name || 'there'},
          </p>
          <p style="margin:0 0 24px;font-size:14px;color:#5F5E5A;line-height:1.6;">
            Thanks for signing up for NomadVital! Click the button below to verify your email address and activate your account.
          </p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${verifyUrl}"
               style="display:inline-block;background:#1D9E75;color:#fff;font-size:15px;font-weight:700;
                      padding:14px 32px;border-radius:10px;text-decoration:none;">
              Verify email address
            </a>
          </div>
          <p style="margin:0 0 8px;font-size:12px;color:#888780;line-height:1.5;">
            Or copy this link into your browser:<br>
            <a href="${verifyUrl}" style="color:#1D9E75;word-break:break-all;">${verifyUrl}</a>
          </p>
          <p style="margin:16px 0 0;font-size:12px;color:#888780;line-height:1.5;">
            This link expires in <strong>24 hours</strong>. If you didn&apos;t sign up for NomadVital, you can safely ignore this email.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:16px 32px;background:#F9F8F5;border-top:1px solid #E8E6DF;text-align:center;">
          <p style="margin:0;font-size:11px;color:#888780;">
            NomadVital · Health travel companion · <a href="https://nomadvital.com" style="color:#1D9E75;text-decoration:none;">nomadvital.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function resetPasswordHtml({ name, resetUrl }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1EFE8;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#fff;border-radius:16px;border:1px solid #D3D1C7;overflow:hidden;">
        <tr><td style="background:#085041;padding:24px 32px;text-align:center;">
          <span style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px;">
            Nomad<span style="font-weight:400;font-style:italic;color:#5DCAA5;">Vital</span>
          </span>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#085041;">
            Reset your password
          </h1>
          <p style="margin:0 0 8px;font-size:14px;color:#5F5E5A;line-height:1.6;">
            Hi ${name || 'there'},
          </p>
          <p style="margin:0 0 24px;font-size:14px;color:#5F5E5A;line-height:1.6;">
            We received a request to reset your NomadVital password. Click the button below — the link expires in <strong>1 hour</strong>.
          </p>
          <div style="text-align:center;margin-bottom:24px;">
            <a href="${resetUrl}"
               style="display:inline-block;background:#085041;color:#fff;font-size:15px;font-weight:700;
                      padding:14px 32px;border-radius:10px;text-decoration:none;">
              Reset my password
            </a>
          </div>
          <p style="margin:0 0 8px;font-size:12px;color:#888780;line-height:1.5;">
            Or copy this link:<br>
            <a href="${resetUrl}" style="color:#1D9E75;word-break:break-all;">${resetUrl}</a>
          </p>
          <p style="margin:16px 0 0;font-size:12px;color:#888780;">
            If you didn&apos;t request this, you can safely ignore this email — your password won&apos;t change.
          </p>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#F9F8F5;border-top:1px solid #E8E6DF;text-align:center;">
          <p style="margin:0;font-size:11px;color:#888780;">
            NomadVital · <a href="https://nomadvital.com" style="color:#1D9E75;text-decoration:none;">nomadvital.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
