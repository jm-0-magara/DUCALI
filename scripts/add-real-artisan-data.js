const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addRealArtisanData() {
  try {
    console.log('🔍 Adding real data to artisan: ixlfC1uBWWbeD4OUi9DxkrYrtKq1');
    
    // Get the artisan document
    const artisanRef = doc(db, 'users', 'ixlfC1uBWWbeD4OUi9DxkrYrtKq1');
    
    // Real portfolio data (you can modify these with your actual data)
    const realPortfolio = [
      {
        id: 'portfolio-1',
        title: 'Custom Leather Wallet',
        description: 'Handcrafted leather wallet with personalized design',
        images: [
          'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755383674/ducali/images/eizm4pxeuwm1cxsmg460.jpg'
        ],
        category: 'Fashion & Clothing',
        createdAt: new Date('2024-01-15'),
        mediaType: 'image'
      }
    ];

    // Real services data (you can modify these with your actual services)
    const realServices = [
      {
        id: 'service-1',
        name: 'Custom Leather Goods',
        description: 'Handcrafted leather bags, wallets, and accessories',
        price: 150,
        category: 'Fashion & Clothing',
        active: true
      }
    ];

    // Update the artisan document with real data
    await updateDoc(artisanRef, {
      portfolio: realPortfolio,
      services: realServices,
      updatedAt: new Date()
    });

    console.log('✅ Successfully added real portfolio and services data!');
    console.log('📊 Portfolio items added:', realPortfolio.length);
    console.log('🛠️ Services added:', realServices.length);
    
    console.log('\n🎨 Real Portfolio Items:');
    realPortfolio.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.title} - ${item.category}`);
    });
    
    console.log('\n🛠️ Real Services:');
    realServices.forEach((service, index) => {
      console.log(`  ${index + 1}. ${service.name} - $${service.price}`);
    });

    console.log('\n💡 You can now refresh your artisan page to see the real data!');

  } catch (error) {
    console.error('❌ Error adding real data:', error);
    console.log('\n💡 You can also add data manually through the Firebase Console:');
    console.log('   https://console.firebase.google.com/project/ducali-ec5a7/firestore/data');
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run the script
addRealArtisanData().then(() => {
  console.log('\n🎉 Script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});






