import { StripeService, createStripeService } from '../payments/stripe-service';
import { MobileMoneyService, createMobileMoneyService } from '../payments/mobile-money';
import { supabase } from '../supabase';

export interface UnifiedPaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer' | 'paypal';
  description: string;
  customerInfo: {
    email: string;
    name: string;
    phone?: string;
  };
  paymentDetails?: {
    phoneNumber?: string;
    cardToken?: string;
    returnUrl?: string;
  };
  metadata?: Record<string, any>;
}

export interface UnifiedPaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'requires_action';
  message: string;
  clientSecret?: string; // For Stripe client-side confirmation
  redirectUrl?: string; // For bank transfers or other redirects
  error?: string;
}

export class PaymentService {
  private stripeService?: StripeService;
  private mobileMoneyService?: MobileMoneyService;

  constructor() {
    // Initialize payment services based on available environment variables
    this.stripeService = createStripeService(process.env.STRIPE_SECRET_KEY);
    
    if (process.env.MTN_API_KEY && process.env.AIRTEL_CLIENT_ID) {
      this.mobileMoneyService = createMobileMoneyService({
        MTN_API_KEY: process.env.MTN_API_KEY,
        MTN_USER_ID: process.env.MTN_USER_ID || '',
        MTN_SUBSCRIPTION_KEY: process.env.MTN_SUBSCRIPTION_KEY || '',
        MTN_BASE_URL: process.env.MTN_BASE_URL || 'https://sandbox.momodeveloper.mtn.com',
        AIRTEL_CLIENT_ID: process.env.AIRTEL_CLIENT_ID,
        AIRTEL_CLIENT_SECRET: process.env.AIRTEL_CLIENT_SECRET || '',
        AIRTEL_BASE_URL: process.env.AIRTEL_BASE_URL || 'https://openapiuat.airtel.africa',
        AIRTEL_PARTNER_ID: process.env.AIRTEL_PARTNER_ID || ''
      });
    }
  }

  // Record payment in database
  private async recordPayment(request: UnifiedPaymentRequest, externalData: any = {}) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          booking_id: request.bookingId,
          payment_method: request.paymentMethod,
          provider: this.getProvider(request.paymentMethod),
          transaction_id: externalData.transactionId,
          reference_number: externalData.reference,
          amount: request.amount,
          currency: request.currency,
          status: externalData.status || 'pending',
          phone_number: request.paymentDetails?.phoneNumber,
          metadata: {
            ...request.metadata,
            ...externalData
          }
        })
        .select()
        .single();

      if (error) throw error;
      return payment;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }

  // Get provider name based on payment method
  private getProvider(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'card': return 'stripe';
      case 'mobile_money': return 'mobile_money';
      case 'bank_transfer': return 'bank';
      case 'paypal': return 'paypal';
      default: return 'unknown';
    }
  }

  // Process card payment via Stripe
  private async processCardPayment(request: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse> {
    if (!this.stripeService) {
      return {
        success: false,
        status: 'failed',
        message: 'Card payment service not available',
        error: 'Stripe not configured'
      };
    }

    try {
      // Convert UGX to USD for international cards if needed
      let amount = request.amount;
      let currency = request.currency;

      if (currency === 'UGX') {
        // For international cards, convert to USD
        amount = this.stripeService.convertCurrency(amount, 'UGX', 'USD') * 100; // Convert to cents
        currency = 'USD';
      } else {
        amount = amount * 100; // Convert to cents for other currencies
      }

      const stripeResult = await this.stripeService.createPaymentIntent({
        amount,
        currency,
        description: request.description,
        customerEmail: request.customerInfo.email,
        customerName: request.customerInfo.name,
        bookingReference: request.bookingId,
        metadata: request.metadata
      });

      if (!stripeResult.success) {
        return {
          success: false,
          status: 'failed',
          message: stripeResult.error || 'Card payment setup failed',
          error: stripeResult.error
        };
      }

      // Record payment in database
      const payment = await this.recordPayment(request, {
        transactionId: stripeResult.paymentIntentId,
        status: 'pending',
        provider: 'stripe'
      });

      return {
        success: true,
        paymentId: payment.id,
        transactionId: stripeResult.paymentIntentId,
        status: 'requires_action',
        message: 'Complete payment on the secure form',
        clientSecret: stripeResult.clientSecret
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: 'Card payment processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Process mobile money payment
  private async processMobileMoneyPayment(request: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse> {
    if (!this.mobileMoneyService) {
      return {
        success: false,
        status: 'failed',
        message: 'Mobile money service not available',
        error: 'Mobile money not configured'
      };
    }

    if (!request.paymentDetails?.phoneNumber) {
      return {
        success: false,
        status: 'failed',
        message: 'Phone number required for mobile money payment',
        error: 'Missing phone number'
      };
    }

    try {
      const reference = `ARM-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const mobileMoneyResult = await this.mobileMoneyService.processPayment({
        amount: request.amount,
        currency: request.currency,
        phoneNumber: request.paymentDetails.phoneNumber,
        reference,
        description: request.description
      });

      // Record payment in database
      const payment = await this.recordPayment(request, {
        transactionId: mobileMoneyResult.transactionId,
        reference: mobileMoneyResult.reference,
        status: mobileMoneyResult.status,
        provider: 'mobile_money'
      });

      return {
        success: mobileMoneyResult.success,
        paymentId: payment.id,
        transactionId: mobileMoneyResult.transactionId,
        status: mobileMoneyResult.status,
        message: mobileMoneyResult.message
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: 'Mobile money payment failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Process bank transfer
  private async processBankTransferPayment(request: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse> {
    try {
      // For bank transfers, we just record the pending payment and provide bank details
      const payment = await this.recordPayment(request, {
        status: 'pending',
        provider: 'bank'
      });

      return {
        success: true,
        paymentId: payment.id,
        status: 'pending',
        message: 'Bank transfer details have been sent to your email',
        redirectUrl: `/payment/bank-details/${payment.id}`
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: 'Bank transfer setup failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Main payment processing method
  async processPayment(request: UnifiedPaymentRequest): Promise<UnifiedPaymentResponse> {
    try {
      // Validate request
      if (!request.bookingId || !request.amount || request.amount <= 0) {
        return {
          success: false,
          status: 'failed',
          message: 'Invalid payment request',
          error: 'Missing required fields or invalid amount'
        };
      }

      // Route to appropriate payment method
      switch (request.paymentMethod) {
        case 'card':
          return this.processCardPayment(request);
        
        case 'mobile_money':
          return this.processMobileMoneyPayment(request);
        
        case 'bank_transfer':
          return this.processBankTransferPayment(request);
        
        case 'paypal':
          // TODO: Implement PayPal integration
          return {
            success: false,
            status: 'failed',
            message: 'PayPal payment not yet implemented',
            error: 'Not implemented'
          };
        
        default:
          return {
            success: false,
            status: 'failed',
            message: 'Unsupported payment method',
            error: 'Invalid payment method'
          };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Payment processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (error) throw error;

      return {
        success: true,
        payment
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get payment status'
      };
    }
  }

  // Update payment status (for webhooks)
  async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled',
    transactionId?: string,
    failureReason?: string
  ) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .update({
          status,
          transaction_id: transactionId,
          failure_reason: failureReason,
          processed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', paymentId)
        .select('booking_id')
        .single();

      if (error) throw error;

      // Update booking status based on payment status
      if (status === 'completed') {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'paid',
            status: 'confirmed'
          })
          .eq('id', payment.booking_id);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update payment status'
      };
    }
  }

  // Process refund
  async processRefund(paymentId: string, amount?: number, reason?: string) {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (error) throw error;

      if (payment.provider === 'stripe' && this.stripeService && payment.transaction_id) {
        const refundResult = await this.stripeService.createRefund(
          payment.transaction_id,
          amount ? amount * 100 : undefined, // Convert to cents
          reason
        );

        if (refundResult.success) {
          // Record refund in database if you have a refunds table
          return {
            success: true,
            refundId: refundResult.refundId,
            amount: refundResult.amount,
            status: refundResult.status
          };
        } else {
          return {
            success: false,
            error: refundResult.error
          };
        }
      } else {
        // For other payment methods, implement manual refund process
        return {
          success: false,
          error: 'Refund not supported for this payment method'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed'
      };
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
