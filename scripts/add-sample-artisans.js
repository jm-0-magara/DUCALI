const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

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

async function addSampleArtisans() {
  try {
    console.log('🎨 Adding sample artisans to the database...');
    
    const sampleArtisans = [
      {
        name: 'Sarah Kimani',
        email: 'sarah.kimani@example.com',
        role: 'artisan',
        specialty: 'Custom Wedding Dresses',
        category: 'Fashion & Clothing',
        rating: 4.9,
        averageRating: 4.9,
        totalOrders: 156,
        totalReviews: 45,
        location: 'Nairobi',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        priceRange: 'From KSH 20,000',
        responseTime: '2 hours',
        description: 'Expert wedding dress designer with 8 years of experience creating beautiful custom gowns.',
        experience: '8+ years',
        skills: ['Wedding Dresses', 'Alterations', 'Bridal Wear', 'Custom Design'],
        verified: true,
        featured: true,
        portfolio: [],
        services: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'David Ochieng',
        email: 'david.ochieng@example.com',
        role: 'artisan',
        specialty: 'Handcrafted Furniture',
        category: 'Home & Decor',
        rating: 4.8,
        averageRating: 4.8,
        totalOrders: 89,
        totalReviews: 32,
        location: 'Mombasa',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        priceRange: 'From KSH 15,000',
        responseTime: '4 hours',
        description: 'Creating unique furniture pieces using sustainable local wood and modern design principles.',
        experience: '12+ years',
        skills: ['Custom Furniture', 'Wood Carving', 'Interior Design', 'Restoration'],
        verified: true,
        featured: true,
        portfolio: [],
        services: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Grace Wanjiku',
        email: 'grace.wanjiku@example.com',
        role: 'artisan',
        specialty: 'Custom Jewelry',
        category: 'Jewelry & Accessories',
        rating: 4.7,
        averageRating: 4.7,
        totalOrders: 203,
        totalReviews: 67,
        location: 'Nakuru',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        priceRange: 'From KSH 8,000',
        responseTime: '6 hours',
        description: 'Skilled jewelry designer creating unique pieces with precious metals and gemstones.',
        experience: '10+ years',
        skills: ['Custom Jewelry', 'Engagement Rings', 'Necklaces', 'Bracelets'],
        verified: true,
        featured: false,
        portfolio: [],
        services: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Michael Otieno',
        email: 'michael.otieno@example.com',
        role: 'artisan',
        specialty: 'Digital Art & Design',
        category: 'Digital Services',
        rating: 4.6,
        averageRating: 4.6,
        totalOrders: 67,
        totalReviews: 23,
        location: 'Kisumu',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        priceRange: 'From KSH 5,000',
        responseTime: '12 hours',
        description: 'Creative digital artist specializing in logo design, illustrations, and digital marketing materials.',
        experience: '6+ years',
        skills: ['Logo Design', 'Digital Art', 'Illustration', 'Branding'],
        verified: true,
        featured: false,
        portfolio: [],
        services: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fatima Hassan',
        email: 'fatima.hassan@example.com',
        role: 'artisan',
        specialty: 'Custom Cakes & Pastries',
        category: 'Food & Catering',
        rating: 4.9,
        averageRating: 4.9,
        totalOrders: 234,
        totalReviews: 89,
        location: 'Eldoret',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        priceRange: 'From KSH 30,000',
        responseTime: '8 hours',
        description: 'Professional pastry chef creating beautiful custom cakes and delicious pastries for special occasions.',
        experience: '7+ years',
        skills: ['Wedding Cakes', 'Birthday Cakes', 'Pastries', 'Catering'],
        verified: true,
        featured: false,
        portfolio: [],
        services: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'James Mwangi',
        email: 'james.mwangi@example.com',
        role: 'artisan',
        specialty: 'Leather Goods',
        category: 'Fashion & Clothing',
        rating: 4.8,
        averageRating: 4.8,
        totalOrders: 145,
        totalReviews: 56,
        location: 'Thika',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        priceRange: 'From KSH 100,000',
        responseTime: '5 hours',
        description: 'Master leather craftsman creating premium bags, wallets, and accessories with traditional techniques.',
        experience: '15+ years',
        skills: ['Leather Bags', 'Wallets', 'Belts', 'Shoe Repair'],
        verified: true,
        featured: true,
        portfolio: [],
        services: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Amina Ali',
        email: 'amina.ali@example.com',
        role: 'artisan',
        specialty: 'Traditional Pottery',
        category: 'Art & Design',
        rating: 4.9,
        averageRating: 4.9,
        totalOrders: 178,
        totalReviews: 52,
        location: 'Lamu',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
        priceRange: 'From KSH 60,000',
        responseTime: '3 days',
        description: 'Traditional potter creating beautiful ceramic pieces using age-old techniques passed down through generations.',
        experience: '20+ years',
        skills: ['Pottery', 'Ceramics', 'Traditional Crafts', 'Sculpture'],
        verified: true,
        featured: true,
        portfolio: [],
        services: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Peter Njoroge',
        email: 'peter.njoroge@example.com',
        role: 'artisan',
        specialty: 'Metal Sculpture',
        category: 'Art & Design',
        rating: 4.7,
        averageRating: 4.7,
        totalOrders: 92,
        totalReviews: 34,
        location: 'Kakamega',
        profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
        priceRange: 'From KSH 200,000',
        responseTime: '1 week',
        description: 'Metal sculptor creating stunning art pieces and custom installations for homes and businesses.',
        experience: '14+ years',
        skills: ['Metal Sculpture', 'Welding', 'Installation Art', 'Custom Design'],
        verified: true,
        featured: false,
        portfolio: [],
        services: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const usersRef = collection(db, 'users');
    
    for (const artisan of sampleArtisans) {
      await addDoc(usersRef, artisan);
      console.log(`✅ Added artisan: ${artisan.name}`);
    }

    console.log('\n🎉 Successfully added sample artisans!');
    console.log('📊 Total artisans added:', sampleArtisans.length);
    console.log('💡 You can now refresh your homepage to see the featured artisans!');
    console.log('🖼️ All artisans now have high-quality profile images from Unsplash');

  } catch (error) {
    console.error('❌ Error adding sample artisans:', error);
    console.log('\n💡 You can also add artisans manually through the Firebase Console:');
    console.log('   https://console.firebase.google.com/project/ducali-ec5a7/firestore/data');
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Run the script
addSampleArtisans().then(() => {
  console.log('\n🎉 Script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
