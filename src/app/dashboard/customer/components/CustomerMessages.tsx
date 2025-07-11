// src/app/dashboard/customer/components/CustomerMessages.tsx
import React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function CustomerMessages() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
        <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-white font-semibold mb-2">No Messages Yet</h3>
        <p className="text-slate-400 mb-4">
          Start a conversation with an artisan to see your messages here.
        </p>
        <Link
          href="/browse"
          className="bg-[#626F47] text-white px-6 py-2 rounded-lg hover:bg-[#A4B465] transition-colors inline-block"
        >
          Browse Artisans
        </Link>
      </div>
    </div>
  );
}