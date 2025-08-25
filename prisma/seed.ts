import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.order.deleteMany();
  await prisma.service.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.artisanProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create customers
  const customer1 = await prisma.user.create({
    data: {
      email: 'sarah.wanjiku@example.com',
      password: hashedPassword,
      name: 'Sarah Wanjiku',
      role: 'CUSTOMER',
      phone: '+254700123456',
      location: 'Nairobi, Kenya',
      bio: 'Looking for unique handmade items from local artisans',
      verified: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'michael.odhiambo@example.com',
      password: hashedPassword,
      name: 'Michael Odhiambo',
      role: 'CUSTOMER',
      phone: '+254700123457',
      location: 'Mombasa, Kenya',
      bio: 'Interested in custom jewelry and traditional crafts',
      verified: true,
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      email: 'grace.akinyi@example.com',
      password: hashedPassword,
      name: 'Grace Akinyi',
      role: 'CUSTOMER',
      phone: '+254700123458',
      location: 'Kisumu, Kenya',
      bio: 'Seeking quality handmade furniture and home decor',
      verified: true,
    },
  });

  // Create artisans
  const artisan1 = await prisma.user.create({
    data: {
      email: 'maria.rodriguez@example.com',
      password: hashedPassword,
      name: 'Maria Rodriguez',
      role: 'ARTISAN',
      phone: '+254700123459',
      location: 'Nairobi, Kenya',
      bio: 'Experienced jewelry maker with 10+ years of experience in traditional African designs',
      verified: true,
    },
  });

  const artisan2 = await prisma.user.create({
    data: {
      email: 'david.kimani@example.com',
      password: hashedPassword,
      name: 'David Kimani',
      role: 'ARTISAN',
      phone: '+254700123460',
      location: 'Mombasa, Kenya',
      bio: 'Specialized in leather goods and accessories using traditional techniques',
      verified: true,
    },
  });

  const artisan3 = await prisma.user.create({
    data: {
      email: 'aisha.patel@example.com',
      password: hashedPassword,
      name: 'Aisha Patel',
      role: 'ARTISAN',
      phone: '+254700123461',
      location: 'Nakuru, Kenya',
      bio: 'Textile artist specializing in traditional patterns and modern designs',
      verified: true,
    },
  });

  const artisan4 = await prisma.user.create({
    data: {
      email: 'john.ochieng@example.com',
      password: hashedPassword,
      name: 'John Ochieng',
      role: 'ARTISAN',
      phone: '+254700123462',
      location: 'Kisumu, Kenya',
      bio: 'Master carpenter creating custom furniture with sustainable materials',
      verified: false, // Pending verification
    },
  });

  const artisan5 = await prisma.user.create({
    data: {
      email: 'amina.hassan@example.com',
      password: hashedPassword,
      name: 'Amina Hassan',
      role: 'ARTISAN',
      phone: '+254700123463',
      location: 'Eldoret, Kenya',
      bio: 'Skilled jeweler creating unique pieces using traditional techniques',
      verified: false, // Pending verification
    },
  });

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ducali.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+254700123464',
      location: 'Nairobi, Kenya',
      bio: 'Platform administrator',
      verified: true,
    },
  });

  console.log('👥 Created test users');

  // Create artisan profiles
  const artisanProfile1 = await prisma.artisanProfile.create({
    data: {
      userId: artisan1.id,
      specialty: 'Jewelry Making',
      category: 'Jewelry',
      experienceYears: 12,
      responseTime: 'Within 2 hours',
      startingPrice: 2500.0, // KSH
      rating: 4.8,
      totalOrders: 45,
      completedOrders: 42,
      totalReviews: 38,
      skills: ['Wire Wrapping', 'Beading', 'Metal Working', 'Stone Setting'],
      languages: ['English', 'Swahili', 'Spanish'],
      availabilityStatus: 'available',
      featured: true,
    },
  });

  const artisanProfile2 = await prisma.artisanProfile.create({
    data: {
      userId: artisan2.id,
      specialty: 'Leather Crafting',
      category: 'Leather Goods',
      experienceYears: 8,
      responseTime: 'Within 4 hours',
      startingPrice: 3500.0, // KSH
      rating: 4.6,
      totalOrders: 32,
      completedOrders: 30,
      totalReviews: 28,
      skills: ['Leather Cutting', 'Stitching', 'Tooling', 'Dyeing'],
      languages: ['English', 'Swahili'],
      availabilityStatus: 'available',
      featured: false,
    },
  });

  const artisanProfile3 = await prisma.artisanProfile.create({
    data: {
      userId: artisan3.id,
      specialty: 'Textile Art',
      category: 'Textiles',
      experienceYears: 6,
      responseTime: 'Within 6 hours',
      startingPrice: 1800.0, // KSH
      rating: 4.7,
      totalOrders: 28,
      completedOrders: 26,
      totalReviews: 24,
      skills: ['Weaving', 'Dyeing', 'Embroidery', 'Pattern Making'],
      languages: ['English', 'Swahili', 'Hindi'],
      availabilityStatus: 'available',
      featured: true,
    },
  });

  const artisanProfile4 = await prisma.artisanProfile.create({
    data: {
      userId: artisan4.id,
      specialty: 'Carpentry',
      category: 'Furniture',
      experienceYears: 15,
      responseTime: 'Within 24 hours',
      startingPrice: 8000.0, // KSH
      rating: 0, // No reviews yet
      totalOrders: 0,
      completedOrders: 0,
      totalReviews: 0,
      skills: ['Wood Carving', 'Joinery', 'Finishing', 'Design'],
      languages: ['English', 'Swahili', 'Luo'],
      availabilityStatus: 'available',
      featured: false,
    },
  });

  const artisanProfile5 = await prisma.artisanProfile.create({
    data: {
      userId: artisan5.id,
      specialty: 'Jewelry Design',
      category: 'Jewelry',
      experienceYears: 8,
      responseTime: 'Within 12 hours',
      startingPrice: 3000.0, // KSH
      rating: 0, // No reviews yet
      totalOrders: 0,
      completedOrders: 0,
      totalReviews: 0,
      skills: ['Custom Design', 'Stone Setting', 'Metal Working', 'Engraving'],
      languages: ['English', 'Swahili', 'Arabic'],
      availabilityStatus: 'available',
      featured: false,
    },
  });

  console.log('🎨 Created artisan profiles');

  // Create services
  const service1 = await prisma.service.create({
    data: {
      artisanId: artisanProfile1.id,
      name: 'Custom Wedding Ring',
      description: 'Handcrafted wedding rings with traditional African patterns',
      category: 'Jewelry',
      priceType: 'CUSTOM',
      minPrice: 5000.0, // KSH
      maxPrice: 25000.0, // KSH
      timeframe: '2-3 weeks',
      active: true,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      artisanId: artisanProfile2.id,
      name: 'Leather Wallet',
      description: 'Handmade leather wallets with custom embossing',
      category: 'Leather Goods',
      priceType: 'FIXED',
      minPrice: 2500.0, // KSH
      maxPrice: 2500.0, // KSH
      timeframe: '1 week',
      active: true,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      artisanId: artisanProfile3.id,
      name: 'Traditional Kanga',
      description: 'Handwoven traditional kanga with modern designs',
      category: 'Textiles',
      priceType: 'FIXED',
      minPrice: 1200.0, // KSH
      maxPrice: 1200.0, // KSH
      timeframe: '1-2 weeks',
      active: true,
    },
  });

  console.log('🛠️  Created services');

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      customerId: customer1.id,
      artisanId: artisan1.id,
      serviceId: service1.id,
      title: 'Custom Wedding Ring Set',
      description: 'Traditional African pattern wedding rings for our ceremony',
      category: 'Jewelry',
      quotedPrice: 15000.0, // KSH
      finalPrice: 15000.0, // KSH
      currency: 'KES',
      status: 'COMPLETED',
      priority: 'HIGH',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
      estimatedCompletion: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 2.5 weeks
      budgetRange: '15000-20000 KSH',
      timelinePreference: '2-3 weeks',
      specialRequirements: 'Traditional Luo patterns',
      progressPercentage: 100,
      acceptedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-002',
      customerId: customer2.id,
      artisanId: artisan2.id,
      serviceId: service2.id,
      title: 'Custom Leather Wallet',
      description: 'Leather wallet with my initials embossed',
      category: 'Leather Goods',
      quotedPrice: 3000.0, // KSH
      finalPrice: 3000.0, // KSH
      currency: 'KES',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
      estimatedCompletion: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days
      budgetRange: '2500-3500 KSH',
      timelinePreference: '1 week',
      specialRequirements: 'Initials "MO" embossed',
      progressPercentage: 60,
      acceptedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-003',
      customerId: customer3.id,
      artisanId: artisan3.id,
      serviceId: service3.id,
      title: 'Traditional Kanga Set',
      description: 'Set of 3 traditional kanga for family celebration',
      category: 'Textiles',
      quotedPrice: 3600.0, // KSH
      finalPrice: 3600.0, // KSH
      currency: 'KES',
      status: 'QUOTE_ACCEPTED',
      priority: 'LOW',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
      estimatedCompletion: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 1.5 weeks
      budgetRange: '3000-4000 KSH',
      timelinePreference: '2 weeks',
      specialRequirements: 'Bright colors, traditional patterns',
      progressPercentage: 0,
      acceptedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('📦 Created orders');

  // Create payments
  const payment1 = await prisma.payment.create({
    data: {
      orderId: order1.id,
      customerId: customer1.id,
      artisanId: artisan1.id,
      amount: 15000.0, // KSH
      currency: 'KES',
      paymentMethod: 'MPESA',
      paymentProvider: 'M-Pesa',
      transactionId: 'MPESA-2024-001',
      status: 'COMPLETED',
      paymentType: 'full',
      escrowStatus: 'released',
      releasedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      orderId: order2.id,
      customerId: customer2.id,
      artisanId: artisan2.id,
      amount: 3000.0, // KSH
      currency: 'KES',
      paymentMethod: 'MPESA',
      paymentProvider: 'M-Pesa',
      transactionId: 'MPESA-2024-002',
      status: 'COMPLETED',
      paymentType: 'full',
      escrowStatus: 'held',
    },
  });

  console.log('💰 Created payments');

  // Create reviews
  const review1 = await prisma.review.create({
    data: {
      orderId: order1.id,
      customerId: customer1.id,
      artisanId: artisan1.id,
      rating: 5,
      title: 'Beautiful Traditional Wedding Rings',
      comment: 'Maria created the most beautiful wedding rings with traditional Luo patterns. The craftsmanship is exceptional and the rings are exactly what we wanted for our ceremony.',
      verifiedPurchase: true,
      helpfulCount: 3,
    },
  });

  console.log('⭐ Created reviews');

  // Create messages
  const message1 = await prisma.message.create({
    data: {
      orderId: order1.id,
      senderId: customer1.id,
      receiverId: artisan1.id,
      content: 'Hi Maria, I love the design you sent! Can we add a small diamond to the center?',
      messageType: 'TEXT',
    },
  });

  const message2 = await prisma.message.create({
    data: {
      orderId: order1.id,
      senderId: artisan1.id,
      receiverId: customer1.id,
      content: 'Absolutely! I can add a small diamond to the center. It will add an extra 2000 KSH to the total. Would you like me to proceed?',
      messageType: 'TEXT',
    },
  });

  const message3 = await prisma.message.create({
    data: {
      orderId: order2.id,
      senderId: customer2.id,
      receiverId: artisan2.id,
      content: 'Hi David, how is the wallet coming along?',
      messageType: 'TEXT',
    },
  });

  console.log('💬 Created messages');

  // Create notifications
  const notification1 = await prisma.notification.create({
    data: {
      userId: customer1.id,
      type: 'order_completed',
      title: 'Order Completed',
      content: 'Your order ORD-2024-001 has been completed successfully!',
      data: { orderId: order1.id },
    },
  });

  const notification2 = await prisma.notification.create({
    data: {
      userId: artisan1.id,
      type: 'payment_received',
      title: 'Payment Received',
      content: 'You have received payment of 15,000 KSH for order ORD-2024-001',
      data: { orderId: order1.id, amount: 15000 },
    },
  });

  const notification3 = await prisma.notification.create({
    data: {
      userId: customer2.id,
      type: 'order_update',
      title: 'Order Update',
      content: 'Your order ORD-2024-002 is 60% complete',
      data: { orderId: order2.id, progress: 60 },
    },
  });

  console.log('🔔 Created notifications');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: ${await prisma.user.count()}`);
  console.log(`- Artisan Profiles: ${await prisma.artisanProfile.count()}`);
  console.log(`- Services: ${await prisma.service.count()}`);
  console.log(`- Orders: ${await prisma.order.count()}`);
  console.log(`- Payments: ${await prisma.payment.count()}`);
  console.log(`- Reviews: ${await prisma.review.count()}`);
  console.log(`- Messages: ${await prisma.message.count()}`);
  console.log(`- Notifications: ${await prisma.notification.count()}`);
  
  console.log('\n🔑 Test Accounts:');
  console.log('Admin: admin@ducali.com / password123');
  console.log('Customer: sarah.wanjiku@example.com / password123');
  console.log('Artisan: maria.rodriguez@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
