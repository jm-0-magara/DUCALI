const fs = require('fs');
const path = require('path');

console.log('🔧 M-Pesa Setup Script');
console.log('======================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local file found');
  
  // Read current content
  const currentContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if M-Pesa credentials are already set
  if (currentContent.includes('your_actual_consumer_key_here')) {
    console.log('⚠️  Please update your M-Pesa credentials in .env.local');
    console.log('\n📝 Replace these lines in your .env.local file:');
    console.log('MPESA_CONSUMER_KEY="your_actual_consumer_key_here"');
    console.log('MPESA_CONSUMER_SECRET="your_actual_consumer_secret_here"');
    console.log('\n🔑 With your actual credentials:');
    console.log('MPESA_CONSUMER_KEY="your_real_consumer_key"');
    console.log('MPESA_CONSUMER_SECRET="your_real_consumer_secret"');
  } else {
    console.log('✅ M-Pesa credentials appear to be configured');
  }
} else {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# M-Pesa Configuration (Kenyan Mobile Money)
# Replace the consumer key and secret with your actual values

# M-Pesa API Credentials (YOUR ACTUAL VALUES)
MPESA_CONSUMER_KEY="your_actual_consumer_key_here"
MPESA_CONSUMER_SECRET="your_actual_consumer_secret_here"

# Test/Sandbox Values (These work for testing)
MPESA_BUSINESS_SHORT_CODE="174379"
MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"

# Environment (use "sandbox" for testing, "live" for production)
MPESA_ENVIRONMENT="sandbox"

# App URL for callbacks
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Firebase Configuration (if you have it)
# FIREBASE_API_KEY="your_firebase_api_key"
# FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
# FIREBASE_PROJECT_ID="your_firebase_project_id"
# FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
# FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
# FIREBASE_APP_ID="your_firebase_app_id"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
}

console.log('\n📋 Next Steps:');
console.log('1. Edit .env.local and replace the placeholder credentials with your actual values');
console.log('2. Restart your development server: npm run dev');
console.log('3. Test M-Pesa: http://localhost:3000/test-mpesa');
console.log('\n🎯 You only need to update:');
console.log('   - MPESA_CONSUMER_KEY');
console.log('   - MPESA_CONSUMER_SECRET');
console.log('\n✅ The rest (Business Short Code, Passkey) are already set for sandbox testing!');
