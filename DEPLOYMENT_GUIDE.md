# Deployment Guide

## Issue: Demo Accounts Not Working on Netlify

### Problem

When deployed to Netlify, the demo accounts show "invalid email or password" errors, even though they work correctly in local development.

### Root Cause

The application requires both frontend (React SPA) and backend (Express API with SQLite database) to work together. Netlify deployment needs specific configuration to serve both correctly.

### Solution

1. **Updated Netlify Configuration** (`netlify.toml`):

   - Changed build command from `npm run build:client` to `npm run build` (builds both frontend and backend)
   - Added `functions = "netlify/functions"` to serve the API
   - Added redirect rule to route `/api/*` to `/.netlify/functions/api/:splat`

2. **Database Compatibility**:

   - Updated database path to use `/tmp/` directory in Netlify environment
   - Database is recreated on each function cold start (expected behavior for SQLite in serverless)

3. **Function Configuration**:
   - Enhanced `netlify/functions/api.ts` with proper serverless configuration
   - Added binary file support for better compatibility

### How to Deploy Correctly

1. **Build Commands**:

   ```bash
   npm run build          # Builds both client and server
   npm run build:client   # Builds only frontend (for static hosting)
   npm run build:server   # Builds only backend (for serverless functions)
   ```

2. **Environment Variables** (if needed):

   ```
   JWT_SECRET=your-secret-key
   STRIPE_SECRET_KEY=your-stripe-key (if using payments)
   TWILIO_ACCOUNT_SID=your-twilio-sid (if using SMS)
   ```

3. **Netlify Deployment Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/spa`
   - Functions directory: `netlify/functions`

### Demo Accounts (After Fix)

| Role             | Email                     | Password     |
| ---------------- | ------------------------- | ------------ |
| **Admin**        | admin@armaflex.com        | admin123     |
| **Receptionist** | receptionist@armaflex.com | reception123 |
| **Housekeeping** | housekeeping@armaflex.com | cleaning123  |
| **Maintenance**  | maintenance@armaflex.com  | repair123    |
| **Finance**      | finance@armaflex.com      | finance123   |
| **Restaurant**   | restaurant@armaflex.com   | food123      |
| **IT Support**   | support@armaflex.com      | help123      |

### Testing the Fix

1. **Local Testing**:

   ```bash
   npm run dev
   # Visit http://localhost:8080 and test login with demo accounts
   ```

2. **After Deployment**:
   - Visit your Netlify URL
   - Click "Show Demo Accounts" on login page
   - Click any role to auto-fill credentials
   - Should now successfully log in

### Troubleshooting

If demo accounts still don't work after deployment:

1. **Check Netlify Function Logs**:

   - Go to Netlify Dashboard → Functions → api
   - Look for error messages in the logs

2. **Check Browser Network Tab**:

   - Open Developer Tools → Network
   - Try to login and check if API calls to `/api/hotel/auth/login` return 200 status

3. **Manual Testing**:
   - Try accessing `https://your-site.netlify.app/api/hotel/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

### Database Persistence Note

In serverless environments like Netlify Functions, the SQLite database is recreated on each cold start. This means:

- Demo accounts are always available (recreated automatically)
- Data is not persistent between deployments
- For production use, consider using a persistent database like:
  - Supabase PostgreSQL
  - PlanetScale MySQL
  - MongoDB Atlas
  - or other cloud database solutions

The current SQLite setup is perfect for demo purposes but not recommended for production with real user data.
