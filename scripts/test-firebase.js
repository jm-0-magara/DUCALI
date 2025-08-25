#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

console.log('🔍 Testing Firebase Connection...');
console.log('📋 Configuration:');
console.log('- Project ID:', firebaseConfig.projectId);
console.log('- Auth Domain:', firebaseConfig.authDomain);
console.log('- Storage Bucket:', firebaseConfig.storageBucket);

try {
  // Initialize Firebase
  console.log('\n🚀 Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');

  // Initialize Firestore
  console.log('\n📊 Initializing Firestore...');
  const db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');

  // Test connection by trying to read from a collection
  console.log('\n🔍 Testing Firestore connection...');
  const testCollection = collection(db, 'test');
  
  console.log('📝 Attempting to read from Firestore...');
  getDocs(testCollection)
    .then(() => {
      console.log('✅ Firestore connection successful!');
      console.log('\n🎉 Your Firebase setup is working correctly!');
      console.log('\n📋 Next steps:');
      console.log('1. Go to Firebase Console > Firestore Database');
      console.log('2. Click "Create database" if not already created');
      console.log('3. Choose "Start in test mode"');
      console.log('4. Select a location (e.g., europe-west1)');
      console.log('5. Run the seed script again: node scripts/seed-firebase.js');
    })
    .catch((error) => {
      console.log('❌ Firestore connection failed:', error.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
      console.log('2. Select your project: ducali-ec5a7');
      console.log('3. Go to Firestore Database');
      console.log('4. Click "Create database" if not already created');
      console.log('5. Set security rules to allow read/write for development');
    });

} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.log('\n🔧 Check your environment variables in .env.local');
}
