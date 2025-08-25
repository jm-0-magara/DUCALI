// scripts/test-firebase-config.js
// Test Firebase configuration

require('dotenv').config();

console.log('🔧 Testing Firebase Configuration...\n');

// Check environment variables
const envVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log('📋 Environment Variables:');
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`   ${key}: ${value ? '✅ Set' : '❌ Missing'}`);
  if (value) {
    console.log(`     Value: ${value}`);
  }
});

// Check if all required fields are present
const requiredFields = ['NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'];
const missingFields = requiredFields.filter(field => !envVars[field]);

if (missingFields.length > 0) {
  console.log('\n❌ Missing required Firebase configuration fields:', missingFields);
} else {
  console.log('\n✅ All required Firebase configuration fields are present');
}

console.log('\n🏁 Configuration test completed');
