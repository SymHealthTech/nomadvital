import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Sign In — NomadVital',
  description: 'Sign in to your NomadVital account.',
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
