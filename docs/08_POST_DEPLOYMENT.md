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