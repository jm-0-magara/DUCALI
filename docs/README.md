# Ducali - Bespoke Marketplace

A modern marketplace connecting customers with skilled artisans for custom-made products. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Browse Artisans** - Search and filter through verified artisans
- **Category Pages** - Dedicated pages for each artisan category
- **Artisan Profiles** - Detailed profiles with portfolio, reviews, and contact forms
- **Search & Filtering** - Advanced search with location, rating, and verification filters
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### User Experience
- **How It Works** - Step-by-step process explanation
- **Trust & Safety** - Verification badges and quality guarantees
- **Contact Forms** - Quote request system with file uploads
- **Portfolio Galleries** - Showcase artisan work with modal views
- **Review System** - Customer reviews with rating distribution

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel/Netlify

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── browse/                     # Browse artisans page
│   │   ├── page.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── data/
│   ├── categories/[category]/      # Dynamic category pages
│   │   ├── page.tsx
│   │   ├── components/
│   │   ├── data/
│   │   └── not-found.tsx
│   ├── artisan/[id]/              # Dynamic artisan profiles
│   │   ├── page.tsx
│   │   ├── components/
│   │   ├── data/
│   │   └── not-found.tsx
│   ├── how-it-works/              # Process explanation page
│   │   └── page.tsx
│   ├── components/                # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Categories.tsx
│   │   ├── FeaturedArtisans.tsx
│   │   ├── Carousel.tsx
│   │   └── CTASection.tsx
│   ├── globals.css
│   └── layout.tsx
└── public/
    └── images/
        └── carousel/               # Carousel images
```

## 🎨 Design System

### Colors
- **Primary Green**: `#626F47` (Dark olive green)
- **Secondary Green**: `#A4B465` (Sage green)
- **Accent Cream**: `#F5ECD5` (Light cream)
- **Warm Orange**: `#F0BB78` (Warm peach)
- **Background**: Slate grays (slate-800, slate-900)

### Typography
- **Headings**: Bold, white text with green accents
- **Body**: Slate-300 for readable text
- **Links**: Hover states with green color transitions

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd ducali
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📱 Pages & Routes

### Main Pages
- `/` - Homepage with hero, categories, and featured artisans
- `/browse` - Browse all artisans with search and filters
- `/how-it-works` - Process explanation and FAQ

### Dynamic Routes
- `/categories/[category]` - Category-specific artisan listings
  - `/categories/fashion`
  - `/categories/home-decor`
  - `/categories/jewelry`
  - `/categories/art-design`
  - `/categories/food-catering`
  - `/categories/digital-services`

- `/artisan/[id]` - Individual artisan profiles
  - `/artisan/1` - Sarah Kimani (Wedding Dresses)
  - `/artisan/2` - David Ochieng (Furniture)
  - `/artisan/3` - Grace Wanjiku (Cakes)

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:
```bash
# Add your environment variables here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Tailwind Configuration
The project uses custom colors defined in `tailwind.config.js`. Modify colors in the `theme.extend.colors` section.

## 📊 Data Structure

### Artisan Interface
```typescript
interface ArtisanProfile {
  id: number;
  name: string;
  specialty: string;
  category: string;
  rating: number;
  orders: number;
  location: string;
  image: string;
  price: string;
  responseTime: string;
  description: string;
  fullDescription: string;
  skills: string[];
  verified: boolean;
  featured: boolean;
  experience: string;
  totalReviews: number;
  portfolio: PortfolioItem[];
  services: Service[];
  reviews: Review[];
}
```

### Adding New Artisans
1. Add artisan data to `src/app/artisan/[id]/data/artisanData.ts`
2. Ensure category matches exactly with category names
3. Add portfolio items, services, and reviews
4. Artisan will automatically appear in browse and category pages

## 🎯 Key Features Explained

### Search & Filtering
- **Text Search**: Searches name, specialty, and skills
- **Category Filter**: Filter by artisan categories
- **Location Filter**: Filter by Kenyan cities
- **Rating Filter**: Minimum rating requirements
- **Verification Filter**: Show only verified artisans
- **Sorting**: By featured status, rating, orders, price, response time

### Portfolio System
- **Grid Display**: Portfolio items in responsive grid
- **Modal View**: Click to view detailed information
- **Navigation**: Previous/next arrows in modal
- **Services**: Separate pricing for different services

### Contact Forms
- **Quote Requests**: Detailed project information
- **File Uploads**: Reference images and documents
- **Form Validation**: Required fields and proper types
- **Success States**: Confirmation messages

## 🔍 Testing

### Manual Testing Checklist
- [ ] Homepage loads and navigation works
- [ ] Browse page search and filters function
- [ ] Category pages show correct artisans
- [ ] Artisan profiles load with all tabs
- [ ] Contact forms can be submitted
- [ ] Dark mode toggle works
- [ ] Mobile responsive design
- [ ] 404 pages show for invalid routes

### Test URLs
- Homepage: `http://localhost:3000`
- Browse: `http://localhost:3000/browse`
- Fashion: `http://localhost:3000/categories/fashion`
- Artisan: `http://localhost:3000/artisan/1`
- How It Works: `http://localhost:3000/how-it-works`

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Deploy automatically on push

### Build Commands
```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔄 Future Enhancements

### Immediate Next Steps
- [ ] User authentication system
- [ ] Artisan dashboard for profile management
- [ ] Payment integration
- [ ] Real image uploads
- [ ] Email notifications

### Long-term Features
- [ ] Live chat system
- [ ] Order tracking
- [ ] Review moderation
- [ ] Analytics dashboard
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for connecting artisans with customers who value quality craftsmanship.**