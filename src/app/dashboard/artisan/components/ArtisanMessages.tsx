// src/app/dashboard/artisan/components/ArtisanMessages.tsx
import React, { useState } from 'react';
import { MessageCircle, Search, Send } from 'lucide-react';
import { Message } from '../../../../types';

const mockMessages: Message[] = [
  {
    id: '1',
    customer: 'Jane Smith',
    lastMessage: 'Hi! Can we discuss the dress design details? I have some specific requirements for the beadwork.',
    timestamp: '2 hours ago',
    unread: true,
    orderId: 'ORD-001'
  },
  {
    id: '2',
    customer: 'Michael Johnson',
    lastMessage: 'Thank you for the update on the alterations! The progress looks great so far.',
    timestamp: '1 day ago',
    unread: false,
    orderId: 'ORD-002'
  },
  {
    id: '3',
    customer: 'Sarah Wilson',
    lastMessage: 'I would like to get a quote for a bridesmaid dress. When can we schedule a consultation?',
    timestamp: '2 days ago',
    unread: true,
    orderId: 'ORD-003'
  },
  {
    id: '4',
    customer: 'Emma Davis',
    lastMessage: 'The cocktail dress turned out absolutely perfect! Thank you so much for your amazing work.',
    timestamp: '1 week ago',
    unread: false,
    orderId: 'ORD-004'
  }
];

export function ArtisanMessages() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && message.unread) ||
                         (filter === 'read' && !message.unread);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = mockMessages.filter(m => m.unread).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          {unreadCount > 0 && (
            <p className="text-slate-400">You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            {/* Search and Filter */}
            <div className="p-4 border-b border-slate-700">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465]"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            {/* Message List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-slate-700' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#626F47] rounded-full flex items-center justify-center text-white text-sm">
                        {message.customer.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{message.customer}</h4>
                        <p className="text-slate-500 text-xs">Order #{message.orderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.unread && (
                        <div className="w-2 h-2 bg-[#A4B465] rounded-full"></div>
                      )}
                      <span className="text-slate-500 text-xs">{message.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{message.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-slate-800 rounded-xl border border-slate-700 h-full flex flex-col">
              {/* Message Header */}
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#626F47] rounded-full flex items-center justify-center text-white">
                    {selectedMessage.customer.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{selectedMessage.customer}</h3>
                    <p className="text-slate-400 text-sm">Order #{selectedMessage.orderId}</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 space-y-4 min-h-64">
                {/* Customer Message */}
                <div className="flex justify-start">
                  <div className="bg-slate-700 rounded-lg p-3 max-w-xs">
                    <p className="text-white text-sm">{selectedMessage.lastMessage}</p>
                    <p className="text-slate-500 text-xs mt-1">{selectedMessage.timestamp}</p>
                  </div>
                </div>

                {/* Sample Artisan Reply */}
                <div className="flex justify-end">
                  <div className="bg-[#626F47] rounded-lg p-3 max-w-xs">
                    <p className="text-white text-sm">
                      Hi! I'd be happy to discuss the design details with you. Let me know what specific beadwork style you have in mind.
                    </p>
                    <p className="text-slate-300 text-xs mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465]"
                  />
                  <button className="bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl border border-slate-700 h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Select a conversation</h3>
                <p className="text-slate-400">Choose a message from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Messages</p>
              <p className="text-xl font-bold text-white">{mockMessages.length}</p>
            </div>
            <MessageCircle className="w-6 h-6 text-[#A4B465]" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Unread</p>
              <p className="text-xl font-bold text-white">{unreadCount}</p>
            </div>
            <div className="w-6 h-6 bg-[#A4B465] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{unreadCount}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Response Rate</p>
              <p className="text-xl font-bold text-white">98%</p>
            </div>
            <div className="text-green-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}