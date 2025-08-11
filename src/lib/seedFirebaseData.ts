import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  Timestamp,
  doc,
  setDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';

// Sample data for seeding Firebase
const sampleUsers = [
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'artisan',
    isVerified: true,
    createdAt: Timestamp.fromDate(new Date('2024-01-15')),
    lastLogin: Timestamp.fromDate(new Date()),
    status: 'active',
    specialty: 'Woodworking',
    location: 'Nairobi, Kenya'
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    role: 'artisan',
    isVerified: false,
    createdAt: Timestamp.fromDate(new Date('2024-02-20')),
    lastLogin: Timestamp.fromDate(new Date()),
    status: 'pending',
    specialty: 'Jewelry Making',
    location: 'Mombasa, Kenya'
  },
  {
    name: 'David Kimani',
    email: 'david.kimani@example.com',
    role: 'customer',
    createdAt: Timestamp.fromDate(new Date('2024-01-10')),
    lastLogin: Timestamp.fromDate(new Date()),
    status: 'active'
  },
  {
    name: 'Sarah Wanjiku',
    email: 'sarah.wanjiku@example.com',
    role: 'customer',
    createdAt: Timestamp.fromDate(new Date('2024-02-05')),
    lastLogin: Timestamp.fromDate(new Date()),
    status: 'active'
  },
  {
    name: 'James Ochieng',
    email: 'james.ochieng@example.com',
    role: 'artisan',
    isVerified: true,
    createdAt: Timestamp.fromDate(new Date('2024-01-25')),
    lastLogin: Timestamp.fromDate(new Date()),
    status: 'active',
    specialty: 'Pottery',
    location: 'Kisumu, Kenya'
  }
];

const sampleOrders = [
  {
    customerId: 'customer1',
    artisanId: 'artisan1',
    totalAmount: 15000,
    status: 'completed',
    createdAt: Timestamp.fromDate(new Date('2024-02-15')),
    updatedAt: Timestamp.fromDate(new Date('2024-02-20')),
    description: 'Custom wooden table',
    customerName: 'David Kimani',
    artisanName: 'John Smith'
  },
  {
    customerId: 'customer2',
    artisanId: 'artisan2',
    totalAmount: 8000,
    status: 'active',
    createdAt: Timestamp.fromDate(new Date('2024-02-18')),
    updatedAt: Timestamp.fromDate(new Date()),
    description: 'Silver necklace',
    customerName: 'Sarah Wanjiku',
    artisanName: 'Maria Rodriguez'
  },
  {
    customerId: 'customer1',
    artisanId: 'artisan3',
    totalAmount: 12000,
    status: 'processing',
    createdAt: Timestamp.fromDate(new Date('2024-02-19')),
    updatedAt: Timestamp.fromDate(new Date()),
    description: 'Ceramic vase set',
    customerName: 'David Kimani',
    artisanName: 'James Ochieng'
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

    console.log('Firebase data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Firebase data:', error);
  }
}

// Function to clear existing data (use with caution)
async function clearExistingData() {
  const collections = ['users', 'orders', 'activities'];
  
  for (const collectionName of collections) {
    const snapshot = await getDocs(collection(db, collectionName));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }
}

// Export for use in development
export { sampleUsers, sampleOrders, sampleActivities };
