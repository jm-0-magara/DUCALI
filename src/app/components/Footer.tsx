"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Heart, Shield, Users, Award } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <footer className={`py-16 px-4 sm:px-6 lg:px-8 ${
      isDark ? 'bg-charcoal-black text-cream' : 'bg-[#EDE8E0] text-charcoal-black'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="text-2xl font-playfair font-bold text-muted-gold">Ducali</div>
            </div>
            <p className={`mb-6 leading-relaxed ${
              isDark ? 'text-cream/80' : 'text-charcoal-black/70'
            }`}>
              Connecting skilled artisans with customers who value quality, craftsmanship, and unique custom-made products.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className={`flex items-center ${
                isDark ? 'text-cream/70' : 'text-charcoal-black/60'
              }`}>
                <Mail className="w-4 h-4 mr-3 text-muted-gold" />
                <span>hello@ducali.com</span>
              </div>
              <div className={`flex items-center ${
                isDark ? 'text-cream/70' : 'text-charcoal-black/60'
              }`}>
                <Phone className="w-4 h-4 mr-3 text-muted-gold" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className={`flex items-center ${
                isDark ? 'text-cream/70' : 'text-charcoal-black/60'
              }`}>
                <MapPin className="w-4 h-4 mr-3 text-muted-gold" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/ducali" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-cream/60 hover:text-muted-gold hover:bg-muted-gold/10' 
                    : 'text-charcoal-black/60 hover:text-muted-gold hover:bg-muted-gold/10'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com/ducali" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-cream/60 hover:text-muted-gold hover:bg-muted-gold/10' 
                    : 'text-charcoal-black/60 hover:text-muted-gold hover:bg-muted-gold/10'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/ducali" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-cream/60 hover:text-muted-gold hover:bg-muted-gold/10' 
                    : 'text-charcoal-black/60 hover:text-muted-gold hover:bg-muted-gold/10'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-gold">Marketplace</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/browse" className={`transition-colors flex items-center ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  <Users className="w-4 h-4 mr-2" />
                  Browse Artisans
                </Link>
              </li>
              <li>
                <Link href="/categories/fashion" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  Fashion & Clothing
                </Link>
              </li>
              <li>
                <Link href="/categories/home-decor" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  Home & Decor
                </Link>
              </li>
              <li>
                <Link href="/categories/jewelry" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  Jewelry & Accessories
                </Link>
              </li>
              <li>
                <Link href="/categories/art-design" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  Art & Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-gold">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/for-artisans/support" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/for-artisans/support" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/for-artisans/support" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-gold">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/how-it-works" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/for-artisans" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  For Artisans
                </Link>
              </li>
              <li>
                <Link href="/browse" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  Browse Artisans
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className={`transition-colors ${
                  isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
                }`}>
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t mt-12 pt-8 ${
          isDark ? 'border-slate-700' : 'border-border'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className={`text-sm ${
              isDark ? 'text-cream/60' : 'text-charcoal-black/60'
            }`}>
              © 2024 Ducali. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/for-artisans/support" className={`text-sm transition-colors ${
                isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
              }`}>
                Privacy Policy
              </Link>
              <Link href="/for-artisans/support" className={`text-sm transition-colors ${
                isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
              }`}>
                Terms of Service
              </Link>
              <Link href="/for-artisans/support" className={`text-sm transition-colors ${
                isDark ? 'text-cream/60 hover:text-cream' : 'text-charcoal-black/60 hover:text-charcoal-black'
              }`}>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}