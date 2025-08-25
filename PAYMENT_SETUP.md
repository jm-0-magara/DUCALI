# 💳 Payment Integration Setup Guide

## 🎯 Overview

DUCALI now includes a comprehensive payment system supporting:
- **Stripe** (Credit/Debit Cards)
- **M-Pesa** (Kenyan Mobile Money)
- **PayPal** (Coming Soon)

## 🚀 Quick Setup

### 1. **Environment Variables**

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# M-Pesa Configuration (Kenyan Mobile Money)
MPESA_CONSUMER_KEY="your_mpesa_consumer_key"
MPESA_CONSUMER_SECRET="your_mpesa_consumer_secret"
MPESA_BUSINESS_SHORT_CODE="your_business_shortcode"
MPESA_PASSKEY="your_mpesa_passkey"
MPESA_ENVIRONMENT="sandbox" # or "live"
```

### 2. **Stripe Setup**

#### Step 1: Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up for a free account
3. Complete account verification

#### Step 2: Get API Keys
1. Go to **Developers → API Keys**
2. Copy your **Publishable Key** and **Secret Key**
3. Add them to your `.env.local`

#### Step 3: Set Up Webhooks
1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Set URL: `https://yourdomain.com/api/payments/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the **Webhook Secret** to your `.env.local`

### 3. **M-Pesa Setup (Kenya)**

#### Step 1: Safaricom Developer Account
1. Go to [Safaricom Developer](https://developer.safaricom.co.ke)
2. Create an account and verify your phone number
3. Create a new app

#### Step 2: Get Credentials
1. Copy your **Consumer Key** and **Consumer Secret**
2. Get your **Business Short Code** from Safaricom
3. Generate your **Passkey**
4. Add all credentials to your `.env.local`

#### Step 3: Test Environment
- Use **sandbox** for testing
- Switch to **live** for production

## 🔧 Payment Features

### **Payment Methods**

#### 1. **Stripe (Credit/Debit Cards)**
- ✅ Secure payment processing
- ✅ Multiple currencies
- ✅ Automatic fraud detection
- ✅ Refund support
- ✅ Webhook integration

#### 2. **M-Pesa (Mobile Money)**
- ✅ STK Push integration
- ✅ Real-time notifications
- ✅ Kenyan market optimized
- ✅ Phone number validation
- ✅ Transaction tracking

### **Payment Flow**

```
Customer → Select Payment Method → Enter Details → Process Payment → Escrow → Release
```

1. **Customer initiates payment**
2. **Payment processed** (Stripe/M-Pesa)
3. **Funds held in escrow**
4. **Order completed**
5. **Payment released to artisan**

### **Escrow System**

- **Security**: Payments held until order completion
- **Protection**: Both customer and artisan protected
- **Transparency**: Clear payment status tracking
- **Automation**: Automatic release on completion

## 📱 Usage Examples

### **Customer Making Payment**

```typescript
import { PaymentModal } from '../components/payments/PaymentModal';

// In your component
const [showPaymentModal, setShowPaymentModal] = useState(false);

const handlePayment = (paymentId: string) => {
  console.log('Payment completed:', paymentId);
  // Redirect to order confirmation
};

<PaymentModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  onSuccess={handlePayment}
  orderId="order_123"
  artisanId="artisan_456"
  amount={5000}
  currency="USD"
/>
```

### **Viewing Payment History**

```typescript
import { PaymentDashboard } from '../components/payments/PaymentDashboard';

// In your dashboard
<PaymentDashboard darkMode={true} />
```

### **API Integration**

#### **Create Payment**
```bash
POST /api/payments
{
  "orderId": "order_123",
  "customerId": "customer_456",
  "artisanId": "artisan_789",
  "amount": 5000,
  "currency": "USD",
  "paymentMethod": "stripe",
  "paymentType": "full"
}
```

#### **Get User Payments**
```bash
GET /api/payments?userId=customer_456&role=customer
```

#### **Get Order Payments**
```bash
GET /api/payments?orderId=order_123
```

## 🛡️ Security Features

### **Payment Security**
- ✅ PCI DSS compliant (Stripe)
- ✅ Encrypted data transmission
- ✅ Webhook signature verification
- ✅ Fraud detection
- ✅ Secure API endpoints

### **Escrow Protection**
- ✅ Funds held securely
- ✅ Automatic release conditions
- ✅ Dispute resolution support
- ✅ Transaction transparency

## 🧪 Testing

### **Stripe Test Cards**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
```

### **M-Pesa Testing**
- Use sandbox environment
- Test with sample phone numbers
- Verify STK Push functionality

## 📊 Payment Analytics

### **Dashboard Features**
- ✅ Payment history
- ✅ Transaction status
- ✅ Revenue tracking
- ✅ Payment method analytics
- ✅ Escrow status monitoring

### **Admin Features**
- ✅ Payment overview
- ✅ Refund management
- ✅ Dispute resolution
- ✅ Financial reporting

## 🚨 Troubleshooting

### **Common Issues**

#### 1. **Stripe Not Configured**
```
Error: Stripe not configured
```
**Solution**: Add `STRIPE_SECRET_KEY` to your environment variables

#### 2. **M-Pesa API Errors**
```
Error: Failed to get M-Pesa access token
```
**Solution**: Verify your M-Pesa credentials and environment

#### 3. **Webhook Failures**
```
Error: Invalid signature
```
**Solution**: Check your webhook secret and endpoint URL

#### 4. **Payment Processing Errors**
```
Error: Payment failed
```
**Solution**: Check payment method configuration and test with valid data

### **Debug Mode**

Enable debug logging:
```bash
NODE_ENV=development
DEBUG=payment:*
```

## 🔄 Webhook Events

### **Stripe Events**
- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

### **M-Pesa Events**
- `STK_PUSH_SUCCESS` - STK Push sent
- `PAYMENT_SUCCESS` - Payment completed
- `PAYMENT_FAILED` - Payment failed

## 📈 Performance Optimization

### **Best Practices**
1. **Use webhooks** for real-time updates
2. **Implement retry logic** for failed payments
3. **Cache payment status** to reduce API calls
4. **Monitor webhook delivery** for reliability
5. **Use proper error handling** for better UX

## 🎉 Next Steps

### **Immediate Actions**
1. ✅ Set up environment variables
2. ✅ Configure Stripe account
3. ✅ Set up M-Pesa (if in Kenya)
4. ✅ Test payment flow
5. ✅ Deploy webhook endpoints

### **Future Enhancements**
- 🔄 PayPal integration
- 🔄 Multi-currency support
- 🔄 Advanced analytics
- 🔄 Automated reconciliation
- 🔄 Mobile app integration

## 📞 Support

### **Documentation**
- [Stripe Documentation](https://stripe.com/docs)
- [M-Pesa API Documentation](https://developer.safaricom.co.ke)
- [DUCALI Payment Guide](./DEVELOPMENT.md)

### **Contact**
- **Technical Issues**: Check logs and error messages
- **Configuration**: Verify environment variables
- **Integration**: Test with sample data first

---

**🎯 Your payment system is now ready! Test thoroughly before going live.**
