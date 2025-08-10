import nodemailer from 'nodemailer';
import { Twilio } from 'twilio';

export interface NotificationTemplate {
  subject: string;
  text: string;
  html: string;
}

export interface NotificationData {
  recipientEmail?: string;
  recipientPhone?: string;
  guestName?: string;
  roomNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  confirmationCode?: string;
  totalAmount?: number;
  paymentMethod?: string;
  hotelName?: string;
  hotelPhone?: string;
  hotelAddress?: string;
  specialRequests?: string;
  staffName?: string;
  issueDescription?: string;
  emergencyLevel?: 'low' | 'medium' | 'high';
  reservationId?: number;
  paymentId?: string;
}

export interface NotificationConfig {
  email: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
  };
  sms: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  hotel: {
    name: string;
    phone: string;
    address: string;
    website: string;
    email: string;
  };
}

// Notification templates
const templates: Record<string, NotificationTemplate> = {
  bookingConfirmation: {
    subject: 'Booking Confirmation - {{hotelName}}',
    text: `Dear {{guestName}},

Your reservation has been confirmed!

Confirmation Code: {{confirmationCode}}
Room: {{roomNumber}}
Check-in: {{checkInDate}}
Check-out: {{checkOutDate}}
Total Amount: ${{totalAmount}}

Hotel Details:
{{hotelName}}
{{hotelAddress}}
Phone: {{hotelPhone}}

Thank you for choosing us!`,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2c5aa0; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .details { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2c5aa0; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>{{guestName}}</strong>,</p>
      <p>We're excited to confirm your reservation at {{hotelName}}!</p>
      
      <div class="details">
        <h3>Reservation Details</h3>
        <p><strong>Confirmation Code:</strong> {{confirmationCode}}</p>
        <p><strong>Room:</strong> {{roomNumber}}</p>
        <p><strong>Check-in:</strong> {{checkInDate}}</p>
        <p><strong>Check-out:</strong> {{checkOutDate}}</p>
        <p><strong>Total Amount:</strong> ${{totalAmount}}</p>
      </div>

      <div class="details">
        <h3>Hotel Information</h3>
        <p><strong>{{hotelName}}</strong><br>
        {{hotelAddress}}<br>
        Phone: {{hotelPhone}}</p>
      </div>

      <p>We look forward to welcoming you!</p>
    </div>
    <div class="footer">
      <p>Thank you for choosing {{hotelName}}</p>
    </div>
  </div>
</body>
</html>`
  },

  paymentReceipt: {
    subject: 'Payment Receipt - {{hotelName}}',
    text: `Dear {{guestName}},

Payment received successfully!

Payment ID: {{paymentId}}
Amount: ${{totalAmount}}
Method: {{paymentMethod}}
Confirmation: {{confirmationCode}}

Hotel: {{hotelName}}
Phone: {{hotelPhone}}

Thank you!`,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .receipt { background: white; padding: 15px; margin: 10px 0; border: 1px solid #ddd; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Received</h1>
    </div>
    <div class="content">
      <p>Dear <strong>{{guestName}}</strong>,</p>
      <p>Your payment has been successfully processed.</p>
      
      <div class="receipt">
        <h3>Payment Details</h3>
        <p><strong>Payment ID:</strong> {{paymentId}}</p>
        <p><strong>Amount:</strong> ${{totalAmount}}</p>
        <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
        <p><strong>Confirmation Code:</strong> {{confirmationCode}}</p>
      </div>

      <p>Thank you for your payment!</p>
    </div>
    <div class="footer">
      <p>{{hotelName}} - {{hotelPhone}}</p>
    </div>
  </div>
</body>
</html>`
  },

  checkInReminder: {
    subject: 'Check-in Reminder - {{hotelName}}',
    text: `Hi {{guestName}},

Your check-in is today!

Room: {{roomNumber}}
Check-in time: {{checkInDate}}
Confirmation: {{confirmationCode}}

{{hotelName}}
{{hotelAddress}}
{{hotelPhone}}

See you soon!`,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #17a2b8; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .reminder { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #17a2b8; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Check-in Reminder</h1>
    </div>
    <div class="content">
      <p>Hi <strong>{{guestName}}</strong>,</p>
      <p>Just a friendly reminder that your check-in is today!</p>
      
      <div class="reminder">
        <h3>Your Reservation</h3>
        <p><strong>Room:</strong> {{roomNumber}}</p>
        <p><strong>Check-in:</strong> {{checkInDate}}</p>
        <p><strong>Confirmation:</strong> {{confirmationCode}}</p>
      </div>

      <p>We're looking forward to welcoming you to {{hotelName}}!</p>
    </div>
    <div class="footer">
      <p>{{hotelName}} - {{hotelAddress}} - {{hotelPhone}}</p>
    </div>
  </div>
</body>
</html>`
  },

  staffAlert: {
    subject: 'Staff Alert - {{emergencyLevel}} Priority',
    text: `Staff Alert - {{emergencyLevel}} Priority

Issue: {{issueDescription}}
Room: {{roomNumber}}
Guest: {{guestName}}
Reported by: {{staffName}}

Please address immediately.

{{hotelName}}`,
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .alert { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #dc3545; }
    .footer { text-align: center; padding: 20px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Staff Alert - {{emergencyLevel}} Priority</h1>
    </div>
    <div class="content">
      <div class="alert">
        <h3>Alert Details</h3>
        <p><strong>Issue:</strong> {{issueDescription}}</p>
        <p><strong>Room:</strong> {{roomNumber}}</p>
        <p><strong>Guest:</strong> {{guestName}}</p>
        <p><strong>Reported by:</strong> {{staffName}}</p>
      </div>

      <p><strong>Please address this issue immediately.</strong></p>
    </div>
    <div class="footer">
      <p>{{hotelName}} Staff Management System</p>
    </div>
  </div>
</body>
</html>`
  }
};

class NotificationService {
  private emailTransporter: nodemailer.Transporter | null = null;
  private twilioClient: Twilio | null = null;
  private config: NotificationConfig;

  constructor() {
    this.config = {
      email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || ''
        },
        from: process.env.EMAIL_FROM || 'no-reply@hotel.com'
      },
      sms: {
        accountSid: process.env.TWILIO_ACCOUNT_SID || '',
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        fromNumber: process.env.TWILIO_FROM_NUMBER || ''
      },
      hotel: {
        name: process.env.HOTEL_NAME || 'Grand Hotel',
        phone: process.env.HOTEL_PHONE || '+1-555-0123',
        address: process.env.HOTEL_ADDRESS || '123 Hotel Street, City, State 12345',
        website: process.env.HOTEL_WEBSITE || 'https://hotel.com',
        email: process.env.HOTEL_EMAIL || 'info@hotel.com'
      }
    };

    this.initializeEmailService();
    this.initializeSMSService();
  }

  private initializeEmailService(): void {
    if (this.config.email.auth.user && this.config.email.auth.pass) {
      this.emailTransporter = nodemailer.createTransporter({
        host: this.config.email.host,
        port: this.config.email.port,
        secure: this.config.email.secure,
        auth: this.config.email.auth
      });
    }
  }

  private initializeSMSService(): void {
    if (this.config.sms.accountSid && this.config.sms.authToken) {
      this.twilioClient = new Twilio(this.config.sms.accountSid, this.config.sms.authToken);
    }
  }

  private processTemplate(template: string, data: NotificationData): string {
    let processed = template;
    
    // Replace all template variables
    const replacements = {
      ...data,
      hotelName: this.config.hotel.name,
      hotelPhone: this.config.hotel.phone,
      hotelAddress: this.config.hotel.address,
      hotelWebsite: this.config.hotel.website,
      hotelEmail: this.config.hotel.email
    };

    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value || ''));
    });

    return processed;
  }

  async sendEmail(templateName: string, data: NotificationData): Promise<boolean> {
    if (!this.emailTransporter || !data.recipientEmail) {
      console.warn('Email service not configured or recipient email missing');
      return false;
    }

    const template = templates[templateName];
    if (!template) {
      console.error(`Email template '${templateName}' not found`);
      return false;
    }

    try {
      const mailOptions = {
        from: this.config.email.from,
        to: data.recipientEmail,
        subject: this.processTemplate(template.subject, data),
        text: this.processTemplate(template.text, data),
        html: this.processTemplate(template.html, data)
      };

      await this.emailTransporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${data.recipientEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendSMS(templateName: string, data: NotificationData): Promise<boolean> {
    if (!this.twilioClient || !data.recipientPhone) {
      console.warn('SMS service not configured or recipient phone missing');
      return false;
    }

    const template = templates[templateName];
    if (!template) {
      console.error(`SMS template '${templateName}' not found`);
      return false;
    }

    try {
      const message = this.processTemplate(template.text, data);
      
      await this.twilioClient.messages.create({
        body: message,
        from: this.config.sms.fromNumber,
        to: data.recipientPhone
      });

      console.log(`SMS sent successfully to ${data.recipientPhone}`);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  async sendNotification(
    templateName: string, 
    data: NotificationData, 
    channels: ('email' | 'sms')[] = ['email']
  ): Promise<{ email?: boolean; sms?: boolean }> {
    const results: { email?: boolean; sms?: boolean } = {};

    if (channels.includes('email')) {
      results.email = await this.sendEmail(templateName, data);
    }

    if (channels.includes('sms')) {
      results.sms = await this.sendSMS(templateName, data);
    }

    return results;
  }

  // Convenience methods for common notifications
  async sendBookingConfirmation(data: NotificationData, channels: ('email' | 'sms')[] = ['email']): Promise<void> {
    await this.sendNotification('bookingConfirmation', data, channels);
  }

  async sendPaymentReceipt(data: NotificationData, channels: ('email' | 'sms')[] = ['email']): Promise<void> {
    await this.sendNotification('paymentReceipt', data, channels);
  }

  async sendCheckInReminder(data: NotificationData, channels: ('email' | 'sms')[] = ['email', 'sms']): Promise<void> {
    await this.sendNotification('checkInReminder', data, channels);
  }

  async sendStaffAlert(data: NotificationData, channels: ('email' | 'sms')[] = ['email', 'sms']): Promise<void> {
    await this.sendNotification('staffAlert', data, channels);
  }

  // Method to test notification services
  async testServices(): Promise<{ email: boolean; sms: boolean }> {
    const testData: NotificationData = {
      recipientEmail: 'test@example.com',
      recipientPhone: '+1234567890',
      guestName: 'Test User',
      roomNumber: '101',
      confirmationCode: 'TEST123'
    };

    return {
      email: await this.sendEmail('bookingConfirmation', testData),
      sms: await this.sendSMS('bookingConfirmation', testData)
    };
  }
}

export const notificationService = new NotificationService();
export default NotificationService;
