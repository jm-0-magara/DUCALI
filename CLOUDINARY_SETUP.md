# 🌟 Complete Cloudinary Setup Guide for Ducali

## 📋 Prerequisites
- A web browser
- Your Ducali project running locally
- Basic understanding of environment variables

---

## 🚀 Step 1: Create Cloudinary Account

### 1.1 Sign Up
1. **Go to** [cloudinary.com](https://cloudinary.com)
2. **Click** "Sign Up For Free"
3. **Fill in your details:**
   - Email address
   - Password
   - Account name (e.g., "ducali-app")
4. **Click** "Create Account"

### 1.2 Verify Email
1. **Check your email** for verification link
2. **Click** the verification link
3. **Log in** to your Cloudinary dashboard

---

## 🔑 Step 2: Get Your Credentials

### 2.1 Find Your Cloud Name
1. **In Cloudinary Dashboard**, look at the top-left corner
2. **Your Cloud Name** is displayed (e.g., `de3qsj9qa`)
3. **Copy it** - you'll need this

### 2.2 Get API Key & Secret
1. **Go to** Dashboard → Settings → Access Keys
2. **Copy your:**
   - **API Key** (e.g., `933676899694873`)
   - **API Secret** (e.g., `unmxeFzYzH-ZyU8ezuSLiQVwv1Y`)
3. **Keep these secure** - don't share them publicly

---

## ⚙️ Step 3: Create Upload Preset

### 3.1 Navigate to Upload Settings
1. **Go to** Dashboard → Settings → Upload
2. **Scroll down** to "Upload presets"
3. **Click** "Add upload preset"

### 3.2 Configure Upload Preset
1. **Preset name:** `ducali_uploads`
2. **Signing Mode:** Select `Unsigned`
3. **Folder:** `ducali/images` (optional)
4. **Allowed formats:** `jpg, png, gif, webp, mp4, mov, avi`
5. **Max file size:** `10 MB`
6. **Click** "Save"

### 3.3 Verify Preset
- **Your preset** should now appear in the list
- **Status** should show as "Active"

---

## 🔧 Step 4: Configure Environment Variables

### 4.1 Open Your Project
1. **Navigate** to your Ducali project folder
2. **Open** `.env.local` file (create if it doesn't exist)

### 4.2 Add Cloudinary Variables
```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=de3qsj9qa
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ducali_uploads
NEXT_PUBLIC_CLOUDINARY_API_KEY=933676899694873
NEXT_PUBLIC_CLOUDINARY_API_SECRET=unmxeFzYzH-ZyU8ezuSLiQVwv1Y
```

### 4.3 Save and Restart
1. **Save** the `.env.local` file
2. **Restart** your development server:
   ```bash
   npm run dev
   ```

---

## 🧪 Step 5: Test Your Setup

### 5.1 Visit Test Page
1. **Open** your browser
2. **Go to** `http://localhost:3001/test-upload`

### 5.2 Check Configuration Status
You should see:
- ✅ **Cloud Name:** `de3qsj9qa` (green)
- ✅ **Upload Preset:** `ducali_uploads` (green)
- ✅ **Service Status:** `Configured` (green)

### 5.3 Test Upload
1. **Click** "Choose File"
2. **Select** a small image (JPG/PNG under 5MB)
3. **Click** "Upload to Cloudinary"
4. **Wait** for upload to complete
5. **Verify** you see the uploaded image

---

## 🎯 Step 6: Verify in Cloudinary Dashboard

### 6.1 Check Media Library
1. **Go to** Cloudinary Dashboard → Media Library
2. **Look for** your uploaded image
3. **Verify** it's in the `ducali/test` folder

### 6.2 Check Upload Preset Usage
1. **Go to** Dashboard → Settings → Upload
2. **Find** your `ducali_uploads` preset
3. **Check** that uploads are working

---

## 🔍 Troubleshooting

### ❌ "Cloudinary not configured"
**Solution:**
- Check your `.env.local` file exists
- Verify variable names are correct
- Restart your development server

### ❌ "Upload preset not found"
**Solution:**
- Go to Cloudinary Dashboard → Settings → Upload
- Verify `ducali_uploads` preset exists
- Check preset is set to "Unsigned"

### ❌ "Invalid file format"
**Solution:**
- Use JPG, PNG, GIF, or WebP images
- Check file size (under 10MB)
- Verify upload preset allows your file type

### ❌ "File too large"
**Solution:**
- Compress your image
- Use a smaller file
- Increase max file size in upload preset

---

## 📱 Step 7: Test in Your App

### 7.1 Admin Profile Picture
1. **Go to** `http://localhost:3001/dashboard/admin?tab=settings`
2. **Scroll to** "Profile Picture" section
3. **Upload** a profile image
4. **Verify** it appears correctly

### 7.2 Artisan Portfolio
1. **Go to** `http://localhost:3001/dashboard/artisan`
2. **Navigate to** Portfolio section
3. **Add** a new portfolio item
4. **Upload** images/videos
5. **Verify** media displays correctly

---

## 🎉 Success Checklist

- ✅ Cloudinary account created
- ✅ Cloud name obtained
- ✅ API credentials copied
- ✅ Upload preset created (`ducali_uploads`)
- ✅ Environment variables configured
- ✅ Test upload successful
- ✅ Admin profile picture working
- ✅ Artisan portfolio uploads working

---

## 🔒 Security Notes

### ✅ Do's:
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Keep API secret secure
- Use unsigned uploads for client-side
- Set appropriate file size limits

### ❌ Don'ts:
- Don't commit `.env.local` to git
- Don't share API credentials publicly
- Don't use signed uploads on client-side
- Don't allow unlimited file sizes

---

## 📞 Need Help?

If you encounter issues:

1. **Check** the test page at `/test-upload`
2. **Review** browser console for errors
3. **Verify** Cloudinary dashboard settings
4. **Ensure** environment variables are loaded

Your Cloudinary setup should now be complete and working! 🚀
