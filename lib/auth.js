import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { authConfig } from '@/lib/auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers.filter((p) => p.id !== 'credentials'),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()
        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB()
        let dbUser = await User.findOne({ email: user.email })

        if (!dbUser) {
          const role = user.email === process.env.ADMIN_EMAIL ? 'admin' : 'user'
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            role,
            plan: 'free',
          })
        }

        user.role = dbUser.role
        user.plan = dbUser.plan
        user.id = dbUser._id.toString()
      }
      return true
    },
  },
})
