# Firebase Index Setup Guide

This guide will help you set up the required Firebase Firestore indexes to resolve query errors.

## 🚨 Current Error

You're getting this error:
```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/v1/r/project/ducali-ec5a7/firestore/indexes?create_composite=Ckxwcm9qZWN0cy9kdWNhbGktZWM1YTcvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Jldmlld3MvaW5kZXhlcy9fEAEaDQoJYXJ0aXNhbklkEAEaDAoIcmVwb3J0ZWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
```

## 🔧 Quick Fix

### Option 1: Direct Link (Recommended)
1. Click the link in the error message above
2. It will take you directly to the Firebase Console
3. Click "Create Index" to create the required index
4. Wait for the index to build (usually takes a few minutes)

### Option 2: Manual Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `ducali-ec5a7`
3. Navigate to Firestore Database → Indexes
4. Click "Create Index"
5. Set up the following index:

**Collection:** `reviews`
**Fields:**
- `artisanId` (Ascending)
- `reported` (Ascending) 
- `createdAt` (Descending)
- `__name__` (Ascending)

## 📋 Required Indexes for Ducali

Based on your application structure, you'll need these indexes:

### 1. Reviews Collection
```javascript
Collection: reviews
Fields:
- artisanId (Ascending)
- reported (Ascending)
- createdAt (Descending)
- __name__ (Ascending)
```

### 2. Orders Collection
```javascript
Collection: orders
Fields:
- userId (Ascending)
- status (Ascending)
- createdAt (Descending)
- __name__ (Ascending)
```

### 3. Messages Collection
```javascript
Collection: messages
Fields:
- conversationId (Ascending)
- createdAt (Ascending)
- __name__ (Ascending)
```

### 4. Artisans Collection
```javascript
Collection: artisans
Fields:
- category (Ascending)
- rating (Descending)
- createdAt (Descending)
- __name__ (Ascending)
```

### 5. Users Collection
```javascript
Collection: users
Fields:
- role (Ascending)
- status (Ascending)
- createdAt (Descending)
- __name__ (Ascending)
```

## 🛠️ Automated Index Creation

You can also create indexes programmatically using the Firebase CLI:

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login to Firebase
```bash
firebase login
```

### Initialize Firebase in your project
```bash
firebase init firestore
```

### Create firestore.indexes.json
```json
{
  "indexes": [
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "artisanId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "reported",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "__name__",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "__name__",
          "order": "ASCENDING"
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
          "fieldPath": "createdAt",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "__name__",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "artisans",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "category",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "rating",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "__name__",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "role",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "__name__",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Deploy indexes
```bash
firebase deploy --only firestore:indexes
```

## 🔍 Index Status Check

After creating indexes, you can check their status:

1. Go to Firebase Console → Firestore Database → Indexes
2. Look for the "Status" column
3. Indexes will show:
   - **Building**: Index is being created
   - **Enabled**: Index is ready to use
   - **Error**: There was an issue creating the index

## ⚡ Performance Tips

### 1. Optimize Queries
- Use compound indexes for multiple field queries
- Order fields by selectivity (most selective first)
- Use `__name__` field for consistent ordering

### 2. Index Limits
- Maximum 200 composite indexes per database
- Maximum 6 fields per composite index
- Consider query patterns when designing indexes

### 3. Cost Optimization
- Indexes consume storage and write operations
- Monitor index usage in Firebase Console
- Remove unused indexes to reduce costs

## 🚀 Testing Indexes

After creating indexes, test your queries:

```javascript
// Test the reviews query that was failing
const reviewsQuery = query(
  collection(db, 'reviews'),
  where('artisanId', '==', 'some-artisan-id'),
  where('reported', '==', true),
  orderBy('createdAt', 'desc')
);

try {
  const snapshot = await getDocs(reviewsQuery);
  console.log('Query successful!', snapshot.docs.length, 'documents');
} catch (error) {
  console.error('Query failed:', error);
}
```

## 📞 Support

If you continue to have issues:

1. Check the Firebase Console for index status
2. Verify your query structure matches the index
3. Wait for indexes to finish building (can take 5-10 minutes)
4. Check Firebase documentation for query limitations

## 🔄 Monitoring

Set up monitoring for index usage:

```javascript
// Add this to your Firebase functions or monitoring
const indexUsage = {
  reviews: 0,
  orders: 0,
  messages: 0,
  artisans: 0,
  users: 0
};

// Track index usage in your queries
function trackIndexUsage(collection, query) {
  indexUsage[collection]++;
  console.log(`Index usage for ${collection}:`, indexUsage[collection]);
}
```

This should resolve your Firebase index error and optimize your queries for better performance!
