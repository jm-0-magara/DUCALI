const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

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

// Profile image URLs for different artisan types
const profileImages = {
  'Fashion & Clothing': [
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
  ],
  'Home & Decor': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
  ],
  'Jewelry & Accessories': [
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
  ],
  'Art & Design': [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  ],
  'Food & Catering': [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face'
  ],
  'Digital Services': [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
  ],
  'default': [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
  ]
};

function getRandomProfileImage(category) {
  const images = profileImages[category] || profileImages['default'];
  return images[Math.floor(Math.random() * images.length)];
}

async function updateArtisanProfileImages() {
  try {
    console.log('🖼️ Updating artisan profile images...');
    
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Only update artisans (not customers or admins)
      if (data.role === 'artisan') {
        // Check if they already have a profile image
        if (!data.profileImage || data.profileImage.includes('👨‍🎨') || data.profileImage.includes('👗') || data.profileImage.includes('🪑')) {
          const profileImage = getRandomProfileImage(data.category);
          
          await updateDoc(doc(db, 'users', docSnapshot.id), {
            profileImage: profileImage,
            updatedAt: new Date()
          });
          
          console.log(`✅ Updated ${data.name} (${data.category}) with profile image`);
          updatedCount++;
        } else {
          console.log(`⏭️ Skipped ${data.name} - already has profile image`);
          skippedCount++;
        }
      }
    }
    
    console.log('\n🎉 Profile image update completed!');
    console.log(`📊 Updated: ${updatedCount} artisans`);
    console.log(`⏭️ Skipped: ${skippedCount} artisans (already had images)`);
    console.log('💡 You can now refresh your homepage to see the updated profile images!');

  } catch (error) {
    console.error('❌ Error updating profile images:', error);
    console.log('\n💡 You can also update images manually through the Firebase Console:');
    console.log('   https://console.firebase.google.com/project/ducali-ec5a7/firestore/data');
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run the script
updateArtisanProfileImages().then(() => {
  console.log('\n🎉 Script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});






