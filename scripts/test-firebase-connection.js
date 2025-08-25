const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function testFirebaseConnection() {
  console.log('🔧 Testing Firebase Connection...');
  console.log('================================');
  
  // Check environment variables
  console.log('\n📋 Environment Variables Check:');
  console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
  console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
  console.log('Storage Bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing');
  console.log('Messaging Sender ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing');
  console.log('App ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing');
  
  // Check for missing required fields
  const missingFields = Object.keys(firebaseConfig).filter(key => !firebaseConfig[key]);
  if (missingFields.length > 0) {
    console.log('\n❌ Missing Firebase config fields:', missingFields);
    console.log('💡 Please check your .env.local file and ensure all Firebase variables are set.');
    return;
  }
  
  console.log('\n✅ All Firebase environment variables are set!');
  
  try {
    // Initialize Firebase
    console.log('\n🚀 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
    
    // Initialize Firestore
    const db = getFirestore(app);
    console.log('✅ Firestore initialized successfully');
    
    // Test connection by trying to read from users collection
    console.log('\n📡 Testing Firestore connection...');
    const usersRef = collection(db, 'users');
    
    console.log('🔍 Attempting to read from users collection...');
    const snapshot = await getDocs(usersRef);
    
    console.log('✅ Successfully connected to Firestore!');
    console.log(`📊 Found ${snapshot.docs.length} documents in users collection`);
    
    // Show first few documents
    if (snapshot.docs.length > 0) {
      console.log('\n📄 Sample Documents:');
      snapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`\nDocument ${index + 1}:`);
        console.log(`  ID: ${doc.id}`);
        console.log(`  Name: ${data.name || 'No name'}`);
        console.log(`  Role: ${data.role || 'No role'}`);
        console.log(`  Email: ${data.email || 'No email'}`);
      });
    } else {
      console.log('\n📭 No documents found in users collection');
    }
    
  } catch (error) {
    console.error('\n❌ Firebase connection failed:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your internet connection');
    console.log('2. Verify your Firebase project is active');
    console.log('3. Check if Firestore is enabled in your Firebase project');
    console.log('4. Verify your Firebase project ID is correct');
    console.log('5. Check if your IP is allowed in Firebase security rules');
  }
}

// Run the test
testFirebaseConnection().then(() => {
  console.log('\n🎉 Test completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});






