import React, { useState, useEffect } from 'react';
import { Users, Search, Wifi, WifiOff, Phone, Mail, MapPin, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VendorsManagement = () => {
  const navigate = useNavigate();
  const [allVendors, setAllVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vendorFilter, setVendorFilter] = useState({ status: 'all', availability: 'all', search: '' });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchVendors();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/vendors`, { headers: getAuthHeaders() });
      const data = await response.json();
      setAllVendors(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch vendors');
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId, vendorName) => {
    if (!window.confirm(`Are you sure you want to delete vendor "${vendorName}"? This will also delete all their services.`)) {
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Vendor and their services deleted successfully!');
        setAllVendors(allVendors.filter(v => v._id !== vendorId));
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to delete vendor');
      }
    } catch (err) {
      setError('Failed to delete vendor');
    }
  };

  const filteredVendors = allVendors.filter(vendor => {
    const matchesStatus = vendorFilter.status === 'all' || vendor.status === vendorFilter.status;
    const matchesAvailability = vendorFilter.availability === 'all' || vendor.availabilityStatus === vendorFilter.availability;
    const matchesSearch = vendor.name.toLowerCase().includes(vendorFilter.search.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(vendorFilter.search.toLowerCase());
    return matchesStatus && matchesAvailability && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-slate-900 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        
        {error && (
          <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 text-red-800 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 text-xs sm:text-sm">
            <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')} className="text-base sm:text-lg flex-shrink-0">×</button>
          </div>
        )}
        
        {success && (
          <div className="mb-3 sm:mb-4 bg-green-50 border border-green-200 text-green-800 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 text-xs sm:text-sm">
            <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
            <span className="flex-1">{success}</span>
            <button onClick={() => setSuccess('')} className="text-base sm:text-lg flex-shrink-0">×</button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 md:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-600" size={18} />
              <span>All Vendors ({filteredVendors.length})</span>
            </h2>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search vendors..."
                value={vendorFilter.search}
                onChange={(e) => setVendorFilter({...vendorFilter, search: e.target.value})}
                className="w-full pl-8 sm:pl-9 pr-2.5 sm:pr-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
              />
            </div>
            <select
              value={vendorFilter.status}
              onChange={(e) => setVendorFilter({...vendorFilter, status: e.target.value})}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
            <select
              value={vendorFilter.availability}
              onChange={(e) => setVendorFilter({...vendorFilter, availability: e.target.value})}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
            <button
              onClick={() => setVendorFilter({ status: 'all', availability: 'all', search: '' })}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm"
            >
              Clear Filters
            </button>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="bg-gray-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="text-gray-400" size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">No Vendors Found</h3>
              <p className="text-gray-600 text-xs sm:text-sm">No vendors match your search criteria</p>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {filteredVendors.map((vendor) => (
                <div key={vendor._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 md:p-5 hover:border-blue-300 transition-all">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">{vendor.name}</h3>
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium border ${
                          vendor.availabilityStatus === 'available' 
                            ? 'bg-green-50 text-green-700 border-green-200 flex items-center gap-1' 
                            : 'bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1'
                        }`}>
                          {vendor.availabilityStatus === 'available' ? (
                            <><Wifi size={10} /> Available</>
                          ) : (
                            <><WifiOff size={10} /> Busy</>
                          )}
                        </span>
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium border ${
                          vendor.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {vendor.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                          <Mail size={12} className="text-blue-600 flex-shrink-0" />
                          <span className="text-[11px] sm:text-xs truncate">{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                          <Phone size={12} className="text-green-600 flex-shrink-0" />
                          <span className="text-[11px] sm:text-xs">{vendor.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                          <MapPin size={12} className="text-red-600 flex-shrink-0" />
                          <span className="text-[11px] sm:text-xs truncate">{vendor.location}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteVendor(vendor._id, vendor.name)}
                      className="w-full sm:w-auto sm:ml-4 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all flex items-center justify-center gap-1.5 font-medium border border-red-200 text-xs sm:text-sm"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorsManagement;