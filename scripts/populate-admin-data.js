// scripts/populate-admin-data.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function populateUsers() {
  console.log('📝 Adding sample users...');
  
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      isVerified: true,
      joinDate: '2024-01-15',
      lastActive: '2024-01-20',
      status: 'active',
      phone: '+1234567890',
      location: 'New York, NY',
      totalOrders: 5,
      totalSpent: 1250,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'artisan',
      isVerified: false,
      joinDate: '2024-01-10',
      lastActive: '2024-01-19',
      status: 'pending',
      phone: '+1234567891',
      location: 'Los Angeles, CA',
      specialty: 'Graphic Design',
      totalOrders: 12,
      totalEarnings: 3200,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'customer',
      isVerified: true,
      joinDate: '2024-01-05',
      lastActive: '2024-01-18',
      status: 'active',
      phone: '+1234567892',
      location: 'Chicago, IL',
      totalOrders: 3,
      totalSpent: 800,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'artisan',
      isVerified: true,
      joinDate: '2024-01-08',
      lastActive: '2024-01-21',
      status: 'active',
      phone: '+1234567893',
      location: 'Miami, FL',
      specialty: 'Web Development',
      totalOrders: 8,
      totalEarnings: 2100,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  ];

  for (const user of users) {
    try {
      await addDoc(collection(db, 'users'), user);
      console.log(`✅ Added user: ${user.name}`);
    } catch (error) {
      console.error(`❌ Error adding user ${user.name}:`, error);
    }
  }
}

async function populateAnnouncements() {
  console.log('📢 Adding sample announcements...');
  
  const announcements = [
    {
      title: 'Welcome to Our Platform!',
      content: 'We are excited to welcome all new users to our artisan marketplace. Discover amazing talent and get your projects done with excellence.',
      author: 'Admin Team',
      authorId: 'admin-001',
      isPublished: true,
      priority: 'high',
      targetAudience: 'all',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      title: 'New Features Available',
      content: 'We have added new features including video portfolio uploads and enhanced messaging. Check them out!',
      author: 'Admin Team',
      authorId: 'admin-001',
      isPublished: true,
      priority: 'medium',
      targetAudience: 'artisans',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      title: 'Platform Maintenance Notice',
      content: 'Scheduled maintenance will occur on Sunday from 2-4 AM EST. Services may be temporarily unavailable.',
      author: 'Admin Team',
      authorId: 'admin-001',
      isPublished: true,
      priority: 'low',
      targetAudience: 'all',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  ];

  for (const announcement of announcements) {
    try {
      await addDoc(collection(db, 'announcements'), announcement);
      console.log(`✅ Added announcement: ${announcement.title}`);
    } catch (error) {
      console.error(`❌ Error adding announcement ${announcement.title}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting database population...');
    
    await populateUsers();
    await populateAnnouncements();
    
    console.log('✅ Database population completed!');
    console.log('🔍 Check the admin dashboard to see the real data');
  } catch (error) {
    console.error('❌ Error populating database:', error);
  }
}

main();
