# 📱 M-Pesa API Setup Guide - Step by Step

## 🎯 Prerequisites

- **Safaricom Phone Number**: You need a Safaricom phone number to register
- **Valid ID**: Kenyan ID or Passport for verification
- **Business Registration**: For live environment (optional for sandbox)

## 📋 Step 1: Safaricom Developer Account

### 1.1 Create Account
1. **Visit**: https://developer.safaricom.co.ke
2. **Click**: "Get Started" or "Sign Up"
3. **Fill in**:
   - Full Name
   - Email Address
   - Phone Number (Safaricom)
   - Password
4. **Verify Email** and Phone Number

### 1.2 Complete Profile
1. **Login** to your account
2. **Go to**: Profile Settings
3. **Upload**: Valid ID (Passport/National ID)
4. **Wait** for verification (usually 24-48 hours)

## 🔑 Step 2: Create M-Pesa App

### 2.1 Create New App
1. **Go to**: Dashboard → "Create App"
2. **Fill in**:
   - App Name: `DUCALI Payments`
   - Description: `Payment integration for DUCALI platform`
   - Environment: `Sandbox` (for testing)
3. **Click**: "Create App"

### 2.2 Get Credentials
After app creation, you'll get:
- **Consumer Key**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Consumer Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**⚠️ Save these securely!**

## 🏢 Step 3: Business Short Code

### 3.1 Sandbox Testing
For testing, use Safaricom's test short code:
- **Business Short Code**: `174379` (Sandbox)
- **Passkey**: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`

### 3.2 Live Environment
For production:
1. **Contact Safaricom**: Call 100 or visit a Safaricom shop
2. **Request**: Business Short Code registration
3. **Provide**: Business registration documents
4. **Wait**: 2-4 weeks for approval
5. **Get**: Your unique Business Short Code

## ⚙️ Step 4: Environment Setup

### 4.1 Create .env.local File
```bash
# Copy from env.mpesa.template to .env.local
cp env.mpesa.template .env.local
```

### 4.2 Update Environment Variables
Edit your `.env.local` file:

```bash
# M-Pesa Configuration
MPESA_CONSUMER_KEY="your_actual_consumer_key"
MPESA_CONSUMER_SECRET="your_actual_consumer_secret"
MPESA_BUSINESS_SHORT_CODE="174379"  # Use 174379 for sandbox
MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
MPESA_ENVIRONMENT="sandbox"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🧪 Step 5: Test the Integration

### 5.1 Start Development Server
```bash
npm run dev
```

### 5.2 Test M-Pesa Payment
1. **Visit**: http://localhost:3000/test-mpesa
2. **Login** with your account
3. **Click**: "Pay with M-Pesa"
4. **Enter**: Test phone number (e.g., 0712345678)
5. **Check**: Your phone for STK Push
6. **Enter**: M-Pesa PIN (use test PIN: 1234)

## 🔄 Step 6: Switch to Live Environment

### 6.1 Update Environment Variables
```bash
MPESA_ENVIRONMENT="live"
MPESA_BUSINESS_SHORT_CODE="your_live_shortcode"
MPESA_PASSKEY="your_live_passkey"
```

### 6.2 Update App Environment
1. **Go to**: Safaricom Developer Portal
2. **Select**: Your app
3. **Change**: Environment to "Live"
4. **Get**: Live credentials

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. "Invalid Consumer Key"
- **Cause**: Wrong consumer key
- **Solution**: Check your app credentials in developer portal

#### 2. "Invalid Business Short Code"
- **Cause**: Wrong short code
- **Solution**: Use `174379` for sandbox testing

#### 3. "STK Push Failed"
- **Cause**: Phone number not M-Pesa registered
- **Solution**: Use a real M-Pesa registered number

#### 4. "Access Token Failed"
- **Cause**: Network issues or wrong credentials
- **Solution**: Check internet connection and credentials

#### 5. "Environment Not Configured"
- **Cause**: Missing environment variables
- **Solution**: Check your `.env.local` file

## 📞 Support

### Safaricom Developer Support
- **Email**: developer@safaricom.co.ke
- **Phone**: 100 (Safaricom Customer Care)
- **Documentation**: https://developer.safaricom.co.ke/docs

### DUCALI Support
- **Test URL**: http://localhost:3000/test-mpesa
- **Documentation**: Check `MPESA_SETUP.md`

## ✅ Checklist

- [ ] Safaricom Developer Account created
- [ ] App created and credentials obtained
- [ ] Environment variables configured
- [ ] Sandbox testing completed
- [ ] Live credentials obtained (if needed)
- [ ] Production environment configured

## 🎉 Success!

Once you complete these steps, your M-Pesa integration will be fully functional!

**Test URL**: http://localhost:3000/test-mpesa
