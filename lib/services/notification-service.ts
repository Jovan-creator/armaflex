import nodemailer from 'nodemailer';
import { supabase } from '../supabase';

export interface NotificationData {
  bookingId: string;
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  serviceType: 'room' | 'dining' | 'event' | 'facility' | 'package';
  serviceName: string;
  serviceDetails: string;
  serviceDate: string;
  totalAmount: number;
  currency: string;
  confirmationCode?: string;
  specialRequests?: string;
  hotelInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
}

export interface NotificationTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
  smsContent?: string;
}

export class NotificationService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient?: any;

  constructor() {
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Initialize Twilio for SMS (if available)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = require('twilio');
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  // Generate booking confirmation template
  private generateBookingConfirmationTemplate(data: NotificationData): NotificationTemplate {
    const subject = `Booking Confirmation - ${data.bookingReference} | ${data.hotelInfo.name}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px 20px; border: 1px solid #e5e7eb; }
          .booking-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .total-amount { background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; color: #166534; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #6b7280; }
          .contact-info { margin: 20px 0; }
          .contact-info a { color: #1e40af; text-decoration: none; }
          .qr-code { text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏨 Booking Confirmed!</h1>
            <p>Thank you for choosing ${data.hotelInfo.name}</p>
          </div>
          
          <div class="content">
            <h2>Dear ${data.guestName},</h2>
            <p>We're delighted to confirm your booking with us. Here are your reservation details:</p>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <div class="detail-row">
                <span><strong>Booking Reference:</strong></span>
                <span>${data.bookingReference}</span>
              </div>
              ${data.confirmationCode ? `
              <div class="detail-row">
                <span><strong>Confirmation Code:</strong></span>
                <span>${data.confirmationCode}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span><strong>Service Type:</strong></span>
                <span>${data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)}</span>
              </div>
              <div class="detail-row">
                <span><strong>Service:</strong></span>
                <span>${data.serviceName}</span>
              </div>
              <div class="detail-row">
                <span><strong>Details:</strong></span>
                <span>${data.serviceDetails}</span>
              </div>
              <div class="detail-row">
                <span><strong>Date/Time:</strong></span>
                <span>${data.serviceDate}</span>
              </div>
              ${data.specialRequests ? `
              <div class="detail-row">
                <span><strong>Special Requests:</strong></span>
                <span>${data.specialRequests}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="total-amount">
              💰 Total Amount: ${new Intl.NumberFormat('en-UG', { style: 'currency', currency: data.currency }).format(data.totalAmount)}
            </div>
            
            <div class="contact-info">
              <h3>📞 Contact Information</h3>
              <p><strong>Hotel:</strong> ${data.hotelInfo.name}</p>
              <p><strong>Address:</strong> ${data.hotelInfo.address}</p>
              <p><strong>Phone:</strong> <a href="tel:${data.hotelInfo.phone}">${data.hotelInfo.phone}</a></p>
              <p><strong>Email:</strong> <a href="mailto:${data.hotelInfo.email}">${data.hotelInfo.email}</a></p>
              ${data.hotelInfo.website ? `<p><strong>Website:</strong> <a href="${data.hotelInfo.website}">${data.hotelInfo.website}</a></p>` : ''}
            </div>
            
            <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h4>📱 Important Information:</h4>
              <ul>
                <li>Please arrive 15 minutes before your scheduled time</li>
                <li>Bring a valid ID for verification</li>
                <li>Contact us immediately if you need to make changes</li>
                <li>Cancellation policy applies as per our terms</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${data.hotelInfo.website || '#'}" class="button">Visit Our Website</a>
            </div>
            
            <p>We look forward to providing you with an exceptional experience!</p>
            <p>Warm regards,<br><strong>The ${data.hotelInfo.name} Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you have any questions, please contact us at ${data.hotelInfo.email} or ${data.hotelInfo.phone}</p>
            <p>&copy; ${new Date().getFullYear()} ${data.hotelInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      BOOKING CONFIRMATION - ${data.hotelInfo.name}
      
      Dear ${data.guestName},
      
      Thank you for your booking! Here are your details:
      
      Booking Reference: ${data.bookingReference}
      ${data.confirmationCode ? `Confirmation Code: ${data.confirmationCode}` : ''}
      Service: ${data.serviceName}
      Details: ${data.serviceDetails}
      Date/Time: ${data.serviceDate}
      Total Amount: ${new Intl.NumberFormat('en-UG', { style: 'currency', currency: data.currency }).format(data.totalAmount)}
      
      Contact Information:
      ${data.hotelInfo.name}
      ${data.hotelInfo.address}
      Phone: ${data.hotelInfo.phone}
      Email: ${data.hotelInfo.email}
      
      Important: Please arrive 15 minutes early and bring valid ID.
      
      We look forward to serving you!
      
      Best regards,
      The ${data.hotelInfo.name} Team
    `;

    const smsContent = `${data.hotelInfo.name}: Booking confirmed! Ref: ${data.bookingReference}. ${data.serviceName} on ${data.serviceDate}. Total: ${new Intl.NumberFormat('en-UG', { style: 'currency', currency: data.currency }).format(data.totalAmount)}. Contact: ${data.hotelInfo.phone}`;

    return { subject, htmlContent, textContent, smsContent };
  }

  // Generate payment confirmation template
  private generatePaymentConfirmationTemplate(data: NotificationData): NotificationTemplate {
    const subject = `Payment Confirmed - ${data.bookingReference} | ${data.hotelInfo.name}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 30px 20px; border: 1px solid #e5e7eb; }
          .payment-details { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #10b981; }
          .amount { text-align: center; font-size: 24px; font-weight: bold; color: #059669; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Confirmed!</h1>
            <p>Your payment has been successfully processed</p>
          </div>
          
          <div class="content">
            <h2>Dear ${data.guestName},</h2>
            <p>We have successfully received your payment for booking ${data.bookingReference}.</p>
            
            <div class="payment-details">
              <h3>💳 Payment Details</h3>
              <p><strong>Booking Reference:</strong> ${data.bookingReference}</p>
              <p><strong>Service:</strong> ${data.serviceName}</p>
              <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
              
              <div class="amount">
                Amount Paid: ${new Intl.NumberFormat('en-UG', { style: 'currency', currency: data.currency }).format(data.totalAmount)}
              </div>
            </div>
            
            <p>Your booking is now fully confirmed. We look forward to serving you!</p>
            
            <p>If you have any questions, please contact us at ${data.hotelInfo.email} or ${data.hotelInfo.phone}</p>
            
            <p>Thank you for choosing ${data.hotelInfo.name}!</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${data.hotelInfo.name}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      PAYMENT CONFIRMATION - ${data.hotelInfo.name}
      
      Dear ${data.guestName},
      
      Payment successfully received for booking ${data.bookingReference}.
      
      Service: ${data.serviceName}
      Amount Paid: ${new Intl.NumberFormat('en-UG', { style: 'currency', currency: data.currency }).format(data.totalAmount)}
      Payment Date: ${new Date().toLocaleDateString()}
      
      Your booking is now fully confirmed.
      
      Contact us: ${data.hotelInfo.phone} | ${data.hotelInfo.email}
      
      Thank you!
      ${data.hotelInfo.name}
    `;

    const smsContent = `${data.hotelInfo.name}: Payment confirmed! ${new Intl.NumberFormat('en-UG', { style: 'currency', currency: data.currency }).format(data.totalAmount)} received for booking ${data.bookingReference}. Thank you!`;

    return { subject, htmlContent, textContent, smsContent };
  }

  // Send email notification
  async sendEmail(to: string, template: NotificationTemplate): Promise<boolean> {
    try {
      const info = await this.emailTransporter.sendMail({
        from: `"${process.env.HOTEL_NAME || 'Armaflex Hotel'}" <${process.env.SMTP_USER}>`,
        to,
        subject: template.subject,
        text: template.textContent,
        html: template.htmlContent,
      });

      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Send SMS notification
  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.twilioClient) {
      console.warn('Twilio not configured, skipping SMS');
      return false;
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to,
      });

      console.log('SMS sent successfully:', result.sid);
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  // Log notification to database
  async logNotification(data: {
    bookingId?: string;
    recipient: string;
    type: 'email' | 'sms';
    templateName: string;
    subject?: string;
    status: 'sent' | 'failed';
    errorMessage?: string;
    metadata?: any;
  }) {
    try {
      const { error } = await supabase
        .from('notification_logs')
        .insert({
          booking_id: data.bookingId,
          recipient: data.recipient,
          type: data.type,
          template_name: data.templateName,
          subject: data.subject,
          status: data.status,
          error_message: data.errorMessage,
          sent_at: data.status === 'sent' ? new Date().toISOString() : null,
          metadata: data.metadata || {}
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to log notification:', error);
    }
  }

  // Send booking confirmation
  async sendBookingConfirmation(data: NotificationData, channels: ('email' | 'sms')[] = ['email']): Promise<{
    email: boolean;
    sms: boolean;
  }> {
    const template = this.generateBookingConfirmationTemplate(data);
    const results = { email: false, sms: false };

    // Send email
    if (channels.includes('email') && data.guestEmail) {
      results.email = await this.sendEmail(data.guestEmail, template);
      
      await this.logNotification({
        bookingId: data.bookingId,
        recipient: data.guestEmail,
        type: 'email',
        templateName: 'booking_confirmation',
        subject: template.subject,
        status: results.email ? 'sent' : 'failed',
        metadata: { bookingReference: data.bookingReference }
      });
    }

    // Send SMS
    if (channels.includes('sms') && data.guestPhone && template.smsContent) {
      results.sms = await this.sendSMS(data.guestPhone, template.smsContent);
      
      await this.logNotification({
        bookingId: data.bookingId,
        recipient: data.guestPhone,
        type: 'sms',
        templateName: 'booking_confirmation',
        status: results.sms ? 'sent' : 'failed',
        metadata: { bookingReference: data.bookingReference }
      });
    }

    return results;
  }

  // Send payment confirmation
  async sendPaymentConfirmation(data: NotificationData, channels: ('email' | 'sms')[] = ['email']): Promise<{
    email: boolean;
    sms: boolean;
  }> {
    const template = this.generatePaymentConfirmationTemplate(data);
    const results = { email: false, sms: false };

    // Send email
    if (channels.includes('email') && data.guestEmail) {
      results.email = await this.sendEmail(data.guestEmail, template);
      
      await this.logNotification({
        bookingId: data.bookingId,
        recipient: data.guestEmail,
        type: 'email',
        templateName: 'payment_confirmation',
        subject: template.subject,
        status: results.email ? 'sent' : 'failed',
        metadata: { bookingReference: data.bookingReference }
      });
    }

    // Send SMS
    if (channels.includes('sms') && data.guestPhone && template.smsContent) {
      results.sms = await this.sendSMS(data.guestPhone, template.smsContent);
      
      await this.logNotification({
        bookingId: data.bookingId,
        recipient: data.guestPhone,
        type: 'sms',
        templateName: 'payment_confirmation',
        status: results.sms ? 'sent' : 'failed',
        metadata: { bookingReference: data.bookingReference }
      });
    }

    return results;
  }

  // Send reminder notification
  async sendReminder(data: NotificationData, reminderType: 'check_in' | 'event' | 'service', channels: ('email' | 'sms')[] = ['email']) {
    // Implementation for reminder notifications
    // This can be extended based on specific reminder needs
    console.log(`Sending ${reminderType} reminder for booking ${data.bookingReference}`);
  }

  // Test email configuration
  async testEmailConfig(): Promise<boolean> {
    try {
      await this.emailTransporter.verify();
      console.log('Email configuration is valid');
      return true;
    } catch (error) {
      console.error('Email configuration error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export helper function to create notification data
export function createNotificationData(
  booking: any,
  guest: any,
  hotelInfo: any
): NotificationData {
  const serviceDetails = getServiceDetails(booking);
  
  return {
    bookingId: booking.id,
    bookingReference: booking.booking_reference,
    guestName: `${guest.first_name} ${guest.last_name}`,
    guestEmail: guest.email,
    guestPhone: guest.phone,
    serviceType: booking.booking_type,
    serviceName: serviceDetails.name,
    serviceDetails: serviceDetails.details,
    serviceDate: serviceDetails.date,
    totalAmount: booking.total_amount,
    currency: booking.currency,
    confirmationCode: booking.confirmation_code,
    specialRequests: booking.special_requests,
    hotelInfo
  };
}

// Helper function to get service details
function getServiceDetails(booking: any) {
  switch (booking.booking_type) {
    case 'room':
      return {
        name: `${booking.rooms?.room_types?.name} - Room ${booking.rooms?.room_number}`,
        details: `${booking.adults} adult(s), ${booking.children} children`,
        date: booking.check_in_date && booking.check_out_date 
          ? `Check-in: ${new Date(booking.check_in_date).toLocaleDateString()} - Check-out: ${new Date(booking.check_out_date).toLocaleDateString()}`
          : 'Dates TBD'
      };
    case 'dining':
      return {
        name: booking.dining_venues?.name || 'Dining Reservation',
        details: `${booking.party_size} guest(s)`,
        date: booking.dining_date && booking.dining_time
          ? `${new Date(booking.dining_date).toLocaleDateString()} at ${booking.dining_time}`
          : 'Date/Time TBD'
      };
    case 'event':
      return {
        name: booking.event_spaces?.name || 'Event Booking',
        details: `${booking.event_type} - ${booking.attendees} attendees`,
        date: booking.event_date && booking.event_start_time
          ? `${new Date(booking.event_date).toLocaleDateString()} at ${booking.event_start_time}`
          : 'Date/Time TBD'
      };
    case 'facility':
      return {
        name: booking.facility_services?.name || 'Facility Service',
        details: 'Service booking',
        date: booking.service_date && booking.service_time
          ? `${new Date(booking.service_date).toLocaleDateString()} at ${booking.service_time}`
          : 'Date/Time TBD'
      };
    default:
      return {
        name: 'Hotel Service',
        details: 'Service booking',
        date: 'TBD'
      };
  }
}
