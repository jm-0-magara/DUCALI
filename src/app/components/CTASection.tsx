import React from 'react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1D2D50] to-[#6E1414]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#FDF6F0] mb-4">
          Ready to Create Something Amazing?
        </h2>
        <p className="text-xl mb-8 text-[#FDF6F0]/80">
          Join thousands of satisfied customers who found their perfect artisan on Ducali
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/browse"
            className="px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#B08D57]/90 transition-all shadow-lg inline-block" 
            style={{ backgroundColor: '#B08D57', color: '#1C1C1C' }}
          >
            Start Your Order
          </Link>
          <Link 
            href="/browse"
            className="border-2 text-[#FDF6F0] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#FDF6F0] hover:text-[#1C1C1C] transition-all inline-block" 
            style={{ borderColor: '#B08D57' }}
          >
            Become an Artisan
          </Link>
        </div>
      </div>
    </section>
  );
}