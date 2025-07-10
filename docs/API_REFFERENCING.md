# Ducali API Reference

## 📊 Data Structures

### Core Interfaces

#### ArtisanProfile
```typescript
interface ArtisanProfile {
  id: number;                    // Unique identifier
  name: string;                  // Full name
  specialty: string;             // Main specialization
  category: string;              // Must match CategoryInfo.name
  rating: number;                // 0-5 rating
  orders: number;                // Completed orders count
  location: string;              // City location
  image: string;                 // Emoji or image URL
  price: string;                 // Starting price display
  responseTime: string;          // Response time estimate
  description: string;           // Brief description
  fullDescription: string;       // Detailed about section
  skills: string[];              // Array of skills/specialties
  verified: boolean;             // Verification status
  featured: boolean;             // Featured status
  experience: string;            // Years of experience
  totalReviews: number;          // Total review count
  portfolio: PortfolioItem[];    // Work samples
  services: Service[];           // Offered services
  reviews: Review[];             // Customer reviews
}
```

#### CategoryInfo
```typescript
interface CategoryInfo {
  slug: string;                  // URL-friendly identifier
  name: string;                  // Display name (must match artisan.category)
  displayName: string;           // Formatted display name
  description: string;           // Category description
  icon: string;                  // Emoji or icon
  heroImage: string;             // Hero section image
  subcategories: string[];       // Subcategory list
  popularServices: string[];     // Popular service types
}
```

#### PortfolioItem
```typescript
interface PortfolioItem {
  id: number;                    // Unique identifier
  title: string;                 // Project title
  description: string;           // Project description
  price: string;                 // Project cost
  timeframe: string;             // Completion time
  placeholder: string;           // Image placeholder (emoji/URL)
}
```

#### Service
```typescript
interface Service {
  name: string;                  // Service name
  description: string;           // Service description
  price: string;                 // Price range
  timeframe: string;             // Estimated completion time
}
```

#### Review
```typescript
interface Review {
  customerName: string;          // Customer name
  rating: number;                // 1-5 star rating
  comment: string;               // Review text
  date: string;                  // Review date
  verified: boolean;             // Verified purchase
  projectType?: string;          // Optional project type
  helpful: number;               // Helpful vote count
}
```

## 🔧 Data Functions

### Artisan Data Management

#### getAllArtisans()
```typescript
function getAllArtisans(): ArtisanProfile[]
```
Returns all artisan profiles from the data store.

**Returns**: Array of all artisan profiles
**Use Cases**: Browse page, category filtering

#### getArtisanById(id: number)
```typescript
function getArtisanById(id: number): ArtisanProfile | null
```
Retrieves a specific artisan by their ID.

**Parameters**:
- `id`: Artisan unique identifier

**Returns**: Artisan profile or null if not found
**Use Cases**: Individual artisan pages

### Category Data Management

#### getAllCategories()
```typescript
function getAllCategories(): CategoryInfo[]
```
Returns all available categories.

**Returns**: Array of category information
**Use Cases**: Navigation menus, category listings

#### getCategoryData(slug: string)
```typescript
function getCategoryData(slug: string): CategoryInfo | null
```
Retrieves category information by URL slug.

**Parameters**:
- `slug`: Category URL identifier (e.g., "fashion", "home-decor")

**Returns**: Category information or null if not found
**Use Cases**: Category pages, URL routing

#### getArtisansByCategory(categoryName: string)
```typescript
function getArtisansByCategory(categoryName: string): ArtisanProfile[]
```
Filters artisans by category name.

**Parameters**:
- `categoryName`: Must match exactly with category.name

**Returns**: Array of artisans in the specified category
**Use Cases**: Category-specific listings

#### getCategorySlug(categoryName: string)
```typescript
function getCategorySlug(categoryName: string): string | null
```
Gets URL slug from category name.

**Parameters**:
- `categoryName`: Full category name

**Returns**: URL slug or null if category not found
**Use Cases**: URL generation, navigation

## 🔍 Filtering & Search

### useArtisanFilters Hook
```typescript
function useArtisanFilters(artisans: ArtisanProfile[])
```

**Parameters**:
- `artisans`: Array of artisans to filter

**Returns**: Object with filtering state and controls
```typescript
{
  // Search state
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  // Filter state
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verified: boolean) => void;
  
  // Display state
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  
  // Results
  filteredAndSortedArtisans: ArtisanProfile[];
  clearFilters: () => void;
}
```

### Filter Options

#### Category Options
```typescript
const categories = [
  'All Categories',
  'Fashion & Clothing',
  'Home & Decor',
  'Jewelry & Accessories',
  'Art & Design',
  'Food & Catering',
  'Digital Services'
];
```

#### Location Options
```typescript
const locations = [
  'All Locations',
  'Nairobi',
  'Mombasa',
  'Nakuru',
  'Kisumu',
  'Eldoret'
];
```

#### Sort Options
```typescript
const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'orders', label: 'Most Orders' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'response', label: 'Fastest Response' }
];
```

## 🛣️ Routing

### Static Routes
- `/` - Homepage
- `/browse` - Browse all artisans
- `/how-it-works` - Process explanation

### Dynamic Routes

#### Category Pages
**Pattern**: `/categories/[category]`
**Examples**:
- `/categories/fashion`
- `/categories/home-decor`
- `/categories/jewelry`

**Parameters**:
- `category`: Must match CategoryInfo.slug

#### Artisan Profiles
**Pattern**: `/artisan/[id]`
**Examples**:
- `/artisan/1`
- `/artisan/2`

**Parameters**:
- `id`: Must match ArtisanProfile.id

### Route Parameters

#### Accessing Parameters (Next.js 13+)
```typescript
// For async components
interface PageProps {
  params: Promise<{ [key: string]: string }>;
}

export default function Page({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  // Use id...
}
```

## 📝 Form Interfaces

### Contact Form Data
```typescript
interface ContactFormData {
  name: string;                  // Customer name (required)
  email: string;                 // Customer email (required)
  phone: string;                 // Customer phone (optional)
  projectType: string;           // Service type (required)
  budget: string;                // Budget range (optional)
  timeline: string;              // Project timeline (optional)
  description: string;           // Project details (required)
  attachments: FileList;         // Reference files (optional)
}
```

### Budget Options
```typescript
const budgetOptions = [
  { value: 'under-100', label: 'Under $100' },
  { value: '100-300', label: '$100 - $300' },
  { value: '300-500', label: '$300 - $500' },
  { value: '500-1000', label: '$500 - $1,000' },
  { value: '1000-plus', label: '$1,000+' }
];
```

### Timeline Options
```typescript
const timelineOptions = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: 'flexible', label: 'Flexible' }
];
```

## 🎨 Component Props

### Common Component Interfaces

#### Dark Mode Props
```typescript
interface DarkModeProps {
  darkMode: boolean;
  toggleDarkMode?: () => void;
}
```

#### Search Props
```typescript
interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
```

#### Filter Props
```typescript
interface FilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verified: boolean) => void;
}
```

## 🔄 State Management

### Filter State
The application uses React hooks for state management:

```typescript
// Search state
const [searchTerm, setSearchTerm] = useState('');

// Filter state
const [selectedCategory, setSelectedCategory] = useState('All Categories');
const [selectedLocation, setSelectedLocation] = useState('All Locations');
const [minRating, setMinRating] = useState(0);
const [verifiedOnly, setVerifiedOnly] = useState(false);

// Display state
const [sortBy, setSortBy] = useState('featured');
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [showFilters, setShowFilters] = useState(false);
```

### Dark Mode State
```typescript
const [darkMode, setDarkMode] = useState(false);

const toggleDarkMode = () => {
  setDarkMode(!darkMode);
};
```

## 🚨 Error Handling

### Not Found Pages
- Custom 404 pages for invalid artisan IDs
- Custom 404 pages for invalid category slugs
- Fallback to homepage or browse page

### Data Validation
- Type checking with TypeScript
- Runtime validation for required fields
- Graceful degradation for missing data

---

This API reference provides the foundation for extending and maintaining the Ducali marketplace platform.