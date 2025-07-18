import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';

interface FeaturedArtisansProps {
  darkMode: boolean;
}

interface Artisan {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  orders: number;
  location: string;
  image: string;
  price: string;
  responseTime: string;
}

const featuredArtisans: Artisan[] = [
  {
    id: 1,
    name: 'Sarah Kimani',
    specialty: 'Custom Wedding Dresses',
    rating: 4.9,
    orders: 127,
    location: 'Nairobi',
    image: '👩‍🎨',
    price: 'From $200',
    responseTime: '2 hours'
  },
  {
    id: 2,
    name: 'David Ochieng',
    specialty: 'Handcrafted Furniture',
    rating: 4.8,
    orders: 89,
    location: 'Mombasa',
    image: '👨‍🔨',
    price: 'From $150',
    responseTime: '4 hours'
  },
  {
    id: 3,
    name: 'Grace Wanjiku',
    specialty: 'Custom Cakes & Pastries',
    rating: 5.0,
    orders: 156,
    location: 'Nakuru',
    image: '👩‍🍳',
    price: 'From $50',
    responseTime: '1 hour'
  }
];

export default function FeaturedArtisans({ darkMode }: FeaturedArtisansProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Meet Our Featured Artisans
          </h2>
          <p className="text-xl text-slate-300">
            Skilled creators ready to bring your vision to life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtisans.map((artisan) => (
            <div key={artisan.id} className={`rounded-xl shadow-lg border transition-all hover:shadow-xl hover:shadow-[#A4B465]/20 p-6 ${
              darkMode 
                ? 'bg-slate-900 border-slate-600 hover:bg-slate-800' 
                : 'bg-slate-900 border-slate-600 hover:bg-slate-800'
            }`}>
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">{artisan.image}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{artisan.name}</h3>
                  <p className="text-slate-300">{artisan.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-current" style={{ color: '#F0BB78' }} />
                  <span className="ml-1 text-slate-300">{artisan.rating}</span>
                  <span className="ml-1 text-slate-400">({artisan.orders} orders)</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{artisan.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold" style={{ color: '#A4B465' }}>{artisan.price}</div>
                <div className="flex items-center text-slate-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{artisan.responseTime}</span>
                </div>
              </div>
              
              <Link 
                href={`/artisan/${artisan.id}`}
                className="w-full text-white py-3 rounded-lg hover:bg-[#626F47] transition-colors shadow-md inline-block text-center" 
                style={{ backgroundColor: '#626F47' }}
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}