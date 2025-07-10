# Ducali Marketplace Test Cases

## 🏠 Homepage Tests

### Navigation Tests
- [ ] **Header navigation** - All links work (Browse Artisans, How It Works, For Artisans)
- [ ] **Dark mode toggle** - Switch between light/dark mode
- [ ] **Logo link** - Clicking "Ducali" returns to homepage
- [ ] **Hero CTA buttons** - "Start Your Custom Order" and "Browse Artisans" work

### Content Tests
- [ ] **Hero section displays** - Title, description, and stats show correctly
- [ ] **Carousel functionality** - Auto-advance, manual navigation, indicators work
- [ ] **Category grid** - All 6 categories display with icons
- [ ] **Featured artisans** - Show correct info (name, rating, location, price)

### Interactive Tests
- [ ] **"Browse Artisans" button** - Takes you to `/browse`
- [ ] **"View Profile" buttons** - Take you to individual artisan pages
- [ ] **Category buttons** - Take you to category pages (when implemented)

---

## 🔍 Browse Page Tests

### URL Tests
- [ ] **Direct access** - `localhost:3000/browse` loads correctly
- [ ] **Navigation from homepage** - Links work properly

### Search & Filter Tests
- [ ] **Search functionality** - Search by name, specialty, or skills
- [ ] **Category filter** - Filter by "All Categories" and specific categories
- [ ] **Location filter** - Filter by location (Nairobi, Mombasa, etc.)
- [ ] **Rating filter** - Filter by minimum rating (4.5+, 4.0+, 3.5+)
- [ ] **Verified filter** - "Verified Only" checkbox works
- [ ] **Clear filters** - Reset all filters when no results

### Display Tests
- [ ] **Results counter** - Shows correct number of artisans
- [ ] **Grid/List toggle** - Switch between view modes
- [ ] **Sorting options** - All sort options work (Featured, Rating, Orders, etc.)
- [ ] **Filter panel** - Expand/collapse filters

### Artisan Cards Tests
- [ ] **All artisan info displays** - Name, specialty, rating, location, price
- [ ] **Verified badges** - Show for verified artisans
- [ ] **Featured labels** - Show for featured artisans
- [ ] **"View Profile" links** - Take you to `/artisan/{id}`

---

## 👨‍🎨 Artisan Profile Tests

### URL Tests
- [ ] **Valid artisan IDs** - `/artisan/1`, `/artisan/2` load correctly
- [ ] **Invalid artisan IDs** - `/artisan/999` shows 404 page

### Profile Content Tests
- [ ] **Hero section** - Name, specialty, rating, location display
- [ ] **Stats display** - Orders completed, experience, response time
- [ ] **Skills/specialties** - Show as styled badges
- [ ] **Verification badge** - Shows for verified artisans

### Tab Navigation Tests
- [ ] **Portfolio tab** - Shows work samples and services
- [ ] **Reviews tab** - Shows customer reviews and rating distribution
- [ ] **Contact tab** - Shows quote request form

### Portfolio Tests
- [ ] **Portfolio grid** - Shows work samples (currently placeholders)
- [ ] **Image modal** - Click to open detailed view
- [ ] **Navigation arrows** - Previous/next in modal
- [ ] **Services offered** - Shows pricing and timeframes

### Reviews Tests
- [ ] **Rating overview** - Shows overall rating and distribution
- [ ] **Individual reviews** - Customer names, ratings, comments
- [ ] **Verified purchases** - Shows verification badges
- [ ] **Load more** - Button to see additional reviews

### Contact Form Tests
- [ ] **Form validation** - Required fields marked and validated
- [ ] **Project type dropdown** - Populated from artisan's services
- [ ] **File upload** - Accepts images and documents
- [ ] **Form submission** - Shows success message
- [ ] **Success state** - Thanks message with next steps

---

## 📂 Category Page Tests (When Implemented)

### URL Tests
- [ ] **Valid categories** - `/categories/fashion`, `/categories/home-decor` work
- [ ] **Invalid categories** - `/categories/invalid` shows 404

### Category-Specific Tests
- [ ] **Fashion category** - Shows only fashion artisans
- [ ] **Home & Decor** - Shows only home/decor artisans
- [ ] **Jewelry** - Shows only jewelry artisans
- [ ] **Art & Design** - Shows only art artisans
- [ ] **Food & Catering** - Shows only food artisans
- [ ] **Digital Services** - Shows only digital artisans

### Content Tests
- [ ] **Category hero** - Shows category icon, name, description
- [ ] **Breadcrumb navigation** - Home > Browse > Category
- [ ] **Popular services** - Shows category-specific services
- [ ] **Artisan count** - Shows correct number for category

---

## 🌐 General Tests

### Responsive Design Tests
- [ ] **Mobile (320px-768px)** - All features work on mobile
- [ ] **Tablet (768px-1024px)** - Layout adapts properly
- [ ] **Desktop (1024px+)** - Full functionality available

### Performance Tests
- [ ] **Page load speed** - Pages load within 3 seconds
- [ ] **Image loading** - Carousel and artisan images load properly
- [ ] **Smooth animations** - Hover effects and transitions work

### Error Handling Tests
- [ ] **404 pages** - Custom 404s for artisan and category not found
- [ ] **Invalid URLs** - Graceful handling of bad URLs
- [ ] **Network errors** - Proper fallbacks if data fails to load

### Accessibility Tests
- [ ] **Keyboard navigation** - Can navigate with Tab key
- [ ] **Screen reader** - Alt text and proper headings
- [ ] **Color contrast** - Text is readable in both light/dark modes

---

## 🔧 Technical Tests

### Import/Export Tests
- [ ] **Component imports** - All components import correctly
- [ ] **Data imports** - Artisan data imports work
- [ ] **Type definitions** - TypeScript types are correct

### State Management Tests
- [ ] **Dark mode state** - Persists across page navigation
- [ ] **Filter state** - Maintains filters when navigating back
- [ ] **Form state** - Contact forms reset properly after submission

### URL Routing Tests
- [ ] **Dynamic routes** - `/artisan/[id]` and `/categories/[category]` work
- [ ] **Back button** - Browser back/forward works correctly
- [ ] **Direct URL access** - All pages accessible via direct URL

---

## 🚀 Quick Test Checklist

**Essential functionality to verify:**

1. ✅ Homepage loads and looks good
2. ✅ "Browse Artisans" button works
3. ✅ Browse page shows artisans
4. ✅ Search and filters work
5. ✅ "View Profile" buttons work
6. ✅ Artisan profiles load with all tabs
7. ✅ Contact form can be filled out
8. ✅ Dark mode toggle works
9. ✅ Mobile/responsive design works
10. ✅ 404 pages show for invalid URLs

**Run this quick test sequence:**
1. Load homepage → Click "Browse Artisans"
2. Search for "Sarah" → Click her "View Profile"
3. Browse her portfolio → Switch to reviews → Try contact form
4. Use browser back button → Try different filters
5. Test on mobile device or resize browser window