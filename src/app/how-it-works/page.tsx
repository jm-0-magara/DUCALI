"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../components/Footer';
import { Search, MessageCircle, CreditCard, Package, Shield, Clock, Star, Users, CheckCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const steps = [
    {
      number: "01",
      title: "Browse & Discover",
      description: "Explore our curated selection of verified artisans. Use filters to find specialists in your category, location, and budget range.",
      icon: <Search className="w-8 h-8" />,
      details: [
        "Browse by category or search for specific skills",
        "View portfolios and read customer reviews",
        "Compare pricing and response times",
        "Check artisan verification status"
      ]
    },
    {
      number: "02", 
      title: "Request Custom Quote",
      description: "Contact your chosen artisan with your project details. Get a personalized quote tailored to your specific needs and timeline.",
      icon: <MessageCircle className="w-8 h-8" />,
      details: [
        "Fill out detailed project requirements",
        "Upload reference images or files",
        "Specify budget range and timeline",
        "Receive response within artisan's listed time"
      ]
    },
    {
      number: "03",
      title: "Secure Payment", 
      description: "Once you approve the quote, make a secure payment through our platform. Your payment is protected until project completion.",
      icon: <CreditCard className="w-8 h-8" />,
      details: [
        "Secure payment processing",
        "Milestone-based payments available",
        "Buyer protection guarantee",
        "Multiple payment methods accepted"
      ]
    },
    {
      number: "04",
      title: "Receive Your Creation",
      description: "Your artisan crafts your unique piece with regular updates. Receive your custom creation and share your experience.",
      icon: <Package className="w-8 h-8" />,
      details: [
        "Regular progress updates from artisan",
        "Quality assurance checks",
        "Secure delivery or pickup",
        "Leave a review to help others"
      ]
    }
  ];

  const guarantees = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Artisans",
      description: "All artisans undergo background checks and portfolio verification"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "On-Time Delivery",
      description: "Artisans commit to realistic timelines and update you throughout"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Quality Guarantee",
      description: "Not satisfied? We'll work with you and the artisan to make it right"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customer Support",
      description: "Our team is here to help resolve any issues throughout your project"
    }
  ];

  const faqs = [
    {
      question: "How do I know if an artisan is reliable?",
      answer: "All artisans on Ducali are verified through our screening process. You can also check their ratings, reviews, completed orders, and portfolio before making a decision."
    },
    {
      question: "What if I'm not satisfied with the final product?",
      answer: "We offer buyer protection and will work with both you and the artisan to resolve any issues. Our quality guarantee ensures you're satisfied with your custom creation."
    },
    {
      question: "How does payment work?",
      answer: "You pay securely through our platform after approving the quote. For larger projects, milestone payments can be arranged. Your payment is protected until project completion."
    },
    {
      question: "Can I make changes during the project?",
      answer: "Minor adjustments are usually possible, but significant changes may affect pricing and timeline. Communicate directly with your artisan through our platform."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary by complexity and artisan. You'll see estimated timeframes on each artisan's profile, and they'll provide specific timelines in their quotes."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees! You pay the agreed quote amount plus a small platform fee (clearly shown before payment). Shipping costs are discussed with your artisan."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
    }`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How <span style={{ color: '#A4B465' }}>Ducali</span> Works
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            From discovery to delivery, we make it simple to connect with skilled artisans and bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="bg-[#626F47] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#A4B465] transition-colors">
              Start Browsing Artisans
            </Link>
            <Link href="#process" className="border-2 border-[#A4B465] text-[#A4B465] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#A4B465] hover:text-white transition-colors">
              See the Process
            </Link>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section id="process" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Simple 4-Step Process</h2>
            <p className="text-xl text-slate-300">Getting your custom creation is easier than you think</p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2">
                  <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-[#626F47] p-3 rounded-full text-white">
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-[#A4B465] font-mono text-sm mb-1">STEP {step.number}</div>
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-300 text-lg mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-400">
                          <CheckCircle className="w-4 h-4 text-[#A4B465] flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-[#626F47] to-[#A4B465] rounded-full flex items-center justify-center text-white text-6xl">
                    {step.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Your Trust & Safety</h2>
            <p className="text-xl text-slate-300">We&#39;ve built multiple layers of protection for your peace of mind</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
                <div className="bg-[#626F47] p-3 rounded-full w-fit mx-auto mb-4 text-white">
                  {guarantee.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{guarantee.title}</h3>
                <p className="text-slate-400 text-sm">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-300">Everything you need to know about working with artisans on Ducali</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-900 rounded-lg border border-slate-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-slate-300">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of satisfied customers who&#39;ve brought their visions to life with Ducali&#39;s talented artisans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="bg-[#626F47] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#A4B465] transition-colors inline-flex items-center gap-2">
              Browse Artisans
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/categories/fashion" className="border-2 border-[#A4B465] text-[#A4B465] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#A4B465] hover:text-white transition-colors">
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}