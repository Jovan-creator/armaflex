import Stripe from 'stripe';

export interface StripePaymentRequest {
  amount: number; // in cents
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  bookingReference: string;
  metadata?: Record<string, string>;
}

export interface StripePaymentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

export class StripeService {
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-06-20', // Use latest API version
    });
  }

  // Create payment intent for client-side confirmation
  async createPaymentIntent(request: StripePaymentRequest): Promise<StripePaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(request.amount), // Ensure integer
        currency: request.currency.toLowerCase(),
        description: request.description,
        receipt_email: request.customerEmail,
        metadata: {
          bookingReference: request.bookingReference,
          customerName: request.customerName,
          ...request.metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret || undefined,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment intent creation failed'
      };
    }
  }

  // Retrieve payment intent status
  async getPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        success: true,
        data: paymentIntent
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve payment intent'
      };
    }
  }

  // Create customer for future payments
  async createCustomer(email: string, name: string, phone?: string) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        phone
      });
      return {
        success: true,
        customerId: customer.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create customer'
      };
    }
  }

  // Process refund
  async createRefund(paymentIntentId: string, amount?: number, reason?: string) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount) : undefined,
        reason: reason as Stripe.RefundCreateParams.Reason || undefined
      });

      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund failed'
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string | Buffer, signature: string, endpointSecret: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return {
        success: true,
        event
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook signature verification failed'
      };
    }
  }

  // Handle webhook events
  async handleWebhookEvent(event: Stripe.Event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('Payment succeeded:', paymentIntent.id);
          // Update booking status in database
          return {
            success: true,
            action: 'payment_succeeded',
            paymentIntentId: paymentIntent.id,
            metadata: paymentIntent.metadata
          };

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          console.log('Payment failed:', failedPayment.id);
          return {
            success: true,
            action: 'payment_failed',
            paymentIntentId: failedPayment.id,
            error: failedPayment.last_payment_error?.message
          };

        case 'charge.dispute.created':
          const dispute = event.data.object as Stripe.Dispute;
          console.log('Dispute created:', dispute.id);
          return {
            success: true,
            action: 'dispute_created',
            disputeId: dispute.id
          };

        default:
          console.log('Unhandled event type:', event.type);
          return {
            success: true,
            action: 'unhandled',
            eventType: event.type
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook handling failed'
      };
    }
  }

  // Convert amount from UGX to USD for international cards (optional)
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    // Simple conversion rates - in production, use a real currency API
    const rates: Record<string, Record<string, number>> = {
      UGX: {
        USD: 0.00027, // 1 UGX = 0.00027 USD (approximate)
        EUR: 0.00025  // 1 UGX = 0.00025 EUR (approximate)
      },
      USD: {
        UGX: 3700,    // 1 USD = 3700 UGX (approximate)
        EUR: 0.92     // 1 USD = 0.92 EUR (approximate)
      }
    };

    if (fromCurrency === toCurrency) return amount;
    
    const rate = rates[fromCurrency]?.[toCurrency];
    if (!rate) {
      throw new Error(`Conversion rate not available for ${fromCurrency} to ${toCurrency}`);
    }

    return Math.round(amount * rate);
  }

  // Create setup intent for future payments
  async createSetupIntent(customerId: string) {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Setup intent creation failed'
      };
    }
  }
}

// Factory function to create Stripe service
export function createStripeService(secretKey?: string): StripeService | null {
  if (!secretKey) {
    console.warn('Stripe secret key not provided');
    return null;
  }
  return new StripeService(secretKey);
}

// Export configured instance
export const stripeService = createStripeService(process.env.STRIPE_SECRET_KEY);
