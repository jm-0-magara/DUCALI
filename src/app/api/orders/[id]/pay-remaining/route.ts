// src/app/api/orders/[id]/pay-remaining/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebase';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { customerId, amount, paymentMethod, phoneNumber } = await request.json();
    const orderId = params.id;

    if (!customerId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, amount, paymentMethod' },
        { status: 400 }
      );
    }

    // Get the order
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = orderSnap.data();
    
    // Verify the order belongs to the customer
    if (orderData.customerId !== customerId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Calculate remaining amount
    const totalAmount = orderData.amount || 0;
    const paidAmount = orderData.paidAmount || 0;
    const remainingAmount = totalAmount - paidAmount;

    if (amount > remainingAmount) {
      return NextResponse.json(
        { error: 'Payment amount exceeds remaining balance' },
        { status: 400 }
      );
    }

    // Update the order with the payment
    const newPaidAmount = paidAmount + amount;
    const paymentHistory = orderData.paymentHistory || [];
    
    const paymentRecord = {
      amount: amount,
      method: paymentMethod,
      phoneNumber: phoneNumber || null,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    await updateDoc(orderRef, {
      paidAmount: newPaidAmount,
      paymentHistory: [...paymentHistory, paymentRecord],
      updatedAt: new Date()
    });

    // If the full amount is paid, mark the order as completed
    if (newPaidAmount >= totalAmount) {
      await updateDoc(orderRef, {
        status: 'completed',
        completedAt: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        orderId,
        amount,
        newPaidAmount,
        remainingAmount: totalAmount - newPaidAmount,
        isFullyPaid: newPaidAmount >= totalAmount
      }
    });

  } catch (error) {
    console.error('Error processing remaining payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
