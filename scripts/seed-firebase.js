#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Firebase configuration - you'll need to update these with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data for Kenyan marketplace
const sampleUsers = [
  {
    name: 'Sarah Wanjiku',
    email: 'sarah.wanjiku@example.com',
    role: 'CUSTOMER',
    phone: '+254700123456',
    location: 'Nairobi, Kenya',
    bio: 'Looking for unique handmade items from local artisans',
    verified: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    lastActive: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000))
  },
  {
    name: 'Michael Odhiambo',
    email: 'michael.odhiambo@example.com',
    role: 'CUSTOMER',
    phone: '+254700123457',
    location: 'Mombasa, Kenya',
    bio: 'Interested in custom jewelry and traditional crafts',
    verified: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)),
    lastActive: Timestamp.fromDate(new Date(Date.now() - 1 * 60 * 60 * 1000))
  },
  {
    name: 'Grace Akinyi',
    email: 'grace.akinyi@example.com',
    role: 'CUSTOMER',
    phone: '+254700123458',
    location: 'Kisumu, Kenya',
    bio: 'Seeking quality handmade furniture and home decor',
    verified: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
    lastActive: Timestamp.fromDate(new Date(Date.now() - 3 * 60 * 60 * 1000))
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    role: 'ARTISAN',
    phone: '+254700123459',
    location: 'Nairobi, Kenya',
    bio: 'Experienced jewelry maker with 10+ years of experience in traditional African designs',
    verified: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)),
    lastActive: Timestamp.fromDate(new Date(Date.now() - 1 * 60 * 60 * 1000)),
    artisanProfile: {
      specialty: 'Jewelry Making',
      category: 'Jewelry',
      experienceYears: 12,
      responseTime: 'Within 2 hours',
      startingPrice: 2500.0,
      rating: 4.8,
      totalOrders: 45,
      completedOrders: 42,
      totalReviews: 38,
      skills: ['Wire Wrapping', 'Beading', 'Metal Working', 'Stone Setting'],
      languages: ['English', 'Swahili', 'Spanish'],
      availabilityStatus: 'available',
      featured: true
    }
  },
  {
    name: 'David Kimani',
    email: 'david.kimani@example.com',
    role: 'ARTISAN',
    phone: '+254700123460',
    location: 'Mombasa, Kenya',
    bio: 'Specialized in leather goods and accessories using traditional techniques',
    verified: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)),
    lastActive: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
    artisanProfile: {
      specialty: 'Leather Crafting',
      category: 'Leather Goods',
      experienceYears: 8,
      responseTime: 'Within 4 hours',
      startingPrice: 3500.0,
      rating: 4.6,
      totalOrders: 32,
      completedOrders: 30,
      totalReviews: 28,
      skills: ['Leather Cutting', 'Stitching', 'Tooling', 'Dyeing'],
      languages: ['English', 'Swahili'],
      availabilityStatus: 'available',
      featured: false
    }
  },
  {
    name: 'Aisha Patel',
    email: 'aisha.patel@example.com',
    role: 'ARTISAN',
    phone: '+254700123461',
    location: 'Nakuru, Kenya',
    bio: 'Textile artist specializing in traditional patterns and modern designs',
    verified: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)),
    lastActive: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)),
    artisanProfile: {
      specialty: 'Textile Art',
      category: 'Textiles',
      experienceYears: 6,
      responseTime: 'Within 6 hours',
      startingPrice: 1800.0,
      rating: 4.7,
      totalOrders: 28,
      completedOrders: 26,
      totalReviews: 24,
      skills: ['Weaving', 'Dyeing', 'Embroidery', 'Pattern Making'],
      languages: ['English', 'Swahili', 'Hindi'],
      availabilityStatus: 'available',
      featured: true
    }
  },
  {
    name: 'John Ochieng',
    email: 'john.ochieng@example.com',
    role: 'ARTISAN',
    phone: '+254700123462',
    location: 'Kisumu, Kenya',
    bio: 'Master carpenter creating custom furniture with sustainable materials',
    verified: false, // Pending verification
    createdAt: Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)),
    lastActive: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    artisanProfile: {
      specialty: 'Carpentry',
      category: 'Furniture',
      experienceYears: 15,
      responseTime: 'Within 24 hours',
      startingPrice: 8000.0,
      rating: 0,
      totalOrders: 0,
      completedOrders: 0,
      totalReviews: 0,
      skills: ['Wood Carving', 'Joinery', 'Finishing', 'Design'],
      languages: ['English', 'Swahili', 'Luo'],
      availabilityStatus: 'available',
      featured: false
    }
  },
  {
    name: 'Amina Hassan',
    email: 'amina.hassan@example.com',
    role: 'ARTISAN',
    phone: '+254700123463',
    location: 'Eldoret, Kenya',
    bio: 'Skilled jeweler creating unique pieces using traditional techniques',
    verified: false, // Pending verification
    createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    lastActive: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    artisanProfile: {
      specialty: 'Jewelry Design',
      category: 'Jewelry',
      experienceYears: 8,
      responseTime: 'Within 12 hours',
      startingPrice: 3000.0,
      rating: 0,
      totalOrders: 0,
      completedOrders: 0,
      totalReviews: 0,
      skills: ['Custom Design', 'Stone Setting', 'Metal Working', 'Engraving'],
      languages: ['English', 'Swahili', 'Arabic'],
      availabilityStatus: 'available',
      featured: false
    }
  },
  {
    name: 'Admin User',
    email: 'admin@ducali.com',
    role: 'ADMIN',
    phone: '+254700123464',
    location: 'Nairobi, Kenya',
    bio: 'Platform administrator',
    verified: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
    lastActive: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000))
  }
];

const sampleOrders = [
  {
    orderNumber: 'ORD-2024-001',
    customerId: 'customer1', // Will be replaced with actual user ID
    artisanId: 'artisan1', // Will be replaced with actual user ID
    title: 'Custom Wedding Ring Set',
    description: 'Traditional African pattern wedding rings for our ceremony',
    category: 'Jewelry',
    quotedPrice: 15000.0,
    finalPrice: 15000.0,
    currency: 'KES',
    status: 'COMPLETED',
    priority: 'HIGH',
    deadline: Timestamp.fromDate(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)),
    estimatedCompletion: Timestamp.fromDate(new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)),
    budgetRange: '15000-20000 KSH',
    timelinePreference: '2-3 weeks',
    specialRequirements: 'Traditional Luo patterns',
    progressPercentage: 100,
    acceptedAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
    startedAt: Timestamp.fromDate(new Date(Date.now() - 19 * 24 * 60 * 60 * 1000)),
    completedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    createdAt: Timestamp.fromDate(new Date(Date.now() - 22 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
  },
  {
    orderNumber: 'ORD-2024-002',
    customerId: 'customer2',
    artisanId: 'artisan2',
    title: 'Custom Leather Wallet',
    description: 'Leather wallet with my initials embossed',
    category: 'Leather Goods',
    quotedPrice: 3000.0,
    finalPrice: 3000.0,
    currency: 'KES',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    deadline: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    estimatedCompletion: Timestamp.fromDate(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)),
    budgetRange: '2500-3500 KSH',
    timelinePreference: '1 week',
    specialRequirements: 'Initials "MO" embossed',
    progressPercentage: 60,
    acceptedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    startedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
  },
  {
    orderNumber: 'ORD-2024-003',
    customerId: 'customer3',
    artisanId: 'artisan3',
    title: 'Traditional Kanga Set',
    description: 'Set of 3 traditional kanga for family celebration',
    category: 'Textiles',
    quotedPrice: 3600.0,
    finalPrice: 3600.0,
    currency: 'KES',
    status: 'QUOTE_ACCEPTED',
    priority: 'LOW',
    deadline: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
    estimatedCompletion: Timestamp.fromDate(new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)),
    budgetRange: '3000-4000 KSH',
    timelinePreference: '2 weeks',
    specialRequirements: 'Bright colors, traditional patterns',
    progressPercentage: 0,
    acceptedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  }
];

const samplePortfolioItems = [
  {
    artisanId: 'artisan1',
    title: 'Traditional Wedding Ring',
    description: 'Handcrafted wedding ring with traditional African patterns',
    category: 'Jewelry',
    price: 15000.0,
    timeframe: '2-3 weeks',
    images: ['/images/portfolio/ring1.jpg', '/images/portfolio/ring2.jpg'],
    tags: ['wedding', 'traditional', 'african', 'handmade'],
    featured: true,
    views: 156,
    likes: 23,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
  },
  {
    artisanId: 'artisan2',
    title: 'Custom Leather Wallet',
    description: 'Handmade leather wallet with custom embossing',
    category: 'Leather Goods',
    price: 3000.0,
    timeframe: '1 week',
    images: ['/images/portfolio/wallet1.jpg', '/images/portfolio/wallet2.jpg'],
    tags: ['leather', 'wallet', 'custom', 'handmade'],
    featured: true,
    views: 203,
    likes: 34,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  },
  {
    artisanId: 'artisan3',
    title: 'Traditional Kanga',
    description: 'Handwoven traditional kanga with modern designs',
    category: 'Textiles',
    price: 1200.0,
    timeframe: '1-2 weeks',
    images: ['/images/portfolio/kanga1.jpg', '/images/portfolio/kanga2.jpg'],
    tags: ['kanga', 'traditional', 'handwoven', 'textile'],
    featured: false,
    views: 89,
    likes: 12,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  }
];

const sampleReviews = [
  {
    orderId: 'order1',
    customerId: 'customer1',
    artisanId: 'artisan1',
    rating: 5,
    title: 'Beautiful Traditional Wedding Rings',
    comment: 'Maria created the most beautiful wedding rings with traditional Luo patterns. The craftsmanship is exceptional and the rings are exactly what we wanted for our ceremony.',
    verifiedPurchase: true,
    helpfulCount: 3,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  }
];

const sampleMessages = [
  {
    orderId: 'order1',
    senderId: 'customer1',
    receiverId: 'artisan1',
    content: 'Hi Maria, I love the design you sent! Can we add a small diamond to the center?',
    messageType: 'TEXT',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000))
  },
  {
    orderId: 'order1',
    senderId: 'artisan1',
    receiverId: 'customer1',
    content: 'Absolutely! I can add a small diamond to the center. It will add an extra 2000 KSH to the total. Would you like me to proceed?',
    messageType: 'TEXT',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 19 * 24 * 60 * 60 * 1000))
  },
  {
    orderId: 'order2',
    senderId: 'customer2',
    receiverId: 'artisan2',
    content: 'Hi David, how is the wallet coming along?',
    messageType: 'TEXT',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
  }
];

const sampleNotifications = [
  {
    userId: 'customer1',
    type: 'order_completed',
    title: 'Order Completed',
    content: 'Your order ORD-2024-001 has been completed successfully!',
    data: { orderId: 'order1' },
    emailSent: false,
    smsSent: false,
    pushSent: false,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  },
  {
    userId: 'artisan1',
    type: 'payment_received',
    title: 'Payment Received',
    content: 'You have received payment of 15,000 KSH for order ORD-2024-001',
    data: { orderId: 'order1', amount: 15000 },
    emailSent: false,
    smsSent: false,
    pushSent: false,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  },
  {
    userId: 'customer2',
    type: 'order_update',
    title: 'Order Update',
    content: 'Your order ORD-2024-002 is 60% complete',
    data: { orderId: 'order2', progress: 60 },
    emailSent: false,
    smsSent: false,
    pushSent: false,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
  }
];

async function seedFirebase() {
  console.log('🌱 Starting Firebase seeding...');

  try {
    // Clear existing data (optional - you might want to skip this in production)
    console.log('📝 Adding users...');
    const userIds = {};
    
    for (const user of sampleUsers) {
      const userRef = await addDoc(collection(db, 'users'), user);
      userIds[user.email] = userRef.id;
      console.log(`✅ Added user: ${user.name} (${userRef.id})`);
    }

    // Update orders with actual user IDs
    console.log('📦 Adding orders...');
    const orderIds = {};
    
    for (let i = 0; i < sampleOrders.length; i++) {
      const order = { ...sampleOrders[i] };
      
      // Map customer and artisan IDs
      if (i === 0) {
        order.customerId = userIds['sarah.wanjiku@example.com'];
        order.artisanId = userIds['maria.rodriguez@example.com'];
      } else if (i === 1) {
        order.customerId = userIds['michael.odhiambo@example.com'];
        order.artisanId = userIds['david.kimani@example.com'];
      } else if (i === 2) {
        order.customerId = userIds['grace.akinyi@example.com'];
        order.artisanId = userIds['aisha.patel@example.com'];
      }

      const orderRef = await addDoc(collection(db, 'orders'), order);
      orderIds[order.orderNumber] = orderRef.id;
      console.log(`✅ Added order: ${order.title} (${orderRef.id})`);
    }

    // Add portfolio items
    console.log('🖼️ Adding portfolio items...');
    for (const item of samplePortfolioItems) {
      const updatedItem = { ...item };
      
      // Map artisan IDs
      if (item.artisanId === 'artisan1') {
        updatedItem.artisanId = userIds['maria.rodriguez@example.com'];
      } else if (item.artisanId === 'artisan2') {
        updatedItem.artisanId = userIds['david.kimani@example.com'];
      } else if (item.artisanId === 'artisan3') {
        updatedItem.artisanId = userIds['aisha.patel@example.com'];
      }

      const portfolioRef = await addDoc(collection(db, 'portfolio_items'), updatedItem);
      console.log(`✅ Added portfolio item: ${item.title} (${portfolioRef.id})`);
    }

    // Add reviews
    console.log('⭐ Adding reviews...');
    for (const review of sampleReviews) {
      const updatedReview = { ...review };
      
      // Map user and order IDs
      updatedReview.customerId = userIds['sarah.wanjiku@example.com'];
      updatedReview.artisanId = userIds['maria.rodriguez@example.com'];
      updatedReview.orderId = orderIds['ORD-2024-001'];

      const reviewRef = await addDoc(collection(db, 'reviews'), updatedReview);
      console.log(`✅ Added review: ${review.title} (${reviewRef.id})`);
    }

    // Add messages
    console.log('💬 Adding messages...');
    for (const message of sampleMessages) {
      const updatedMessage = { ...message };
      
      // Map user and order IDs
      if (message.orderId === 'order1') {
        updatedMessage.orderId = orderIds['ORD-2024-001'];
        updatedMessage.senderId = userIds['sarah.wanjiku@example.com'];
        updatedMessage.receiverId = userIds['maria.rodriguez@example.com'];
      } else if (message.orderId === 'order2') {
        updatedMessage.orderId = orderIds['ORD-2024-002'];
        updatedMessage.senderId = userIds['michael.odhiambo@example.com'];
        updatedMessage.receiverId = userIds['david.kimani@example.com'];
      }

      const messageRef = await addDoc(collection(db, 'messages'), updatedMessage);
      console.log(`✅ Added message: ${message.content.substring(0, 50)}... (${messageRef.id})`);
    }

    // Add notifications
    console.log('🔔 Adding notifications...');
    for (const notification of sampleNotifications) {
      const updatedNotification = { ...notification };
      
      // Map user and order IDs
      if (notification.userId === 'customer1') {
        updatedNotification.userId = userIds['sarah.wanjiku@example.com'];
        updatedNotification.data = { orderId: orderIds['ORD-2024-001'] };
      } else if (notification.userId === 'artisan1') {
        updatedNotification.userId = userIds['maria.rodriguez@example.com'];
        updatedNotification.data = { orderId: orderIds['ORD-2024-001'], amount: 15000 };
      } else if (notification.userId === 'customer2') {
        updatedNotification.userId = userIds['michael.odhiambo@example.com'];
        updatedNotification.data = { orderId: orderIds['ORD-2024-002'], progress: 60 };
      }

      const notificationRef = await addDoc(collection(db, 'notifications'), updatedNotification);
      console.log(`✅ Added notification: ${notification.title} (${notificationRef.id})`);
    }

    console.log('\n✅ Firebase seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${sampleUsers.length}`);
    console.log(`- Orders: ${sampleOrders.length}`);
    console.log(`- Portfolio Items: ${samplePortfolioItems.length}`);
    console.log(`- Reviews: ${sampleReviews.length}`);
    console.log(`- Messages: ${sampleMessages.length}`);
    console.log(`- Notifications: ${sampleNotifications.length}`);
    
    console.log('\n🔑 Test Accounts:');
    console.log('Admin: admin@ducali.com / password123');
    console.log('Customer: sarah.wanjiku@example.com / password123');
    console.log('Artisan: maria.rodriguez@example.com / password123');
    
    console.log('\n💡 Note: All prices are in KSH (Kenyan Shillings)');
    console.log('💡 The admin dashboard now shows real data from Firebase');

  } catch (error) {
    console.error('❌ Error during Firebase seeding:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedFirebase();
