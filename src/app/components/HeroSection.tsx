import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#FDF6F0' }}>
            Bring Your <span style={{ color: '#B08D57' }}>Vision</span> to Life
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: 'rgba(253, 246, 240, 0.8)' }}>
            Connect with skilled artisans and creators to get custom-made products that are uniquely yours. 
            From wedding dresses to handcrafted furniture, we make bespoke accessible.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              className="px-8 py-4 rounded-lg text-lg font-semibold transform hover:scale-105 transition-all shadow-lg"
              style={{ 
                backgroundColor: '#6E1414', 
                color: '#FDF6F0' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(110, 20, 20, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6E1414'}
            >
              Start Your Custom Order
            </button>
            <Link 
              href="/browse" 
              className="border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all inline-block text-center hover:opacity-80"
              style={{ 
                borderColor: '#B08D57', 
                color: '#B08D57' 
              }}
            >
              Browse Artisans
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#B08D57' }}>500+</div>
              <div style={{ color: 'rgba(253, 246, 240, 0.6)' }}>Verified Artisans</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#B08D57' }}>2,500+</div>
              <div style={{ color: 'rgba(253, 246, 240, 0.6)' }}>Orders Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: '#B08D57' }}>4.9★</div>
              <div style={{ color: 'rgba(253, 246, 240, 0.6)' }}>Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}