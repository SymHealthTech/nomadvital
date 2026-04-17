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
  // RESEND_FROM must be set to a verified sender.
  // During development use onboarding@resend.dev (delivers to your Resend account email only).
  // In production verify your domain in Resend and set e.g. NomadVital <noreply@nomadvital.com>
  const from = process.env.RESEND_FROM

  if (!apiKey) {
    console.log('\n📧 [EMAIL — RESEND_API_KEY not set, printing link to console]')
    console.log('To:     ', to)
    console.log('Subject:', subject)
    const stripped = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    // Extract the verification/reset URL for easy copy-paste in dev
    const urlMatch = stripped.match(/https?:\/\/\S+verify-email\S*|https?:\/\/\S+reset-password\S*/i)
    if (urlMatch) console.log('Link:   ', urlMatch[0])
    console.log('')
    return { ok: true, dev: true }
  }

  if (!from) {
    throw new Error(
      'RESEND_FROM is not set. Add it to .env.local or Vercel env vars.\n' +
      'Use onboarding@resend.dev for testing, or a verified domain address for production.'
    )
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
    const errBody = await res.text().catch(() => 'unknown')
    throw new Error(`Resend API error (${res.status}): ${errBody}`)
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

export function adminOtpHtml({ code, action, targetUser }) {
  const actionLabel =
    action === 'delete'
      ? `Delete user <strong>${targetUser || 'unknown'}</strong>`
      : `Change plan for <strong>${targetUser || 'unknown'}</strong>`

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
            Admin Action Confirmation
          </h1>
          <p style="margin:0 0 8px;font-size:14px;color:#5F5E5A;line-height:1.6;">
            A sensitive admin action was requested:
          </p>
          <p style="margin:0 0 24px;font-size:14px;color:#5F5E5A;line-height:1.6;">
            ${actionLabel}
          </p>
          <p style="margin:0 0 12px;font-size:14px;color:#5F5E5A;">
            Use this one-time confirmation code to proceed:
          </p>
          <div style="text-align:center;margin-bottom:24px;">
            <div style="display:inline-block;background:#F1EFE8;border:2px solid #085041;border-radius:12px;padding:16px 40px;">
              <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#085041;font-family:monospace;">${code}</span>
            </div>
          </div>
          <p style="margin:0;font-size:12px;color:#888780;line-height:1.5;">
            This code expires in <strong>10 minutes</strong>. If you did not request this action, someone may be attempting unauthorised access — review your admin panel immediately.
          </p>
        </td></tr>
        <tr><td style="padding:16px 32px;background:#F9F8F5;border-top:1px solid #E8E6DF;text-align:center;">
          <p style="margin:0;font-size:11px;color:#888780;">
            NomadVital Admin · <a href="https://nomadvital.com" style="color:#1D9E75;text-decoration:none;">nomadvital.com</a>
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
