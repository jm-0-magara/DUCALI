//Mock data
export interface Artisan {
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
  skills: string[];
  verified: boolean;
  featured: boolean;
}

export const mockArtisans: Artisan[] = [
  {
    id: 1,
    name: 'Sarah Kimani',
    specialty: 'Custom Wedding Dresses',
    category: 'Fashion & Clothing',
    rating: 4.9,
    orders: 127,
    location: 'Nairobi',
    image: '👩‍🎨',
    price: 'From $200',
    responseTime: '2 hours',
    description: 'Specializing in elegant wedding dresses with intricate beadwork and traditional African influences.',
    skills: ['Wedding Dresses', 'Evening Wear', 'Alterations'],
    verified: true,
    featured: true
  },
  {
    id: 2,
    name: 'David Ochieng',
    specialty: 'Handcrafted Furniture',
    category: 'Home & Decor',
    rating: 4.8,
    orders: 89,
    location: 'Mombasa',
    image: '👨‍🔨',
    price: 'From $150',
    responseTime: '4 hours',
    description: 'Creating unique furniture pieces using sustainable local wood and modern design principles.',
    skills: ['Custom Furniture', 'Wood Carving', 'Interior Design'],
    verified: true,
    featured: false
  },
  {
    id: 3,
    name: 'Grace Wanjiku',
    specialty: 'Custom Cakes & Pastries',
    category: 'Food & Catering',
    rating: 5.0,
    orders: 156,
    location: 'Nakuru',
    image: '👩‍🍳',
    price: 'From $50',
    responseTime: '1 hour',
    description: 'Award-winning baker creating stunning custom cakes for weddings, birthdays, and special events.',
    skills: ['Wedding Cakes', 'Birthday Cakes', 'Pastries'],
    verified: true,
    featured: true
  },
  {
    id: 4,
    name: 'James Mwangi',
    specialty: 'Leather Craftsman',
    category: 'Fashion & Clothing',
    rating: 4.7,
    orders: 73,
    location: 'Kisumu',
    image: '👨‍🎨',
    price: 'From $80',
    responseTime: '3 hours',
    description: 'Hand-crafting premium leather goods including bags, belts, and accessories with traditional techniques.',
    skills: ['Leather Bags', 'Belts', 'Wallets'],
    verified: true,
    featured: false
  },
  {
    id: 5,
    name: 'Mary Achieng',
    specialty: 'Ceramic Artist',
    category: 'Art & Design',
    rating: 4.6,
    orders: 45,
    location: 'Eldoret',
    image: '👩‍🎨',
    price: 'From $30',
    responseTime: '6 hours',
    description: 'Creating beautiful ceramic pieces for home decor, including vases, bowls, and decorative sculptures.',
    skills: ['Pottery', 'Ceramic Sculptures', 'Home Decor'],
    verified: false,
    featured: false
  },
  {
    id: 6,
    name: 'Peter Kamau',
    specialty: 'Jewelry Designer',
    category: 'Jewelry & Accessories',
    rating: 4.9,
    orders: 112,
    location: 'Nairobi',
    image: '👨‍💍',
    price: 'From $120',
    responseTime: '2 hours',
    description: 'Designing unique jewelry pieces using precious metals and gemstones with modern and traditional influences.',
    skills: ['Engagement Rings', 'Necklaces', 'Custom Jewelry'],
    verified: true,
    featured: true
  }
];