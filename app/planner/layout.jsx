import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Diet Travel Planner — NomadVital',
  description: 'Get a personalised AI-generated meal plan for your destination and health condition. Safe foods, local options, and condition-specific advice.',
}

export default async function PlannerLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')
  return children
}
