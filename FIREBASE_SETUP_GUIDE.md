# Firebase Setup Guide for Ducali

## 🚀 Quick Setup

Your Ducali application is now configured to use **Firebase Firestore** as the database with **KSH (Kenyan Shillings)** as the default currency throughout the entire website.

## 📋 Prerequisites

1. **Firebase Account**: Create a free account at [Firebase Console](https://console.firebase.google.com/)
2. **Node.js**: Make sure you have Node.js installed

## 🔧 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `ducali-marketplace`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## 🔧 Step 2: Add Web App

1. In your Firebase project, click **"Add app"** (</> icon)
2. Choose **"Web"**
3. Enter app nickname: `ducali-web`
4. Click **"Register app"**
5. Copy the Firebase configuration object

## 🔧 Step 3: Configure Environment Variables

Add these Firebase configuration variables to your `.env` file:

```env
# ========================================
# FIREBASE
# ========================================
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Replace the values** with your actual Firebase configuration from Step 2.

## 🔧 Step 4: Enable Firestore Database

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to Kenya (e.g., `europe-west1`)
5. Click **"Done"**

## 🔧 Step 5: Set Firestore Security Rules

In Firebase Console > Firestore Database > Rules, update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users under any document
    // WARNING: This is for development only!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Note**: These rules allow full access for development. For production, you'll want more restrictive rules.

## 🌱 Step 6: Seed the Database

Run the Firebase seed script to populate your database with sample data:

```bash
node scripts/seed-firebase.js
```

This will create:
- **8 Users** (3 customers, 4 artisans, 1 admin)
- **3 Orders** with realistic Kenyan marketplace data
- **3 Portfolio Items** showcasing artisan work
- **1 Review** from a satisfied customer
- **3 Messages** showing communication between users
- **3 Notifications** for order updates

## 🎯 Step 7: Start the Application

```bash
npm run dev
```

## 🔑 Test Accounts

After seeding, you can use these test accounts:

- **Admin**: `admin@ducali.com` / `password123`
- **Customer**: `sarah.wanjiku@example.com` / `password123`
- **Artisan**: `maria.rodriguez@example.com` / `password123`

## 💰 Currency Configuration

All prices throughout the application are now in **KSH (Kenyan Shillings)**:

- **Sample Order Prices**: 1,500 KSH - 15,000 KSH
- **Artisan Starting Prices**: 1,800 KSH - 8,000 KSH
- **Portfolio Items**: 1,200 KSH - 15,000 KSH

## 📊 Admin Dashboard Features

The admin dashboard now shows **real data** from Firebase:

- **Total Users**: Count of all registered users
- **Active Orders**: Orders currently in progress
- **Pending Verifications**: Artisans awaiting approval
- **Platform Revenue**: Total revenue in KSH
- **Recent Activity**: Latest user registrations, orders, and reviews

## 🔄 What's Changed

1. **Database**: Switched from MongoDB/Prisma to Firebase Firestore
2. **Currency**: All prices now default to KSH
3. **Data Services**: Updated to use Firebase queries
4. **Admin Dashboard**: Now displays real-time data from Firebase
5. **Artisan Profiles**: Fetched from Firebase with proper filtering

## 🚨 Troubleshooting

### Firebase Connection Issues
- Verify your Firebase configuration in `.env`
- Check that Firestore is enabled in your Firebase project
- Ensure security rules allow read/write access

### Seed Script Errors
- Make sure Firebase configuration is correct
- Check that Firestore database is created
- Verify network connection

### Admin Dashboard Not Loading
- Check browser console for Firebase errors
- Verify that the seed script ran successfully
- Ensure Firebase project has the correct collections

## 🎉 Success!

Once you complete these steps, you'll have a **fully functional marketplace** with:

✅ **Real database integration** using Firebase  
✅ **KSH as default currency** throughout the app  
✅ **Realistic Kenyan marketplace data**  
✅ **Working admin dashboard** with live statistics  
✅ **Complete user management** system  
✅ **Order tracking** and messaging system  

Your Ducali marketplace is now ready for development and testing! 🚀
