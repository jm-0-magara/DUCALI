# 🚀 DUCALI Development Setup Guide

This guide will help you get DUCALI running locally for development.

## 📋 Quick Start (5 minutes)

### 1. **Prerequisites**
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### 2. **Initial Setup**
```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd DUCALI

# Install dependencies
npm install

# Run the setup script
npm run setup

# Start development server
npm run dev
```

### 3. **Database Setup Options**

#### **Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Get connection string
5. Update `.env.local`:
```bash
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ducali"
```

#### **Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Update `.env.local`:
```bash
DATABASE_URL="mongodb://localhost:27017/ducali-dev"
```

#### **Option C: Development Mode (No Database)**
For quick testing, you can run without a database:
```bash
# The app will use mock data
npm run dev
```

### 4. **Test Your Setup**
1. Visit: http://localhost:3001
2. Try registering a new user
3. Test the authentication flow
4. Browse the artisan marketplace

## 🔧 Development Workflow

### **Daily Development**
```bash
# Start development server
npm run dev

# In another terminal, watch for changes
npm run lint

# Test database operations
npx prisma studio
```

### **Database Operations**
```bash
# Push schema changes
npx prisma db push

# Generate Prisma client
npx prisma generate

# View database in browser
npx prisma studio

# Seed database
npm run db:seed
```

### **Code Quality**
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Type checking
npx tsc --noEmit
```

## 🎯 Feature Development Priority

### **Phase 1: Core Features (Week 1)**
- [x] User authentication
- [x] Basic UI components
- [ ] File upload functionality
- [ ] Input validation
- [ ] Error handling

### **Phase 2: Marketplace Features (Week 2)**
- [ ] Artisan profiles
- [ ] Portfolio management
- [ ] Search and filtering
- [ ] Order management

### **Phase 3: Communication (Week 3)**
- [ ] Real-time messaging
- [ ] Notifications
- [ ] Reviews and ratings

### **Phase 4: Payments (Week 4)**
- [ ] Stripe integration
- [ ] M-Pesa integration
- [ ] Payment processing

## 🐛 Common Issues & Solutions

### **"DATABASE_URL not found"**
```bash
# Check if .env.local exists
ls -la .env.local

# If not, run setup
npm run setup

# Update DATABASE_URL in .env.local
```

### **"Port 3000 is in use"**
- The app will automatically use the next available port
- Check the terminal output for the correct URL

### **"Prisma client not generated"**
```bash
npx prisma generate
```

### **"Environment validation failed"**
```bash
# Check your .env.local file
cat .env.local

# Ensure all required variables are set
npm run setup
```

## 📁 Project Structure

```
DUCALI/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── components/     # Reusable components
│   │   └── ...
│   ├── lib/                # Utility functions
│   ├── contexts/           # React contexts
│   └── types/              # TypeScript types
├── prisma/                 # Database schema
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🔍 Development Tools

### **VS Code Extensions (Recommended)**
- Prisma (database schema)
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer

### **Browser Extensions**
- React Developer Tools
- Redux DevTools (if using Redux)

## 🚀 Deployment Preparation

### **Environment Variables**
Ensure these are set for production:
```bash
NODE_ENV=production
DATABASE_URL=your-production-db-url
JWT_SECRET=your-production-secret
NEXTAUTH_SECRET=your-production-secret
```

### **Build for Production**
```bash
npm run build
npm start
```

## 📞 Getting Help

1. **Check the logs** - Look at terminal output for errors
2. **Review documentation** - Check `docs/` folder
3. **Search issues** - Look for similar problems
4. **Ask for help** - Create an issue with details

## 🎉 Success Checklist

- [ ] Development server runs without errors
- [ ] Can register new users
- [ ] Can login/logout
- [ ] Database connection works
- [ ] File uploads work (if configured)
- [ ] Basic navigation works
- [ ] No console errors in browser

## 🚀 Next Steps

After completing the setup:
1. **Explore the codebase** - Understand the structure
2. **Add your first feature** - Start with something small
3. **Set up external services** - Add API keys as needed
4. **Write tests** - Ensure code quality
5. **Deploy** - Share your work with the world!

Happy coding! 🎉
