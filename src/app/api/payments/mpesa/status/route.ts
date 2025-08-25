import { NextRequest, NextResponse } from 'next/server';

// Mock payment status storage (in a real app, this would be in a database)
const mockPaymentStatuses = new Map<string, {
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  checkoutRequestId: string;
}>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutRequestId = searchParams.get('checkoutRequestId');

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: 'Checkout request ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking payment status for:', checkoutRequestId);

    // Check if it's a mock payment
    if (checkoutRequestId.startsWith('mock_')) {
      // For mock payments, simulate confirmation after a delay
      const mockPayment = mockPaymentStatuses.get(checkoutRequestId);
      
      if (!mockPayment) {
        // First time checking this mock payment - create it
        mockPaymentStatuses.set(checkoutRequestId, {
          status: 'pending',
          timestamp: new Date(),
          checkoutRequestId
        });
        
        console.log('🧪 Mock payment created, status: pending');
        return NextResponse.json({
          status: 'pending',
          message: 'Payment is being processed',
          checkoutRequestId
        });
      }

      // Simulate confirmation after 30 seconds (for testing)
      const timeSinceCreation = Date.now() - mockPayment.timestamp.getTime();
      const confirmationDelay = 30000; // 30 seconds

      if (timeSinceCreation > confirmationDelay && mockPayment.status === 'pending') {
        // Update status to confirmed
        mockPaymentStatuses.set(checkoutRequestId, {
          ...mockPayment,
          status: 'confirmed'
        });
        
        console.log('🧪 Mock payment confirmed after delay');
        return NextResponse.json({
          status: 'confirmed',
          message: 'Payment confirmed successfully',
          checkoutRequestId,
          transactionId: `mock_transaction_${Date.now()}`,
          receiptNumber: `mock_receipt_${Date.now()}`
        });
      }

      // Return current status
      console.log(`🧪 Mock payment status: ${mockPayment.status}`);
      return NextResponse.json({
        status: mockPayment.status,
        message: mockPayment.status === 'pending' ? 'Payment is being processed' : 'Payment confirmed',
        checkoutRequestId
      });
    }

    // For real M-Pesa payments (not implemented in mock mode)
    console.log('🚫 Real M-Pesa payment status check not implemented in mock mode');
    return NextResponse.json({
      status: 'pending',
      message: 'Real M-Pesa payment status checking not implemented in mock mode',
      checkoutRequestId
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check payment status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to manually confirm a mock payment (for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkoutRequestId, status } = body;

    if (!checkoutRequestId || !status) {
      return NextResponse.json(
        { error: 'Checkout request ID and status are required' },
        { status: 400 }
      );
    }

    if (!checkoutRequestId.startsWith('mock_')) {
      return NextResponse.json(
        { error: 'Can only manually update mock payments' },
        { status: 400 }
      );
    }

    // Update mock payment status
    const existingPayment = mockPaymentStatuses.get(checkoutRequestId);
    if (existingPayment) {
      mockPaymentStatuses.set(checkoutRequestId, {
        ...existingPayment,
        status: status as 'pending' | 'confirmed' | 'failed'
      });
      
      console.log(`🧪 Mock payment ${checkoutRequestId} manually updated to: ${status}`);
      
      return NextResponse.json({
        success: true,
        message: `Mock payment status updated to ${status}`,
        checkoutRequestId,
        status
      });
    } else {
      return NextResponse.json(
        { error: 'Mock payment not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error updating mock payment status:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update payment status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
