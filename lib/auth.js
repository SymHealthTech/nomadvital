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
        type: { label: 'Type', type: 'text' },
      },
      async authorize(credentials) {
        // Guest login — JWT-only, no DB record needed
        if (credentials?.type === 'guest') {
          const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
          return {
            id: guestId,
            name: 'Guest',
            email: null,
            plan: 'free',
            role: 'user',
            isGuest: true,
          }
        }

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
    // NOTE: Spreading authConfig.callbacks first, then redefining jwt/session/signIn
    // below means our versions FULLY override the ones in auth.config.js (object
    // spread: later keys win). The auth.config.js callbacks still exist because
    // middleware.js uses authConfig directly and needs them — but in this NextAuth
    // instance they only run once, via the definitions below.
    ...authConfig.callbacks,

    async jwt({ token, user }) {
      // Only runs at sign-in time — stamp the token with user data
      if (user) {
        token.role = user.role
        token.plan = user.plan
        token.id = user.id
        token.isGuest = user.isGuest || false
      }
      return token
    },

    /**
     * session() is called on every server-side auth() call and every
     * useSession() access. We always re-read plan + role from MongoDB here
     * so that payment/webhook upgrades are reflected immediately on the
     * next page load — no session update() tricks required.
     */
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.plan = token.plan
        session.user.id = token.id
      }

      // Expose isGuest flag to session
      session.user.isGuest = token.isGuest || false

      // Always sync plan from DB so payment upgrades show immediately
      // Skip for guest users — they have no meaningful DB upgrades
      if (token?.id && !token.isGuest) {
        try {
          await connectDB()
          const dbUser = await User.findById(token.id).select('plan role').lean()
          if (dbUser) {
            session.user.plan = dbUser.plan
            session.user.role = dbUser.role
          }
        } catch { /* non-fatal — fall back to token values */ }
      }

      return session
    },

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
