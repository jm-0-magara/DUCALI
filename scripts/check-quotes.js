// scripts/check-quotes.js
// Check all quotes and their status

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

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

async function checkQuotes() {
  console.log('🔍 Checking all quotes in database...\n');

  try {
    // Check all quotes
    const quotesSnapshot = await getDocs(collection(db, 'quoteRequests'));
    console.log(`📋 Total quotes found: ${quotesSnapshot.size}`);
    
    if (!quotesSnapshot.empty) {
      quotesSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - Quote ID: ${doc.id}`);
        console.log(`     Project: ${data.projectTitle}`);
        console.log(`     Customer: ${data.customerId}`);
        console.log(`     Artisan: ${data.artisanId}`);
        console.log(`     Status: ${data.status}`);
        console.log(`     Amount: ${data.artisanResponse?.quote || 'N/A'} ${data.artisanResponse?.currency || 'KES'}`);
        console.log(`     Created: ${data.createdAt?.toDate?.() || 'N/A'}`);
        console.log(`     Accepted: ${data.acceptedAt?.toDate?.() || 'N/A'}`);
        console.log(`     Payment ID: ${data.paymentId || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No quotes found in database');
    }

  } catch (error) {
    console.error('❌ Error checking quotes:', error);
  }
}

// Run the check
checkQuotes().then(() => {
  console.log('🏁 Check completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Check failed:', error);
  process.exit(1);
});
