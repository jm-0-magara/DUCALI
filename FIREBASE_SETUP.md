# Firebase Setup Guide for DUCALI

This guide will help you set up Firebase for your DUCALI platform, replacing MongoDB with Firebase Authentication and Firestore.

## 🚀 Quick Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `ducali-platform`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Set Up Authentication

1. In Firebase Console, go to **Authentication → Get Started**
2. Click **"Sign-in method"** tab
3. Enable **"Email/Password"** provider
4. Click **"Save"**

### 3. Set Up Firestore Database

1. Go to **Firestore Database → Create Database**
2. Choose **"Start in test mode"** (we'll add security rules later)
3. Select a location close to your users
4. Click **"Done"**

### 4. Get Your Firebase Configuration

1. Click the **gear icon** (Project Settings)
2. Go to **General** tab
3. Scroll down to **"Your apps"** section
4. Click **"Add app"** → **Web** (</>)
5. Enter app nickname: `ducali-web`
6. Click **"Register app"**
7. **Copy the config object** (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 5. Update Environment Variables

1. Open your `.env.local` file
2. Add your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef123456"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 6. Test the Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3001`
3. Try to register a new user
4. Check Firebase Console → Authentication to see the new user
5. Check Firestore Database to see the user document

## 🔧 What's Been Set Up

### Firebase Services Configured:

1. **Authentication**: Email/password sign-in
2. **Firestore**: NoSQL database for user data
3. **Storage**: For file uploads (profile pictures, portfolio images)

### Files Created/Updated:

- `src/lib/firebase.ts` - Firebase initialization
- `src/lib/firebase-auth.ts` - Authentication functions
- `src/contexts/AuthContext.tsx` - Updated to use Firebase
- `env.example` - Added Firebase environment variables

### Features Available:

- ✅ User registration with email/password
- ✅ User login/logout
- ✅ Real-time authentication state
- ✅ User profile management
- ✅ Role-based access (artisan/customer)
- ✅ Persistent sessions

## 🛡️ Security Rules (Next Steps)

After testing, you should add Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Artisans can read other artisans' public data
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         resource.data.role == 'artisan');
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - This is normal, the app handles multiple initializations

2. **"Permission denied"**
   - Make sure Firestore is in test mode
   - Check that authentication is enabled

3. **"Invalid API key"**
   - Verify your environment variables are correct
   - Make sure to restart the dev server after adding env vars

### Need Help?

- Check Firebase Console for error logs
- Verify all environment variables are set
- Ensure Firebase project is properly configured

## 🎯 Next Steps

After Firebase is working:

1. **Test user registration and login**
2. **Connect settings forms to Firebase**
3. **Add file upload functionality**
4. **Implement real-time messaging**
5. **Add search functionality**

Your DUCALI platform now has a robust, scalable backend with Firebase! 🎉
