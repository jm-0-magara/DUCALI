console.log('🔍 Testing Environment Variables...\n');

// Test Firebase variables
console.log('Firebase API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Found' : '❌ Missing');
console.log('Firebase Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Found' : '❌ Missing');
console.log('Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Found' : '❌ Missing');

// Test M-Pesa variables
console.log('M-Pesa Consumer Key:', process.env.MPESA_CONSUMER_KEY ? '✅ Found' : '❌ Missing');
console.log('M-Pesa Consumer Secret:', process.env.MPESA_CONSUMER_SECRET ? '✅ Found' : '❌ Missing');
console.log('M-Pesa Business Short Code:', process.env.MPESA_BUSINESS_SHORT_CODE ? '✅ Found' : '❌ Missing');

console.log('\n📋 All Environment Variables:');
Object.keys(process.env).forEach(key => {
  if (key.includes('FIREBASE') || key.includes('MPESA') || key.includes('NEXT_PUBLIC')) {
    console.log(`${key}: ${process.env[key] ? 'Set' : 'Not Set'}`);
  }
});
