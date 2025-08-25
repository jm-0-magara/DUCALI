import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '../../../lib/paymentService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const userId = searchParams.get('userId');
    const role = searchParams.get('role') as 'customer' | 'artisan';

    if (orderId) {
      const payments = await paymentService.getOrderPayments(orderId);
      return NextResponse.json(payments);
    }

    if (userId && role) {
      const payments = await paymentService.getUserPayments(userId, role);
      return NextResponse.json(payments);
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error retrieving payments:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerId, artisanId, amount, currency, paymentMethod, paymentType, milestoneNumber } = body;

    // Validate required fields
    if (!orderId || !customerId || !artisanId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
    );
    }

    // Create payment record
    const payment = await paymentService.createPayment({
      orderId,
      customerId,
      artisanId,
      amount,
      currency: currency || 'USD',
      paymentMethod,
      paymentType: paymentType || 'full',
      milestoneNumber,
    });

    // If it's a Stripe payment, create payment intent
    if (paymentMethod === 'stripe') {
      const paymentIntent = await paymentService.createStripePaymentIntent(amount, currency);
      
      // Update payment with transaction ID
      await paymentService.updatePaymentStatus(payment.id, 'processing', paymentIntent.id);
      
      return NextResponse.json({
        payment,
        paymentIntent,
      });
    }

    // If it's an M-Pesa payment
    if (paymentMethod === 'mpesa') {
      const mpesaPayment = await paymentService.createMpesaPayment({
        phoneNumber: body.phoneNumber,
        amount,
        orderId,
        customerId,
        artisanId,
      });

      return NextResponse.json({
        payment,
        mpesaPayment,
      });
    }

    return NextResponse.json({ payment });
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payment' },
      { status: 500 }
    );
  }
}
