# Firebase Indexes Setup Guide

## 🔧 **Current Issue**
Your Firebase queries are failing because they require composite indexes that haven't been created yet. I've temporarily disabled the `orderBy` clauses to prevent errors, but for optimal performance, you should create these indexes.

## 📋 **Required Indexes**

### **1. Conversations Collection**
**Index for:** `customerId` + `status` + `updatedAt`
- **Collection:** `conversations`
- **Fields:** 
  - `customerId` (Ascending)
  - `status` (Ascending) 
  - `updatedAt` (Descending)

**Index for:** `artisanId` + `status` + `updatedAt`
- **Collection:** `conversations`
- **Fields:**
  - `artisanId` (Ascending)
  - `status` (Ascending)
  - `updatedAt` (Descending)

### **2. Messages Collection**
**Index for:** `conversationId` + `deleted` + `timestamp`
- **Collection:** `messages`
- **Fields:**
  - `conversationId` (Ascending)
  - `deleted` (Ascending)
  - `timestamp` (Descending)

### **3. Notifications Collection**
**Index for:** `userId` + `read` + `timestamp`
- **Collection:** `notifications`
- **Fields:**
  - `userId` (Ascending)
  - `read` (Ascending)
  - `timestamp` (Descending)

### **4. Activities Collection**
**Index for:** `timestamp`
- **Collection:** `activities`
- **Fields:**
  - `timestamp` (Descending)

## 🚀 **How to Create Indexes**

### **Option 1: Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `ducali-ec5a7`
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **"Create Index"**
5. Add each index listed above
6. Wait for indexes to build (can take a few minutes)

### **Option 2: Using Firebase CLI**
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy indexes
firebase deploy --only firestore:indexes
```

## 📝 **Index Configuration File**
Create `firestore.indexes.json` in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "conversations",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "customerId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "conversations",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "artisanId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "updatedAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "conversationId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "deleted",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "read",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "activities",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "timestamp",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

## ✅ **After Creating Indexes**
Once the indexes are created and built, you can re-enable the `orderBy` clauses in your code:

1. **In `src/lib/messagingService.ts`:**
   - Uncomment the `orderBy` clauses
   - Remove the temporary comments

2. **In `src/lib/adminDataService.ts`:**
   - Uncomment the `orderBy` clause
   - Remove the temporary comments

## ⚠️ **Important Notes**
- Index creation can take 1-5 minutes
- You'll see a "Building" status while indexes are being created
- The app will work without indexes but queries will be slower
- Once indexes are built, your queries will be much faster

## 🔍 **Monitoring Index Status**
- Check the **Firestore Database** → **Indexes** tab in Firebase Console
- Look for "Building" or "Enabled" status
- If you see "Error", check the error message and fix the configuration
