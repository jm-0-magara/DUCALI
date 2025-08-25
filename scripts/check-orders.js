// scripts/check-orders.js
// Simple script to check for orders in the database

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

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

async function checkOrders() {
  console.log('🔍 Checking for orders in database...\n');

  try {
    // Check orders collection
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    console.log(`📦 Orders found: ${ordersSnapshot.size}`);
    
    if (!ordersSnapshot.empty) {
      ordersSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - Order ID: ${doc.id}`);
        console.log(`     Customer: ${data.customerId}`);
        console.log(`     Artisan: ${data.artisanId}`);
        console.log(`     Amount: ${data.amount} ${data.currency}`);
        console.log(`     Status: ${data.status}`);
        console.log(`     Created: ${data.createdAt?.toDate?.() || 'N/A'}`);
        console.log('');
      });
    }

    // Check projects collection
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    console.log(`🏗️ Projects found: ${projectsSnapshot.size}`);
    
    if (!projectsSnapshot.empty) {
      projectsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - Project ID: ${doc.id}`);
        console.log(`     Title: ${data.title}`);
        console.log(`     Customer: ${data.customerId}`);
        console.log(`     Artisan: ${data.artisanId || 'Not assigned'}`);
        console.log(`     Status: ${data.status}`);
        console.log('');
      });
    }

    // Check accepted quotes
    const quotesSnapshot = await getDocs(collection(db, 'quoteRequests'));
    const acceptedQuotes = quotesSnapshot.docs.filter(doc => doc.data().status === 'accepted');
    console.log(`📋 Accepted quotes found: ${acceptedQuotes.length}`);
    
    if (acceptedQuotes.length > 0) {
      acceptedQuotes.forEach(doc => {
        const data = doc.data();
        console.log(`   - Quote ID: ${doc.id}`);
        console.log(`     Project: ${data.projectTitle}`);
        console.log(`     Customer: ${data.customerId}`);
        console.log(`     Artisan: ${data.artisanId}`);
        console.log(`     Amount: ${data.artisanResponse?.quote || 'N/A'} ${data.artisanResponse?.currency || 'KES'}`);
        console.log(`     Accepted: ${data.acceptedAt?.toDate?.() || 'N/A'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error checking orders:', error);
  }
}

// Run the check
checkOrders().then(() => {
  console.log('🏁 Check completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Check failed:', error);
  process.exit(1);
});
