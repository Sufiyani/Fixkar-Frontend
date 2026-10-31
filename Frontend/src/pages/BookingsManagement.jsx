import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Trash2, User, Mail, Phone, Home, MapPin, DollarSign, MessageSquare, AlertCircle, CheckCircle, Users, Filter, X, ArrowLeft, Sparkles, TrendingUp, Clock, BadgeCheck } from 'lucide-react';

// Toast Component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  return (
    <div className="fixed top-4 right-4 z-[60] animate-slideIn">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] backdrop-blur-sm`}>
        <CheckCircle size={20} />
        <p className="flex-1 font-medium">{message}</p>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-all">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const BookingsManagement = () => {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingFilter, setBookingFilter] = useState({ service: 'all', status: 'all', search: '' });
  const [toast, setToast] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchBookings();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/bookings`, { headers: getAuthHeaders() });
      const data = await response.json();
      setAllBookings(data);
      setLoading(false);
      showToast(`${data.length} bookings loaded successfully!`, 'success');
    } catch (err) {
      setError('Failed to fetch bookings');
      showToast('Failed to fetch bookings', 'error');
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Booking deleted successfully!');
        showToast('Booking deleted successfully!', 'success');
        setAllBookings(allBookings.filter(b => b._id !== bookingId));
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to delete booking');
        showToast(data.message || 'Failed to delete booking', 'error');
      }
    } catch (err) {
      setError('Failed to delete booking');
      showToast('Failed to delete booking', 'error');
    }
  };

  const filteredBookings = allBookings.filter(booking => {
    const matchesService = bookingFilter.service === 'all' || booking.serviceCategory === bookingFilter.service;
    const matchesStatus = bookingFilter.status === 'all' || booking.status === bookingFilter.status;
    const matchesSearch = booking.userName?.toLowerCase().includes(bookingFilter.search.toLowerCase()) ||
                         booking.vendorName?.toLowerCase().includes(bookingFilter.search.toLowerCase()) ||
                         booking.userPhone?.includes(bookingFilter.search);
    return matchesService && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200',
      'Confirmed': 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200',
      'Completed': 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200',
      'Cancelled': 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200';
  };

  const getBookingStats = () => {
    return {
      total: allBookings.length,
      pending: allBookings.filter(b => b.status === 'Pending').length,
      confirmed: allBookings.filter(b => b.status === 'Confirmed').length,
      completed: allBookings.filter(b => b.status === 'Completed').length,
    };
  };

  const stats = getBookingStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 border-t-slate-900 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="text-slate-900 animate-pulse" size={28} />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading bookings...</p>
          <div className="flex gap-1 justify-center mt-4">
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6">
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-center gap-3 text-sm shadow-lg animate-fadeIn">
            <AlertCircle size={20} />
            <span className="flex-1 font-medium">{error}</span>
            <button onClick={() => setError('')} className="hover:bg-red-200 p-1 rounded-lg transition-all">
              <X size={18} />
            </button>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl flex items-center gap-3 text-sm shadow-lg animate-fadeIn">
            <CheckCircle size={20} />
            <span className="flex-1 font-medium">{success}</span>
            <button onClick={() => setSuccess('')} className="hover:bg-emerald-200 p-1 rounded-lg transition-all">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8 relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Calendar className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
                  <p className="text-gray-600 text-sm mt-1">View and manage all customer bookings</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-5 py-3 rounded-xl font-bold transition-all text-sm shadow-lg"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Calendar className="text-white" size={24} />
              </div>
              <Sparkles className="text-purple-500" size={20} />
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl shadow-lg">
                <Clock className="text-white" size={24} />
              </div>
              <TrendingUp className="text-amber-500" size={20} />
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <BadgeCheck className="text-white" size={24} />
              </div>
              <CheckCircle className="text-blue-500" size={20} />
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Confirmed</p>
            <p className="text-3xl font-bold text-gray-900">{stats.confirmed}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                <CheckCircle className="text-white" size={24} />
              </div>
              <Sparkles className="text-emerald-500" size={20} />
            </div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-xl">
                <Filter className="text-white" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                All Bookings ({filteredBookings.length})
              </h2>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, phone..."
                value={bookingFilter.search}
                onChange={(e) => setBookingFilter({...bookingFilter, search: e.target.value})}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium transition-all"
              />
            </div>
            <select
              value={bookingFilter.status}
              onChange={(e) => setBookingFilter({...bookingFilter, status: e.target.value})}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium transition-all"
            >
              <option value="all">All Status</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Confirmed">✓ Confirmed</option>
              <option value="Completed">✓ Completed</option>
              <option value="Cancelled">✗ Cancelled</option>
            </select>
            <button
              onClick={() => {
                setBookingFilter({ service: 'all', status: 'all', search: '' });
                showToast('Filters cleared!', 'info');
              }}
              className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 px-4 py-3 rounded-xl font-bold transition-all text-sm shadow-md flex items-center justify-center gap-2"
            >
              <X size={18} />
              Clear Filters
            </button>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 animate-fadeIn">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Found</h3>
              <p className="text-gray-600 text-sm">No bookings match your search criteria</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking, index) => (
                <div key={booking._id} className="border-2 border-gray-200 rounded-3xl p-6 hover:border-purple-300 hover:shadow-xl transition-all animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{booking.serviceCategory}</h3>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 shadow-sm ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar size={16} className="text-purple-500" />
                        Booked on: {new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all flex items-center gap-2 font-bold border-2 border-red-300 text-sm shadow-lg"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Details Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200 shadow-md">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                        <div className="bg-blue-500 p-1.5 rounded-lg">
                          <User size={16} className="text-white" />
                        </div>
                        Customer Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3 bg-white/70 px-3 py-2 rounded-xl">
                          <User size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold">Name</p>
                            <p className="font-bold text-gray-900">{booking.userName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/70 px-3 py-2 rounded-xl">
                          <Mail size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold">Email</p>
                            <p className="text-gray-800 truncate">{booking.userEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/70 px-3 py-2 rounded-xl">
                          <Phone size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold">Phone</p>
                            <p className="text-gray-800 font-medium">{booking.userPhone}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/70 px-3 py-2 rounded-xl">
                          <Home size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold">Address</p>
                            <p className="text-gray-800">{booking.userAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vendor Details Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border-2 border-emerald-200 shadow-md">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                        <div className="bg-emerald-500 p-1.5 rounded-lg">
                          <Users size={16} className="text-white" />
                        </div>
                        Vendor Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3 bg-white/70 px-3 py-2 rounded-xl">
                          <User size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold">Name</p>
                            <p className="font-bold text-gray-900">{booking.vendorName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/70 px-3 py-2 rounded-xl">
                          <Mail size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold">Email</p>
                            <p className="text-gray-800 truncate">{booking.vendorEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/70 px-3 py-2 rounded-xl">
                          <Phone size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold">Phone</p>
                            <p className="text-gray-800 font-medium">{booking.vendorPhone}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/70 px-3 py-2 rounded-xl">
                          <MapPin size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold">Service Location</p>
                            <p className="text-gray-800">{booking.serviceLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/70 px-3 py-2 rounded-xl">
                          <DollarSign size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 font-semibold">Price</p>
                            <p className="font-bold text-emerald-600 text-lg">Rs. {booking.servicePrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes Section */}
                  {booking.notes && (
                    <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 border-2 border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                        <div className="bg-gray-600 p-1.5 rounded-lg">
                          <MessageSquare size={16} className="text-white" />
                        </div>
                        Customer Notes
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{booking.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;