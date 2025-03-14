# Deployment Guide for City Harvest Church Website

This guide provides step-by-step instructions for deploying the City Harvest Church website to Vercel. The documentation has been split into separate files for better organization.

## Table of Contents

1. [Preparation](docs/01_PREPARATION.md)
2. [Vercel Account Setup](docs/02_VERCEL_SETUP.md)
3. [Deployment Process](docs/03_DEPLOYMENT.md)
4. [Environment Variables](docs/04_ENVIRONMENT_VARIABLES.md)
5. [Database Configuration](docs/05_DATABASE.md)
6. [OAuth Configuration](docs/06_OAUTH.md)
7. [Stripe Production Setup](docs/07_STRIPE.md)
8. [Post-Deployment Tasks](docs/08_POST_DEPLOYMENT.md)
9. [Troubleshooting](docs/09_TROUBLESHOOTING.md)




### Get Live API Keys

1. In the Stripe Dashboard, go to "Developers" > "API keys"
2. Copy your live publishable key (`pk_live_...`) and secret key (`sk_live_...`)
3. Update these in your Vercel environment variables


### Set Up Production Webhooks

1. In the Stripe Dashboard, go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-vercel-domain.vercel.app/api/webhooks/stripe`
4. Select the following events to listen for:

1. `payment_intent.succeeded`
2. `payment_intent.payment_failed`
3. `invoice.payment_succeeded`
4. `invoice.payment_failed`



5. Click "Add endpoint"
6. Copy the signing secret (`whsec_...`)
7. Add this as `STRIPE_WEBHOOK_SECRET` in your Vercel environment variables


## 8. Verification

After deployment completes, verify that everything works correctly:

1. Visit your Vercel deployment URL
2. Test user authentication:

1. Sign in with Google
2. Sign in with Facebook



3. Test admin functionality:

1. Access the admin dashboard
2. Create/edit content



4. Test donation processing:

1. Make a small test donation with a real card
2. Verify the donation is recorded in your database
3. Check that webhooks are being received correctly



5. Test responsive design on different devices


## 9. Custom Domain Setup

To use a custom domain for your site:

1. In your Vercel project, go to "Settings" > "Domains"
2. Click "Add" and enter your domain name
3. Follow one of these methods to configure your domain:

1. **Vercel DNS**: Transfer your domain to Vercel for automatic configuration
2. **External DNS**: Add the required DNS records at your domain registrar



4. Wait for DNS propagation (can take up to 48 hours)
5. Verify that HTTPS is working correctly


## 10. Post-Deployment Tasks

### Monitoring and Analytics

- Set up [Vercel Analytics](https://vercel.com/analytics) for performance monitoring
- Consider adding [Google Analytics](https://analytics.google.com/) for user behavior tracking
- Set up [Sentry](https://sentry.io/) or similar for error tracking


### Performance Optimization

- Run Lighthouse tests to identify performance issues
- Enable [Automatic Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- Configure [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) for frequently updated pages


### Security

- Set up regular security audits
- Keep all dependencies updated
- Consider adding rate limiting for API routes
- Implement CSRF protection for forms


### Backup Strategy

- Set up regular database backups
- Ensure your Git repository is backed up
- Document recovery procedures


## 11. Troubleshooting

### Build Failures

- Check the build logs in Vercel for specific errors
- Verify that all dependencies are correctly installed
- Check for environment variables that might be missing


### Runtime Errors

- Check the Function logs in Vercel
- Look for errors in the browser console
- Verify that API routes are working correctly


### Database Connection Issues

- Check that your `DATABASE_URL` is correct
- Verify that your database is accessible from Vercel's servers
- Check for connection limits or firewall restrictions


### Authentication Problems

- Verify OAuth configuration and callback URLs
- Check that your `NEXTAUTH_URL` is set correctly
- Ensure `NEXTAUTH_SECRET` is properly configured


### Stripe Integration Issues

- Verify webhook setup and test with Stripe's webhook tester
- Check that API keys are correctly set
- Look for errors in the Stripe Dashboard logs


## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [NextAuth.js Deployment Documentation](https://next-auth.js.org/deployment)