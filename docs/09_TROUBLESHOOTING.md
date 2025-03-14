# 9. Troubleshooting

This section covers common issues you might encounter during deployment and their solutions.

## NPM Permission Issues

### Problem: Permission errors during global npm installations

When running `npm install -g`, you might see errors about insufficient permissions.

### Solution:
1. Set up a local npm global directory (Recommended):
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

2. Add to your shell profile (~/.bash_profile, ~/.zshrc, etc.):
```bash
export PATH=~/.npm-global/bin:$PATH
```

3. Reload your shell profile:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

4. Try installing again:
```bash
npm install -g vercel
```

> ⚠️ Note: While using `sudo npm install -g` would also work, it's not recommended for security reasons.

## Build Errors

### Problem: Next.js build fails in Vercel

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are listed in `package.json`
3. Verify environment variables are properly set
4. Check for any TypeScript errors

## Database Connection Issues

### Problem: Application can't connect to database

1. Verify `DATABASE_URL` is correct in Vercel environment variables
2. Ensure database accepts connections from Vercel's IP range
3. Check SSL requirements are met
4. Verify database user has correct permissions

## OAuth Configuration Issues

### Problem: OAuth login not working

1. Verify redirect URIs match exactly in OAuth provider settings
2. Check all OAuth-related environment variables are set
3. Ensure you're using the correct OAuth credentials (development vs. production)
4. Check for any CORS issues in browser console

## Stripe Integration Issues

### Problem: Stripe payments not working

1. Verify you're using live keys in production
2. Check webhook endpoint is properly configured
3. Ensure all required Stripe environment variables are set
4. Monitor Stripe dashboard for detailed error logs

## General Debugging Tips

1. Check Vercel deployment logs
2. Use `vercel logs` command for real-time logs
3. Add console logging for debugging
4. Monitor your error reporting service
5. Check browser console for frontend errors
