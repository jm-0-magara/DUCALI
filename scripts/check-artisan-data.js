const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function checkArtisanData() {
  try {
    console.log('🔍 Checking artisan data in the database...');
    
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    let artisanCount = 0;
    let customerCount = 0;
    let adminCount = 0;
    let totalUsers = 0;
    
    console.log('\n📊 Database Summary:');
    console.log('====================');
    
    // First, let's see all users and their roles
    console.log('\n👥 All Users in Database:');
    console.log('========================');
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      totalUsers++;
      
      console.log(`\n📄 Document ${totalUsers}:`);
      console.log(`   ID: ${docSnapshot.id}`);
      console.log(`   Name: ${data.name || 'No name'}`);
      console.log(`   Email: ${data.email || 'No email'}`);
      console.log(`   Role: ${data.role || 'No role'}`);
      
      if (data.role === 'artisan') {
        artisanCount++;
        console.log(`   Category: ${data.category || 'No category'}`);
        console.log(`   Profile Image: ${data.profileImage || 'No image'}`);
        console.log(`   Featured: ${data.featured ? 'Yes' : 'No'}`);
        console.log(`   Verified: ${data.verified ? 'Yes' : 'No'}`);
        console.log(`   Portfolio Items: ${data.portfolio ? data.portfolio.length : 0}`);
        console.log(`   Services: ${data.services ? data.services.length : 0}`);
      } else if (data.role === 'customer') {
        customerCount++;
      } else if (data.role === 'admin') {
        adminCount++;
      } else {
        console.log(`   ⚠️ Unknown role: ${data.role}`);
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Artisans: ${artisanCount}`);
    console.log(`   Customers: ${customerCount}`);
    console.log(`   Admins: ${adminCount}`);
    
    if (artisanCount === 0) {
      console.log('\n⚠️ No artisans found in the database!');
      console.log('💡 You can add artisans using: npm run add-sample-artisans');
      console.log('💡 Or manually add them through Firebase Console');
    } else {
      console.log('\n✅ Found artisans in the database!');
      console.log('💡 Your homepage should display these artisans.');
    }

  } catch (error) {
    console.error('❌ Error checking artisan data:', error);
    console.log('\n💡 This might be due to Firebase connection issues.');
    console.log('   Check your internet connection and Firebase configuration.');
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run the script
checkArtisanData().then(() => {
  console.log('\n🎉 Script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
