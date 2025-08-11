import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
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

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const whereConditions: any = {
      userId: user.id,
    };

    if (unreadOnly) {
      whereConditions.readAt = null;
    }

    const notifications = await prisma.notification.findMany({
      where: whereConditions,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.notification.count({
      where: {
        userId: user.id,
      },
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        readAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      notifications,
      pagination: {
        limit,
        offset,
        total: totalCount,
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
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
      type,
      title,
      content,
      data,
      emailSent = false,
      smsSent = false,
      pushSent = false,
    } = body;

    // Validate required fields
    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        type,
        title,
        content,
        data,
        emailSent,
        smsSent,
        pushSent,
      },
    });

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification created successfully',
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationIds, action } = body;

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { error: 'Notification IDs array is required' },
        { status: 400 }
      );
    }

    if (!['mark-read', 'mark-unread', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be mark-read, mark-unread, or delete' },
        { status: 400 }
      );
    }

    let updateData: any = {};
    let operation: 'update' | 'delete' = 'update';

    switch (action) {
      case 'mark-read':
        updateData = { readAt: new Date() };
        break;
      case 'mark-unread':
        updateData = { readAt: null };
        break;
      case 'delete':
        operation = 'delete';
        break;
    }

    if (operation === 'delete') {
      await prisma.notification.deleteMany({
        where: {
          id: { in: notificationIds },
          userId: user.id,
        },
      });
    } else {
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: user.id,
        },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Notifications ${action.replace('-', ' ')} successfully`,
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
