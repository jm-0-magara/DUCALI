import { prisma } from './database';

export interface NotificationData {
  type: string;
  title: string;
  content?: string;
  data?: any;
  emailSent?: boolean;
  smsSent?: boolean;
  pushSent?: boolean;
}

export async function createNotification(
  userId: string,
  notificationData: NotificationData
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        ...notificationData,
      },
    });

    return { success: true, notification };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

export async function createOrderNotification(
  orderId: string,
  type: 'order_created' | 'quote_sent' | 'quote_accepted' | 'order_started' | 'order_completed' | 'order_cancelled',
  recipientId: string,
  additionalData?: any
) {
  const notificationTemplates = {
    order_created: {
      title: 'New Order Request',
      content: 'You have received a new order request. Please review and respond.',
    },
    quote_sent: {
      title: 'Quote Sent',
      content: 'A quote has been sent for your order. Please review and accept or request changes.',
    },
    quote_accepted: {
      title: 'Quote Accepted',
      content: 'Your quote has been accepted! The order is now in progress.',
    },
    order_started: {
      title: 'Order Started',
      content: 'Work on your order has begun. You will receive updates on the progress.',
    },
    order_completed: {
      title: 'Order Completed',
      content: 'Your order has been completed! Please review and leave feedback.',
    },
    order_cancelled: {
      title: 'Order Cancelled',
      content: 'An order has been cancelled.',
    },
  };

  const template = notificationTemplates[type];
  
  return await createNotification(recipientId, {
    type,
    title: template.title,
    content: template.content,
    data: {
      orderId,
      ...additionalData,
    },
  });
}

export async function createMessageNotification(
  messageId: string,
  senderId: string,
  receiverId: string,
  orderId?: string,
  additionalData?: any
) {
  // Get sender name
  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { name: true },
  });

  return await createNotification(receiverId, {
    type: 'new_message',
    title: 'New Message',
    content: `You have received a new message from ${sender?.name || 'an artisan'}.`,
    data: {
      messageId,
      senderId,
      orderId,
      ...additionalData,
    },
  });
}

export async function createReviewNotification(
  reviewId: string,
  artisanId: string,
  customerId: string,
  orderId: string,
  additionalData?: any
) {
  // Get customer name
  const customer = await prisma.user.findUnique({
    where: { id: customerId },
    select: { name: true },
  });

  return await createNotification(artisanId, {
    type: 'new_review',
    title: 'New Review',
    content: `You have received a new review from ${customer?.name || 'a customer'}.`,
    data: {
      reviewId,
      customerId,
      orderId,
      ...additionalData,
    },
  });
}

export async function createPaymentNotification(
  paymentId: string,
  userId: string,
  type: 'payment_received' | 'payment_failed' | 'payment_refunded',
  additionalData?: any
) {
  const notificationTemplates = {
    payment_received: {
      title: 'Payment Received',
      content: 'Payment has been successfully processed for your order.',
    },
    payment_failed: {
      title: 'Payment Failed',
      content: 'Payment processing failed. Please try again or contact support.',
    },
    payment_refunded: {
      title: 'Payment Refunded',
      content: 'Your payment has been refunded.',
    },
  };

  const template = notificationTemplates[type];

  return await createNotification(userId, {
    type,
    title: template.title,
    content: template.content,
    data: {
      paymentId,
      ...additionalData,
    },
  });
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { success: true, notification };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Failed to mark notifications as read' };
  }
}

export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });

    return { success: true, count };
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return { success: false, error: 'Failed to get unread notification count' };
  }
}

export async function deleteOldNotifications(userId: string, daysOld: number = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await prisma.notification.deleteMany({
      where: {
        userId,
        createdAt: {
          lt: cutoffDate,
        },
        readAt: {
          not: null,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting old notifications:', error);
    return { success: false, error: 'Failed to delete old notifications' };
  }
}
