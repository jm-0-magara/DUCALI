import React from 'react';

export default function CTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#626F47] to-[#A4B465]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Create Something Amazing?
        </h2>
        <p className="text-xl mb-8" style={{ color: '#F5ECD5' }}>
          Join thousands of satisfied customers who found their perfect artisan on Ducali
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#F0BB78] transition-all shadow-lg" 
            style={{ backgroundColor: '#F5ECD5', color: '#626F47' }}
          >
            Start Your Order
          </button>
          <button 
            className="border-2 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#626F47] transition-all" 
            style={{ borderColor: '#F5ECD5' }}
          >
            Become an Artisan
          </button>
        </div>
      </div>
    </section>
  );
}