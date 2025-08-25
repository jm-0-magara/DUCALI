"use client";

import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../components/Footer';
import { DollarSign, Calculator, TrendingUp, Shield, Clock, CreditCard, Zap, CheckCircle, Info, Percent, Users, Award } from 'lucide-react';

interface CommissionTier {
  id: string;
  name: string;
  description: string;
  commissionRate: number;
  requirements: string[];
  benefits: string[];
  icon: React.ReactNode;
  color: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  processingTime: string;
  fees: string;
  icon: React.ReactNode;
}

const commissionTiers: CommissionTier[] = [
  {
    id: '1',
    name: 'Starter Tier',
    description: 'Perfect for new artisans just getting started',
    commissionRate: 15,
    requirements: [
      'Complete profile verification',
      'Upload at least 5 portfolio items',
      'Maintain 4.0+ rating',
      'Complete first 3 orders'
    ],
    benefits: [
      'Standard platform features',
      'Basic customer support',
      'Access to resources library',
      'Standard payment processing'
    ],
    icon: <Users className="w-6 h-6" />,
    color: 'text-blue-400'
  },
  {
    id: '2',
    name: 'Professional Tier',
    description: 'For established artisans with proven track record',
    commissionRate: 12,
    requirements: [
      'Complete 20+ orders successfully',
      'Maintain 4.5+ rating',
      '90%+ on-time delivery rate',
      'Active for 3+ months'
    ],
    benefits: [
      'Reduced commission rate',
      'Priority customer support',
      'Featured in search results',
      'Advanced analytics dashboard',
      'Early access to new features'
    ],
    icon: <Award className="w-6 h-6" />,
    color: 'text-green-400'
  },
  {
    id: '3',
    name: 'Elite Tier',
    description: 'Top-performing artisans with exceptional service',
    commissionRate: 8,
    requirements: [
      'Complete 50+ orders successfully',
      'Maintain 4.8+ rating',
      '95%+ on-time delivery rate',
      'Active for 6+ months',
      'Featured artisan status'
    ],
    benefits: [
      'Lowest commission rate',
      'VIP customer support',
      'Premium placement in search',
      'Exclusive marketing opportunities',
      'Direct partnership opportunities',
      'Custom branding options'
    ],
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-purple-400'
  }
];

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'M-Pesa',
    description: 'Instant mobile money transfers',
    processingTime: 'Instant',
    fees: 'KES 30 per transaction',
    icon: <CreditCard className="w-6 h-6" />
  },
  {
    id: '2',
    name: 'Bank Transfer',
    description: 'Direct bank account deposits',
    processingTime: '1-3 business days',
    fees: 'Free',
    icon: <CreditCard className="w-6 h-6" />
  },
  {
    id: '3',
    name: 'PayPal',
    description: 'International payment processing',
    processingTime: '1-2 business days',
    fees: '2.9% + KES 50',
    icon: <CreditCard className="w-6 h-6" />
  }
];

export default function CommissionRates() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [orderValue, setOrderValue] = React.useState(10000);
  const [selectedTier, setSelectedTier] = React.useState(commissionTiers[0]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const calculateEarnings = (value: number, commissionRate: number) => {
    const commission = (value * commissionRate) / 100;
    const netEarnings = value - commission;
    return { commission, netEarnings };
  };

  const { commission, netEarnings } = calculateEarnings(orderValue, selectedTier.commissionRate);

  return (
    <div className={`min-h-screen transition-colors duration-300`}
         style={{
           background: darkMode 
             ? 'linear-gradient(to bottom right, #1C1C1C, #1D2D50, #1C1C1C)'
             : 'linear-gradient(to bottom right, #1D2D50, #B08D57, #6E1414)'
         }}>
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <DollarSign className="w-16 h-16 text-[#B08D57] mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Commission Rates & Payments
            </h1>
            <p className="text-xl text-[#FDF6F0]/80 max-w-3xl mx-auto leading-relaxed">
              Transparent, competitive commission rates designed to help you maximize your earnings. 
              The more you succeed, the less you pay. Start earning more today.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Percent className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">8-15%</div>
              <div className="text-[#FDF6F0]/70">Commission Range</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Clock className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">24-72h</div>
              <div className="text-[#FDF6F0]/70">Payment Processing</div>
            </div>
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20">
              <Shield className="w-8 h-8 text-[#B08D57] mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-[#FDF6F0]/70">Secure Payments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Commission Tiers</h2>
            <p className="text-[#FDF6F0]/80 text-lg">
              Earn more as you grow. Our tiered commission structure rewards quality and consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {commissionTiers.map((tier) => (
              <div 
                key={tier.id}
                className={`bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                  selectedTier.id === tier.id 
                    ? 'border-[#B08D57] shadow-lg shadow-[#B08D57]/20' 
                    : 'border-[#B08D57]/20 hover:border-[#B08D57]/40'
                }`}
                onClick={() => setSelectedTier(tier)}
              >
                <div className="text-center mb-6">
                  <div className={`${tier.color} mb-3`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-2">{tier.name}</h3>
                  <p className="text-[#FDF6F0]/70 text-sm mb-4">{tier.description}</p>
                  <div className="text-3xl font-bold text-[#B08D57] mb-1">
                    {tier.commissionRate}%
                  </div>
                  <div className="text-[#FDF6F0]/60 text-sm">Commission Rate</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Requirements</h4>
                    <ul className="space-y-2">
                      {tier.requirements.map((req, index) => (
                        <li key={index} className="flex items-start text-[#FDF6F0]/70 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Benefits</h4>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-[#FDF6F0]/70 text-sm">
                          <Zap className="w-4 h-4 text-[#B08D57] mr-2 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Earnings Calculator</h2>
            <p className="text-[#FDF6F0]/80 text-lg">
              See how much you'll earn with different order values and commission tiers.
            </p>
          </div>

          <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#B08D57]/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Calculate Your Earnings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#FDF6F0]/80 text-sm mb-2">
                      Order Value (KES)
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={orderValue}
                      onChange={(e) => setOrderValue(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-[#FDF6F0]/60 text-sm mt-2">
                      <span>KES 1,000</span>
                      <span>KES 100,000</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-2xl font-bold text-[#B08D57]">
                        KES {orderValue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#FDF6F0]/80 text-sm mb-2">
                      Commission Tier
                    </label>
                    <div className="space-y-2">
                      {commissionTiers.map((tier) => (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedTier(tier)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedTier.id === tier.id
                              ? 'bg-[#B08D57] text-[#1C1C1C]'
                              : 'bg-[#2A2A2A] text-[#FDF6F0] hover:bg-[#2A2A2A]/80'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{tier.name}</span>
                            <span className="text-sm">{tier.commissionRate}%</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-4">Your Earnings</h3>
                
                <div className="space-y-4">
                  <div className="bg-[#2A2A2A] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#FDF6F0]/80">Order Value</span>
                      <span className="text-white font-semibold">
                        KES {orderValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#FDF6F0]/80">Commission ({selectedTier.commissionRate}%)</span>
                      <span className="text-red-400 font-semibold">
                        -KES {commission.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-[#B08D57]/20 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#FDF6F0] font-semibold">Your Earnings</span>
                        <span className="text-[#B08D57] font-bold text-xl">
                          KES {netEarnings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2A2A2A] rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Monthly Projection</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#FDF6F0]/70">10 orders/month</span>
                        <span className="text-[#B08D57] font-semibold">
                          KES {(netEarnings * 10).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#FDF6F0]/70">20 orders/month</span>
                        <span className="text-[#B08D57] font-semibold">
                          KES {(netEarnings * 20).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#FDF6F0]/70">50 orders/month</span>
                        <span className="text-[#B08D57] font-semibold">
                          KES {(netEarnings * 50).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Payment Methods</h2>
            <p className="text-[#FDF6F0]/80 text-lg">
              Get paid quickly and securely through multiple payment options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-xl p-6 border border-[#B08D57]/20 hover:border-[#B08D57]/40 transition-all duration-300"
              >
                <div className="text-[#B08D57] mb-4">
                  {method.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{method.name}</h3>
                <p className="text-[#FDF6F0]/70 text-sm mb-4">{method.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#FDF6F0]/60 text-sm">Processing Time</span>
                    <span className="text-white text-sm">{method.processingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#FDF6F0]/60 text-sm">Fees</span>
                    <span className="text-white text-sm">{method.fees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Schedule */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#B08D57]/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Payment Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#B08D57] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#1C1C1C] font-bold">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Order Completion</h3>
                <p className="text-[#FDF6F0]/70 text-sm">
                  Customer marks order as complete and leaves review
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[#B08D57] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#1C1C1C] font-bold">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Payment Processing</h3>
                <p className="text-[#FDF6F0]/70 text-sm">
                  We process your payment within 24-72 hours
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-[#B08D57] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#1C1C1C] font-bold">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Funds Available</h3>
                <p className="text-[#FDF6F0]/70 text-sm">
                  Money is transferred to your chosen payment method
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-lg p-6 border border-[#B08D57]/20">
              <h3 className="text-white font-semibold mb-2">How do commission rates work?</h3>
              <p className="text-[#FDF6F0]/70">
                Commission rates are calculated as a percentage of the total order value. For example, 
                with a 12% commission rate on a KES 10,000 order, you would pay KES 1,200 in commission 
                and earn KES 8,800.
              </p>
            </div>
            
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-lg p-6 border border-[#B08D57]/20">
              <h3 className="text-white font-semibold mb-2">When do I get paid?</h3>
              <p className="text-[#FDF6F0]/70">
                Payments are processed within 24-72 hours after the customer marks the order as complete. 
                The exact timing depends on your chosen payment method.
              </p>
            </div>
            
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-lg p-6 border border-[#B08D57]/20">
              <h3 className="text-white font-semibold mb-2">How do I qualify for lower commission rates?</h3>
              <p className="text-[#FDF6F0]/70">
                To qualify for lower commission rates, you need to meet the requirements for each tier. 
                Focus on completing orders successfully, maintaining high ratings, and delivering on time.
              </p>
            </div>
            
            <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-lg p-6 border border-[#B08D57]/20">
              <h3 className="text-white font-semibold mb-2">Are there any hidden fees?</h3>
              <p className="text-[#FDF6F0]/70">
                No hidden fees! The commission rate is clearly stated and applied to all orders. 
                Payment processing fees may apply depending on your chosen payment method.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#1C1C1C]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#B08D57]/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-[#FDF6F0]/80 mb-6 text-lg">
              Join thousands of artisans who are already earning more with our competitive commission rates. 
              Start your journey today and keep more of what you earn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-[#B08D57] text-[#1C1C1C] font-semibold rounded-lg hover:bg-[#A4B465] transition-colors">
                Join as Artisan
              </button>
              <button className="px-8 py-3 border border-[#B08D57] text-[#FDF6F0] font-semibold rounded-lg hover:bg-[#B08D57]/10 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
