# Stripe Payment Integration Setup

## Environment Variables Required

### For Netlify Deployment

In your Netlify dashboard, go to **Site Settings** → **Environment Variables** and add:

**Client-side variables (VITE_ prefix):**
```
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_stripe_publishable_key
```

**Server-side variables (for backend):**
```
STRIPE_SECRET_KEY = sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET = whsec_your_webhook_secret
```

### For Local Development

Update your `.env` file with your Stripe test keys:

```bash
# Stripe Configuration (Test keys for development)
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_your_test_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_test_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_test_webhook_secret"
```

## Getting Your Stripe Keys

1. **Sign up for Stripe** at https://stripe.com
2. **Go to Dashboard** → **Developers** → **API keys**
3. **Copy your Publishable key** (starts with `pk_test_`) for `VITE_STRIPE_PUBLISHABLE_KEY`
4. **Copy your Secret key** (starts with `sk_test_`) for `STRIPE_SECRET_KEY`
5. **Set up webhooks** in Dashboard → Developers → Webhooks for `STRIPE_WEBHOOK_SECRET`

## Webhook Configuration

Set up webhooks to handle payment events:

1. **Webhook endpoint**: `https://your-domain.com/api/hotel/webhooks/stripe`
2. **Events to send**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `refund.created`

## Test Credit Cards

Stripe provides test card numbers for development:

- **Successful payment**: 4242 4242 4242 4242
- **Requires authentication**: 4000 0025 0000 3155
- **Declined card**: 4000 0000 0000 0002

Use any future expiry date, any 3-digit CVC, and any postal code.

## Production Setup

When ready for production:

1. **Activate your Stripe account** with business verification
2. **Replace test keys** with live keys (starts with `pk_live_` and `sk_live_`)
3. **Update webhook endpoints** to use your production domain
4. **Enable only necessary payment methods** in Stripe Dashboard

## Security Notes

- ✅ **Publishable keys** (VITE_) are safe to expose in client-side code
- ❌ **Secret keys** should never be exposed in client-side code
- ❌ **Never commit real keys** to version control
- ✅ **Use environment variables** for all sensitive data

## Features Supported

- ✅ Credit/Debit card payments
- ✅ 3D Secure authentication
- ✅ Payment refunds
- ✅ Webhook event handling
- ✅ Multi-currency support
- ✅ Payment history tracking
- ✅ Real-time payment status updates
