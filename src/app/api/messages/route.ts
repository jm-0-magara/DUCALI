import { NextRequest, NextResponse } from 'next/server';
import { createMessage } from '@/lib/database';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        OR: [
          { customerId: user.id },
          { artisanId: user.id },
        ],
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    // Get messages for this order
    const messages = await prisma.message.findMany({
      where: { orderId },
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
    });

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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

    const body = await request.json();
    const {
      orderId,
      receiverId,
      content,
      messageType = 'TEXT',
      attachments = [],
    } = body;

    // Validate required fields
    if (!orderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Order ID, receiver ID, and content are required' },
        { status: 400 }
      );
    }

    // Verify order exists and user has access
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        OR: [
          { customerId: user.id },
          { artisanId: user.id },
        ],
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      );
    }

    // Verify receiver exists and is part of the order
    const receiver = await prisma.user.findFirst({
      where: {
        id: receiverId,
        OR: [
          { id: order.customerId },
          { id: order.artisanId },
        ],
      },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: 'Invalid receiver' },
        { status: 400 }
      );
    }

    // Create message
    const message = await createMessage({
      orderId,
      senderId: user.id,
      receiverId,
      content,
      messageType,
      attachments,
    });

    return NextResponse.json({
      success: true,
      message,
      messageText: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
