# 6. OAuth Configuration

Update your OAuth providers with your production URLs:

## Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add the following to "Authorized redirect URIs":
   1. `https://your-vercel-domain.vercel.app/api/auth/callback/google`
   2. If using a custom domain, also add: `https://your-custom-domain.com/api/auth/callback/google`

## Facebook OAuth

1. Go to [Facebook Developer Portal](https://developers.facebook.com/apps/)
2. Select your app
3. Go to "Facebook Login" > "Settings"
4. Add the following to "Valid OAuth Redirect URIs":
   1. `https://your-vercel-domain.vercel.app/api/auth/callback/facebook`
   2. If using a custom domain, also add: `https://your-custom-domain.com/api/auth/callback/facebook`
