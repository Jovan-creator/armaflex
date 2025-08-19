// Mobile Money Payment Integration for Uganda (MTN and Airtel)

interface MobileMoneyConfig {
  mtn: {
    apiKey: string;
    userId: string;
    baseUrl: string;
    subscriptionKey: string;
  };
  airtel: {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    partnerId: string;
  };
}

interface PaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  reference: string;
  description: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  providerResponse?: any;
}

export class MobileMoneyService {
  private config: MobileMoneyConfig;

  constructor(config: MobileMoneyConfig) {
    this.config = config;
  }

  // Determine provider based on phone number
  private getProvider(phoneNumber: string): 'mtn' | 'airtel' | 'unknown' {
    // Remove country code and clean phone number
    const cleanPhone = phoneNumber.replace(/^\+?256/, '').replace(/\s/g, '');
    
    // MTN prefixes in Uganda
    const mtnPrefixes = ['77', '78', '76', '39'];
    // Airtel prefixes in Uganda  
    const airtelPrefixes = ['75', '70', '20'];
    
    const prefix = cleanPhone.substring(0, 2);
    
    if (mtnPrefixes.includes(prefix)) return 'mtn';
    if (airtelPrefixes.includes(prefix)) return 'airtel';
    return 'unknown';
  }

  // Format phone number for each provider
  private formatPhoneNumber(phoneNumber: string, provider: 'mtn' | 'airtel'): string {
    let cleanPhone = phoneNumber.replace(/^\+?256/, '').replace(/\s/g, '');
    
    // Ensure it starts with 0 for local format
    if (!cleanPhone.startsWith('0')) {
      cleanPhone = '0' + cleanPhone;
    }
    
    // For international format
    if (provider === 'mtn') {
      return cleanPhone.replace(/^0/, '256');
    } else {
      return '256' + cleanPhone.replace(/^0/, '');
    }
  }

  // MTN MoMo API integration
  private async processMTNPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(request.phoneNumber, 'mtn');
      
      // Step 1: Get access token
      const tokenResponse = await fetch(`${this.config.mtn.baseUrl}/collection/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.config.mtn.subscriptionKey,
          'Authorization': `Basic ${Buffer.from(`${this.config.mtn.userId}:${this.config.mtn.apiKey}`).toString('base64')}`
        }
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get MTN access token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Step 2: Request payment
      const paymentPayload = {
        amount: request.amount.toString(),
        currency: request.currency,
        externalId: request.reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone
        },
        payerMessage: request.description,
        payeeNote: `Payment for booking ${request.reference}`
      };

      const paymentResponse = await fetch(`${this.config.mtn.baseUrl}/collection/v1_0/requesttopay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Reference-Id': request.reference,
          'X-Target-Environment': 'sandbox', // Change to 'live' for production
          'Ocp-Apim-Subscription-Key': this.config.mtn.subscriptionKey
        },
        body: JSON.stringify(paymentPayload)
      });

      if (paymentResponse.ok) {
        return {
          success: true,
          transactionId: request.reference,
          reference: request.reference,
          status: 'pending',
          message: 'Payment request sent to MTN Mobile Money. Please approve on your phone.',
          providerResponse: { provider: 'MTN' }
        };
      } else {
        const errorData = await paymentResponse.json();
        return {
          success: false,
          status: 'failed',
          message: `MTN payment failed: ${errorData.message || 'Unknown error'}`,
          providerResponse: errorData
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: `MTN payment error: ${error.message}`,
        providerResponse: { error: error.message }
      };
    }
  }

  // Airtel Money API integration
  private async processAirtelPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(request.phoneNumber, 'airtel');

      // Step 1: Get access token
      const tokenPayload = {
        client_id: this.config.airtel.clientId,
        client_secret: this.config.airtel.clientSecret,
        grant_type: 'client_credentials'
      };

      const tokenResponse = await fetch(`${this.config.airtel.baseUrl}/auth/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tokenPayload)
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get Airtel access token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Step 2: Request payment
      const paymentPayload = {
        reference: request.reference,
        subscriber: {
          country: 'UG',
          currency: request.currency,
          msisdn: formattedPhone
        },
        transaction: {
          amount: request.amount,
          country: 'UG',
          currency: request.currency,
          id: request.reference
        }
      };

      const paymentResponse = await fetch(`${this.config.airtel.baseUrl}/merchant/v1/payments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Country': 'UG',
          'X-Currency': request.currency
        },
        body: JSON.stringify(paymentPayload)
      });

      const responseData = await paymentResponse.json();

      if (paymentResponse.ok && responseData.status === 'TXN_SUCCESS') {
        return {
          success: true,
          transactionId: responseData.data?.transaction?.id || request.reference,
          reference: request.reference,
          status: 'pending',
          message: 'Payment request sent to Airtel Money. Please approve on your phone.',
          providerResponse: responseData
        };
      } else {
        return {
          success: false,
          status: 'failed',
          message: `Airtel payment failed: ${responseData.message || 'Unknown error'}`,
          providerResponse: responseData
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: `Airtel payment error: ${error.message}`,
        providerResponse: { error: error.message }
      };
    }
  }

  // Main payment processing method
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const provider = this.getProvider(request.phoneNumber);

    if (provider === 'unknown') {
      return {
        success: false,
        status: 'failed',
        message: 'Unsupported phone number. Please use MTN or Airtel number.'
      };
    }

    if (provider === 'mtn') {
      return this.processMTNPayment(request);
    } else {
      return this.processAirtelPayment(request);
    }
  }

  // Check payment status
  async checkPaymentStatus(transactionId: string, provider: 'mtn' | 'airtel'): Promise<PaymentResponse> {
    try {
      if (provider === 'mtn') {
        // MTN status check
        const tokenResponse = await fetch(`${this.config.mtn.baseUrl}/collection/token/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': this.config.mtn.subscriptionKey,
            'Authorization': `Basic ${Buffer.from(`${this.config.mtn.userId}:${this.config.mtn.apiKey}`).toString('base64')}`
          }
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const statusResponse = await fetch(`${this.config.mtn.baseUrl}/collection/v1_0/requesttopay/${transactionId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Target-Environment': 'sandbox',
            'Ocp-Apim-Subscription-Key': this.config.mtn.subscriptionKey
          }
        });

        const statusData = await statusResponse.json();
        
        return {
          success: statusData.status === 'SUCCESSFUL',
          transactionId,
          status: statusData.status === 'SUCCESSFUL' ? 'completed' : 
                  statusData.status === 'FAILED' ? 'failed' : 'pending',
          message: `Payment ${statusData.status.toLowerCase()}`,
          providerResponse: statusData
        };
      } else {
        // Airtel status check implementation
        // Note: Airtel typically uses webhooks for status updates
        return {
          success: false,
          status: 'pending',
          message: 'Status check pending for Airtel Money',
          transactionId
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: `Status check failed: ${error.message}`,
        transactionId
      };
    }
  }

  // Generate unique reference number
  static generateReference(prefix: string = 'ARM'): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  // Validate phone number format
  static validatePhoneNumber(phoneNumber: string): boolean {
    const cleanPhone = phoneNumber.replace(/^\+?256/, '').replace(/\s/g, '');
    return /^[0-9]{9}$/.test(cleanPhone);
  }
}

// Export configuration interface for environment setup
export interface MobileMoneyEnvConfig {
  MTN_API_KEY: string;
  MTN_USER_ID: string;
  MTN_SUBSCRIPTION_KEY: string;
  MTN_BASE_URL: string;
  AIRTEL_CLIENT_ID: string;
  AIRTEL_CLIENT_SECRET: string;
  AIRTEL_BASE_URL: string;
  AIRTEL_PARTNER_ID: string;
}

// Factory function to create service with environment variables
export function createMobileMoneyService(env: MobileMoneyEnvConfig): MobileMoneyService {
  const config: MobileMoneyConfig = {
    mtn: {
      apiKey: env.MTN_API_KEY,
      userId: env.MTN_USER_ID,
      baseUrl: env.MTN_BASE_URL || 'https://sandbox.momodeveloper.mtn.com',
      subscriptionKey: env.MTN_SUBSCRIPTION_KEY
    },
    airtel: {
      clientId: env.AIRTEL_CLIENT_ID,
      clientSecret: env.AIRTEL_CLIENT_SECRET,
      baseUrl: env.AIRTEL_BASE_URL || 'https://openapiuat.airtel.africa',
      partnerId: env.AIRTEL_PARTNER_ID
    }
  };

  return new MobileMoneyService(config);
}
