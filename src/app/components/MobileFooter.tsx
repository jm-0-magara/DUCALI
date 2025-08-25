"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { adminSettingsService, AdminSettings as AdminSettingsType } from '../../lib/adminSettingsService';

export default function MobileFooter() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  
  // Admin settings state
  const [settings, setSettings] = useState<AdminSettingsType>({
    platformName: 'Ducali',
    platformDescription: 'Connecting artisans with customers worldwide',
    contactEmail: 'admin@ducali.com',
    supportPhone: '+1234567890',
    commissionRate: 10,
    maxFileSize: 10,
    autoApproveArtisans: false,
    requireVerification: true,
    enableNotifications: true,
    maintenanceMode: false,
    currency: 'KSH',
    timezone: 'UTC',
    language: 'English'
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Fetch admin settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        console.log('🔍 MobileFooter: Fetching admin settings from database...');
        
        const platformSettings = await adminSettingsService.getPlatformSettings();
        console.log('✅ MobileFooter: Fetched settings:', platformSettings);
        
        setSettings(platformSettings);
      } catch (error) {
        console.error('❌ MobileFooter: Error fetching settings:', error);
        // Keep using default settings if fetch fails
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const footerSections = [
    {
      id: 'company',
      title: 'Company Info',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Mission', href: '/mission' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' }
      ]
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      links: [
        { name: 'Browse Artisans', href: '/browse' },
        { name: 'Categories', href: '/categories' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Success Stories', href: '/success-stories' }
      ]
    },
    {
      id: 'artisans',
      title: 'For Artisans',
      links: [
        { name: 'Success Stories', href: '/for-artisans/success-stories' },
        { name: 'Artisan Resources', href: '/for-artisans/resources' },
        { name: 'Commission Rates', href: '/for-artisans/commission-rates' },
        { name: 'Artisan Support', href: '/for-artisans/support' }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' }
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Footer Sections */}
        <div className="py-8">
          {footerSections.map((section) => (
            <div key={section.id} className="border-b border-slate-700 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              
              {expandedSections[section.id] && (
                <div className="pb-4 space-y-3">
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block text-slate-300 hover:text-white transition-colors py-2 touch-manipulation"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="py-6 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-5 h-5 text-[#A4B465]" />
              <span>
                {settingsLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Loading...
                  </div>
                ) : (
                  settings.contactEmail
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="w-5 h-5 text-[#A4B465]" />
              <span>
                {settingsLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Loading...
                  </div>
                ) : (
                  settings.supportPhone
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-5 h-5 text-[#A4B465]" />
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="py-6 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors touch-manipulation"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors touch-manipulation"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors touch-manipulation"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors touch-manipulation"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-6 border-t border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-slate-300 mb-4">
            Get the latest updates on new artisans and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] touch-manipulation"
            />
            <button className="px-6 py-3 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors touch-manipulation font-medium">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <Link href="/" className="text-2xl font-bold text-[#B08D57]">
                <span className="font-playfair">
                  {settingsLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      Loading...
                    </span>
                  ) : (
                    settings.platformName
                  )}
                </span>
              </Link>
              <p className="text-slate-400 text-sm mt-1">Bespoke Marketplace</p>
            </div>
            <div className="text-slate-400 text-sm text-center sm:text-right">
              © 2024 {settingsLoading ? 'Ducali' : settings.platformName}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
