// scripts/test-artisan-orders.js
// Test if the artisan dashboard can fetch orders

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

async function testArtisanOrders() {
  console.log('🧪 Testing artisan orders fetch...\n');

  try {
    const artisanId = 'ukpqxXeyyxbNMnHWplgijkMTM052';
    
    console.log('📝 Testing orders for artisan:', artisanId);

    // Query orders for this artisan
    const q = query(
      collection(db, 'orders'),
      where('artisanId', '==', artisanId)
    );

    const snapshot = await getDocs(q);
    console.log(`📦 Orders found for artisan: ${snapshot.size}`);
    
    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - Order ID: ${doc.id}`);
        console.log(`     Project: ${data.description}`);
        console.log(`     Customer: ${data.customerId}`);
        console.log(`     Amount: ${data.amount} ${data.currency}`);
        console.log(`     Status: ${data.status}`);
        console.log(`     Created: ${data.createdAt?.toDate?.() || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No orders found for this artisan');
    }

    // Also check projects
    const projectsQuery = query(
      collection(db, 'projects'),
      where('artisanId', '==', artisanId)
    );

    const projectsSnapshot = await getDocs(projectsQuery);
    console.log(`🏗️ Projects found for artisan: ${projectsSnapshot.size}`);
    
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
    console.error('❌ Error testing artisan orders:', error);
  }
}

// Run the test
testArtisanOrders().then(() => {
  console.log('🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
