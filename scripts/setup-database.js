#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Ducali Database...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# ========================================
# DUCALI - Environment Configuration
# ========================================

# ========================================
# CORE APPLICATION
# ========================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ========================================
# DATABASE
# ========================================
# MongoDB (Using local MongoDB for development)
DATABASE_URL="mongodb://localhost:27017/ducali"

# ========================================
# AUTHENTICATION & SECURITY
# ========================================
JWT_SECRET="ducali-jwt-secret-key-for-development-only-change-in-production"
NEXTAUTH_SECRET="ducali-nextauth-secret-key-for-development-only-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# ========================================
# FEATURE FLAGS
# ========================================
ENABLE_REAL_TIME_MESSAGING=true
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_ANALYTICS=true
ENABLE_MONITORING=true
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Run: npx prisma db push');
console.log('3. Run: npx prisma db seed');
console.log('4. Start the development server: npm run dev');
console.log('\n🔑 Test Accounts (after seeding):');
console.log('- Admin: admin@ducali.com / password123');
console.log('- Customer: sarah.wanjiku@example.com / password123');
console.log('- Artisan: maria.rodriguez@example.com / password123');

console.log('\n💡 Note: All prices are now in KSH (Kenyan Shillings)');
console.log('💡 The admin dashboard now shows real data from the database');
console.log('💡 Sample data includes realistic Kenyan marketplace content');
