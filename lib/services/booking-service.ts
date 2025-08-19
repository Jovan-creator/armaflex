import { supabase } from '../supabase';
import { v4 as uuidv4 } from 'uuid';
import { MobileMoneyService, createMobileMoneyService } from '../payments/mobile-money';

export interface BookingRequest {
  serviceType: 'room' | 'dining' | 'event' | 'facility' | 'package';
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city?: string;
    nationality?: string;
  };
  // Room booking specific
  roomId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  children?: number;
  // Dining booking specific
  diningVenueId?: string;
  diningDate?: string;
  diningTime?: string;
  partySize?: number;
  // Event booking specific
  eventSpaceId?: string;
  eventDate?: string;
  eventStartTime?: string;
  eventEndTime?: string;
  eventType?: string;
  attendees?: number;
  // Facility booking specific
  facilityServiceId?: string;
  serviceDate?: string;
  serviceTime?: string;
  // Common fields
  totalAmount: number;
  currency: string;
  specialRequests?: string;
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
  paymentDetails?: {
    phoneNumber?: string;
    cardToken?: string;
  };
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  bookingReference?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  message: string;
  error?: any;
}

export class BookingService {
  private mobileMoneyService?: MobileMoneyService;

  constructor() {
    // Initialize mobile money service if environment variables are available
    const mobileMoneyConfig = {
      MTN_API_KEY: process.env.MTN_API_KEY || '',
      MTN_USER_ID: process.env.MTN_USER_ID || '',
      MTN_SUBSCRIPTION_KEY: process.env.MTN_SUBSCRIPTION_KEY || '',
      MTN_BASE_URL: process.env.MTN_BASE_URL || 'https://sandbox.momodeveloper.mtn.com',
      AIRTEL_CLIENT_ID: process.env.AIRTEL_CLIENT_ID || '',
      AIRTEL_CLIENT_SECRET: process.env.AIRTEL_CLIENT_SECRET || '',
      AIRTEL_BASE_URL: process.env.AIRTEL_BASE_URL || 'https://openapiuat.airtel.africa',
      AIRTEL_PARTNER_ID: process.env.AIRTEL_PARTNER_ID || ''
    };

    if (mobileMoneyConfig.MTN_API_KEY && mobileMoneyConfig.AIRTEL_CLIENT_ID) {
      this.mobileMoneyService = createMobileMoneyService(mobileMoneyConfig);
    }
  }

  // Generate unique booking reference
  private generateBookingReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ARM-${timestamp.slice(-6)}-${random}`;
  }

  // Create or find guest record
  private async createOrFindGuest(guestInfo: BookingRequest['guestInfo']) {
    try {
      // First, try to find existing guest by email
      const { data: existingGuest } = await supabase
        .from('guests')
        .select('*')
        .eq('email', guestInfo.email)
        .single();

      if (existingGuest) {
        // Update guest information if provided
        const { data: updatedGuest, error } = await supabase
          .from('guests')
          .update({
            first_name: guestInfo.firstName,
            last_name: guestInfo.lastName,
            phone: guestInfo.phone,
            country: guestInfo.country,
            city: guestInfo.city,
            nationality: guestInfo.nationality,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingGuest.id)
          .select()
          .single();

        if (error) throw error;
        return updatedGuest;
      } else {
        // Create new guest
        const { data: newGuest, error } = await supabase
          .from('guests')
          .insert({
            first_name: guestInfo.firstName,
            last_name: guestInfo.lastName,
            email: guestInfo.email,
            phone: guestInfo.phone,
            country: guestInfo.country,
            city: guestInfo.city,
            nationality: guestInfo.nationality
          })
          .select()
          .single();

        if (error) throw error;
        return newGuest;
      }
    } catch (error) {
      console.error('Error creating/finding guest:', error);
      throw error;
    }
  }

  // Process payment based on method
  private async processPayment(
    bookingId: string,
    amount: number,
    currency: string,
    paymentMethod: string,
    paymentDetails?: any
  ) {
    try {
      if (paymentMethod === 'mobile_money' && this.mobileMoneyService && paymentDetails?.phoneNumber) {
        const reference = this.generateBookingReference();
        
        const paymentResult = await this.mobileMoneyService.processPayment({
          amount,
          currency,
          phoneNumber: paymentDetails.phoneNumber,
          reference,
          description: `Payment for booking ${bookingId}`
        });

        // Record payment in database
        const { data: payment, error } = await supabase
          .from('payments')
          .insert({
            booking_id: bookingId,
            payment_method: 'mobile_money',
            provider: paymentResult.providerResponse?.provider || 'mobile_money',
            transaction_id: paymentResult.transactionId,
            reference_number: paymentResult.reference,
            amount,
            currency,
            status: paymentResult.success ? 'processing' : 'failed',
            phone_number: paymentDetails.phoneNumber,
            failure_reason: paymentResult.success ? null : paymentResult.message,
            metadata: paymentResult.providerResponse
          })
          .select()
          .single();

        if (error) throw error;

        return {
          success: paymentResult.success,
          status: paymentResult.status,
          message: paymentResult.message,
          paymentId: payment.id
        };
      } else if (paymentMethod === 'card') {
        // Integrate with Stripe here
        // For now, just record a pending payment
        const { data: payment, error } = await supabase
          .from('payments')
          .insert({
            booking_id: bookingId,
            payment_method: 'card',
            provider: 'stripe',
            amount,
            currency,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;

        return {
          success: true,
          status: 'pending',
          message: 'Card payment processing...',
          paymentId: payment.id
        };
      } else if (paymentMethod === 'bank_transfer') {
        // Record bank transfer payment
        const { data: payment, error } = await supabase
          .from('payments')
          .insert({
            booking_id: bookingId,
            payment_method: 'bank_transfer',
            provider: 'bank',
            amount,
            currency,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;

        return {
          success: true,
          status: 'pending',
          message: 'Bank transfer details will be sent to your email',
          paymentId: payment.id
        };
      }

      throw new Error('Unsupported payment method');
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // Main booking creation method
  async createBooking(request: BookingRequest): Promise<BookingResponse> {
    try {
      // 1. Create or find guest
      const guest = await this.createOrFindGuest(request.guestInfo);

      // 2. Generate booking reference
      const bookingReference = this.generateBookingReference();

      // 3. Create booking record
      const bookingData = {
        booking_reference: bookingReference,
        guest_id: guest.id,
        booking_type: request.serviceType,
        room_id: request.roomId,
        check_in_date: request.checkInDate,
        check_out_date: request.checkOutDate,
        adults: request.adults || 1,
        children: request.children || 0,
        dining_venue_id: request.diningVenueId,
        dining_date: request.diningDate,
        dining_time: request.diningTime,
        party_size: request.partySize,
        event_space_id: request.eventSpaceId,
        event_date: request.eventDate,
        event_start_time: request.eventStartTime,
        event_end_time: request.eventEndTime,
        event_type: request.eventType,
        attendees: request.attendees,
        facility_service_id: request.facilityServiceId,
        service_date: request.serviceDate,
        service_time: request.serviceTime,
        total_amount: request.totalAmount,
        currency: request.currency,
        status: 'pending',
        payment_status: 'pending',
        special_requests: request.specialRequests
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 4. Process payment
      const paymentResult = await this.processPayment(
        booking.id,
        request.totalAmount,
        request.currency,
        request.paymentMethod,
        request.paymentDetails
      );

      // 5. Update booking payment status if payment was successful
      if (paymentResult.success && paymentResult.status === 'completed') {
        await supabase
          .from('bookings')
          .update({ 
            payment_status: 'paid',
            status: 'confirmed'
          })
          .eq('id', booking.id);
      }

      // 6. Send confirmation email/SMS (implement notification service)
      // TODO: Implement notification sending

      return {
        success: true,
        bookingId: booking.id,
        bookingReference: booking.booking_reference,
        paymentStatus: paymentResult.status,
        message: `Booking created successfully! Reference: ${booking.booking_reference}. ${paymentResult.message}`
      };

    } catch (error) {
      console.error('Booking creation error:', error);
      return {
        success: false,
        message: 'Failed to create booking. Please try again.',
        error: error.message
      };
    }
  }

  // Get booking by reference
  async getBooking(bookingReference: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          guests(*),
          payments(*),
          rooms(room_number, room_types(name)),
          dining_venues(name),
          event_spaces(name),
          facility_services(name)
        `)
        .eq('booking_reference', bookingReference)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get available rooms for dates
  async getAvailableRooms(checkIn: string, checkOut: string) {
    try {
      const { data, error } = await supabase.rpc('get_available_rooms', {
        checkin_date: checkIn,
        checkout_date: checkOut
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check availability for any resource
  async checkAvailability(
    resourceType: 'room' | 'dining' | 'event_space' | 'facility',
    resourceId: string,
    date: string,
    timeSlot?: string
  ) {
    try {
      let query = supabase
        .from('availability')
        .select('*')
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId)
        .eq('date', date);

      if (timeSlot) {
        query = query.eq('time_slot', timeSlot);
      }

      const { data, error } = await query;
      if (error) throw error;

      const isAvailable = !data || data.length === 0 || data.every(slot => slot.is_available);
      return { success: true, available: isAvailable, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update payment status (webhook handler)
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
      } else if (status === 'failed') {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'pending',
            status: 'pending'
          })
          .eq('id', payment.booking_id);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const bookingService = new BookingService();
