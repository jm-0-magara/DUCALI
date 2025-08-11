#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔧 DUCALI Setup Script');
console.log('======================\n');

// Generate secure secrets
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  if (!fs.existsSync(envExamplePath)) {
    console.error('❌ env.example file not found!');
    process.exit(1);
  }
  
  // Copy env.example to .env.local
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  fs.writeFileSync(envPath, envExample);
  console.log('✅ Created .env.local from env.example');
} else {
  console.log('✅ .env.local already exists');
}

// Generate secure secrets
console.log('\n🔐 Generating secure secrets...');
const jwtSecret = generateSecret(32);
const nextAuthSecret = generateSecret(32);

console.log('Generated JWT_SECRET:', jwtSecret);
console.log('Generated NEXTAUTH_SECRET:', nextAuthSecret);

// Update .env.local with generated secrets
let envContent = fs.readFileSync(envPath, 'utf8');

// Replace placeholder secrets
envContent = envContent.replace(
  /JWT_SECRET="your-super-secure-jwt-secret-min-32-characters-long"/,
  `JWT_SECRET="${jwtSecret}"`
);

envContent = envContent.replace(
  /NEXTAUTH_SECRET="your-nextauth-secret-min-32-characters-long"/,
  `NEXTAUTH_SECRET="${nextAuthSecret}"`
);

fs.writeFileSync(envPath, envContent);
console.log('✅ Updated .env.local with secure secrets');

// Check required dependencies
console.log('\n📦 Checking dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredDeps = ['zod', 'bcryptjs', 'jsonwebtoken'];
const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

if (missingDeps.length > 0) {
  console.log('⚠️  Missing dependencies:', missingDeps.join(', '));
  console.log('Run: npm install', missingDeps.join(' '));
} else {
  console.log('✅ All required dependencies are installed');
}

// Check if .env.local is in .gitignore
console.log('\n🔒 Checking security...');
const gitignorePath = path.join(process.cwd(), '.gitignore');
let gitignoreContent = '';

if (fs.existsSync(gitignorePath)) {
  gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
}

if (!gitignoreContent.includes('.env.local')) {
  console.log('⚠️  Adding .env.local to .gitignore...');
  fs.appendFileSync(gitignorePath, '\n# Environment variables\n.env.local\n.env.production\n');
  console.log('✅ Added .env.local to .gitignore');
} else {
  console.log('✅ .env.local is already in .gitignore');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Edit .env.local with your API keys');
console.log('2. Set up your MongoDB database');
console.log('3. Run: npm run dev');
console.log('4. Check API_KEYS_SETUP.md for detailed setup instructions');
console.log('\n🔑 Required API keys for full functionality:');
console.log('- DATABASE_URL (MongoDB)');
console.log('- STRIPE_SECRET_KEY (for payments)');
console.log('- CLOUDINARY_CLOUD_NAME (for file uploads)');
console.log('- REDIS_URL (for caching)');
console.log('\n📖 See API_KEYS_SETUP.md for complete setup guide');
