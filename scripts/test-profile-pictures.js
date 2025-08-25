const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

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

async function testProfilePictures() {
  try {
    console.log('🔍 Testing profile picture functionality...');
    
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    console.log('\n📊 Profile Picture Analysis:');
    console.log('============================');
    
    let totalUsers = 0;
    let usersWithPictures = 0;
    let usersWithoutPictures = 0;
    let brokenImageUrls = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      totalUsers++;
      
      console.log(`\n👤 User ${totalUsers}: ${data.name || 'Unknown'}`);
      console.log(`   Role: ${data.role || 'No role'}`);
      console.log(`   Profile Image: ${data.profileImage || 'No image'}`);
      
      if (data.profileImage) {
        usersWithPictures++;
        
        // Check if the image URL is valid
        try {
          const response = await fetch(data.profileImage, { method: 'HEAD' });
          if (!response.ok) {
            console.log(`   ⚠️  Broken image URL: ${data.profileImage}`);
            brokenImageUrls++;
          } else {
            console.log(`   ✅ Valid image URL`);
          }
        } catch (error) {
          console.log(`   ❌ Error checking image URL: ${error.message}`);
          brokenImageUrls++;
        }
      } else {
        usersWithoutPictures++;
        console.log(`   📷 No profile picture set`);
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Users with Pictures: ${usersWithPictures}`);
    console.log(`   Users without Pictures: ${usersWithoutPictures}`);
    console.log(`   Broken Image URLs: ${brokenImageUrls}`);
    
    if (brokenImageUrls > 0) {
      console.log('\n⚠️  Issues Found:');
      console.log('   - Some profile pictures have broken URLs');
      console.log('   - This could be due to Firebase Storage configuration');
      console.log('   - Check your Firebase Storage rules and bucket settings');
    }
    
    if (usersWithoutPictures > 0) {
      console.log('\n💡 Suggestions:');
      console.log('   - Users can upload profile pictures through their dashboard');
      console.log('   - Check if the upload functionality is working correctly');
      console.log('   - Verify Firebase Storage permissions');
    }

  } catch (error) {
    console.error('❌ Error testing profile pictures:', error);
    console.log('\n💡 This might be due to:');
    console.log('   - Firebase connection issues');
    console.log('   - Missing environment variables');
    console.log('   - Network connectivity problems');
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run the script
testProfilePictures().then(() => {
  console.log('\n🎉 Profile picture test completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Profile picture test failed:', error);
  process.exit(1);
});
