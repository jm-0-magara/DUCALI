import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        OR: [
          { customerId: user.id },
          { artisanId: user.id },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            phone: true,
          },
        },
        artisan: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            phone: true,
          },
        },
        service: true,
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(request);
    const body = await request.json();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has access to this order
    const existingOrder = await prisma.order.findFirst({
      where: {
        id,
        OR: [
          { customerId: user.id },
          { artisanId: user.id },
        ],
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    // Only artisans can update order status and progress
    if (user.role !== 'ARTISAN' && (body.status || body.progressPercentage)) {
      return NextResponse.json(
        { error: 'Only artisans can update order status and progress' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.status) {
      updateData.status = body.status;
      
      // Set timestamps based on status
      if (body.status === 'QUOTE_ACCEPTED') {
        updateData.acceptedAt = new Date();
      } else if (body.status === 'IN_PROGRESS') {
        updateData.startedAt = new Date();
      } else if (body.status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }
    }

    if (body.quotedPrice !== undefined) updateData.quotedPrice = body.quotedPrice;
    if (body.finalPrice !== undefined) updateData.finalPrice = body.finalPrice;
    if (body.progressPercentage !== undefined) updateData.progressPercentage = body.progressPercentage;
    if (body.estimatedCompletion) updateData.estimatedCompletion = new Date(body.estimatedCompletion);
    if (body.deadline) updateData.deadline = new Date(body.deadline);
    if (body.priority) updateData.priority = body.priority;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        artisan: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        service: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has access to this order
    const existingOrder = await prisma.order.findFirst({
      where: {
        id,
        OR: [
          { customerId: user.id },
          { artisanId: user.id },
        ],
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    // Only customers can cancel orders, and only if they haven't been accepted yet
    if (user.role !== 'CUSTOMER' || existingOrder.customerId !== user.id) {
      return NextResponse.json(
        { error: 'Only customers can cancel their own orders' },
        { status: 403 }
      );
    }

    if (existingOrder.status !== 'QUOTE_REQUESTED' && existingOrder.status !== 'QUOTE_SENT') {
      return NextResponse.json(
        { error: 'Cannot cancel order that has been accepted or is in progress' },
        { status: 400 }
      );
    }

    // Cancel the order
    const cancelledOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
