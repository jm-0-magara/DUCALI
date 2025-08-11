import { NextRequest, NextResponse } from 'next/server';
import { createOrder, findOrders, prisma } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const orders = await findOrders(user.id, user.role as 'CUSTOMER' | 'ARTISAN');

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { error: 'Only customers can create orders' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      artisanId,
      serviceId,
      title,
      description,
      category,
      budgetRange,
      timelinePreference,
      specialRequirements,
      attachments,
    } = body;

    // Validate required fields
    if (!artisanId || !title || !description) {
      return NextResponse.json(
        { error: 'Artisan ID, title, and description are required' },
        { status: 400 }
      );
    }

    // Verify artisan exists
    const artisan = await prisma.user.findUnique({
      where: { id: artisanId },
    });

    if (!artisan || artisan.role !== 'ARTISAN') {
      return NextResponse.json(
        { error: 'Invalid artisan ID' },
        { status: 400 }
      );
    }

    // Create order
    const order = await createOrder({
      customerId: user.id,
      artisanId,
      serviceId,
      title,
      description,
      category,
      budgetRange,
      timelinePreference,
      specialRequirements,
      attachments: attachments || [],
    });

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
