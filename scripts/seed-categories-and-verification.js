const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
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

// Default categories for the marketplace
const defaultCategories = [
  {
    name: 'All Categories',
    slug: 'browse',
    icon: '🎨',
    description: 'Browse all categories and artisans',
    featured: true,
    sortOrder: 0
  },
  {
    name: 'Fashion & Clothing',
    slug: 'fashion',
    icon: '👗',
    description: 'Custom clothing, traditional wear, and fashion accessories',
    featured: true,
    sortOrder: 1
  },
  {
    name: 'Home & Decor',
    slug: 'home-decor',
    icon: '🏠',
    description: 'Home decoration, furniture, and interior design items',
    featured: true,
    sortOrder: 2
  },
  {
    name: 'Jewelry & Accessories',
    slug: 'jewelry',
    icon: '💍',
    description: 'Handcrafted jewelry, beads, and personal accessories',
    featured: true,
    sortOrder: 3
  },
  {
    name: 'Art & Design',
    slug: 'art-design',
    icon: '🎨',
    description: 'Paintings, sculptures, and artistic creations',
    featured: true,
    sortOrder: 4
  },
  {
    name: 'Food & Catering',
    slug: 'food-catering',
    icon: '🍰',
    description: 'Traditional foods, catering services, and culinary arts',
    featured: false,
    sortOrder: 5
  },
  {
    name: 'Digital Services',
    slug: 'digital-services',
    icon: '💻',
    description: 'Web design, digital art, and technology services',
    featured: false,
    sortOrder: 6
  },
  {
    name: 'Leather & Crafts',
    slug: 'leather-crafts',
    icon: '👜',
    description: 'Leather goods, bags, and traditional crafts',
    featured: false,
    sortOrder: 7
  },
  {
    name: 'Textiles & Fabrics',
    slug: 'textiles-fabrics',
    icon: '🧵',
    description: 'Traditional fabrics, weaving, and textile arts',
    featured: false,
    sortOrder: 8
  },
  {
    name: 'Wood & Furniture',
    slug: 'wood-furniture',
    icon: '🪑',
    description: 'Custom furniture, wood carvings, and carpentry',
    featured: false,
    sortOrder: 9
  }
];

// Sample verification requests
const sampleVerificationRequests = [
  {
    userId: 'sample-artisan-1',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    phone: '+254700123459',
    location: 'Nairobi, Kenya',
    specialty: 'Jewelry Making',
    experience: '5 years',
    portfolio: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'
    ],
    documents: [
      'id_verification.pdf',
      'business_license.pdf',
      'certificate.pdf'
    ],
    status: 'pending',
    bio: 'Experienced jewelry maker with 10+ years of experience in traditional African designs',
    skills: ['Custom Rings', 'Necklaces', 'Earrings', 'Wedding Bands'],
    certifications: ['Jewelry Design Certificate', 'Gemology Certification']
  },
  {
    userId: 'sample-artisan-2',
    name: 'David Kimani',
    email: 'david.kimani@example.com',
    phone: '+254700123460',
    location: 'Mombasa, Kenya',
    specialty: 'Leather Goods',
    experience: '8 years',
    portfolio: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400'
    ],
    documents: [
      'id_verification.pdf',
      'business_license.pdf'
    ],
    status: 'approved',
    bio: 'Specialized in leather goods and accessories using traditional techniques',
    skills: ['Custom Bags', 'Belts', 'Wallets', 'Shoes'],
    certifications: ['Leather Crafting Certificate']
  },
  {
    userId: 'sample-artisan-3',
    name: 'Aisha Patel',
    email: 'aisha.patel@example.com',
    phone: '+254700123461',
    location: 'Nakuru, Kenya',
    specialty: 'Textile Design',
    experience: '3 years',
    portfolio: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    ],
    documents: [
      'id_verification.pdf',
      'certificate.pdf'
    ],
    status: 'rejected',
    bio: 'Textile artist specializing in traditional patterns and modern designs',
    skills: ['Fabric Design', 'Pattern Making', 'Dyeing', 'Weaving'],
    certifications: ['Textile Design Certificate']
  }
];

async function seedCategoriesAndVerification() {
  try {
    console.log('🌱 Starting categories and verification data seeding...');
    console.log('==================================================');

    // Check for existing categories first
    console.log('\n📂 Checking existing categories...');
    const existingSnapshot = await getDocs(collection(db, 'categories'));
    const existingCategories = new Set();
    
    existingSnapshot.forEach((doc) => {
      const data = doc.data();
      existingCategories.add(data.name);
    });

    console.log(`Found ${existingCategories.size} existing categories`);

    // Seed categories (only if they don't exist)
    console.log('\n📂 Seeding new categories...');
    let addedCount = 0;
    for (const category of defaultCategories) {
      if (existingCategories.has(category.name)) {
        console.log(`⏭️  Skipping existing category: ${category.name}`);
        continue;
      }
      
      try {
        await addDoc(collection(db, 'categories'), {
          ...category,
          status: 'active',
          productCount: 0,
          artisanCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`✅ Added category: ${category.name}`);
        addedCount++;
      } catch (error) {
        console.log(`⚠️  Failed to add category ${category.name}:`, error.message);
      }
    }

    console.log(`\n📊 Summary: ${addedCount} new categories added`);

    // Seed verification requests
    console.log('\n🔍 Seeding verification requests...');
    for (const request of sampleVerificationRequests) {
      try {
        await addDoc(collection(db, 'verification_requests'), {
          ...request,
          submittedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log(`✅ Added verification request: ${request.name}`);
      } catch (error) {
        console.log(`⚠️  Verification request for ${request.name} might already exist:`, error.message);
      }
    }

    console.log('\n🎉 Categories and verification data seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`- Categories added: ${defaultCategories.length}`);
    console.log(`- Verification requests added: ${sampleVerificationRequests.length}`);
    console.log('\n💡 You can now view real data in your admin dashboard and categories page.');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seeding
seedCategoriesAndVerification();
