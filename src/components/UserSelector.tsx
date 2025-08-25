"use client";

import React, { useState, useEffect } from 'react';
import { Search, User as UserIcon, ChevronDown, X } from 'lucide-react';
import { userService, User } from '../lib/userService';

interface UserSelectorProps {
  selectedUserId: string;
  onUserSelect: (user: User) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function UserSelector({ 
  selectedUserId, 
  onUserSelect, 
  placeholder = "Select a user...",
  className = "",
  disabled = false
}: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const usersData = await userService.getActiveUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Set selected user when selectedUserId changes
  useEffect(() => {
    if (selectedUserId && users.length > 0) {
      const user = users.find(u => u.id === selectedUserId);
      if (user) {
        setSelectedUser(user);
      }
    } else {
      setSelectedUser(null);
    }
  }, [selectedUserId, users]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    onUserSelect(user);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    setSelectedUser(null);
    onUserSelect({} as User); // Pass empty user to clear selection
    setIsOpen(false);
    setSearchQuery('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/10 text-red-500';
      case 'artisan':
        return 'bg-blue-500/10 text-blue-500';
      case 'customer':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected User Display */}
      {selectedUser ? (
        <div className="flex items-center justify-between p-3 bg-slate-700 border border-slate-600 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-gold to-wine-red rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {selectedUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">{selectedUser.name}</div>
              <div className="text-slate-400 text-sm">{selectedUser.email}</div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
              {selectedUser.role}
            </span>
          </div>
          <button
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* User Selection Button */
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full flex items-center justify-between p-3 bg-slate-700 border border-slate-600 rounded-lg text-left hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-slate-400">{placeholder}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 max-h-64 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-slate-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-gold"
                autoFocus
              />
            </div>
          </div>

          {/* Users List */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-gold mx-auto"></div>
                <p className="text-slate-400 text-sm mt-2">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
                             <div className="p-4 text-center">
                 <UserIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                 <p className="text-slate-400 text-sm">
                   {searchQuery ? 'No users found' : 'No users available'}
                 </p>
               </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-700 transition-colors border-b border-slate-600 last:border-b-0"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-gold to-wine-red rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-slate-400 text-sm">{user.email}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
