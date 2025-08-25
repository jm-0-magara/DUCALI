# 📱 M-Pesa Payment Setup Guide

## 🎯 Quick M-Pesa Setup

### **Step 1: Environment Variables**

Add these to your `.env.local` file:

```bash
# M-Pesa Configuration (Kenyan Mobile Money)
MPESA_CONSUMER_KEY="your_mpesa_consumer_key"
MPESA_CONSUMER_SECRET="your_mpesa_consumer_secret"
MPESA_BUSINESS_SHORT_CODE="your_business_shortcode"
MPESA_PASSKEY="your_mpesa_passkey"
MPESA_ENVIRONMENT="sandbox" # Use "live" for production
```

### **Step 2: Safaricom Developer Account**

1. **Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke)**
2. **Create an account** and verify your phone number
3. **Create a new app** for your project
4. **Get your credentials**:
   - Consumer Key
   - Consumer Secret
   - Business Short Code (from Safaricom)
   - Passkey (generate in developer portal)

### **Step 3: Test the Integration**

1. **Visit**: `http://localhost:3000/test-mpesa`
2. **Login** with your account
3. **Click "Pay with M-Pesa"**
4. **Enter a test phone number** (e.g., 0712345678)
5. **Check your phone** for the STK Push
6. **Enter your M-Pesa PIN** to complete the test

## 🔧 M-Pesa Features

### **✅ What's Working**
- **STK Push Integration**: Instant payment prompts
- **Phone Number Validation**: Kenyan number format support
- **Real-time Processing**: Live payment status updates
- **Escrow System**: Secure payment holding
- **Transaction Tracking**: Complete payment history
- **Error Handling**: Comprehensive error messages

### **📱 Payment Flow**
```
Customer → Enter Phone → STK Push → Enter PIN → Payment Complete → Escrow → Release
```

## 🧪 Testing

### **Test Phone Numbers**
- **Success**: Any valid Kenyan number (0712345678)
- **Sandbox**: Use test numbers from Safaricom
- **Live**: Real M-Pesa registered numbers

### **Test Amounts**
- **Minimum**: 1 KES
- **Maximum**: 70,000 KES
- **Recommended**: 100-1000 KES for testing

## 🚨 Troubleshooting

### **Common Issues**

#### 1. **"Failed to get M-Pesa access token"**
**Solution**: Check your `MPESA_CONSUMER_KEY` and `MPESA_CONSUMER_SECRET`

#### 2. **"Invalid phone number"**
**Solution**: Use format: 0712345678 or 254712345678

#### 3. **"STK Push failed"**
**Solution**: 
- Check your `MPESA_BUSINESS_SHORT_CODE`
- Verify your `MPESA_PASSKEY`
- Ensure phone number is M-Pesa registered

#### 4. **"Environment not configured"**
**Solution**: Set `MPESA_ENVIRONMENT="sandbox"` for testing

## 📊 M-Pesa Dashboard

### **Payment History**
- View all M-Pesa transactions
- Track payment status
- Monitor escrow releases
- Export transaction data

### **Analytics**
- Payment success rates
- Transaction volumes
- User payment patterns
- Revenue tracking

## 🔒 Security Features

### **M-Pesa Security**
- ✅ Encrypted data transmission
- ✅ Secure PIN entry
- ✅ Transaction verification
- ✅ Fraud detection
- ✅ Escrow protection

### **DUCALI Security**
- ✅ Payment validation
- ✅ Phone number verification
- ✅ Transaction logging
- ✅ Error handling
- ✅ Audit trails

## 🎉 Ready to Use!

### **Next Steps**
1. ✅ Set up environment variables
2. ✅ Configure Safaricom credentials
3. ✅ Test with sandbox environment
4. ✅ Switch to live environment
5. ✅ Start accepting M-Pesa payments!

### **Test URL**
Visit: `http://localhost:3000/test-mpesa`

---

**📱 Your M-Pesa integration is ready! Test thoroughly before going live.**
