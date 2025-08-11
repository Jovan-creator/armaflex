# Deployment Testing Guide

## Quick Test URLs for Your Netlify Site

Visit these URLs to test if the backend is working:

1. **Health Check**: https://armaflexhotel.netlify.app/api/health
   - Should return: `{"status":"OK","timestamp":"...","environment":"..."}`

2. **Ping Test**: https://armaflexhotel.netlify.app/api/ping
   - Should return: `{"message":"ping"}`

## Demo Account Testing

Try logging in with these exact credentials:

| Email | Password |
|-------|----------|
| admin@armaflex.com | admin123 |
| receptionist@armaflex.com | reception123 |
| housekeeping@armaflex.com | cleaning123 |

## If Still Not Working

### Check Netlify Function Logs
1. Go to your Netlify dashboard
2. Click on your site
3. Go to "Functions" tab
4. Click on "api" function
5. Check the logs for errors

### Common Issues & Solutions

1. **"Internal server error"** → Check function logs for database errors
2. **"Invalid credentials"** → Database initialization might have failed
3. **Network error** → API routing might not be working

### Force Redeploy
If needed, trigger a fresh deployment:
1. Go to Netlify dashboard
2. Go to "Deploys" tab
3. Click "Trigger deploy" → "Deploy site"

## Expected Log Messages

In the function logs, you should see:
```
🚀 Initializing Netlify Function...
✅ Express app created successfully
✅ Using in-memory SQLite database for serverless environment
✅ Database initialized successfully
```

If you see database errors, the issue is with SQLite initialization in the serverless environment.
