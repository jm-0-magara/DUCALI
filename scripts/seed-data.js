// scripts/seed-data.js
// Run this script to seed Firebase with test data for development

const { seedFirebaseData } = require('../src/lib/seedFirebaseData.ts');

async function main() {
  console.log('🚀 Starting Firebase data seeding...');
  
  try {
    await seedFirebaseData();
    console.log('✅ Firebase data seeding completed successfully!');
    console.log('📊 You can now view real data in your admin dashboard');
  } catch (error) {
    console.error('❌ Error seeding Firebase data:', error);
    process.exit(1);
  }
}

main();
