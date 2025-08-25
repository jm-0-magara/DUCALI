#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Firebase configuration
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

// Sample announcements data
const sampleAnnouncements = [
  {
    title: "Welcome to Ducali - Your Artisan Marketplace",
    content: "We're excited to welcome you to Ducali, the premier marketplace connecting skilled artisans with customers across Kenya. Discover unique handcrafted items, connect with talented artisans, and support local craftsmanship.",
    type: "info",
    priority: "medium",
    targetAudience: "all",
    isActive: true,
    isPublished: true,
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    createdBy: "Ducali Admin",
    authorId: "admin-001"
  },
  {
    title: "New Payment System Launch",
    content: "We're pleased to announce the launch of our new secure payment system. Now you can pay for your orders using M-Pesa, bank transfers, and other local payment methods. All transactions are secure and protected.",
    type: "success",
    priority: "high",
    targetAudience: "all",
    isActive: true,
    isPublished: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    createdBy: "Ducali Admin",
    authorId: "admin-001"
  },
  {
    title: "Artisan Verification Process",
    content: "Attention all artisans: Please ensure your profiles are complete and verified. This helps build trust with customers and increases your chances of receiving orders. Contact support if you need assistance with verification.",
    type: "warning",
    priority: "high",
    targetAudience: "artisans",
    isActive: true,
    isPublished: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    createdBy: "Ducali Admin",
    authorId: "admin-001"
  },
  {
    title: "Customer Satisfaction Survey",
    content: "We value your feedback! Please take a moment to complete our customer satisfaction survey. Your input helps us improve our platform and better serve the artisan community. Survey link will be sent to your email.",
    type: "info",
    priority: "low",
    targetAudience: "customers",
    isActive: true,
    isPublished: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // 7 days ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    createdBy: "Ducali Admin",
    authorId: "admin-001"
  },
  {
    title: "Platform Maintenance Notice",
    content: "Scheduled maintenance will occur on Sunday, 2:00 AM - 4:00 AM EAT. During this time, the platform will be temporarily unavailable. We apologize for any inconvenience and appreciate your patience.",
    type: "warning",
    priority: "medium",
    targetAudience: "all",
    isActive: true,
    isPublished: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)), // 10 days ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    createdBy: "Ducali Admin",
    authorId: "admin-001"
  },
  {
    title: "Draft: New Feature Coming Soon",
    content: "We're working on exciting new features including real-time messaging, order tracking, and enhanced search capabilities. Stay tuned for updates!",
    type: "info",
    priority: "low",
    targetAudience: "all",
    isActive: false,
    isPublished: false,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)), // 1 day ago
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    createdBy: "Ducali Admin",
    authorId: "admin-001"
  }
];

async function addSampleAnnouncements() {
  try {
    console.log('🚀 Adding sample announcements to Firebase...');
    
    for (const announcement of sampleAnnouncements) {
      const docRef = await addDoc(collection(db, 'announcements'), announcement);
      console.log(`✅ Added announcement: "${announcement.title}" with ID: ${docRef.id}`);
    }
    
    console.log('\n🎉 Successfully added all sample announcements!');
    console.log(`📊 Total announcements added: ${sampleAnnouncements.length}`);
    console.log('\n📝 Sample announcements include:');
    sampleAnnouncements.forEach((announcement, index) => {
      console.log(`   ${index + 1}. ${announcement.title} (${announcement.priority} priority, ${announcement.targetAudience})`);
    });
    
    console.log('\n🔗 You can now view these announcements in your admin dashboard at: http://localhost:3001/dashboard/admin');
    
  } catch (error) {
    console.error('❌ Error adding sample announcements:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Make sure your Firebase project is set up correctly');
    console.log('   2. Check that your .env.local file contains the correct Firebase configuration');
    console.log('   3. Ensure Firestore Database is created and security rules allow write access');
    console.log('   4. Verify that the announcements collection can be created');
  }
}

// Run the script
addSampleAnnouncements();
