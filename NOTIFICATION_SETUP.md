# Email & SMS Notification System Setup Guide

The hotel management system now includes a comprehensive notification system that supports both email and SMS notifications for various hotel operations.

## Features Implemented

### 📧 Email Notifications
- **Booking Confirmations**: Sent automatically when reservations are created
- **Payment Receipts**: Sent when payments are successfully processed  
- **Check-in Reminders**: Scheduled notifications before guest arrival
- **Staff Alerts**: Important notifications for staff members
- **System Updates**: Administrative notifications

### 📱 SMS Notifications  
- **Urgent Alerts**: High-priority notifications
- **Check-in Reminders**: Text reminders for guests
- **Staff Emergencies**: Critical alerts for staff
- **Booking Confirmations**: Optional SMS confirmations

### ⚙️ Notification Management
- **User Preferences**: Individual notification settings per user/guest
- **Quiet Hours**: Suppress non-urgent notifications during specified times
- **Multi-language Support**: Notifications in multiple languages
- **Notification Logs**: Complete audit trail of all sent notifications
- **Test Functionality**: Test email and SMS services

## Configuration Required

### 1. Email Service Setup

#### Gmail SMTP (Recommended for Development)
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"  # Generate app password in Gmail settings
EMAIL_FROM="noreply@armaflex.com"
```

#### Other Email Providers
- **SendGrid**: `EMAIL_HOST="smtp.sendgrid.net"`, Port 587
- **Mailgun**: `EMAIL_HOST="smtp.mailgun.org"`, Port 587  
- **AWS SES**: `EMAIL_HOST="email-smtp.region.amazonaws.com"`, Port 587

### 2. SMS Service Setup (Twilio)

1. **Create Twilio Account**: Sign up at https://www.twilio.com
2. **Get Credentials**: Account SID, Auth Token, and Phone Number
3. **Configure Environment Variables**:

```env
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"  
TWILIO_FROM_NUMBER="+1234567890"
```

### 3. Hotel Information

```env
HOTEL_NAME="Armaflex Hotel"
HOTEL_PHONE="+1-555-ARMAFLEX"
HOTEL_ADDRESS="123 Luxury Avenue, City, State 12345"
HOTEL_WEBSITE="https://armaflex.com"
HOTEL_EMAIL="info@armaflex.com"
```

## Deployment Configuration

### Development (.env)
```env
# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="dev@yourhotel.com"
EMAIL_PASS="your-dev-app-password"
EMAIL_FROM="noreply@yourhotel.com"

# SMS Configuration  
TWILIO_ACCOUNT_SID="your_dev_account_sid"
TWILIO_AUTH_TOKEN="your_dev_auth_token"
TWILIO_FROM_NUMBER="+1234567890"
```

### Production (.env.production)
```env
# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587" 
EMAIL_SECURE="false"
EMAIL_USER="notifications@yourhotel.com"
EMAIL_PASS="your-production-app-password"
EMAIL_FROM="noreply@yourhotel.com"

# SMS Configuration
TWILIO_ACCOUNT_SID="your_production_account_sid"
TWILIO_AUTH_TOKEN="your_production_auth_token"
TWILIO_FROM_NUMBER="+1234567890"
```

### Netlify Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables, add:

```
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = notifications@yourhotel.com
EMAIL_PASS = your-production-app-password
EMAIL_FROM = noreply@yourhotel.com
TWILIO_ACCOUNT_SID = your_production_account_sid
TWILIO_AUTH_TOKEN = your_production_auth_token
TWILIO_FROM_NUMBER = +1234567890
HOTEL_NAME = Your Hotel Name
HOTEL_PHONE = +1-555-0123
HOTEL_ADDRESS = Your Hotel Address
HOTEL_WEBSITE = https://yourhotel.com
HOTEL_EMAIL = info@yourhotel.com
```

## Usage

### For Users
1. **Navigate to Notification Settings**: Use the sidebar menu to access notification preferences
2. **Configure Preferences**: Set email/SMS preferences for different notification types
3. **Test Services**: Use the test buttons to verify email and SMS functionality
4. **Set Quiet Hours**: Configure times when non-urgent notifications are suppressed

### For Developers

#### Send Manual Notifications
```typescript
import { notificationService } from '@/services/notificationService';

// Send booking confirmation
await notificationService.sendBookingConfirmation({
  recipientEmail: 'guest@example.com',
  guestName: 'John Doe',
  roomNumber: '101',
  confirmationCode: 'ARM-123456',
  checkInDate: '2024-01-15',
  checkOutDate: '2024-01-17',
  totalAmount: 299.99
}, ['email', 'sms']);
```

#### Add Custom Notification Templates
1. Add template to `templates` object in `notificationService.ts`
2. Create corresponding method in `NotificationService` class
3. Add API endpoint if needed

#### Log Notifications
```typescript
await db.logNotification({
  userId: user.id,
  type: 'email',
  templateName: 'customTemplate',
  recipient: 'user@example.com',
  status: 'sent',
  sentAt: new Date()
});
```

## Troubleshooting

### Email Issues
- **Authentication Error**: Verify email credentials and app password
- **Connection Timeout**: Check EMAIL_HOST and EMAIL_PORT settings
- **Blocked by Provider**: Some providers block SMTP, use app passwords

### SMS Issues  
- **Invalid Phone Number**: Ensure phone numbers include country code (+1 for US)
- **Account Suspended**: Check Twilio account status and billing
- **Rate Limiting**: Twilio has rate limits for trial accounts

### Common Problems
- **Environment Variables**: Ensure all required variables are set
- **Firewall Issues**: Check if SMTP ports (587/465) are blocked
- **Service Status**: Verify email/SMS service provider status

## Testing

### Email Testing
1. Go to Notification Settings page
2. Enter test email address
3. Click test email button
4. Check inbox and spam folder

### SMS Testing
1. Go to Notification Settings page  
2. Enter test phone number (with country code)
3. Click test SMS button
4. Check for SMS delivery

### Production Testing
- Test with real email addresses and phone numbers
- Verify notification logs in the admin panel
- Check webhook delivery for payment notifications

## API Endpoints

- `GET /api/hotel/notifications/preferences` - Get user notification preferences
- `POST /api/hotel/notifications/preferences` - Save notification preferences
- `POST /api/hotel/notifications/test` - Send test notifications
- `GET /api/hotel/notifications/logs` - Get notification history

## Security Considerations

- **Environment Variables**: Never commit credentials to repository
- **API Keys**: Use environment variables for all sensitive data
- **Rate Limiting**: Implement rate limiting for notification endpoints
- **Validation**: Validate email addresses and phone numbers before sending
- **Logging**: Log all notification attempts for audit purposes

## Future Enhancements

- **Push Notifications**: Web and mobile push notifications
- **WhatsApp Integration**: WhatsApp Business API integration
- **Advanced Scheduling**: Schedule notifications for specific times
- **A/B Testing**: Test different notification templates
- **Analytics**: Detailed notification analytics and reporting
