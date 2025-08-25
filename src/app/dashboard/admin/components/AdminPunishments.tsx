"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Ban, 
  Clock, 
  User, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Flag,
  Gavel,
  History,
  Settings,
  Download,
  Plus,
  X,
  Save,
  Upload
} from 'lucide-react';
import { punishmentService } from '../../../../lib/punishmentService';
import { userService, User as UserType } from '../../../../lib/userService';
import { UserSelector } from '../../../../components/UserSelector';

interface Violation {
  id: string;
  userId: string;
  userName: string;
  userRole: 'customer' | 'artisan' | 'admin';
  violationType: 'spam' | 'harassment' | 'fraud' | 'inappropriate_content' | 'fake_reviews' | 'payment_issues' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence?: string[];
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
}

interface Punishment {
  id: string;
  userId: string;
  userName: string;
  violationId: string;
  punishmentType: 'warning' | 'suspension' | 'ban' | 'fine' | 'restriction';
  duration?: number; // in days, 0 for permanent
  reason: string;
  adminNotes: string;
  issuedBy: string;
  issuedAt: Date;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'revoked';
  revokedBy?: string;
  revokedAt?: Date;
  revokedReason?: string;
}

export function AdminPunishments() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [punishments, setPunishments] = useState<Punishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'violations' | 'punishments'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'resolved'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [showNewViolationModal, setShowNewViolationModal] = useState(false);
  const [showNewPunishmentModal, setShowNewPunishmentModal] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  
  // Form states for new violation
  const [newViolation, setNewViolation] = useState({
    userId: '',
    userName: '',
    userRole: 'customer' as 'customer' | 'artisan' | 'admin',
    violationType: 'spam' as 'spam' | 'harassment' | 'fraud' | 'inappropriate_content' | 'fake_reviews' | 'payment_issues' | 'other',
    severity: 'low' as 'low' | 'medium' | 'high' | 'critical',
    description: '',
    evidence: [] as string[],
    reportedBy: 'Current Admin'
  });

  // Form states for new punishment
  const [newPunishment, setNewPunishment] = useState({
    userId: '',
    userName: '',
    violationId: '',
    punishmentType: 'warning' as 'warning' | 'suspension' | 'ban' | 'fine' | 'restriction',
    duration: 0,
    reason: '',
    adminNotes: '',
    issuedBy: 'Current Admin'
  });

  const [submitting, setSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedPunishment, setSelectedPunishment] = useState<Punishment | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const [violationsData, punishmentsData] = await Promise.all([
          punishmentService.getViolations(),
          punishmentService.getPunishments()
        ]);
        
        setViolations(violationsData);
        setPunishments(punishmentsData);
      } catch (error) {
        console.error('Error loading punishment data:', error);
        // Start with empty arrays if Firebase fails
        setViolations([]);
        setPunishments([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getViolationTypeIcon = (type: string) => {
    switch (type) {
      case 'spam':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'harassment':
        return <Ban className="w-4 h-4 text-red-500" />;
      case 'fraud':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'inappropriate_content':
        return <Flag className="w-4 h-4 text-orange-500" />;
      case 'fake_reviews':
        return <Gavel className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-500 bg-green-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'high':
        return 'text-orange-500 bg-orange-500/10';
      case 'critical':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'investigating':
        return 'text-blue-500 bg-blue-500/10';
      case 'resolved':
        return 'text-green-500 bg-green-500/10';
      case 'dismissed':
        return 'text-gray-500 bg-gray-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPunishmentTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'suspension':
        return 'text-orange-500 bg-orange-500/10';
      case 'ban':
        return 'text-red-500 bg-red-500/10';
      case 'fine':
        return 'text-purple-500 bg-purple-500/10';
      case 'restriction':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  // Handle new violation submission
  const handleViolationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionMessage('');

    try {
      // Validate required fields
      if (!newViolation.userId || !newViolation.userName || !newViolation.description) {
        throw new Error('Please fill in all required fields');
      }

      // Create violation using punishment service
      const violationId = await punishmentService.createViolation({
        ...newViolation,
        status: 'pending'
      });
      
      // Add to local state
      const violation: Violation = {
        id: violationId,
        ...newViolation,
        reportedAt: new Date(),
        status: 'pending'
      };

      setViolations(prev => [violation, ...prev]);
      
      setSubmissionMessage('Violation created successfully!');
      setShowNewViolationModal(false);
      
             // Reset form
       setNewViolation({
         userId: '',
         userName: '',
         userRole: 'customer',
         violationType: 'spam',
         severity: 'low',
         description: '',
         evidence: [],
         reportedBy: 'Current Admin'
       });

      // Clear message after 3 seconds
      setTimeout(() => setSubmissionMessage(''), 3000);
    } catch (error) {
      setSubmissionMessage(error instanceof Error ? error.message : 'Failed to create violation');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle new punishment submission
  const handlePunishmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmissionMessage('');

    try {
      // Validate required fields
      if (!newPunishment.userId || !newPunishment.userName || !newPunishment.reason) {
        throw new Error('Please fill in all required fields');
      }

      // Create punishment using punishment service
      const punishmentId = await punishmentService.createPunishment({
        ...newPunishment,
        status: 'active'
      });
      
      // Add to local state
      const punishment: Punishment = {
        id: punishmentId,
        ...newPunishment,
        issuedAt: new Date(),
        status: 'active',
        expiresAt: newPunishment.duration > 0 ? new Date(Date.now() + newPunishment.duration * 24 * 60 * 60 * 1000) : undefined
      };

      setPunishments(prev => [punishment, ...prev]);
      
      setSubmissionMessage('Punishment issued successfully!');
      setShowNewPunishmentModal(false);
      
             // Reset form
       setNewPunishment({
         userId: '',
         userName: '',
         violationId: '',
         punishmentType: 'warning',
         duration: 0,
         reason: '',
         adminNotes: '',
         issuedBy: 'Current Admin'
       });

      // Clear message after 3 seconds
      setTimeout(() => setSubmissionMessage(''), 3000);
    } catch (error) {
      setSubmissionMessage(error instanceof Error ? error.message : 'Failed to issue punishment');
    } finally {
      setSubmitting(false);
    }
  };

  // User selection handlers
  const handleViolationUserSelect = (user: UserType) => {
    setNewViolation(prev => ({
      ...prev,
      userId: user.id,
      userName: user.name,
      userRole: user.role
    }));
  };

  const handlePunishmentUserSelect = (user: UserType) => {
    setNewPunishment(prev => ({
      ...prev,
      userId: user.id,
      userName: user.name
    }));
  };

  // Reset forms when modals close
  const handleCloseViolationModal = () => {
    setShowNewViolationModal(false);
    setNewViolation({
      userId: '',
      userName: '',
      userRole: 'customer',
      violationType: 'spam',
      severity: 'low',
      description: '',
      evidence: [],
      reportedBy: 'Current Admin'
    });
  };

  const handleClosePunishmentModal = () => {
    setShowNewPunishmentModal(false);
    setNewPunishment({
      userId: '',
      userName: '',
      violationId: '',
      punishmentType: 'warning',
      duration: 0,
      reason: '',
      adminNotes: '',
      issuedBy: 'Current Admin'
    });
  };

  // Handle punishment revocation
  const handleRevokePunishment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPunishment) return;

    setSubmitting(true);
    setSubmissionMessage('');

    try {
      await punishmentService.revokePunishment(
        selectedPunishment.id,
        'Current Admin',
        revokeReason
      );

      // Update local state
      setPunishments(prev => prev.map(p => 
        p.id === selectedPunishment.id 
          ? { ...p, status: 'revoked', revokedBy: 'Current Admin', revokedAt: new Date(), revokedReason: revokeReason }
          : p
      ));

      setSubmissionMessage('Punishment revoked successfully!');
      setShowRevokeModal(false);
      setSelectedPunishment(null);
      setRevokeReason('');

      setTimeout(() => setSubmissionMessage(''), 3000);
    } catch (error) {
      setSubmissionMessage(error instanceof Error ? error.message : 'Failed to revoke punishment');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle violation status update
  const handleUpdateViolationStatus = async (violationId: string, newStatus: string) => {
    try {
      await punishmentService.updateViolationStatus(violationId, newStatus, 'Updated by Admin', 'Current Admin');
      
      // Update local state
      setViolations(prev => prev.map(v => 
        v.id === violationId 
          ? { 
              ...v, 
              status: newStatus as any,
              resolvedBy: newStatus === 'resolved' || newStatus === 'dismissed' ? 'Current Admin' : v.resolvedBy,
              resolvedAt: newStatus === 'resolved' || newStatus === 'dismissed' ? new Date() : v.resolvedAt
            }
          : v
      ));

      setSubmissionMessage(`Violation status updated to ${newStatus}`);
      setTimeout(() => setSubmissionMessage(''), 3000);
    } catch (error) {
      setSubmissionMessage(error instanceof Error ? error.message : 'Failed to update violation status');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Punishment Management</h1>
          <p className="text-slate-400">Monitor violations and manage user punishments</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNewViolationModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Violation
          </button>
          <button 
            onClick={() => setShowNewPunishmentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Gavel className="w-4 h-4" />
            Issue Punishment
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Violations</p>
              <p className="text-2xl font-bold text-white">{violations.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Punishments</p>
              <p className="text-2xl font-bold text-white">
                {punishments.filter(p => p.status === 'active').length}
              </p>
            </div>
            <Gavel className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-white">
                {violations.filter(v => v.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Banned Users</p>
              <p className="text-2xl font-bold text-white">
                {punishments.filter(p => p.punishmentType === 'ban' && p.status === 'active').length}
              </p>
            </div>
            <Ban className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search violations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-gold"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
          >
            <option value="all">All Items</option>
            <option value="violations">Violations Only</option>
            <option value="punishments">Punishments Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Violations List */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Violations</h2>
        {violations.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No violations found</h3>
            <p className="text-slate-400">All users are following the rules!</p>
          </div>
        ) : (
          violations.map((violation) => (
            <div key={violation.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Violation Icon */}
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getViolationTypeIcon(violation.violationType)}
                  </div>

                  {/* Violation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                        {violation.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(violation.status)}`}>
                        {violation.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                        {violation.violationType.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1">{violation.userName}</h3>
                    <p className="text-slate-400 text-sm mb-2">{violation.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{violation.userRole}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Reported {violation.reportedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>By: {violation.reportedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                                 {/* Actions */}
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={() => setSelectedViolation(violation)}
                     className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                     title="View Details"
                   >
                     <Eye className="w-4 h-4" />
                   </button>
                   <div className="relative">
                     <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                       <MoreVertical className="w-4 h-4" />
                     </button>
                     <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-xl border border-slate-600 py-2 z-10">
                       <button
                         onClick={() => handleUpdateViolationStatus(violation.id, 'investigating')}
                         className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                       >
                         Mark Investigating
                       </button>
                       <button
                         onClick={() => handleUpdateViolationStatus(violation.id, 'resolved')}
                         className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                       >
                         Mark Resolved
                       </button>
                       <button
                         onClick={() => handleUpdateViolationStatus(violation.id, 'dismissed')}
                         className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                       >
                         Dismiss
                       </button>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Punishments List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">Active Punishments</h2>
        {punishments.filter(p => p.status === 'active').length === 0 ? (
          <div className="text-center py-12">
            <Gavel className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No active punishments</h3>
            <p className="text-slate-400">All users are in good standing!</p>
          </div>
        ) : (
          punishments.filter(p => p.status === 'active').map((punishment) => (
            <div key={punishment.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Punishment Icon */}
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gavel className="w-6 h-6 text-orange-500" />
                  </div>

                  {/* Punishment Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPunishmentTypeColor(punishment.punishmentType)}`}>
                        {punishment.punishmentType}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                        Active
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1">{punishment.userName}</h3>
                    <p className="text-slate-400 text-sm mb-2">{punishment.reason}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Issued {punishment.issuedAt.toLocaleDateString()}</span>
                      </div>
                      {punishment.expiresAt && (
                        <div className="flex items-center gap-1">
                          <span>Expires {punishment.expiresAt.toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span>By: {punishment.issuedBy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                                 {/* Actions */}
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={() => {
                       setSelectedPunishment(punishment);
                       setShowRevokeModal(true);
                     }}
                     className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                     title="Revoke Punishment"
                   >
                     <Edit className="w-4 h-4" />
                   </button>
                   <div className="relative">
                     <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                       <MoreVertical className="w-4 h-4" />
                     </button>
                     <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-xl border border-slate-600 py-2 z-10">
                       <button
                         onClick={() => {
                           setSelectedPunishment(punishment);
                           setShowRevokeModal(true);
                         }}
                         className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                       >
                         Revoke Punishment
                       </button>
                       <button
                         onClick={() => setSelectedPunishment(punishment)}
                         className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                       >
                         View Details
                       </button>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

             {/* Success/Error Message */}
       {submissionMessage && (
         <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
           submissionMessage.includes('successfully') 
             ? 'bg-green-500 text-white' 
             : 'bg-red-500 text-white'
         }`}>
           {submissionMessage}
         </div>
       )}

       {/* New Violation Modal */}
       {showNewViolationModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white">Create New Violation</h2>
               <button
                 onClick={handleCloseViolationModal}
                 className="p-2 text-slate-400 hover:text-white transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>

             <form onSubmit={handleViolationSubmit} className="space-y-4">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Select User *
                    </label>
                    <UserSelector
                      selectedUserId={newViolation.userId}
                      onUserSelect={handleViolationUserSelect}
                      placeholder="Choose a user to report..."
                      disabled={submitting}
                    />
                  </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">
                     User Role
                   </label>
                   <select
                     value={newViolation.userRole}
                     onChange={(e) => setNewViolation(prev => ({ ...prev, userRole: e.target.value as any }))}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
                   >
                     <option value="customer">Customer</option>
                     <option value="artisan">Artisan</option>
                     <option value="admin">Admin</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">
                     Violation Type
                   </label>
                   <select
                     value={newViolation.violationType}
                     onChange={(e) => setNewViolation(prev => ({ ...prev, violationType: e.target.value as any }))}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
                   >
                     <option value="spam">Spam</option>
                     <option value="harassment">Harassment</option>
                     <option value="fraud">Fraud</option>
                     <option value="inappropriate_content">Inappropriate Content</option>
                     <option value="fake_reviews">Fake Reviews</option>
                     <option value="payment_issues">Payment Issues</option>
                     <option value="other">Other</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">
                     Severity
                   </label>
                   <select
                     value={newViolation.severity}
                     onChange={(e) => setNewViolation(prev => ({ ...prev, severity: e.target.value as any }))}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
                   >
                     <option value="low">Low</option>
                     <option value="medium">Medium</option>
                     <option value="high">High</option>
                     <option value="critical">Critical</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">
                   Description *
                 </label>
                 <textarea
                   value={newViolation.description}
                   onChange={(e) => setNewViolation(prev => ({ ...prev, description: e.target.value }))}
                   className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-gold"
                   placeholder="Describe the violation in detail..."
                   rows={4}
                   required
                 />
               </div>

               <div className="flex items-center justify-end gap-3 pt-4">
                 <button
                   type="button"
                   onClick={handleCloseViolationModal}
                   className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={submitting}
                   className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                 >
                   {submitting ? (
                     <>
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                       Creating...
                     </>
                   ) : (
                     <>
                       <Save className="w-4 h-4" />
                       Create Violation
                     </>
                   )}
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}

       {/* New Punishment Modal */}
       {showNewPunishmentModal && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white">Issue New Punishment</h2>
               <button
                 onClick={handleClosePunishmentModal}
                 className="p-2 text-slate-400 hover:text-white transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>

             <form onSubmit={handlePunishmentSubmit} className="space-y-4">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Select User *
                    </label>
                    <UserSelector
                      selectedUserId={newPunishment.userId}
                      onUserSelect={handlePunishmentUserSelect}
                      placeholder="Choose a user to punish..."
                      disabled={submitting}
                    />
                  </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">
                     Violation ID (Optional)
                   </label>
                   <input
                     type="text"
                     value={newPunishment.violationId}
                     onChange={(e) => setNewPunishment(prev => ({ ...prev, violationId: e.target.value }))}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-gold"
                     placeholder="Related violation ID"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">
                     Punishment Type
                   </label>
                   <select
                     value={newPunishment.punishmentType}
                     onChange={(e) => setNewPunishment(prev => ({ ...prev, punishmentType: e.target.value as any }))}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
                   >
                     <option value="warning">Warning</option>
                     <option value="suspension">Suspension</option>
                     <option value="ban">Ban</option>
                     <option value="fine">Fine</option>
                     <option value="restriction">Restriction</option>
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">
                     Duration (Days)
                   </label>
                   <input
                     type="number"
                     value={newPunishment.duration}
                     onChange={(e) => setNewPunishment(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                     className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-gold"
                     placeholder="0 for permanent"
                     min="0"
                   />
                   <p className="text-xs text-slate-400 mt-1">0 = Permanent, 1+ = Temporary</p>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">
                   Reason *
                 </label>
                 <textarea
                   value={newPunishment.reason}
                   onChange={(e) => setNewPunishment(prev => ({ ...prev, reason: e.target.value }))}
                   className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-gold"
                   placeholder="Explain the reason for this punishment..."
                   rows={3}
                   required
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">
                   Admin Notes
                 </label>
                 <textarea
                   value={newPunishment.adminNotes}
                   onChange={(e) => setNewPunishment(prev => ({ ...prev, adminNotes: e.target.value }))}
                   className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-gold"
                   placeholder="Additional notes for internal reference..."
                   rows={3}
                 />
               </div>

               <div className="flex items-center justify-end gap-3 pt-4">
                 <button
                   type="button"
                   onClick={handleClosePunishmentModal}
                   className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={submitting}
                   className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                 >
                   {submitting ? (
                     <>
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                       Issuing...
                     </>
                   ) : (
                     <>
                       <Gavel className="w-4 h-4" />
                       Issue Punishment
                     </>
                   )}
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}

       {/* Revoke Punishment Modal */}
       {showRevokeModal && selectedPunishment && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white">Revoke Punishment</h2>
               <button
                 onClick={() => {
                   setShowRevokeModal(false);
                   setSelectedPunishment(null);
                   setRevokeReason('');
                 }}
                 className="p-2 text-slate-400 hover:text-white transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>

             <div className="mb-4">
               <p className="text-slate-300 mb-2">
                 <strong>User:</strong> {selectedPunishment.userName}
               </p>
               <p className="text-slate-300 mb-2">
                 <strong>Punishment:</strong> {selectedPunishment.punishmentType}
               </p>
               <p className="text-slate-300 mb-4">
                 <strong>Reason:</strong> {selectedPunishment.reason}
               </p>
             </div>

             <form onSubmit={handleRevokePunishment} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">
                   Revocation Reason *
                 </label>
                 <textarea
                   value={revokeReason}
                   onChange={(e) => setRevokeReason(e.target.value)}
                   className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-gold"
                   placeholder="Explain why this punishment is being revoked..."
                   rows={3}
                   required
                 />
               </div>

               <div className="flex items-center justify-end gap-3 pt-4">
                 <button
                   type="button"
                   onClick={() => {
                     setShowRevokeModal(false);
                     setSelectedPunishment(null);
                     setRevokeReason('');
                   }}
                   className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={submitting || !revokeReason.trim()}
                   className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                 >
                   {submitting ? (
                     <>
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                       Revoking...
                     </>
                   ) : (
                     <>
                       <Ban className="w-4 h-4" />
                       Revoke Punishment
                     </>
                   )}
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
     </div>
   );
 }
