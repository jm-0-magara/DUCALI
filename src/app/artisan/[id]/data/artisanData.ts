export interface ArtisanProfile {
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

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  price: string;
  timeframe: string;
  placeholder: string; // Replace with actual image URLs later
}

export interface Service {
  name: string;
  description: string;
  price: string;
  timeframe: string;
}

export interface Review {
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  projectType?: string;
  helpful: number;
}

// Extended artisan data with full profiles
const artisanProfiles: ArtisanProfile[] = [
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
    fullDescription: 'With over 8 years of experience in bridal fashion, I specialize in creating one-of-a-kind wedding dresses that blend traditional African craftsmanship with contemporary design. Each dress is carefully handcrafted using the finest fabrics and adorned with intricate beadwork that tells your unique story. I work closely with each bride to ensure their dream dress becomes a reality, from initial consultation through final fitting.',
    skills: ['Wedding Dresses', 'Evening Wear', 'Alterations', 'Traditional African Attire', 'Beadwork'],
    verified: true,
    featured: true,
    experience: '8+ years',
    totalReviews: 58,
    portfolio: [
      {
        id: 1,
        title: 'Elegant Mermaid Wedding Dress',
        description: 'Custom mermaid-style wedding dress with hand-sewn pearls and lace detailing',
        price: '$450',
        timeframe: '6 weeks',
        placeholder: '👰‍♀️'
      },
      {
        id: 2,
        title: 'Traditional Kenyan Wedding Gown',
        description: 'Beautiful fusion of modern silhouette with traditional Kenyan beadwork',
        price: '$380',
        timeframe: '5 weeks',
        placeholder: '✨'
      },
      {
        id: 3,
        title: 'Vintage-Inspired Evening Dress',
        description: 'Art deco inspired evening gown with intricate embroidery',
        price: '$320',
        timeframe: '4 weeks',
        placeholder: '🌟'
      }
    ],
    services: [
      {
        name: 'Custom Wedding Dress',
        description: 'Complete custom wedding dress design and creation',
        price: '$300 - $800',
        timeframe: '6-8 weeks'
      },
      {
        name: 'Dress Alterations',
        description: 'Professional alterations for existing dresses',
        price: '$50 - $150',
        timeframe: '1-2 weeks'
      },
      {
        name: 'Evening Wear',
        description: 'Custom evening gowns for special occasions',
        price: '$200 - $500',
        timeframe: '4-6 weeks'
      }
    ],
    reviews: [
      {
        customerName: 'Grace M.',
        rating: 5,
        comment: 'Sarah created the most beautiful wedding dress for me. The attention to detail was incredible and she perfectly captured my vision. I felt like a princess on my wedding day!',
        date: '2 weeks ago',
        verified: true,
        projectType: 'Wedding Dress',
        helpful: 12
      },
      {
        customerName: 'Jennifer K.',
        rating: 5,
        comment: 'Absolutely stunning work! Sarah is not just talented but also very professional. She kept me updated throughout the process and delivered exactly on time.',
        date: '1 month ago',
        verified: true,
        projectType: 'Evening Gown',
        helpful: 8
      },
      {
        customerName: 'Mary W.',
        rating: 4,
        comment: 'Great experience working with Sarah. The dress was beautiful and well-made. Only minor issue was a small delay, but the quality made up for it.',
        date: '2 months ago',
        verified: true,
        projectType: 'Alterations',
        helpful: 5
      }
    ]
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
    fullDescription: 'I am a master craftsman with 12 years of experience in creating bespoke furniture pieces. Using only sustainably sourced local hardwoods, I combine traditional woodworking techniques with contemporary design to create furniture that is both functional and beautiful. Each piece is built to last generations and can be customized to fit your space and style perfectly.',
    skills: ['Custom Furniture', 'Wood Carving', 'Interior Design', 'Restoration', 'Sustainable Crafting'],
    verified: true,
    featured: false,
    experience: '12+ years',
    totalReviews: 42,
    portfolio: [
      {
        id: 1,
        title: 'Modern Dining Table Set',
        description: 'Six-seater dining table with matching chairs, made from mahogany',
        price: '$650',
        timeframe: '8 weeks',
        placeholder: '🪑'
      },
      {
        id: 2,
        title: 'Custom Bookshelf',
        description: 'Floor-to-ceiling bookshelf with integrated lighting',
        price: '$420',
        timeframe: '5 weeks',
        placeholder: '📚'
      },
      {
        id: 3,
        title: 'Handcrafted Coffee Table',
        description: 'Live-edge coffee table with steel legs',
        price: '$280',
        timeframe: '3 weeks',
        placeholder: '☕'
      }
    ],
    services: [
      {
        name: 'Custom Furniture Design',
        description: 'Complete custom furniture pieces designed for your space',
        price: '$200 - $1,200',
        timeframe: '4-10 weeks'
      },
      {
        name: 'Furniture Restoration',
        description: 'Restore and refinish your existing furniture pieces',
        price: '$80 - $300',
        timeframe: '2-4 weeks'
      },
      {
        name: 'Interior Consultation',
        description: 'Professional advice on furniture placement and design',
        price: '$50 - $150',
        timeframe: '1-2 days'
      }
    ],
    reviews: [
      {
        customerName: 'Robert T.',
        rating: 5,
        comment: 'David built us a beautiful dining table that has become the centerpiece of our home. The craftsmanship is exceptional and the wood quality is outstanding.',
        date: '3 weeks ago',
        verified: true,
        projectType: 'Dining Table',
        helpful: 15
      },
      {
        customerName: 'Alice N.',
        rating: 5,
        comment: 'Amazing work! Our custom bookshelf fits perfectly and the attention to detail is incredible. David is a true artist.',
        date: '1 month ago',
        verified: true,
        projectType: 'Custom Bookshelf',
        helpful: 9
      }
    ]
  },
  // Add more artisan profiles as needed...
];

export function getArtisanById(id: number): ArtisanProfile | null {
  return artisanProfiles.find(artisan => artisan.id === id) || null;
}

export function getAllArtisans(): ArtisanProfile[] {
  return artisanProfiles;
}