# 🔑 DUCALI API Keys Setup Guide

This guide will help you set up all the required API keys and services for the DUCALI platform.

## 📋 Prerequisites

1. Copy `env.example` to `.env.local`
2. Install required dependencies: `npm install zod`
3. Ensure you have a MongoDB database running

## 🚀 Getting Started

### 1. **Core Environment Variables (Required)**

```bash
# Copy the example file
cp env.example .env.local

# Generate secure secrets (run these commands)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add the generated secrets to your `.env.local`:
```bash
JWT_SECRET="your-generated-secret-here"
NEXTAUTH_SECRET="your-generated-secret-here"
```

### 2. **Database Setup**

#### MongoDB (Recommended)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add to `.env.local`:
```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ducali"
```

## 💳 Payment Processing

### **Stripe Setup**
1. Sign up at [Stripe](https://stripe.com)
2. Go to Developers → API Keys
3. Copy your keys:
```bash
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```
4. Set up webhooks:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook`
   - Copy webhook secret:
```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### **M-Pesa Setup (Kenyan Mobile Money)**
1. Sign up at [Safaricom Developer](https://developer.safaricom.co.ke)
2. Create an app and get credentials:
```bash
MPESA_CONSUMER_KEY="your-consumer-key"
MPESA_CONSUMER_SECRET="your-consumer-secret"
MPESA_BUSINESS_SHORT_CODE="your-shortcode"
MPESA_PASSKEY="your-passkey"
MPESA_ENVIRONMENT="sandbox" # or "live"
```

## 📁 File Upload & Storage

### **Cloudinary Setup (Recommended)**
1. Sign up at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard → API Keys
3. Copy your credentials:
```bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### **AWS S3 Setup (Alternative)**
1. Create AWS account
2. Create S3 bucket
3. Create IAM user with S3 access
4. Get credentials:
```bash
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
```

## 🔄 Real-time Features

### **Redis Setup**
1. **Local Development:**
```bash
# Install Redis locally or use Docker
docker run -d -p 6379:6379 redis:alpine
REDIS_URL="redis://localhost:6379"
```

2. **Production:**
   - Use [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/) or [Upstash](https://upstash.com)
   - Get connection string:
```bash
REDIS_URL="redis://username:password@host:port"
```

### **Pusher Setup (Alternative to WebSocket)**
1. Sign up at [Pusher](https://pusher.com)
2. Create a new app
3. Get credentials:
```bash
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="your-cluster"
```

## 🔍 Search & Analytics

### **Algolia Setup**
1. Sign up at [Algolia](https://www.algolia.com)
2. Create a new application
3. Get API keys:
```bash
ALGOLIA_APP_ID="your-app-id"
ALGOLIA_SEARCH_API_KEY="your-search-key"
ALGOLIA_ADMIN_API_KEY="your-admin-key"
```

### **Google Analytics**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property
3. Get your measurement ID:
```bash
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## 📊 Monitoring & Logging

### **Sentry Setup**
1. Sign up at [Sentry](https://sentry.io)
2. Create a new project
3. Get your DSN:
```bash
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
```

### **LogRocket Setup**
1. Sign up at [LogRocket](https://logrocket.com)
2. Create a new project
3. Get your app ID:
```bash
NEXT_PUBLIC_LOGROCKET_APP_ID="your-app-id"
```

## 📧 Email & Notifications

### **SendGrid Setup**
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Verify your sender email
4. Add credentials:
```bash
SENDGRID_API_KEY="SG.your-api-key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

### **Twilio Setup (SMS)**
1. Sign up at [Twilio](https://www.twilio.com)
2. Get your account credentials
3. Buy a phone number
4. Add credentials:
```bash
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

## 🗺️ Maps & Location

### **Google Maps**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Create API key:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
```

## 🧪 Testing Your Setup

1. **Validate Environment:**
```bash
npm run dev
# Should show: "✅ Environment validation passed"
```

2. **Test Database Connection:**
```bash
npx prisma db push
npx prisma generate
```

3. **Test Authentication:**
```bash
# Try to register a new user
# Check if JWT tokens are generated correctly
```

## 🔒 Security Checklist

- [ ] All secrets are at least 32 characters long
- [ ] No secrets are committed to version control
- [ ] `.env.local` is in `.gitignore`
- [ ] Production secrets are different from development
- [ ] API keys have appropriate permissions (principle of least privilege)

## 🚨 Common Issues

### **"JWT_SECRET must be at least 32 characters long"**
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **"DATABASE_URL is required"**
- Ensure MongoDB is running
- Check connection string format
- Verify network access

### **"Environment validation failed"**
- Check that all required variables are set
- Ensure no typos in variable names
- Verify URL formats are correct

## 📞 Support

If you encounter issues:
1. Check the error messages in the console
2. Verify all API keys are correctly copied
3. Ensure services are properly configured
4. Check network connectivity

## 🎯 Next Steps

After setting up your API keys:
1. Run `npm run dev` to start development
2. Test user registration and login
3. Test file upload functionality
4. Test payment processing
5. Deploy to production with proper environment variables
