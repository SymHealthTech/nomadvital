import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'AI Health Advisor — Ask About Food Safety & Nutrition',
  description:
    'Get instant AI-powered answers about food safety, allergens, and nutrition for any destination. Personalized health guidance for travelers with diabetes, gluten-free diets, and allergies.',
  keywords: [
    'AI health advisor travel',
    'food safety questions',
    'travel nutrition advice',
    'dietary conditions travel',
  ],
}

export default async function AskLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')
  return children
}
