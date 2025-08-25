import { NextRequest, NextResponse } from 'next/server';
import { quoteService } from '../../../../../lib/quoteService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const quoteId = id;
    const body = await request.json();
    const { quote, currency, message, timeline, terms } = body;

    // Validate required fields
    if (!quote || !currency || !message || !timeline || !terms) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate quote amount
    if (quote <= 0) {
      return NextResponse.json(
        { error: 'Quote amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Get the quote request to verify it exists and is pending
    const quoteRequest = await quoteService.getQuoteRequest(quoteId);
    if (!quoteRequest) {
      return NextResponse.json(
        { error: 'Quote request not found' },
        { status: 404 }
      );
    }

    if (quoteRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Quote request has already been responded to' },
        { status: 400 }
      );
    }

    // Respond to the quote request
    await quoteService.respondToQuoteRequest(quoteId, {
      quote,
      currency,
      message,
      timeline,
      terms
    });

    return NextResponse.json({
      success: true,
      message: 'Quote response submitted successfully'
    });

  } catch (error: any) {
    console.error('Error responding to quote request:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to respond to quote request',
        success: false 
      },
      { status: 500 }
    );
  }
}
