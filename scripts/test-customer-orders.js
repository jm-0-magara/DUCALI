// scripts/test-customer-orders.js
// Test if the customer can see their orders

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');
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

console.log('🔧 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testCustomerOrders() {
  console.log('🧪 Testing customer orders fetch...\n');

  try {
    const customerId = '3I3re3quyJcnknfxx2oZoaE5ess2';
    
    console.log('📝 Testing orders for customer:', customerId);

    // Query orders for this customer
    const q = query(
      collection(db, 'orders'),
      where('customerId', '==', customerId)
    );

    const snapshot = await getDocs(q);
    console.log(`📦 Orders found for customer: ${snapshot.size}`);
    
    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - Order ID: ${doc.id}`);
        console.log(`     Project: ${data.description}`);
        console.log(`     Artisan: ${data.artisanId}`);
        console.log(`     Amount: ${data.amount} ${data.currency}`);
        console.log(`     Status: ${data.status}`);
        console.log(`     Created: ${data.createdAt?.toDate?.() || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No orders found for this customer');
    }

    // Also check projects for this customer
    const projectsQuery = query(
      collection(db, 'projects'),
      where('customerId', '==', customerId)
    );

    const projectsSnapshot = await getDocs(projectsQuery);
    console.log(`🏗️ Projects found for customer: ${projectsSnapshot.size}`);
    
    if (!projectsSnapshot.empty) {
      projectsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - Project ID: ${doc.id}`);
        console.log(`     Title: ${data.title}`);
        console.log(`     Status: ${data.status}`);
        console.log(`     Created: ${data.createdAt?.toDate?.() || 'N/A'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error testing customer orders:', error);
  }
}

// Run the test
testCustomerOrders().then(() => {
  console.log('🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
