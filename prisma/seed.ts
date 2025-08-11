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
      email: 'customer1@example.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: 'CUSTOMER',
      phone: '+1234567890',
      location: 'New York, NY',
      bio: 'Looking for unique handmade items',
      verified: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      password: hashedPassword,
      name: 'Michael Chen',
      role: 'CUSTOMER',
      phone: '+1234567891',
      location: 'Los Angeles, CA',
      bio: 'Interested in custom jewelry',
      verified: true,
    },
  });

  // Create artisans
  const artisan1 = await prisma.user.create({
    data: {
      email: 'artisan1@example.com',
      password: hashedPassword,
      name: 'Maria Rodriguez',
      role: 'ARTISAN',
      phone: '+1234567892',
      location: 'Miami, FL',
      bio: 'Experienced jewelry maker with 10+ years of experience',
      verified: true,
    },
  });

  const artisan2 = await prisma.user.create({
    data: {
      email: 'artisan2@example.com',
      password: hashedPassword,
      name: 'David Kim',
      role: 'ARTISAN',
      phone: '+1234567893',
      location: 'Seattle, WA',
      bio: 'Specialized in leather goods and accessories',
      verified: true,
    },
  });

  const artisan3 = await prisma.user.create({
    data: {
      email: 'artisan3@example.com',
      password: hashedPassword,
      name: 'Aisha Patel',
      role: 'ARTISAN',
      phone: '+1234567894',
      location: 'Chicago, IL',
      bio: 'Textile artist specializing in traditional patterns',
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
      startingPrice: 50.0,
      rating: 4.8,
      totalOrders: 45,
      completedOrders: 42,
      totalReviews: 38,
      skills: ['Wire Wrapping', 'Beading', 'Metal Working', 'Stone Setting'],
      languages: ['English', 'Spanish'],
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
      startingPrice: 75.0,
      rating: 4.6,
      totalOrders: 32,
      completedOrders: 30,
      totalReviews: 28,
      skills: ['Leather Cutting', 'Stitching', 'Tooling', 'Dyeing'],
      languages: ['English', 'Korean'],
      availabilityStatus: 'available',
      featured: false,
    },
  });

  const artisanProfile3 = await prisma.artisanProfile.create({
    data: {
      userId: artisan3.id,
      specialty: 'Textile Art',
      category: 'Textiles',
      experienceYears: 15,
      responseTime: 'Within 6 hours',
      startingPrice: 100.0,
      rating: 4.9,
      totalOrders: 67,
      completedOrders: 65,
      totalReviews: 61,
      skills: ['Embroidery', 'Weaving', 'Dyeing', 'Pattern Making'],
      languages: ['English', 'Hindi'],
      availabilityStatus: 'available',
      featured: true,
    },
  });

  console.log('🎨 Created artisan profiles');

  // Create portfolio items
  await prisma.portfolioItem.createMany({
    data: [
      {
        artisanId: artisanProfile1.id,
        title: 'Handcrafted Silver Ring',
        description: 'Beautiful sterling silver ring with natural stone',
        category: 'Rings',
        price: 120.0,
        timeframe: '1-2 weeks',
        images: ['/images/portfolio/ring1.jpg', '/images/portfolio/ring2.jpg'],
        tags: ['silver', 'ring', 'stone', 'handmade'],
        featured: true,
        views: 156,
        likes: 23,
      },
      {
        artisanId: artisanProfile1.id,
        title: 'Wire Wrapped Necklace',
        description: 'Elegant wire wrapped pendant with crystal',
        category: 'Necklaces',
        price: 85.0,
        timeframe: '1 week',
        images: ['/images/portfolio/necklace1.jpg'],
        tags: ['wire', 'necklace', 'crystal', 'handmade'],
        featured: false,
        views: 89,
        likes: 12,
      },
      {
        artisanId: artisanProfile2.id,
        title: 'Custom Leather Wallet',
        description: 'Hand-stitched leather wallet with card slots',
        category: 'Wallets',
        price: 95.0,
        timeframe: '2-3 weeks',
        images: ['/images/portfolio/wallet1.jpg', '/images/portfolio/wallet2.jpg'],
        tags: ['leather', 'wallet', 'handmade', 'custom'],
        featured: true,
        views: 203,
        likes: 34,
      },
      {
        artisanId: artisanProfile2.id,
        title: 'Leather Belt',
        description: 'Full-grain leather belt with brass buckle',
        category: 'Belts',
        price: 65.0,
        timeframe: '1-2 weeks',
        images: ['/images/portfolio/belt1.jpg'],
        tags: ['leather', 'belt', 'brass', 'handmade'],
        featured: false,
        views: 67,
        likes: 8,
      },
      {
        artisanId: artisanProfile3.id,
        title: 'Embroidered Wall Hanging',
        description: 'Traditional pattern embroidered on cotton',
        category: 'Wall Art',
        price: 150.0,
        timeframe: '3-4 weeks',
        images: ['/images/portfolio/wallhanging1.jpg', '/images/portfolio/wallhanging2.jpg'],
        tags: ['embroidery', 'wall art', 'traditional', 'handmade'],
        featured: true,
        views: 178,
        likes: 29,
      },
    ],
  });

  console.log('🖼️  Created portfolio items');

  // Create services
  await prisma.service.createMany({
    data: [
      {
        artisanId: artisanProfile1.id,
        name: 'Custom Ring Design',
        description: 'Personalized ring design based on your preferences',
        category: 'Jewelry',
        priceType: 'CUSTOM',
        minPrice: 80.0,
        maxPrice: 300.0,
        timeframe: '2-3 weeks',
        active: true,
      },
      {
        artisanId: artisanProfile1.id,
        name: 'Wire Wrapped Jewelry',
        description: 'Handmade wire wrapped pendants and earrings',
        category: 'Jewelry',
        priceType: 'FIXED',
        minPrice: 45.0,
        maxPrice: 120.0,
        timeframe: '1-2 weeks',
        active: true,
      },
      {
        artisanId: artisanProfile2.id,
        name: 'Custom Leather Goods',
        description: 'Bespoke leather items made to your specifications',
        category: 'Leather Goods',
        priceType: 'CUSTOM',
        minPrice: 50.0,
        maxPrice: 500.0,
        timeframe: '2-4 weeks',
        active: true,
      },
      {
        artisanId: artisanProfile3.id,
        name: 'Textile Art Commission',
        description: 'Custom textile art pieces for your home',
        category: 'Textiles',
        priceType: 'CUSTOM',
        minPrice: 100.0,
        maxPrice: 1000.0,
        timeframe: '4-6 weeks',
        active: true,
      },
    ],
  });

  console.log('🛠️  Created services');

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20241201-001',
      customerId: customer1.id,
      artisanId: artisan1.id,
      title: 'Custom Silver Ring',
      description: 'I would like a custom silver ring with a blue sapphire stone',
      category: 'Jewelry',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      quotedPrice: 150.0,
      finalPrice: 150.0,
      budgetRange: '100-200',
      timelinePreference: '2-3 weeks',
      specialRequirements: 'Size 7, prefer sterling silver',
      progressPercentage: 60,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20241201-002',
      customerId: customer2.id,
      artisanId: artisan2.id,
      title: 'Leather Wallet',
      description: 'Looking for a custom leather wallet with specific card slots',
      category: 'Leather Goods',
      status: 'QUOTE_REQUESTED',
      priority: 'LOW',
      budgetRange: '50-100',
      timelinePreference: '1-2 weeks',
      specialRequirements: 'Need space for 8 cards and cash',
    },
  });

  console.log('📦 Created sample orders');

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        orderId: order1.id,
        senderId: customer1.id,
        receiverId: artisan1.id,
        content: 'Hi! I love your work. Can you tell me more about the ring design process?',
        messageType: 'TEXT',
      },
      {
        orderId: order1.id,
        senderId: artisan1.id,
        receiverId: customer1.id,
        content: 'Thank you! I\'d be happy to walk you through the process. What style are you looking for?',
        messageType: 'TEXT',
      },
      {
        orderId: order1.id,
        senderId: customer1.id,
        receiverId: artisan1.id,
        content: 'I prefer a minimalist design with a vintage feel. Can you show me some examples?',
        messageType: 'TEXT',
      },
    ],
  });

  console.log('💬 Created sample messages');

  // Create sample reviews
  await prisma.review.createMany({
    data: [
      {
        orderId: order1.id,
        customerId: customer1.id,
        artisanId: artisan1.id,
        rating: 5,
        title: 'Beautiful Custom Ring',
        comment: 'Maria created exactly what I was looking for. The quality is exceptional and the communication was great throughout the process.',
        verifiedPurchase: true,
        helpfulCount: 3,
      },
    ],
  });

  console.log('⭐ Created sample reviews');

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
