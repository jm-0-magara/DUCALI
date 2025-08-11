import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with fallback for development
export const prisma = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017/ducali-dev',
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
  }
}

// Utility functions for common database operations
export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      artisanProfile: {
        include: {
          portfolioItems: true,
          services: true,
        },
      },
    },
  });
}

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      artisanProfile: {
        include: {
          portfolioItems: true,
          services: true,
        },
      },
    },
  });
}

export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: 'CUSTOMER' | 'ARTISAN';
  phone?: string;
  location?: string;
  bio?: string;
}) {
  return await prisma.user.create({
    data: userData,
    include: {
      artisanProfile: true,
    },
  });
}

export async function updateUser(id: string, data: Partial<{
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
}>) {
  return await prisma.user.update({
    where: { id },
    data,
    include: {
      artisanProfile: {
        include: {
          portfolioItems: true,
          services: true,
        },
      },
    },
  });
}

export async function findArtisans(filters?: {
  category?: string;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}) {
  const where: {
    role: 'ARTISAN';
    artisanProfile: { isNot: null } | { category?: string; rating?: { gte: number } };
    location?: { contains: string; mode: 'insensitive' };
  } = {
    role: 'ARTISAN',
    artisanProfile: {
      isNot: null,
    },
  };

  if (filters?.category) {
    where.artisanProfile = {
      ...where.artisanProfile,
      category: filters.category,
    };
  }

  if (filters?.location) {
    where.location = {
      contains: filters.location,
      mode: 'insensitive',
    };
  }

  if (filters?.minRating) {
    where.artisanProfile = {
      ...where.artisanProfile,
      rating: {
        gte: filters.minRating,
      },
    };
  }

  return await prisma.user.findMany({
    where,
    include: {
      artisanProfile: {
        include: {
          portfolioItems: {
            take: 6, // Limit portfolio items for performance
          },
          services: true,
        },
      },
    },
    take: filters?.limit || 20,
    skip: filters?.offset || 0,
    orderBy: {
      artisanProfile: {
        rating: 'desc',
      },
    },
  });
}

export async function findOrders(userId: string, role: 'CUSTOMER' | 'ARTISAN') {
  const where = role === 'CUSTOMER' 
    ? { customerId: userId }
    : { artisanId: userId };

  return await prisma.order.findMany({
    where,
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
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function findMessages(orderId: string) {
  return await prisma.message.findMany({
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
}

export async function createMessage(messageData: {
  orderId?: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType?: 'TEXT' | 'IMAGE' | 'FILE' | 'QUOTE' | 'MILESTONE';
  attachments?: string[];
}) {
  return await prisma.message.create({
    data: messageData,
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
  });
}

export async function createOrder(orderData: {
  customerId: string;
  artisanId: string;
  serviceId?: string;
  title: string;
  description: string;
  category?: string;
  budgetRange?: string;
  timelinePreference?: string;
  specialRequirements?: string;
  attachments?: string[];
}) {
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return await prisma.order.create({
    data: {
      ...orderData,
      orderNumber,
    },
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
}

export async function updateOrderStatus(
  orderId: string, 
  status: 'QUOTE_REQUESTED' | 'QUOTE_SENT' | 'QUOTE_ACCEPTED' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED',
  additionalData?: {
    quotedPrice?: number;
    finalPrice?: number;
    progressPercentage?: number;
    estimatedCompletion?: Date;
    deadline?: Date;
  }
) {
  const updateData: {
    status: 'QUOTE_REQUESTED' | 'QUOTE_SENT' | 'QUOTE_ACCEPTED' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
    acceptedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    quotedPrice?: number;
    finalPrice?: number;
    progressPercentage?: number;
    estimatedCompletion?: Date;
    deadline?: Date;
  } = { status };

  if (status === 'QUOTE_ACCEPTED') {
    updateData.acceptedAt = new Date();
  } else if (status === 'IN_PROGRESS') {
    updateData.startedAt = new Date();
  } else if (status === 'COMPLETED') {
    updateData.completedAt = new Date();
  }

  if (additionalData) {
    Object.assign(updateData, additionalData);
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      artisan: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}
