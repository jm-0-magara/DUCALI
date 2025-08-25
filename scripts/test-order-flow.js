// scripts/test-order-flow.js
// Test script to verify order creation after quote acceptance

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, doc, getDoc } = require('firebase/firestore');
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testOrderFlow() {
  console.log('🧪 Testing Order Flow');
  console.log('=====================\n');

  try {
    // 1. Check for accepted quotes
    console.log('1. Checking for accepted quotes...');
    const quotesQuery = query(
      collection(db, 'quoteRequests'),
      where('status', '==', 'accepted')
    );
    const quotesSnapshot = await getDocs(quotesQuery);
    
    if (quotesSnapshot.empty) {
      console.log('❌ No accepted quotes found');
      console.log('💡 Try accepting a quote first through the UI');
      return;
    }

    console.log(`✅ Found ${quotesSnapshot.size} accepted quote(s)`);
    
    // 2. Check for corresponding orders
    console.log('\n2. Checking for corresponding orders...');
    const ordersQuery = query(collection(db, 'orders'));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    if (ordersSnapshot.empty) {
      console.log('❌ No orders found');
      console.log('💡 Orders should be created automatically when quotes are accepted');
      return;
    }

    console.log(`✅ Found ${ordersSnapshot.size} order(s)`);

    // 3. Match quotes with orders
    console.log('\n3. Matching quotes with orders...');
    const quotes = quotesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('\n📋 Accepted Quotes:');
    quotes.forEach(quote => {
      console.log(`   - Quote ID: ${quote.id}`);
      console.log(`     Project: ${quote.projectTitle}`);
      console.log(`     Customer: ${quote.customerId}`);
      console.log(`     Artisan: ${quote.artisanId}`);
      console.log(`     Amount: ${quote.artisanResponse?.quote || 'N/A'} ${quote.artisanResponse?.currency || 'KES'}`);
      console.log(`     Accepted: ${quote.acceptedAt?.toDate?.() || 'N/A'}`);
      console.log('');
    });

    console.log('📦 Orders:');
    orders.forEach(order => {
      console.log(`   - Order ID: ${order.id}`);
      console.log(`     Project ID: ${order.projectId}`);
      console.log(`     Customer: ${order.customerId}`);
      console.log(`     Artisan: ${order.artisanId}`);
      console.log(`     Amount: ${order.amount} ${order.currency}`);
      console.log(`     Status: ${order.status}`);
      console.log(`     Created: ${order.createdAt?.toDate?.() || 'N/A'}`);
      console.log('');
    });

    // 4. Check for projects
    console.log('4. Checking for projects...');
    const projectsQuery = query(collection(db, 'projects'));
    const projectsSnapshot = await getDocs(projectsQuery);
    
    if (projectsSnapshot.empty) {
      console.log('❌ No projects found');
    } else {
      console.log(`✅ Found ${projectsSnapshot.size} project(s)`);
      
      const projects = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('\n🏗️  Projects:');
      projects.forEach(project => {
        console.log(`   - Project ID: ${project.id}`);
        console.log(`     Title: ${project.title}`);
        console.log(`     Customer: ${project.customerId}`);
        console.log(`     Artisan: ${project.artisanId || 'Not assigned'}`);
        console.log(`     Status: ${project.status}`);
        console.log('');
      });
    }

    // 5. Summary
    console.log('📊 Summary:');
    console.log(`   - Accepted Quotes: ${quotes.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Projects: ${projectsSnapshot.size}`);
    
    if (quotes.length > 0 && orders.length > 0) {
      console.log('\n✅ Order flow appears to be working!');
      console.log('💡 Check the artisan dashboard to see if orders are displayed');
    } else {
      console.log('\n⚠️  Some parts of the order flow may not be working');
      console.log('💡 Try accepting a quote through the UI and check again');
    }

  } catch (error) {
    console.error('❌ Error testing order flow:', error);
  }
}

// Run the test
testOrderFlow().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
