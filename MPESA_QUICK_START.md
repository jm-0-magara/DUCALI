# 🚀 M-Pesa Quick Start - Test Immediately

## ⚡ Quick Setup (5 Minutes)

### 1. **Create .env.local File**
```bash
# Create .env.local in your project root
touch .env.local
```

### 2. **Add Test Configuration**
Copy this to your `.env.local`:

```bash
# M-Pesa Test Configuration (Sandbox)
MPESA_CONSUMER_KEY="test_consumer_key"
MPESA_CONSUMER_SECRET="test_consumer_secret"
MPESA_BUSINESS_SHORT_CODE="174379"
MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
MPESA_ENVIRONMENT="sandbox"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. **Test the UI (No API Keys Needed)**
1. **Visit**: http://localhost:3000/test-mpesa
2. **Login** with your account
3. **Click**: "Pay with M-Pesa"
4. **See**: The beautiful M-Pesa payment modal

## 🎯 What You Can Test Right Now

### ✅ **UI/UX Testing**
- Payment modal appearance
- Phone number validation
- Form interactions
- Error handling
- Success states

### ✅ **Frontend Integration**
- Component rendering
- State management
- User interactions
- Responsive design

### ❌ **What Won't Work Yet**
- Actual M-Pesa payments
- STK Push
- Real transactions

## 🔑 Next Steps for Real Payments

### 1. **Get Real API Keys**
- Follow the full setup guide in `MPESA_API_SETUP.md`
- Get your Consumer Key and Secret from Safaricom

### 2. **Update Environment Variables**
```bash
# Replace with your real credentials
MPESA_CONSUMER_KEY="your_real_consumer_key"
MPESA_CONSUMER_SECRET="your_real_consumer_secret"
```

### 3. **Test Real Payments**
- Use a real M-Pesa registered phone number
- Receive actual STK Push
- Complete real transactions

## 🧪 Test Phone Numbers

### Sandbox Testing
- **Test Number**: 0712345678
- **Test PIN**: 1234
- **Test Amount**: 1-1000 KES

### Live Testing
- **Real Number**: Your actual M-Pesa number
- **Real PIN**: Your actual M-Pesa PIN
- **Real Amount**: Any amount (1-70,000 KES)

## 🎉 Ready to Test!

**Test URL**: http://localhost:3000/test-mpesa

The UI is fully functional and ready for testing. Once you get your real API keys, you can start processing actual M-Pesa payments!
