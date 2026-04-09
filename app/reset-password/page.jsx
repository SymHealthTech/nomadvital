import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'

export const metadata = {
  title: 'Set New Password — NomadVital',
  description: 'Set a new password for your NomadVital account.',
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F1EFE8' }} />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
