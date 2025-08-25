# 💰 Two-Payment System: Initial + Remaining Payments

## 🔄 **Complete Payment Flow**

### **Phase 1: Initial Payment (Quote Acceptance)**
1. **Quote Request** → Customer requests quote from artisan
2. **Quote Response** → Artisan provides quote with price and timeline
3. **Initial Payment** → Customer pays small amount to start work
4. **Order Creation** → System creates order with "accepted" status
5. **Work Begins** → Artisan starts working on the project

### **Phase 2: Work Completion**
6. **Work in Progress** → Artisan works on the project
7. **Order Completion** → Artisan marks order as complete (status: "review")
8. **Customer Review** → Customer reviews completed work

### **Phase 3: Final Payment & Receipt**
9. **Remaining Payment** → Customer pays remaining amount
10. **Order Finalization** → Order status becomes "completed"
11. **Receipt Generation** → Customer gets downloadable receipt

---

## 💳 **Payment Breakdown**

### **Initial Payment**
- **Purpose**: Start the work
- **Amount**: Small portion of total cost (e.g., 20-30%)
- **When**: After quote acceptance
- **Status**: Order becomes "accepted"

### **Remaining Payment**
- **Purpose**: Complete the transaction
- **Amount**: Remaining balance (e.g., 70-80%)
- **When**: After work completion and customer approval
- **Status**: Order becomes "completed"

---

## 📱 **User Interface Flow**

### **Customer Dashboard - Order Details**

#### **For Orders in 'review' status:**
```tsx
{order.status === 'review' && (
  <div className="flex gap-3">
    <button onClick={() => handlePayRemaining()}>
      <DollarSign className="w-4 h-4" />
      Pay Remaining Amount
    </button>
    <button onClick={() => handleApproveOrder()}>
      <CheckCircle className="w-4 h-4" />
      Approve & Complete
    </button>
    <button onClick={() => handleRejectOrder()}>
      <AlertCircle className="w-4 h-4" />
      Reject Work
    </button>
  </div>
)}
```

#### **For Completed Orders:**
```tsx
{order.status === 'completed' && (
  <button onClick={() => handleShowReceipt()}>
    <FileText className="w-4 h-4" />
    View Receipt
  </button>
)}
```

---

## 🧾 **RemainingPaymentModal Features**

### **Payment Summary Display:**
- **Total Amount**: Full project cost
- **Already Paid**: Initial payment amount
- **Remaining Amount**: Difference to be paid
- **Payment Methods**: M-Pesa, Credit Card, PayPal

### **Payment Processing:**
- **M-Pesa Integration**: Mobile money payments
- **Mock Payments**: Development mode simulation
- **Payment Confirmation**: Real-time status checks
- **Error Handling**: Comprehensive error management

### **Security Features:**
- **Amount Validation**: Prevents overpayment
- **Customer Verification**: Ensures payment authorization
- **Payment History**: Complete transaction tracking
- **Status Management**: Proper order state transitions

---

## 🔧 **Technical Implementation**

### **API Endpoints:**
- `POST /api/orders/[id]/pay-remaining` - Process remaining payment
- `POST /api/orders/[id]/complete` - Complete order with approval
- `GET /api/orders/[id]` - Get order details

### **Database Schema:**
```typescript
interface Order {
  id: string;
  amount: number;           // Total order amount
  paidAmount: number;       // Amount paid so far
  paymentHistory: Payment[]; // Complete payment records
  status: 'accepted' | 'in_progress' | 'review' | 'completed';
  // ... other fields
}

interface Payment {
  amount: number;
  method: 'mpesa' | 'stripe' | 'paypal';
  phoneNumber?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}
```

### **Payment Flow Logic:**
```typescript
// Calculate remaining amount
const totalAmount = order.amount || 0;
const paidAmount = order.paidAmount || 0;
const remainingAmount = totalAmount - paidAmount;

// Update order after payment
const newPaidAmount = paidAmount + paymentAmount;
await updateDoc(orderRef, {
  paidAmount: newPaidAmount,
  paymentHistory: [...paymentHistory, paymentRecord],
  status: newPaidAmount >= totalAmount ? 'completed' : 'review'
});
```

---

## 📊 **Order Status Transitions**

```
Quote Requested → Quote Sent → Quote Accepted → In Progress → Review → Completed
     ↓              ↓             ↓              ↓           ↓         ↓
   Customer      Artisan       Customer       Artisan     Customer   Receipt
   Requests      Responds      Pays Initial   Works       Pays       Available
   Quote         with Quote    Amount         on Project  Remaining
```

### **Status Descriptions:**
- **accepted**: Initial payment made, work can begin
- **in_progress**: Artisan is working on the project
- **review**: Work completed, waiting for customer approval/payment
- **completed**: Full payment received, order finalized

---

## 🎯 **Key Benefits**

### **For Customers:**
- **Risk Mitigation**: Pay small amount to start work
- **Quality Assurance**: Review work before final payment
- **Flexibility**: Pay remaining amount after satisfaction
- **Transparency**: Clear payment breakdown and history

### **For Artisans:**
- **Commitment**: Initial payment shows customer commitment
- **Cash Flow**: Receive partial payment to start work
- **Security**: Work is reviewed before final payment
- **Professionalism**: Structured payment system

### **For Platform:**
- **Trust Building**: Two-payment system builds confidence
- **Dispute Resolution**: Clear payment history for disputes
- **Revenue Tracking**: Complete transaction monitoring
- **User Experience**: Professional payment flow

---

## 🔒 **Security & Validation**

### **Payment Validation:**
- Amount cannot exceed remaining balance
- Customer must own the order
- Payment method must be valid
- Order status must allow payments

### **Data Integrity:**
- Payment history is immutable
- Order status transitions are validated
- All transactions are logged
- Receipt generation is auditable

### **Error Handling:**
- Network failures are handled gracefully
- Payment timeouts are managed
- Invalid amounts are rejected
- User-friendly error messages

---

## 📱 **Mobile Responsiveness**

### **Payment Modal:**
- Responsive design for all screen sizes
- Touch-friendly payment method selection
- Clear payment breakdown display
- Easy phone number input for M-Pesa

### **Order Management:**
- Mobile-optimized order details
- Touch-friendly action buttons
- Responsive receipt display
- Easy navigation between states

---

## 🧪 **Testing & Development**

### **Development Mode:**
- Mock M-Pesa payments for testing
- Simulated payment confirmations
- Clear development indicators
- Comprehensive logging

### **Production Mode:**
- Real M-Pesa STK push integration
- Live payment processing
- Production security measures
- Performance monitoring

---

## 🏆 **Summary**

The two-payment system provides:

1. **Initial Payment**: Small amount to start work and show commitment
2. **Work Completion**: Artisan completes work and marks as ready
3. **Customer Review**: Customer reviews work before final payment
4. **Remaining Payment**: Customer pays remaining amount securely
5. **Receipt Generation**: Professional receipt with complete payment history

This creates a balanced, professional marketplace where:
- **Customers** feel secure paying after work completion
- **Artisans** receive partial payment to start work
- **Both parties** have clear expectations and documentation
- **The platform** maintains transparency and trust

The system is fully implemented with professional UI, secure payment processing, and comprehensive receipt generation.
