import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Users, TrendingUp, Clock, AlertCircle, Calendar, Filter, Search, Wifi, WifiOff, Phone, Mail, MapPin, Award, Trash2, Home, X, BarChart3, Activity } from 'lucide-react';

// Toast
const Toast = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast ${t.type === 'success' ? 'toast-success' : 'toast-error'}`}>
        {t.type === 'success' ? <CheckCircle size={17} className="flex-shrink-0" /> : <AlertCircle size={17} className="flex-shrink-0" />}
        <p className="flex-1">{t.message}</p>
        <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100 transition-opacity"><X size={15} /></button>
      </div>
    ))}
  </div>
);

// Stat Card
const StatCard = ({ icon: Icon, label, value, color, bgColor, sub }) => (
  <div className="card-dark rounded-2xl p-5 group hover:border-indigo-500/30 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 ${bgColor} border rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className={color} size={19} />
      </div>
      <Activity className="text-white/10" size={16} />
    </div>
    <p className="text-white/45 text-xs font-medium mb-1">{label}</p>
    <p className="text-2xl font-black text-white">{value}</p>
    {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [view, setView] = useState('dashboard');
  const [pendingServices, setPendingServices] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [stats, setStats] = useState({ totalVendors:0, pendingServices:0, approvedServices:0, totalServices:0, totalBookings:0, availableVendors:0, busyVendors:0, pendingBookings:0, confirmedBookings:0, completedBookings:0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [vendorFilter, setVendorFilter] = useState({ status:'all', availability:'all', search:'' });
  const [bookingFilter, setBookingFilter] = useState({ service:'all', status:'all', search:'' });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => { fetchData(); }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  });

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };
  const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sR, vR, bR, stR] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/services/pending`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/admin/vendors`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/admin/bookings`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/admin/stats`, { headers: getAuthHeaders() }),
      ]);
      const [s, v, b, st] = await Promise.all([sR.json(), vR.json(), bR.json(), stR.json()]);
      setPendingServices(s); setAllVendors(v); setAllBookings(b); setStats(st);
    } catch { setError('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (serviceId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/services/${serviceId}/approve`, { method: 'PUT', headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok) { addToast('Service approved!'); setPendingServices(p => p.filter(s => s._id !== serviceId)); fetchData(); }
      else addToast(data.message || 'Failed to approve', 'error');
    } catch { addToast('Failed to approve service', 'error'); }
  };

  const handleDisapprove = (id) => { setDeleteTarget({ type:'service', id, name:'this service' }); setShowDeleteModal(true); };
  const handleDeleteVendor = (id, name) => { setDeleteTarget({ type:'vendor', id, name }); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      let url;
      if (deleteTarget.type === 'service') url = `${API_BASE_URL}/admin/services/${deleteTarget.id}/disapprove`;
      else if (deleteTarget.type === 'vendor') url = `${API_BASE_URL}/admin/vendors/${deleteTarget.id}`;
      else url = `${API_BASE_URL}/bookings/${deleteTarget.id}`;

      const method = deleteTarget.type === 'service' ? 'DELETE' : 'DELETE';
      const res = await fetch(url, { method, headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok) {
        addToast(`${deleteTarget.type === 'vendor' ? 'Vendor' : 'Service'} deleted successfully!`);
        if (deleteTarget.type === 'service') setPendingServices(p => p.filter(s => s._id !== deleteTarget.id));
        else if (deleteTarget.type === 'vendor') setAllVendors(p => p.filter(v => v._id !== deleteTarget.id));
        else setAllBookings(p => p.filter(b => b._id !== deleteTarget.id));
        fetchData();
      } else addToast(data.message || 'Failed to delete', 'error');
    } catch { addToast('Failed to delete', 'error'); }
    finally { setShowDeleteModal(false); setDeleteTarget(null); }
  };

  const filteredVendors = allVendors.filter(v => {
    const ms = vendorFilter.status === 'all' || v.status === vendorFilter.status;
    const ma = vendorFilter.availability === 'all' || v.availabilityStatus === vendorFilter.availability;
    const mq = v.name?.toLowerCase().includes(vendorFilter.search.toLowerCase()) || v.email?.toLowerCase().includes(vendorFilter.search.toLowerCase());
    return ms && ma && mq;
  });

  const filteredBookings = allBookings.filter(b => {
    const ms = bookingFilter.status === 'all' || b.status === bookingFilter.status;
    const mq = b.userName?.toLowerCase().includes(bookingFilter.search.toLowerCase()) || b.userPhone?.includes(bookingFilter.search);
    return ms && mq;
  });

  const getStatusBadge = (status) => {
    const map = {
      'Pending':   'badge-warning',
      'Confirmed': 'badge-indigo',
      'Completed': 'badge-success',
      'Cancelled': 'badge-error',
      'Approved':  'badge-success',
    };
    return map[status] || 'badge-indigo';
  };

  const navItems = [
    { id:'dashboard', icon: Home,      label:'Dashboard' },
    { id:'vendors',   icon: Users,     label:'Vendors'   },
    { id:'bookings',  icon: Calendar,  label:'Bookings'  },
    { id:'pending',   icon: Clock,     label:'Pending'   },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-2 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center"><Shield className="text-indigo-400" size={18} /></div>
          </div>
          <p className="text-white/45 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-strong rounded-2xl max-w-md w-full p-7 animate-scale-in text-center">
            <div className="w-14 h-14 bg-red-500/15 border border-red-500/25 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Trash2 className="text-red-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Confirm Delete</h3>
            <p className="text-white/45 text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">{deleteTarget?.name}</span>?
              {deleteTarget?.type === 'vendor' && ' This will also delete all their services.'} This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                className="flex-1 btn-ghost py-3 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={confirmDelete}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/50 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2">
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0d0d18] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/15 border border-indigo-500/25 rounded-xl flex items-center justify-center">
                <Shield className="text-indigo-400" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
                <p className="text-white/35 text-xs">Platform management & analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              All systems operational
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex gap-1 pb-0">
            {navItems.map(n => (
              <button key={n.id} onClick={() => setView(n.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  view === n.id
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}>
                <n.icon size={15} />
                {n.label}
                {n.id === 'pending' && pendingServices.length > 0 && (
                  <span className="bg-amber-500/20 text-amber-400 text-xs px-1.5 py-0.5 rounded-full border border-amber-500/25 font-bold leading-none">
                    {pendingServices.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
            <button onClick={() => setError('')} className="ml-auto opacity-60 hover:opacity-100">×</button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── DASHBOARD ── */}
        {view === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={Users} label="Total Vendors" value={stats.totalVendors} color="text-indigo-400" bgColor="bg-indigo-500/10 border-indigo-500/20" sub={`${stats.availableVendors} available · ${stats.busyVendors} busy`} />
              <StatCard icon={Clock} label="Pending Services" value={stats.pendingServices} color="text-amber-400" bgColor="bg-amber-500/10 border-amber-500/20" />
              <StatCard icon={CheckCircle} label="Approved Services" value={stats.approvedServices} color="text-emerald-400" bgColor="bg-emerald-500/10 border-emerald-500/20" />
              <StatCard icon={Calendar} label="Total Bookings" value={stats.totalBookings || 0} color="text-purple-400" bgColor="bg-purple-500/10 border-purple-500/20" sub={`${stats.pendingBookings || 0} pending`} />
            </div>

            <div className="grid lg:grid-cols-2 gap-5 mb-6">
              <button onClick={() => setView('vendors')}
                className="card-dark rounded-2xl p-6 text-left hover:border-indigo-500/40 group transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="text-indigo-400" size={22} />
                  </div>
                  <span className="text-3xl font-black text-white">{stats.totalVendors}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Manage Vendors</h3>
                <p className="text-white/40 text-sm mb-4">View all vendors, check availability and manage accounts</p>
                <div className="flex gap-4 text-xs text-white/35">
                  <span className="flex items-center gap-1.5"><Wifi size={12} className="text-emerald-400" /> {stats.availableVendors} Available</span>
                  <span className="flex items-center gap-1.5"><WifiOff size={12} className="text-orange-400" /> {stats.busyVendors} Busy</span>
                </div>
                <div className="mt-4 text-sm font-semibold text-indigo-400 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  View All Vendors →
                </div>
              </button>

              <button onClick={() => setView('bookings')}
                className="card-dark rounded-2xl p-6 text-left hover:border-purple-500/40 group transition-all">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="text-purple-400" size={22} />
                  </div>
                  <span className="text-3xl font-black text-white">{stats.totalBookings || 0}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Manage Bookings</h3>
                <p className="text-white/40 text-sm mb-4">Track all customer bookings, filter by service and status</p>
                <div className="flex gap-4 text-xs text-white/35">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-amber-400" /> {stats.pendingBookings || 0} Pending</span>
                  <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-emerald-400" /> {stats.confirmedBookings || 0} Confirmed</span>
                </div>
                <div className="mt-4 text-sm font-semibold text-purple-400 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  View All Bookings →
                </div>
              </button>
            </div>

            {/* Pending Services */}
            <div className="card-dark rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Clock className="text-amber-400" size={18} />
                  Pending Approvals
                  {pendingServices.length > 0 && (
                    <span className="badge-warning">{pendingServices.length}</span>
                  )}
                </h2>
                {pendingServices.length > 0 && (
                  <button onClick={() => setView('pending')} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">View all →</button>
                )}
              </div>

              {pendingServices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-emerald-400" size={26} />
                  </div>
                  <h3 className="font-bold text-white mb-1">All caught up!</h3>
                  <p className="text-white/35 text-sm">No pending services to review</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingServices.slice(0, 3).map(svc => (
                    <div key={svc._id} className="glass rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-indigo-500/25 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm">{svc.category}</p>
                        <p className="text-white/40 text-xs mt-0.5">by {svc.vendorId?.name} · {svc.location}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={() => handleApprove(svc._id)}
                          className="flex-1 sm:flex-none bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/25 px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all">
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button onClick={() => handleDisapprove(svc._id)}
                          className="flex-1 sm:flex-none bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25 px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all">
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── VENDORS ── */}
        {view === 'vendors' && (
          <div className="card-dark rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Users className="text-indigo-400" size={18} />
                All Vendors <span className="text-white/30 font-normal">({filteredVendors.length})</span>
              </h2>
              <button onClick={() => setView('dashboard')} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">← Dashboard</button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
                <input type="text" placeholder="Search vendors..." value={vendorFilter.search}
                  onChange={(e) => setVendorFilter({...vendorFilter, search: e.target.value})}
                  className="input-dark w-full pl-9 pr-3 py-2.5 text-sm" />
              </div>
              <select value={vendorFilter.status} onChange={(e) => setVendorFilter({...vendorFilter, status: e.target.value})}
                className="input-dark px-3 py-2.5 text-sm">
                <option value="all" className="bg-[#111118]">All Status</option>
                <option value="Approved" className="bg-[#111118]">Approved</option>
                <option value="Pending" className="bg-[#111118]">Pending</option>
              </select>
              <select value={vendorFilter.availability} onChange={(e) => setVendorFilter({...vendorFilter, availability: e.target.value})}
                className="input-dark px-3 py-2.5 text-sm">
                <option value="all" className="bg-[#111118]">All Availability</option>
                <option value="available" className="bg-[#111118]">Available</option>
                <option value="busy" className="bg-[#111118]">Busy</option>
              </select>
              <button onClick={() => setVendorFilter({ status:'all', availability:'all', search:'' })}
                className="btn-ghost py-2.5 text-sm font-medium rounded-xl">Clear Filters</button>
            </div>

            {filteredVendors.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white/25" size={26} />
                </div>
                <p className="text-white/40 text-sm">No vendors match your search</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredVendors.map(v => (
                  <div key={v._id} className="glass rounded-xl p-4 hover:border-indigo-500/25 transition-all">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <p className="font-semibold text-white">{v.name}</p>
                          <span className={v.availabilityStatus === 'available' ? 'badge-success' : 'badge-warning'}>
                            {v.availabilityStatus === 'available' ? <><Wifi size={10}/> Available</> : <><WifiOff size={10}/> Busy</>}
                          </span>
                          <span className={v.status === 'Approved' ? 'badge-success' : 'badge-warning'}>{v.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-white/40">
                          <span className="flex items-center gap-1.5"><Mail size={12} /> {v.email}</span>
                          <span className="flex items-center gap-1.5"><Phone size={12} /> {v.phone}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={12} /> {v.location}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteVendor(v._id, v.name)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {view === 'bookings' && (
          <div className="card-dark rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Calendar className="text-purple-400" size={18} />
                All Bookings <span className="text-white/30 font-normal">({filteredBookings.length})</span>
              </h2>
              <button onClick={() => setView('dashboard')} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">← Dashboard</button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={15} />
                <input type="text" placeholder="Search bookings..." value={bookingFilter.search}
                  onChange={(e) => setBookingFilter({...bookingFilter, search: e.target.value})}
                  className="input-dark w-full pl-9 pr-3 py-2.5 text-sm" />
              </div>
              <select value={bookingFilter.status} onChange={(e) => setBookingFilter({...bookingFilter, status: e.target.value})}
                className="input-dark px-3 py-2.5 text-sm">
                <option value="all" className="bg-[#111118]">All Status</option>
                <option value="Pending" className="bg-[#111118]">Pending</option>
                <option value="Confirmed" className="bg-[#111118]">Confirmed</option>
                <option value="Completed" className="bg-[#111118]">Completed</option>
                <option value="Cancelled" className="bg-[#111118]">Cancelled</option>
              </select>
              <button onClick={() => setBookingFilter({ service:'all', status:'all', search:'' })}
                className="btn-ghost py-2.5 text-sm font-medium rounded-xl">Clear Filters</button>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-white/25" size={26} />
                </div>
                <p className="text-white/40 text-sm">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map(b => (
                  <div key={b._id} className="glass rounded-xl p-4 hover:border-purple-500/25 transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <p className="font-semibold text-white text-sm">{b.userName || 'Customer'}</p>
                          <span className={getStatusBadge(b.status)}>{b.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-white/40">
                          {b.serviceId?.category && <span>Service: {b.serviceId.category}</span>}
                          {b.vendorId?.name && <span>Vendor: {b.vendorId.name}</span>}
                          {b.userPhone && <span className="flex items-center gap-1"><Phone size={11} /> {b.userPhone}</span>}
                          <span>{new Date(b.createdAt).toLocaleDateString('en-GB')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PENDING ── */}
        {view === 'pending' && (
          <div className="card-dark rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Clock className="text-amber-400" size={18} />
                Pending Services <span className="text-white/30 font-normal">({pendingServices.length})</span>
              </h2>
              <button onClick={() => setView('dashboard')} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">← Dashboard</button>
            </div>

            {pendingServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-emerald-400" size={26} />
                </div>
                <h3 className="font-bold text-white mb-1">All caught up!</h3>
                <p className="text-white/35 text-sm">No pending services to review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingServices.map(svc => (
                  <div key={svc._id} className="glass rounded-xl p-5 hover:border-amber-500/25 transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <p className="font-semibold text-white">{svc.category}</p>
                          <span className="badge-warning">Pending</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-white/40">
                          <span>by {svc.vendorId?.name}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {svc.location}</span>
                          {svc.price && <span>Rs. {svc.price}</span>}
                          {svc.experience && <span className="flex items-center gap-1"><Award size={11} /> {svc.experience}</span>}
                        </div>
                        {svc.description && <p className="text-white/35 text-xs mt-2 leading-relaxed">{svc.description}</p>}
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={() => handleApprove(svc._id)}
                          className="flex-1 sm:flex-none bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/25 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all">
                          <CheckCircle size={15} /> Approve
                        </button>
                        <button onClick={() => handleDisapprove(svc._id)}
                          className="flex-1 sm:flex-none bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all">
                          <XCircle size={15} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
