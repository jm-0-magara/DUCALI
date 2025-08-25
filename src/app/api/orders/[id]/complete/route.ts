// src/app/api/orders/[id]/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '../../../../../lib/orderService';
import { notificationService } from '../../../../../lib/notificationService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    const { customerId, action, rating, review } = body; // action: 'approve' | 'reject'

    console.log('📝 Completing order:', { orderId, customerId, action, rating });

    // Validate required fields
    if (!customerId || !action) {
      return NextResponse.json(
        { error: 'Customer ID and action are required' },
        { status: 400 }
      );
    }

    // Get the order first
    const order = await orderService.getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify this order belongs to the current user
    if (order.customerId !== customerId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Verify order is in review status
    if (order.status !== 'review') {
      return NextResponse.json(
        { error: 'Order is not ready for review' },
        { status: 400 }
      );
    }

    let newStatus: 'completed' | 'cancelled';
    let updateData: any = {};

    if (action === 'approve') {
      newStatus = 'completed';
      updateData = {
        status: newStatus,
        completedAt: new Date(),
        rating: rating || null,
        review: review || null,
        updatedAt: new Date(),
      };
    } else if (action === 'reject') {
      newStatus = 'cancelled';
      updateData = {
        status: newStatus,
        updatedAt: new Date(),
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Update the order
    await orderService.updateOrder(orderId, updateData);
    console.log('✅ Order updated:', { orderId, newStatus });

    // Send notifications
    try {
      if (action === 'approve') {
        // Notify artisan that work was approved
        await notificationService.createNotification({
          userId: order.artisanId,
          type: 'order_completed',
          title: 'Order Completed!',
          message: `Your work on "${order.description}" has been approved by the customer.`,
          data: {
            orderId: order.id,
            projectTitle: order.description,
            amount: order.amount,
            currency: order.currency,
            rating: rating || null,
          },
        });

        // Notify customer that order is completed
        await notificationService.createNotification({
          userId: customerId,
          type: 'order_completed',
          title: 'Order Completed!',
          message: `Your order "${order.description}" has been completed successfully.`,
          data: {
            orderId: order.id,
            projectTitle: order.description,
            amount: order.amount,
            currency: order.currency,
          },
        });
      } else {
        // Notify artisan that work was rejected
        await notificationService.createNotification({
          userId: order.artisanId,
          type: 'order_rejected',
          title: 'Order Rejected',
          message: `Your work on "${order.description}" was rejected by the customer.`,
          data: {
            orderId: order.id,
            projectTitle: order.description,
          },
        });
      }

      console.log('✅ Notifications sent successfully');
    } catch (notificationError) {
      console.error('⚠️ Notification error (non-critical):', notificationError);
    }

    return NextResponse.json({
      success: true,
      message: `Order ${action === 'approve' ? 'completed' : 'rejected'} successfully`,
      data: {
        orderId,
        status: newStatus,
        action,
      }
    });

  } catch (error) {
    console.error('❌ Error completing order:', error);
    return NextResponse.json(
      {
        error: 'Failed to complete order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
