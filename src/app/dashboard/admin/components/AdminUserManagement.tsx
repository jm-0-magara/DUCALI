"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Download,
  MoreHorizontal,
  Ban,
  Unlock,
  Crown,
  Star,
  Activity,
  TrendingUp,
  Users as UsersIcon,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import { adminDataService } from '../../../../lib/adminDataService';
import { useTheme } from '../../../../contexts/ThemeContext';

export function AdminUserManagement() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showUserStats, setShowUserStats] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await adminDataService.getUsers();
        console.log('🔍 User Management: Using REAL database data', usersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        console.log('⚠️ User Management: Falling back to MOCK data');
        // Fallback to mock data if Firebase fails
        setUsers([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'customer',
            isVerified: true,
            joinDate: '2024-01-15',
            lastActive: '2024-01-20',
            status: 'active',
            profileImage: null,
            phone: '+1234567890',
            location: 'New York, NY',
            totalOrders: 5,
            totalSpent: 1250
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'artisan',
            isVerified: false,
            joinDate: '2024-01-10',
            lastActive: '2024-01-19',
            status: 'pending',
            profileImage: null,
            phone: '+1234567891',
            location: 'Los Angeles, CA',
            specialty: 'Graphic Design',
            totalOrders: 12,
            totalEarnings: 3200
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            role: 'customer',
            isVerified: true,
            joinDate: '2024-01-05',
            lastActive: '2024-01-18',
            status: 'active',
            profileImage: null,
            phone: '+1234567892',
            location: 'Chicago, IL',
            totalOrders: 3,
            totalSpent: 800
          },
          {
            id: '4',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            role: 'artisan',
            isVerified: true,
            joinDate: '2024-01-08',
            lastActive: '2024-01-21',
            status: 'active',
            profileImage: null,
            phone: '+1234567893',
            location: 'Miami, FL',
            specialty: 'Web Development',
            totalOrders: 8,
            totalEarnings: 2100
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'verified' && user.isVerified) ||
                         (statusFilter === 'unverified' && !user.isVerified);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId);
    // In real app, this would open an edit modal
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // TODO: Implement deleteUser in adminDataService
      setUsers(users.filter(user => user.id !== userId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    try {
      switch (action) {
        case 'verify':
          // TODO: Implement verifyUser in adminDataService
          break;
        case 'suspend':
          // TODO: Implement suspendUser in adminDataService
          break;
        case 'delete':
          // TODO: Implement deleteUser in adminDataService
          break;
      }
      
      // Refresh users list
      const updatedUsers = await adminDataService.getUsers();
      setUsers(updatedUsers);
      setSelectedUsers([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'artisan': return <Star className="w-4 h-4 text-purple-500" />;
      case 'customer': return <Activity className="w-4 h-4 text-blue-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string, isVerified: boolean) => {
    if (status === 'suspended') return 'text-red-500 bg-red-100 dark:bg-red-900/20';
    if (isVerified) return 'text-green-500 bg-green-100 dark:bg-green-900/20';
    return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleExportUsers = () => {
    // TODO: Implement CSV export
    console.log('Exporting users data...');
  };

  const handleUserVerification = async (userId: string, verified: boolean) => {
    try {
      // TODO: Implement updateUserVerification in adminDataService
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isVerified: verified } : user
      ));
    } catch (error) {
      console.error('Error updating user verification:', error);
    }
  };

  const handleUserStatusChange = async (userId: string, status: string) => {
    try {
      // TODO: Implement status update in adminDataService
      console.log('Updating user status:', userId, status);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleUserRoleChange = async (userId: string, role: string) => {
    try {
      // TODO: Implement role update in adminDataService
      console.log('Updating user role:', userId, role);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getFilteredAndSortedUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const paginatedUsers = () => {
    const filtered = getFilteredAndSortedUsers();
    const startIndex = (page - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(getFilteredAndSortedUsers().length / itemsPerPage);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <RefreshCw className="w-8 h-8 animate-spin mr-3" />
        <span>Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>User Management</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-2 text-sm sm:text-base`}>
            Manage platform users, permissions, and account status
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} transition-colors`}
          >
            Bulk Actions
          </button>
          <button
            onClick={() => console.log('Export users')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} transition-colors flex items-center justify-center gap-2`}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Users</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{users.length}</p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <UsersIcon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Verified Users</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {users.filter(u => u.isVerified).length}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <CheckCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Artisans</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {users.filter(u => u.role === 'artisan').length}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <Star className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Users</p>
              <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <TrendingUp className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-4 sm:p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 text-sm sm:text-base ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50 focus:border-[#A4B465]`}
              />
            </div>
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={`px-3 sm:px-4 py-3 text-sm sm:text-base ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50`}
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="artisan">Artisans</option>
            <option value="admin">Admins</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 sm:px-4 py-3 text-sm sm:text-base ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50`}
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-4 sm:p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium text-sm sm:text-base`}>
                {selectedUsers.length} user(s) selected
              </span>
              <button
                onClick={handleSelectAll}
                className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
              >
                {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleBulkAction('verify')}
                className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm sm:text-base"
              >
                Verify Selected
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors text-sm sm:text-base"
              >
                Suspend Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <tr>
                <th className="px-3 sm:px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className={`px-3 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>User</th>
                <th className={`px-3 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'} hidden sm:table-cell`}>Role</th>
                <th className={`px-3 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Status</th>
                <th className={`px-3 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'} hidden md:table-cell`}>Joined</th>
                <th className={`px-3 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'} hidden lg:table-cell`}>Last Active</th>
                <th className={`px-3 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Actions</th>
              </tr>
            </thead>
                         <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
               {filteredUsers.map((user) => (
                 <tr key={user.id} className={`${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'} transition-colors`}>
                   <td className="px-3 sm:px-6 py-4">
                     <input
                       type="checkbox"
                       checked={selectedUsers.includes(user.id)}
                       onChange={() => handleSelectUser(user.id)}
                       className="rounded border-slate-300"
                     />
                   </td>
                   <td className="px-3 sm:px-6 py-4">
                     <div className="flex items-center gap-2 sm:gap-3">
                       <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#A4B465] to-[#626F47] rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                         {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                       </div>
                       <div className="min-w-0 flex-1">
                         <div className={`font-medium text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'} truncate`}>
                           {user.name || 'N/A'}
                         </div>
                         <div className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} truncate`}>
                           {user.email}
                         </div>
                         {/* Show role on mobile */}
                         <div className="sm:hidden flex items-center gap-1 mt-1">
                           {getRoleIcon(user.role)}
                           <span className={`text-xs capitalize ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                             {user.role}
                           </span>
                         </div>
                       </div>
                     </div>
                   </td>
                   <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                     <div className="flex items-center gap-2">
                       {getRoleIcon(user.role)}
                       <span className={`capitalize text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                         {user.role}
                       </span>
                     </div>
                   </td>
                   <td className="px-3 sm:px-6 py-4">
                     <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(user.status, user.isVerified)}`}>
                       {user.isVerified ? 'Verified' : 'Unverified'}
                     </span>
                   </td>
                   <td className={`px-3 sm:px-6 py-4 text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} hidden md:table-cell`}>
                     {new Date(user.joinDate).toLocaleDateString()}
                   </td>
                   <td className={`px-3 sm:px-6 py-4 text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} hidden lg:table-cell`}>
                     {new Date(user.lastActive).toLocaleDateString()}
                   </td>
                   <td className="px-3 sm:px-6 py-4">
                     <div className="flex items-center gap-1 sm:gap-2">
                       <button
                         onClick={() => handleViewUser(user)}
                         className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
                         title="View Details"
                       >
                         <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                       </button>
                       <button
                         onClick={() => handleEditUser(user.id)}
                         className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
                         title="Edit User"
                       >
                         <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                       </button>
                       <button
                         onClick={() => setShowDeleteConfirm(user.id)}
                         className={`p-1.5 sm:p-2 rounded-lg text-red-500 hover:text-red-600 ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'} transition-colors`}
                         title="Delete User"
                       >
                         <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                       </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>

             {/* User Details Modal */}
       {showUserModal && selectedUser && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
             <div className="flex justify-between items-center mb-4 sm:mb-6">
               <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>User Details</h2>
               <button
                 onClick={() => setShowUserModal(false)}
                 className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A4B465] to-[#626F47] rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedUser.name?.charAt(0)?.toUpperCase() || selectedUser.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedUser.name || 'N/A'}
                  </h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Role</label>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedUser.role}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Status</label>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                  </p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Phone</label>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Location</label>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedUser.location || 'N/A'}</p>
                </div>
              </div>
              
              {selectedUser.role === 'artisan' && (
                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Specialty</label>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedUser.specialty || 'N/A'}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Orders</label>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedUser.totalOrders || 0}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {selectedUser.role === 'artisan' ? 'Total Earnings' : 'Total Spent'}
                  </label>
                  <p className={`${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ${selectedUser.totalEarnings || selectedUser.totalSpent || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 max-w-md w-full mx-4`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Delete User</h3>
            </div>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className={`flex-1 px-4 py-2 rounded-xl ${isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
