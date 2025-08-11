import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export function AdminArtisanVerification() {
  const [filter, setFilter] = useState('pending');

  // Mock data - in real app, this would come from Firebase
  const verificationRequests = [
    {
      id: '1',
      name: 'Maria Rodriguez',
      email: 'maria@example.com',
      phone: '+1234567891',
      location: 'Miami, FL',
      specialty: 'Jewelry Making',
      experience: '5 years',
      portfolio: ['jewelry1.jpg', 'jewelry2.jpg', 'jewelry3.jpg'],
      documents: ['id_verification.pdf', 'business_license.pdf'],
      status: 'pending',
      submittedAt: '2024-01-15',
      rating: 4.8,
      totalOrders: 0
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567892',
      location: 'New York, NY',
      specialty: 'Woodworking',
      experience: '8 years',
      portfolio: ['wood1.jpg', 'wood2.jpg'],
      documents: ['id_verification.pdf'],
      status: 'approved',
      submittedAt: '2024-01-10',
      rating: 4.9,
      totalOrders: 12
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1234567893',
      location: 'Los Angeles, CA',
      specialty: 'Textile Design',
      experience: '3 years',
      portfolio: ['textile1.jpg', 'textile2.jpg', 'textile3.jpg'],
      documents: ['id_verification.pdf', 'certificate.pdf'],
      status: 'rejected',
      submittedAt: '2024-01-08',
      rating: 0,
      totalOrders: 0
    }
  ];

  const filteredRequests = verificationRequests.filter(request => 
    filter === 'all' || request.status === filter
  );

  const handleApprove = (requestId: string) => {
    console.log('Approve verification:', requestId);
    // In real app, this would update the verification status
  };

  const handleReject = (requestId: string) => {
    console.log('Reject verification:', requestId);
    // In real app, this would update the verification status
  };

  const handleViewDetails = (requestId: string) => {
    console.log('View details:', requestId);
    // In real app, this would open a modal with full details
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Artisan Verification</h1>
        <p className="text-slate-400 mt-2">Review and manage artisan verification requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-500">
                {verificationRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-500">
                {verificationRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-500">
                {verificationRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Requests</p>
              <p className="text-2xl font-bold text-white">
                {verificationRequests.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Rejected
            </button>
          </div>
          <div className="text-slate-400">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{request.name}</h3>
                    <p className="text-slate-400">{request.specialty}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-slate-300">
                      <Mail className="w-4 h-4 mr-2" />
                      {request.email}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Phone className="w-4 h-4 mr-2" />
                      {request.phone}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      {request.location}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-slate-300">
                      <span className="font-medium">Experience:</span> {request.experience}
                    </div>
                    <div className="text-slate-300">
                      <span className="font-medium">Portfolio:</span> {request.portfolio.length} items
                    </div>
                    <div className="text-slate-300">
                      <span className="font-medium">Documents:</span> {request.documents.length} files
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {request.rating > 0 ? request.rating : 'No ratings'}
                  </div>
                  <div>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <button
                  onClick={() => handleViewDetails(request.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
