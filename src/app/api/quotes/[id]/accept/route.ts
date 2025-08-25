import { NextRequest, NextResponse } from 'next/server';
import { quoteService } from '../../../../../lib/quoteService';
import { notificationService } from '../../../../../lib/notificationService';
import { orderService } from '../../../../../lib/orderService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params;
    const body = await request.json();
    const { customerId, paymentId, paymentStatus } = body;

    console.log('📝 Accepting quote:', { quoteId, customerId, paymentId, paymentStatus });

    // Validate required fields
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get the quote first
    const quote = await quoteService.getQuoteRequest(quoteId);
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Accept the quote
    await quoteService.acceptQuote(quoteId, customerId, paymentId);
    console.log('✅ Quote accepted, now creating order...');

    // Create order from accepted quote
    let order;
    try {
      console.log('📦 Creating order from quote:', {
        quoteId: quote.id,
        customerId: quote.customerId,
        artisanId: quote.artisanId,
        projectTitle: quote.projectTitle,
        amount: quote.artisanResponse?.quote || 0,
        currency: quote.artisanResponse?.currency || 'KES'
      });

      order = await orderService.createOrderFromQuote(quote, paymentId);
      
      if (!order) {
        console.error('❌ Failed to create order from quote - order is null');
        return NextResponse.json(
          { error: 'Failed to create order' },
          { status: 500 }
        );
      }

      console.log('✅ Order created successfully:', order.id);
    } catch (orderError) {
      console.error('❌ Error creating order from quote:', orderError);
      return NextResponse.json(
        { 
          error: 'Failed to create order',
          details: orderError instanceof Error ? orderError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Send notifications
    try {
      // Notify artisan that quote was accepted
      await notificationService.sendQuoteAcceptedNotification(
        quote.artisanId,
        {
          quoteId,
          customerName: quote.customerId, // Use customerId as placeholder
          projectTitle: quote.projectTitle,
          amount: quote.artisanResponse?.quote || 0,
          currency: quote.artisanResponse?.currency || 'KES',
          orderId: order.id
        }
      );

      // Notify customer that order was created
      await notificationService.sendOrderCreatedNotification(
        customerId,
        {
          orderId: order.id,
          projectTitle: quote.projectTitle,
          amount: quote.artisanResponse?.quote || 0,
          currency: quote.artisanResponse?.currency || 'KES',
          artisanId: quote.artisanId
        }
      );

      console.log('✅ Notifications sent successfully');
    } catch (notificationError) {
      console.error('⚠️ Notification error (non-critical):', notificationError);
    }

    return NextResponse.json({
      success: true,
      message: 'Quote accepted and order created successfully',
      data: {
        quoteId,
        orderId: order.id,
        status: 'accepted'
      }
    });

  } catch (error) {
    console.error('❌ Error accepting quote:', error);
    return NextResponse.json(
      {
        error: 'Failed to accept quote',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
