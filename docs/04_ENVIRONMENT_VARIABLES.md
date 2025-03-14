# 4. Environment Variables

Add all required environment variables in the Vercel project settings:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables:

| Variable | Description | How to Obtain | Example
|-----|-----|-----|-----
| `DATABASE_URL` | Production database connection string | 1. Create a database in your preferred provider (e.g., Neon, Supabase)
2. Go to the connection settings
3. Copy the connection string with SSL enabled | `postgresql://username:password@hostname.neon.tech/dbname?sslmode=require`
| `NEXTAUTH_URL` | Your Vercel deployment URL | After deploying to Vercel, use your project's URL or custom domain | `https://your-project.vercel.app`
| `NEXTAUTH_SECRET` | Random string for NextAuth security | Generate using terminal command:
```bash
openssl rand -base64 32
``` | `K2zqxZZh9K6ZJ+kdRtR1vqmVz2RbEJd...`
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | 1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create or select a project
3. Click "Create Credentials" > "OAuth client ID"
4. Choose "Web application"
5. Add authorized redirect URIs
6. Copy the client ID | `123456789-abcdef...apps.googleusercontent.com`
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Same location as GOOGLE_CLIENT_ID:
1. In credentials page, find your OAuth 2.0 Client
2. Click to view details
3. Copy client secret | `GOCSPX-ABC123...`
| `FACEBOOK_CLIENT_ID` | Facebook OAuth app ID | 1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create or select an app
3. Add Facebook Login product
4. Copy the App ID from Settings > Basic | `1234567890123456`
| `FACEBOOK_CLIENT_SECRET` | Facebook OAuth app secret | Same location as FACEBOOK_CLIENT_ID:
1. Go to Settings > Basic
2. Click "Show" next to App Secret
3. Copy the value | `abcdef123456...`
| `STRIPE_SECRET_KEY` | Stripe live secret key | 1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Switch to Live mode
3. Click "Reveal live key" and copy | `sk_live_51ABC...`
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe live publishable key | Same location as STRIPE_SECRET_KEY:
1. Copy the publishable key (starts with 'pk_live_') | `pk_live_51ABC...`
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | 1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Create endpoint for your production URL
3. Copy the signing secret | `whsec_ABC123...`
| `NODE_ENV` | Environment setting | Set this to 'production' for production environment | `production`

**Important Notes:**
1. Never commit these values to your repository
2. Always use live/production credentials in production, not test/development ones
3. Rotate secrets periodically for security
4. Keep backup copies of these values in a secure password manager
