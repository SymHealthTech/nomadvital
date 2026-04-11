# NomadVital

**AI-powered health and nutrition guidance for international travelers.**

NomadVital is a health-travel SaaS that helps travelers manage dietary conditions, food allergies, medication needs, and general wellness concerns across borders. Users get personalized guidance from Claude (Anthropic) tailored to their destination and traveler persona (e.g. celiac, diabetic, pregnant, athlete), curated destination health guides, community tips, and a blog covering travel-health best practices.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB with Mongoose
- **Auth:** NextAuth v5 (JWT strategy, Google OAuth + credentials + guest sessions)
- **Payments:** Dodo Payments (subscriptions)
- **AI:** Claude (Anthropic SDK) for the health Q&A and planner
- **Styling:** Tailwind CSS (primary `#085041`, accent `#1D9E75`)
- **Fonts:** Playfair Display (headings), Inter (body)
- **PWA:** `next-pwa` (offline-ready, installable)
- **Deployment target:** Vercel

## Local Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd nomadvital

# 2. Install dependencies
npm install

# 3. Copy the env template and fill in real values
cp .env.example .env.local
# Edit .env.local with your MongoDB URI, Anthropic key, Dodo keys, etc.

# 4. Run the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | Full MongoDB connection string (Atlas or self-hosted). |
| `NEXTAUTH_SECRET` | Random string used to sign JWTs. Generate with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | Public URL of the deployed app. `http://localhost:3000` locally, your Vercel URL in prod. |
| `GOOGLE_CLIENT_ID` | OAuth client ID from Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret from Google Cloud Console. |
| `ANTHROPIC_API_KEY` | API key from console.anthropic.com. Powers the Claude AI health Q&A. |
| `DODO_PAYMENTS_API_KEY` | Dodo Payments secret key (test or live). |
| `DODO_PAYMENTS_WEBHOOK_SECRET` | Webhook signing secret from the Dodo dashboard. |
| `DODO_PRO_MONTHLY_PRODUCT_ID` | Product ID for the Pro monthly plan in Dodo. |
| `DODO_PRO_ANNUAL_PRODUCT_ID` | Product ID for the Pro annual plan in Dodo. |
| `DODO_BUSINESS_ID` | Your Dodo Payments business ID. |
| `DODO_API_URL` | Dodo API base URL. Use `https://test.dodopayments.com/v1` for test mode, `https://live.dodopayments.com/v1` for live mode. |
| `ADMIN_EMAIL` | Email address that is automatically granted the `admin` role on first login. |

## Deploying to Vercel

1. Push the repository to GitHub (or GitLab/Bitbucket).
2. In the Vercel dashboard, click **Add New Project** and import the repo.
3. Leave **Framework Preset** as *Next.js* (detected automatically, `vercel.json` pins it).
4. In the **Environment Variables** section, paste in every variable from `.env.example` using your real production values.
   - Make sure `NEXTAUTH_URL` is set to your Vercel domain (e.g. `https://nomadvital.vercel.app`).
5. Click **Deploy**. First build typically takes 2-4 minutes.
6. After the first deploy, add the Vercel domain to:
   - Google OAuth allowed redirect URIs: `https://yourapp.vercel.app/api/auth/callback/google`
   - Dodo Payments webhook endpoint: `https://yourapp.vercel.app/api/webhooks/dodo`
7. In MongoDB Atlas, allow connections from `0.0.0.0/0` (or Vercel's egress IPs) for the production cluster.

## Switching Dodo Payments from Test to Live Mode

All Dodo integration is driven by the `DODO_API_URL` and `DODO_PAYMENTS_API_KEY` environment variables. To flip from the sandbox to real charges:

1. Generate a new **live** API key and webhook secret in the Dodo Payments dashboard.
2. Recreate your products in live mode and note the new product IDs.
3. Update these env vars on Vercel (Production environment):
   - `DODO_API_URL=https://live.dodopayments.com/v1`
   - `DODO_PAYMENTS_API_KEY=<your live secret key>`
   - `DODO_PAYMENTS_WEBHOOK_SECRET=<your live webhook secret>`
   - `DODO_PRO_MONTHLY_PRODUCT_ID=<live monthly product id>`
   - `DODO_PRO_ANNUAL_PRODUCT_ID=<live annual product id>`
4. Trigger a redeploy so the new env vars are picked up.
5. Perform a real test transaction (you can refund it) to confirm webhooks are arriving.

To go back to test mode, set `DODO_API_URL=https://test.dodopayments.com/v1` and use test credentials.

## Admin Panel

The admin dashboard lives at `/admin` and is gated by middleware (only users with `role === 'admin'` can access it). Use it to manage users, destinations, blog posts, reviews, traveler tips, and revenue metrics.

To grant yourself admin access on a fresh deploy, set `ADMIN_EMAIL` to the email you log in with, or promote a user manually in MongoDB: `db.users.updateOne({ email: 'you@example.com' }, { $set: { role: 'admin' } })`.

## Scripts

- `npm run dev` - start the dev server on port 3000
- `npm run build` - production build
- `npm run start` - run the production build locally
- `npm run lint` - run ESLint
