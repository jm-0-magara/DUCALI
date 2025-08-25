import { db } from './firebase';
import { collection, addDoc, Timestamp, getDocs, deleteDoc } from 'firebase/firestore';

const sampleUsers = [
  {
    name: 'John Smith',
    email: 'john@example.com',
    role: 'artisan',
    isVerified: true,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    lastLogin: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000))
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    role: 'artisan',
    isVerified: false,
    status: 'pending',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    lastLogin: Timestamp.fromDate(new Date(Date.now() - 1 * 60 * 60 * 1000))
  },
  {
    name: 'James Ochieng',
    email: 'james@example.com',
    role: 'artisan',
    isVerified: true,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)),
    lastLogin: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000))
  },
  {
    name: 'David Kimani',
    email: 'david@example.com',
    role: 'customer',
    isVerified: true,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    lastLogin: Timestamp.fromDate(new Date(Date.now() - 30 * 60 * 1000))
  },
  {
    name: 'Sarah Wanjiku',
    email: 'sarah@example.com',
    role: 'customer',
    isVerified: true,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    lastLogin: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  }
];

const sampleOrders = [
  {
    customerId: 'customer1',
    artisanId: 'artisan1',
    totalAmount: 89.99,
    status: 'completed',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
  },
  {
    customerId: 'customer2',
    artisanId: 'artisan2',
    totalAmount: 45.99,
    status: 'processing',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  },
  {
    customerId: 'customer1',
    artisanId: 'artisan3',
    totalAmount: 120.00,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 12 * 60 * 60 * 1000))
  }
];

const sampleActivities = [
  {
    type: 'user_registration',
    message: 'New artisan registered: Maria Rodriguez',
    time: '2 hours ago',
    status: 'pending',
    userId: 'artisan2',
    timestamp: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000))
  },
  {
    type: 'order_completed',
    message: 'Order #1234 completed successfully',
    time: '4 hours ago',
    status: 'completed',
    orderId: 'order1',
    timestamp: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000))
  },
  {
    type: 'verification_approved',
    message: 'Artisan verification approved: John Smith',
    time: '6 hours ago',
    status: 'approved',
    userId: 'artisan1',
    timestamp: Timestamp.fromDate(new Date(Date.now() - 6 * 60 * 60 * 1000))
  },
  {
    type: 'dispute_reported',
    message: 'Dispute reported for Order #1230',
    time: '8 hours ago',
    status: 'warning',
    orderId: 'order2',
    timestamp: Timestamp.fromDate(new Date(Date.now() - 8 * 60 * 60 * 1000))
  }
];

// New sample data for Product Management
const sampleCategories = [
  {
    name: 'Jewelry',
    description: 'Handcrafted jewelry and accessories',
    productCount: 45,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000))
  },
  {
    name: 'Home & Decor',
    description: 'Home decoration and furniture items',
    productCount: 67,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 55 * 24 * 60 * 60 * 1000))
  },
  {
    name: 'Fashion & Clothing',
    description: 'Clothing and fashion accessories',
    productCount: 34,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 50 * 24 * 60 * 60 * 1000))
  },
  {
    name: 'Art & Design',
    description: 'Artwork and design items',
    productCount: 23,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000))
  },
  {
    name: 'Digital Services',
    description: 'Digital and technology services',
    productCount: 12,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 40 * 24 * 60 * 60 * 1000))
  }
];

const sampleProducts = [
  {
    name: 'Handcrafted Wooden Bowl',
    artisanId: 'artisan1',
    artisanName: 'John Smith',
    category: 'Home & Decor',
    price: 45.99,
    status: 'active',
    rating: 4.8,
    sales: 23,
    stock: 5,
    description: 'Beautiful handcrafted wooden bowl made from sustainable materials',
    images: ['bowl1.jpg', 'bowl2.jpg'],
    createdAt: Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
  },
  {
    name: 'Silver Jewelry Set',
    artisanId: 'artisan2',
    artisanName: 'Maria Rodriguez',
    category: 'Jewelry & Accessories',
    price: 89.99,
    status: 'pending',
    rating: 0,
    sales: 0,
    stock: 10,
    description: 'Elegant silver jewelry set with traditional designs',
    images: ['jewelry1.jpg'],
    createdAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  },
  {
    name: 'Ceramic Vase Collection',
    artisanId: 'artisan3',
    artisanName: 'James Ochieng',
    category: 'Home & Decor',
    price: 120.00,
    status: 'active',
    rating: 4.6,
    sales: 8,
    stock: 3,
    description: 'Unique ceramic vase collection with traditional African patterns',
    images: ['vase1.jpg', 'vase2.jpg', 'vase3.jpg'],
    createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  },
  {
    name: 'Leather Wallet',
    artisanId: 'artisan1',
    artisanName: 'John Smith',
    category: 'Fashion & Clothing',
    price: 35.50,
    status: 'rejected',
    rating: 0,
    sales: 0,
    stock: 15,
    description: 'Handcrafted leather wallet with multiple card slots',
    images: ['wallet1.jpg'],
    createdAt: Timestamp.fromDate(new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
  }
];

// New sample data for Financial Management
const sampleTransactions = [
  {
    type: 'payment',
    amount: 89.99,
    status: 'completed',
    customerId: 'customer1',
    customerName: 'David Kimani',
    artisanId: 'artisan2',
    artisanName: 'Maria Rodriguez',
    orderId: 'order1',
    description: 'Silver Jewelry Set',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
  },
  {
    type: 'commission',
    amount: 8.99,
    status: 'completed',
    customerId: 'customer1',
    customerName: 'David Kimani',
    artisanId: 'artisan2',
    artisanName: 'Maria Rodriguez',
    orderId: 'order1',
    description: 'Platform commission',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
  },
  {
    type: 'payment',
    amount: 45.99,
    status: 'pending',
    customerId: 'customer2',
    customerName: 'Sarah Wanjiku',
    artisanId: 'artisan1',
    artisanName: 'John Smith',
    orderId: 'order2',
    description: 'Handcrafted Wooden Bowl',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  },
  {
    type: 'refund',
    amount: 120.00,
    status: 'completed',
    customerId: 'customer1',
    customerName: 'David Kimani',
    artisanId: 'artisan3',
    artisanName: 'James Ochieng',
    orderId: 'order3',
    description: 'Refund for damaged item',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  }
];

// New sample data for Reviews & Quality
const sampleReviews = [
  {
    artisanId: 'artisan1',
    customerId: 'customer1',
    customerName: 'David Kimani',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    title: 'Excellent craftsmanship!',
    comment: 'John delivered exactly what I was looking for. The quality is outstanding and he was very professional throughout the entire process. Highly recommended!',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    helpful: 2,
    reported: false,
    verified: true,
    orderId: 'order1'
  },
  {
    artisanId: 'artisan1',
    customerId: 'customer2',
    customerName: 'Sarah Wanjiku',
    customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    title: 'Great work, very satisfied',
    comment: 'John is a talented artisan. The project was completed on time and the quality exceeded my expectations. Will definitely work with him again.',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    helpful: 1,
    reported: false,
    verified: true,
    orderId: 'order3'
  },
  {
    artisanId: 'artisan2',
    customerId: 'customer1',
    customerName: 'David Kimani',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 3,
    title: 'Good work but could be better',
    comment: 'Maria did a decent job, but there were some delays in communication. The final product was good but took longer than expected.',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    helpful: 0,
    reported: false,
    verified: true,
    orderId: 'order2'
  },
  {
    artisanId: 'artisan3',
    customerId: 'customer2',
    customerName: 'Sarah Wanjiku',
    customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    title: 'Outstanding service!',
    comment: 'James is incredibly talented and professional. He went above and beyond to ensure I was completely satisfied with the result. The attention to detail is remarkable.',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    helpful: 3,
    reported: false,
    verified: true,
    orderId: 'order4'
  }
];

const sampleDisputes = [
  {
    type: 'quality',
    customerId: 'customer1',
    customerName: 'David Kimani',
    artisanId: 'artisan2',
    artisanName: 'Maria Rodriguez',
    orderId: 'order1',
    status: 'investigating',
    priority: 'high',
    description: 'Customer claims product arrived damaged and doesn\'t match description',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000))
  },
  {
    type: 'delivery',
    customerId: 'customer2',
    customerName: 'Sarah Wanjiku',
    artisanId: 'artisan1',
    artisanName: 'John Smith',
    orderId: 'order2',
    status: 'open',
    priority: 'medium',
    description: 'Order not delivered within promised timeframe',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000))
  },
  {
    type: 'refund',
    customerId: 'customer1',
    customerName: 'David Kimani',
    artisanId: 'artisan3',
    artisanName: 'James Ochieng',
    orderId: 'order3',
    status: 'resolved',
    priority: 'low',
    description: 'Customer requested refund due to size mismatch',
    resolution: 'Refund processed successfully',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000))
  }
];

export async function seedFirebaseData() {
  if (!db) {
    console.error('Firebase database not initialized');
    return;
  }

  try {
    console.log('Starting Firebase data seeding...');

    // Clear existing data (optional - be careful in production)
    // await clearExistingData();

    // Seed users
    console.log('Seeding users...');
    for (const user of sampleUsers) {
      await addDoc(collection(db, 'users'), user);
    }

    // Seed orders
    console.log('Seeding orders...');
    for (const order of sampleOrders) {
      await addDoc(collection(db, 'orders'), order);
    }

    // Seed activities
    console.log('Seeding activities...');
    for (const activity of sampleActivities) {
      await addDoc(collection(db, 'activities'), activity);
    }

    // Seed categories
    console.log('Seeding categories...');
    for (const category of sampleCategories) {
      await addDoc(collection(db, 'categories'), category);
    }

    // Seed products
    console.log('Seeding products...');
    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
    }

    // Seed transactions
    console.log('Seeding transactions...');
    for (const transaction of sampleTransactions) {
      await addDoc(collection(db, 'transactions'), transaction);
    }

    // Seed reviews
    console.log('Seeding reviews...');
    for (const review of sampleReviews) {
      await addDoc(collection(db, 'reviews'), review);
    }

    // Seed disputes
    console.log('Seeding disputes...');
    for (const dispute of sampleDisputes) {
      await addDoc(collection(db, 'disputes'), dispute);
    }

    console.log('Firebase data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Firebase data:', error);
  }
}

// Function to clear existing data (use with caution)
async function clearExistingData() {
  const collections = ['users', 'orders', 'activities', 'categories', 'products', 'transactions', 'reviews', 'disputes'];
  for (const collectionName of collections) {
    const snapshot = await getDocs(collection(db!, collectionName));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }
}

// Export for use in development
export { sampleUsers, sampleOrders, sampleActivities };
