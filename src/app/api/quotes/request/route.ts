import { NextRequest, NextResponse } from 'next/server';
import { quoteService } from '../../../../lib/quoteService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      artisanId,
      projectTitle,
      projectDescription,
      projectType,
      budget,
      timeline,
      location,
      urgency,
      attachments,
      additionalRequirements
    } = body;

    // Validate required fields
    if (!customerId || !artisanId || !projectTitle || !projectDescription || !projectType || !budget || !timeline || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate budget
    if (!budget.min || !budget.max || budget.min <= 0 || budget.max <= 0) {
      return NextResponse.json(
        { error: 'Invalid budget range' },
        { status: 400 }
      );
    }

    if (budget.min > budget.max) {
      return NextResponse.json(
        { error: 'Minimum budget cannot be greater than maximum budget' },
        { status: 400 }
      );
    }

    // Create quote request
    const quoteRequest = await quoteService.createQuoteRequest({
      customerId,
      artisanId,
      projectTitle,
      projectDescription,
      projectType,
      budget,
      timeline,
      location,
      urgency: urgency || 'medium',
      attachments: attachments || [],
      additionalRequirements: additionalRequirements || ''
    });

    return NextResponse.json({
      success: true,
      quoteRequest,
      message: 'Quote request created successfully'
    });

  } catch (error: any) {
    console.error('Error creating quote request:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create quote request',
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const artisanId = searchParams.get('artisanId');
    const quoteId = searchParams.get('id');

    if (quoteId) {
      // Get specific quote request
      const quoteRequest = await quoteService.getQuoteRequest(quoteId);
      if (!quoteRequest) {
        return NextResponse.json(
          { error: 'Quote request not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, quoteRequest });
    }

    if (customerId) {
      // Get customer's quote requests
      const quoteRequests = await quoteService.getCustomerQuoteRequests(customerId);
      return NextResponse.json({ success: true, quoteRequests });
    }

    if (artisanId) {
      // Get artisan's quote requests
      const quoteRequests = await quoteService.getArtisanQuoteRequests(artisanId);
      return NextResponse.json({ success: true, quoteRequests });
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Error fetching quote requests:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch quote requests',
        success: false 
      },
      { status: 500 }
    );
  }
}
