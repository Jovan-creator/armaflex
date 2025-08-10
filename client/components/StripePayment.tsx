import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, CreditCard, Lock } from "lucide-react";

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890_test_key');

interface PaymentFormProps {
  amount: number;
  currency: string;
  reservationId: number;
  guestName: string;
  description: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

function PaymentForm({ amount, currency, reservationId, guestName, description, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  // Create payment intent when component mounts
  useEffect(() => {
    createPaymentIntent();
  }, [amount, reservationId]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/hotel/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify({
          amount,
          currency: currency.toLowerCase(),
          reservation_id: reservationId,
          description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.client_secret);
    } catch (err: any) {
      setError(err.message);
      onError(err.message);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: guestName,
          },
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      setError(err.message);
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Payment Details</span>
        </CardTitle>
        <CardDescription>
          Secure payment processing powered by Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Guest:</span>
              <span className="text-sm font-medium">{guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Description:</span>
              <span className="text-sm font-medium">{description}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-lg">{formatCurrency(amount, currency)}</span>
            </div>
          </div>

          {/* Card Input */}
          <div className="space-y-2">
            <Label>Card Information</Label>
            <div className="p-3 border rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || processing || !clientSecret}
          >
            {processing ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              `Pay ${formatCurrency(amount, currency)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface StripePaymentProps {
  amount: number;
  currency?: string;
  reservationId: number;
  guestName: string;
  description: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export default function StripePayment({
  amount,
  currency = 'USD',
  reservationId,
  guestName,
  description,
  onSuccess,
  onError
}: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        currency={currency}
        reservationId={reservationId}
        guestName={guestName}
        description={description}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}

// Payment Success Component
export function PaymentSuccess({ paymentIntentId, amount, currency = 'USD' }: {
  paymentIntentId: string;
  amount: number;
  currency?: string;
}) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground mb-4">
          Your payment of {formatCurrency(amount, currency)} has been processed successfully.
        </p>
        <div className="bg-gray-50 p-3 rounded text-sm">
          <p className="text-muted-foreground">Transaction ID:</p>
          <p className="font-mono text-xs break-all">{paymentIntentId}</p>
        </div>
      </CardContent>
    </Card>
  );
}
