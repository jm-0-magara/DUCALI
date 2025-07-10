import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Bring Your <span style={{ color: '#A4B465' }}>Vision</span> to Life
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Connect with skilled artisans and creators to get custom-made products that are uniquely yours. 
            From wedding dresses to handcrafted furniture, we make bespoke accessible.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#626F47] transform hover:scale-105 transition-all shadow-lg" style={{ backgroundColor: '#626F47' }}>
              Start Your Custom Order
            </button>
            <Link 
              href="/browse" 
              className="border-2 text-[#A4B465] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#A4B465] hover:text-white transition-all inline-block text-center" 
              style={{ borderColor: '#A4B465' }}
            >
              Browse Artisans
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#A4B465' }}>500+</div>
              <div className="text-slate-400">Verified Artisans</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#A4B465' }}>2,500+</div>
              <div className="text-slate-400">Orders Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#A4B465' }}>4.9★</div>
              <div className="text-slate-400">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}