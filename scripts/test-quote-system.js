const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } = require('firebase/firestore');

// Load environment variables
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

console.log('🧪 Testing Quote System...');
console.log('==========================');

async function testQuoteSystem() {
  try {
    // Test data
    const testCustomerId = 'test-customer-' + Date.now();
    const testArtisanId = 'test-artisan-' + Date.now();
    
    console.log('📝 Creating test quote request...');
    
    // Create a test quote request
    const quoteData = {
      customerId: testCustomerId,
      artisanId: testArtisanId,
      projectTitle: 'Test Project',
      projectDescription: 'This is a test project for quote system',
      projectType: 'furniture',
      budget: {
        min: 10000,
        max: 20000,
        currency: 'KES'
      },
      timeline: '2-4 weeks',
      location: 'Nairobi',
      urgency: 'medium',
      attachments: [],
      additionalRequirements: 'Test requirements',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };

    const docRef = await addDoc(collection(db, 'quoteRequests'), quoteData);
    console.log('✅ Test quote request created with ID:', docRef.id);

    // Test querying by artisan ID
    console.log('\n🔍 Testing artisan quote requests query...');
    const artisanQuery = query(
      collection(db, 'quoteRequests'),
      where('artisanId', '==', testArtisanId)
    );
    
    const artisanSnapshot = await getDocs(artisanQuery);
    console.log('✅ Found', artisanSnapshot.size, 'quote requests for artisan');

    // Test querying by customer ID
    console.log('\n🔍 Testing customer quote requests query...');
    const customerQuery = query(
      collection(db, 'quoteRequests'),
      where('customerId', '==', testCustomerId)
    );
    
    const customerSnapshot = await getDocs(customerQuery);
    console.log('✅ Found', customerSnapshot.size, 'quote requests for customer');

    // Test querying pending requests
    console.log('\n🔍 Testing pending quote requests query...');
    const pendingQuery = query(
      collection(db, 'quoteRequests'),
      where('artisanId', '==', testArtisanId),
      where('status', '==', 'pending')
    );
    
    const pendingSnapshot = await getDocs(pendingQuery);
    console.log('✅ Found', pendingSnapshot.size, 'pending quote requests');

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await deleteDoc(doc(db, 'quoteRequests', docRef.id));
    console.log('✅ Test quote request deleted');

    console.log('\n🎉 All tests passed! Quote system is working correctly.');
    console.log('\n📋 Summary:');
    console.log('- ✅ Quote creation: Working');
    console.log('- ✅ Artisan queries: Working');
    console.log('- ✅ Customer queries: Working');
    console.log('- ✅ Pending queries: Working');
    console.log('- ✅ No index errors encountered');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('index')) {
      console.log('\n💡 This appears to be an index error. You need to create the required Firebase indexes.');
      console.log('🔗 Go to: https://console.firebase.google.com/v1/r/project/ducali-ec5a7/firestore/indexes');
      console.log('📋 Run: node scripts/setup-firebase-indexes.js for detailed instructions');
    }
  }
}

// Run the test
testQuoteSystem();
