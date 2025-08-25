# 🎨 Adding Real Artisan Data to Ducali

## 📋 Overview

This guide will help you add real artisan data to your Firebase database so your homepage displays actual content instead of demo data.

## 🚀 Quick Start Options

### Option 1: Manual Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/ducali-ec5a7/firestore/data
   - Navigate to the `users` collection

2. **Add New Artisan Document**
   - Click "Add document"
   - Use a custom ID (e.g., `artisan-1`)
   - Add the following fields:

```json
{
  "name": "Your Artisan Name",
  "email": "artisan@example.com",
  "role": "artisan",
  "specialty": "Custom Wedding Dresses",
  "category": "Fashion & Clothing",
  "rating": 4.9,
  "averageRating": 4.9,
  "totalOrders": 156,
  "totalReviews": 45,
  "location": "Nairobi",
  "profileImage": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
  "priceRange": "From $200",
  "responseTime": "2 hours",
  "description": "Expert wedding dress designer with 8 years of experience creating beautiful custom gowns.",
  "experience": "8+ years",
  "skills": ["Wedding Dresses", "Alterations", "Bridal Wear", "Custom Design"],
  "verified": true,
  "featured": true,
  "portfolio": [],
  "services": [],
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

### Option 2: Use the Script (If Firebase Connection Works)

```bash
npm run add-sample-artisans
```

This will add 8 sample artisans with real profile images.

### Option 3: Update Existing Artisans

If you already have artisans but they need profile images:

```bash
npm run update-profile-images
```

## 📊 Required Fields for Artisans

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Artisan's full name |
| `email` | string | ✅ | Contact email |
| `role` | string | ✅ | Must be "artisan" |
| `specialty` | string | ✅ | Main craft/skill |
| `category` | string | ✅ | One of: Fashion & Clothing, Home & Decor, Jewelry & Accessories, Art & Design, Food & Catering, Digital Services |
| `rating` | number | ✅ | Average rating (0-5) |
| `averageRating` | number | ✅ | Same as rating |
| `totalOrders` | number | ✅ | Number of completed orders |
| `totalReviews` | number | ✅ | Number of reviews |
| `location` | string | ✅ | City/location |
| `profileImage` | string | ✅ | Image URL or emoji |
| `priceRange` | string | ✅ | Price range text |
| `responseTime` | string | ✅ | Response time text |
| `description` | string | ✅ | Detailed description |
| `experience` | string | ✅ | Years of experience |
| `skills` | array | ✅ | Array of skill strings |
| `verified` | boolean | ✅ | Verification status |
| `featured` | boolean | ✅ | Featured on homepage |
| `portfolio` | array | ✅ | Portfolio items array |
| `services` | array | ✅ | Services array |
| `createdAt` | timestamp | ✅ | Creation date |
| `updatedAt` | timestamp | ✅ | Last update date |

## 🖼️ Profile Images

### Option 1: Use Unsplash Images (Recommended)

Use high-quality Unsplash images with face cropping:

```
https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face
https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face
https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face
https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face
https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face
https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face
https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face
https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face
```

### Option 2: Use Emojis (Fallback)

If you can't use images, use relevant emojis:

- 👗 Fashion & Clothing
- 🪑 Home & Decor  
- 💍 Jewelry & Accessories
- 🎨 Art & Design
- 🍰 Food & Catering
- 💻 Digital Services
- 👨‍🎨 General Artisan

## 🎯 Sample Artisan Data

### Fashion & Clothing Artisan

```json
{
  "name": "Sarah Kimani",
  "email": "sarah.kimani@example.com",
  "role": "artisan",
  "specialty": "Custom Wedding Dresses",
  "category": "Fashion & Clothing",
  "rating": 4.9,
  "averageRating": 4.9,
  "totalOrders": 156,
  "totalReviews": 45,
  "location": "Nairobi",
  "profileImage": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
  "priceRange": "From $200",
  "responseTime": "2 hours",
  "description": "Expert wedding dress designer with 8 years of experience creating beautiful custom gowns.",
  "experience": "8+ years",
  "skills": ["Wedding Dresses", "Alterations", "Bridal Wear", "Custom Design"],
  "verified": true,
  "featured": true,
  "portfolio": [],
  "services": [],
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

### Home & Decor Artisan

```json
{
  "name": "David Ochieng",
  "email": "david.ochieng@example.com",
  "role": "artisan",
  "specialty": "Handcrafted Furniture",
  "category": "Home & Decor",
  "rating": 4.8,
  "averageRating": 4.8,
  "totalOrders": 89,
  "totalReviews": 32,
  "location": "Mombasa",
  "profileImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  "priceRange": "From $150",
  "responseTime": "4 hours",
  "description": "Creating unique furniture pieces using sustainable local wood and modern design principles.",
  "experience": "12+ years",
  "skills": ["Custom Furniture", "Wood Carving", "Interior Design", "Restoration"],
  "verified": true,
  "featured": true,
  "portfolio": [],
  "services": [],
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

## 🔧 Troubleshooting

### Firebase Connection Issues

If you see connection errors:

1. **Check Internet Connection**
2. **Verify Firebase Configuration** in `.env.local`
3. **Check Firebase Project Settings**
4. **Try Manual Console Method**

### Profile Images Not Showing

1. **Check Image URLs** - Make sure they're accessible
2. **Use HTTPS URLs** - Firebase requires secure URLs
3. **Try Emoji Fallbacks** - Use emojis if images fail
4. **Check Browser Console** - Look for image loading errors

### No Artisans Showing

1. **Check Database** - Run `npm run check-artisans`
2. **Verify Role Field** - Must be exactly "artisan"
3. **Check Featured Field** - Set to `true` for homepage display
4. **Refresh Page** - Clear cache and reload

## 📱 Testing Your Changes

1. **Visit Homepage** - http://localhost:3001
2. **Check Featured Section** - Should show your artisans
3. **Click Artisan Cards** - Should navigate to profile pages
4. **Test Profile Images** - Should display correctly
5. **Check Mobile View** - Should be responsive

## 🎉 Success Indicators

✅ Homepage shows real artisan cards  
✅ Profile images display correctly  
✅ Artisan names and details are visible  
✅ Featured section has content  
✅ No "demo data" warning  
✅ Mobile responsive design works  

## 📞 Need Help?

If you're still having issues:

1. **Check the console** for error messages
2. **Verify your Firebase setup** is correct
3. **Try the manual console method** first
4. **Use emoji profile images** as a fallback

Your homepage should now display real artisan data with proper profile pictures! 🎨✨






