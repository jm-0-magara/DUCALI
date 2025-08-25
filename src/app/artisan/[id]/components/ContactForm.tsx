"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Clock, FileText } from 'lucide-react';
import { type Artisan } from '../../../../lib/artisanService';
import { useAuth } from '../../../../contexts/AuthContext';
import MessageButton from '../../../../components/messaging/MessageButton';
import QuoteRequestModal from '../../../../components/quotes/QuoteRequestModal';
import { useTheme } from '../../../../contexts/ThemeContext';

interface ContactFormProps {
  artisan: Artisan;
}

export default function ContactForm({ artisan }: ContactFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const ContactInfo = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className={`flex items-center gap-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
      <Icon className="w-5 h-5 text-[#A4B465]" />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );

  return (
    <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
      <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-6`}>Contact</h3>
      
      {/* Contact Information */}
      <div className="mb-6 space-y-3">
        <ContactInfo icon={MapPin} label="Location" value={artisan.location} />
        <ContactInfo icon={Clock} label="Response Time" value={artisan.responseTime || 'Within 24 hours'} />
        {artisan.email && (
          <ContactInfo icon={Mail} label="Email" value={artisan.email} />
        )}
      </div>

      {/* Message Buttons */}
      <div className="space-y-4">
        {/* Quick Message Button */}
        <MessageButton
          artisanId={artisan.id}
          artisanName={artisan.name}
          artisanImage={artisan.profileImage}
          variant="button"
          className="w-full"
        >
          Send Quick Message
        </MessageButton>
        
        {/* Get Quote Button */}
        <button
          type="button"
          onClick={() => setShowQuoteModal(true)}
          disabled={!isAuthenticated}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Get Quote
        </button>

        {!isAuthenticated && (
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} text-center`}>
            Please sign in to send a message or get a quote
          </p>
        )}
      </div>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <QuoteRequestModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          artisanId={artisan.id}
          artisanName={artisan.name}
          artisanSpecialty={artisan.specialty}
          darkMode={isDark}
        />
      )}
    </div>
  );
}