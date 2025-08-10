import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_...", {
  apiVersion: "2024-06-20",
});

export class PaymentService {
  // Create payment intent for reservation
  async createPaymentIntent(
    amount: number,
    currency: string = "usd",
    metadata: any = {},
  ) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  }

  // Confirm payment intent
  async confirmPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent =
        await stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error("Error confirming payment intent:", error);
      throw error;
    }
  }

  // Get payment intent details
  async getPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      throw error;
    }
  }

  // Create refund
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
  ) {
    try {
      const refundData: any = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      if (reason) {
        refundData.reason = reason;
      }

      const refund = await stripe.refunds.create(refundData);
      return refund;
    } catch (error) {
      console.error("Error creating refund:", error);
      throw error;
    }
  }

  // Get refunds for payment intent
  async getRefunds(paymentIntentId: string) {
    try {
      const refunds = await stripe.refunds.list({
        payment_intent: paymentIntentId,
      });
      return refunds;
    } catch (error) {
      console.error("Error retrieving refunds:", error);
      throw error;
    }
  }

  // Get payment methods for customer
  async getPaymentMethods(customerId: string) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });
      return paymentMethods;
    } catch (error) {
      console.error("Error retrieving payment methods:", error);
      throw error;
    }
  }

  // Create customer
  async createCustomer(email: string, name: string, metadata: any = {}) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata,
      });
      return customer;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  }

  // Webhook handler for Stripe events
  async handleWebhookEvent(event: Stripe.Event) {
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log("Payment succeeded:", paymentIntent.id);

          // Update payment status in database and send receipt
          try {
            const { DatabaseService } = await import('../database/db');
            const { notificationService } = await import('./notificationService');
            const db = DatabaseService.getInstance();

            // Find payment and reservation details
            const payment = await db.findPaymentByStripeId(paymentIntent.id);
            if (payment) {
              // Update payment status
              await db.updatePaymentStatus(payment.id, 'succeeded');

              // Get reservation and guest details
              const reservation = await db.getReservationById(payment.reservation_id);
              if (reservation) {
                const guest = await db.getGuestById(reservation.guest_id);
                const room = await db.getRoomById(reservation.room_id);

                if (guest && guest.email) {
                  // Send payment receipt notification
                  const notificationData = {
                    recipientEmail: guest.email,
                    recipientPhone: guest.phone,
                    guestName: `${guest.first_name} ${guest.last_name}`,
                    roomNumber: room?.room_number || 'N/A',
                    confirmationCode: reservation.confirmation_code,
                    totalAmount: payment.amount,
                    paymentMethod: payment.payment_method || 'Card',
                    paymentId: paymentIntent.id,
                    reservationId: reservation.id
                  };

                  const emailSent = await notificationService.sendPaymentReceipt(
                    notificationData,
                    ['email']
                  );

                  // Log notification
                  await db.logNotification({
                    guestId: guest.id,
                    type: 'email',
                    templateName: 'paymentReceipt',
                    recipient: guest.email,
                    subject: 'Payment Receipt - Armaflex Hotel',
                    status: emailSent.email ? 'sent' : 'failed',
                    sentAt: emailSent.email ? new Date() : undefined,
                    metadata: { paymentId: paymentIntent.id, reservationId: reservation.id }
                  });
                }
              }
            }
          } catch (notificationError) {
            console.error('Failed to send payment receipt:', notificationError);
          }
          break;

        case "payment_intent.payment_failed":
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          console.log("Payment failed:", failedPayment.id);

          // Update payment status in database
          try {
            const { DatabaseService } = await import('../database/db');
            const db = DatabaseService.getInstance();
            const payment = await db.findPaymentByStripeId(failedPayment.id);
            if (payment) {
              await db.updatePaymentStatus(payment.id, 'failed');
            }
          } catch (error) {
            console.error('Failed to update payment status:', error);
          }
          break;

        case "refund.created":
          const refund = event.data.object as Stripe.Refund;
          console.log("Refund created:", refund.id);

          // Update refund status in database
          try {
            const { DatabaseService } = await import('../database/db');
            const db = DatabaseService.getInstance();
            await db.updateRefundStatus(refund.id, 'succeeded');
          } catch (error) {
            console.error('Failed to update refund status:', error);
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error("Error handling webhook event:", error);
      throw error;
    }
  }

  // Calculate total with tax (example implementation)
  calculateTotal(subtotal: number, taxRate: number = 0.08) {
    const tax = subtotal * taxRate;
    return {
      subtotal,
      tax,
      total: subtotal + tax,
    };
  }

  // Format amount for display
  formatAmount(amount: number, currency: string = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  }
}

export const paymentService = new PaymentService();
