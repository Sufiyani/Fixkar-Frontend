import React, { useState, useEffect } from "react";
import { PlusCircle, MapPin, Wrench, Phone, Calendar, Star, DollarSign, Clock, TrendingUp, Award, Users, CheckCircle, Trash2, Save, AlertCircle, XCircle, Wifi, WifiOff, User, Mail, Sparkles, MessageSquare, Activity } from "lucide-react";
import { vendorAPI } from "../utils/api";

// Toast
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const styles = { success: 'toast toast-success', error: 'toast toast-error', info: 'toast toast-info' };
  return (
    <div className="toast-container">
      <div className={styles[type] || 'toast toast-info'}>
        <CheckCircle size={17} className="flex-shrink-0" />
        <p className="flex-1">{message}</p>
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity ml-1"><XCircle size={15} /></button>
      </div>
    </div>
  );
};

// Stat Card
const StatCard = ({ icon: Icon, label, value, color, bgColor, sub, delay = '' }) => (
  <div className={`card-dark rounded-2xl p-5 group hover:border-indigo-500/30 transition-all animate-fade-in-up ${delay}`}>
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

const VendorDashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings:0, rating:4.8, earnings:0, activeServices:0, reviews:0 });
  const [vendorStatus, setVendorStatus] = useState('available');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ category:"", location:"", contact:"", availability:"", price:"", experience:"", description:"" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => { fetchVendorData(); }, []);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const getAuthHeaders = () => ({ 'Content-Type':'application/json', 'Authorization':`Bearer ${localStorage.getItem('accessToken')}` });

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const profileRes = await fetch(`${API_BASE_URL}/vendors/profile`, { headers: getAuthHeaders() });
      const profileData = await profileRes.json();
      setVendorStatus(profileData.availabilityStatus || 'available');

      const servicesRes = await fetch(`${API_BASE_URL}/vendors/services`, { headers: getAuthHeaders() });
      const statsRes = await fetch(`${API_BASE_URL}/vendors/stats`, { headers: getAuthHeaders() });
      const bookingsData = await vendorAPI.getMyBookings();

      setServices(await servicesRes.json());
      setStats(await statsRes.json());
      setBookings(bookingsData);
    } catch { showToast('Failed to load data', 'error'); }
    finally { setLoading(false); }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = vendorStatus === 'available' ? 'busy' : 'available';
      const res = await fetch(`${API_BASE_URL}/vendors/availability`, {
        method:'PUT', headers: getAuthHeaders(), body: JSON.stringify({ availabilityStatus: newStatus })
      });
      if (res.ok) { setVendorStatus(newStatus); showToast(`Status: ${newStatus === 'available' ? 'Available' : 'Busy'}`); }
      else showToast('Failed to update status', 'error');
    } catch { showToast('Failed to update status', 'error'); }
  };

  const handleAddService = async () => {
    if (!newService.category || !newService.location || !newService.contact || !newService.availability) {
      showToast('Please fill in all required fields', 'error'); return;
    }
    const cleanContact = newService.contact.replace(/[-\s]/g, '');
    if (!/^03\d{9}$/.test(cleanContact)) { showToast('Contact must be 11 digits starting with 03', 'error'); return; }
    if (newService.price && !/^\d+(-\d+)?$/.test(newService.price.replace(/\s/g, ''))) { showToast('Invalid price format', 'error'); return; }
    if (newService.experience && !/\d/.test(newService.experience)) { showToast('Experience should include years', 'error'); return; }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/vendors/services`, {
        method:'POST', headers: getAuthHeaders(),
        body: JSON.stringify({ ...newService, contact: cleanContact })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Service submitted! Waiting for approval.');
        setServices(p => [...p, data.service]);
        setNewService({ category:"", location:"", contact:"", availability:"", price:"", experience:"", description:"" });
        setShowAddForm(false);
        setTimeout(fetchVendorData, 2000);
      } else showToast(data.message || 'Failed to create service', 'error');
    } catch { showToast('Failed to create service', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/vendors/services/${id}`, { method:'DELETE', headers: getAuthHeaders() });
      if (res.ok) { showToast('Service deleted'); setServices(p => p.filter(s => s._id !== id)); }
      else showToast('Failed to delete', 'error');
    } catch { showToast('Failed to delete', 'error'); }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/vendor/${bookingId}/status`, {
        method:'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      showToast(`Booking ${newStatus.toLowerCase()} successfully!`);
      fetchVendorData();
    } catch (err) { showToast(err.message || 'Failed to update booking', 'error'); }
  };

  const getStatusBadge = (status) => {
    const map = { Approved:'badge-success', Pending:'badge-warning', Disapproved:'badge-error' };
    const icons = { Approved: CheckCircle, Pending: Clock, Disapproved: XCircle };
    const Icon = icons[status] || Activity;
    return (
      <span className={map[status] || 'badge-indigo'}>
        <Icon size={11} /> {status === 'Disapproved' ? 'Rejected' : status}
      </span>
    );
  };

  const getBookingStatusBadge = (status) => {
    const map = { Pending:'badge-warning', Confirmed:'badge-indigo', Completed:'badge-success', Cancelled:'badge-error' };
    return <span className={map[status] || 'badge-indigo'}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-2 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center"><Wrench className="text-emerald-400" size={18} /></div>
          </div>
          <p className="text-white/45 font-medium">Loading dashboard...</p>
          <div className="flex gap-1 justify-center mt-3">
            {[0,150,300].map(d => <div key={d} className="w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-bounce" style={{animationDelay:`${d}ms`}}></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-[#0d0d18] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/25 rounded-xl flex items-center justify-center">
                <Wrench className="text-emerald-400" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Vendor Dashboard</h1>
                <p className="text-white/35 text-xs">Manage your services and bookings</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleAvailability}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  vendorStatus === 'available'
                    ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/25'
                    : 'bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/25'
                }`}>
                {vendorStatus === 'available' ? <><Wifi size={16} /> Available</> : <><WifiOff size={16} /> Busy</>}
              </button>
              <button onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm">
                <PlusCircle size={16} />
                Add Service
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> <span className="flex-1">{error}</span>
            <button onClick={() => setError('')} className="opacity-60 hover:opacity-100"><XCircle size={15} /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Calendar} label="Total Bookings" value={bookings.length} color="text-indigo-400" bgColor="bg-indigo-500/10 border-indigo-500/20" sub={`${bookings.filter(b => b.status === 'Pending').length} pending`} />
          <StatCard icon={Star} label="Rating" value={stats.rating} color="text-amber-400" bgColor="bg-amber-500/10 border-amber-500/20" sub={`${stats.reviews || 0} reviews`} delay="delay-100" />
          <StatCard icon={DollarSign} label="Total Earnings" value={`Rs. ${(stats.earnings || 0).toLocaleString()}`} color="text-emerald-400" bgColor="bg-emerald-500/10 border-emerald-500/20" delay="delay-200" />
          <StatCard icon={Users} label="Active Services" value={stats.activeServices || 0} color="text-purple-400" bgColor="bg-purple-500/10 border-purple-500/20" sub="Approved" delay="delay-300" />
        </div>

        {/* Add Service Form */}
        {showAddForm && (
          <div className="card-dark rounded-2xl p-6 mb-6 animate-scale-in border-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/25 rounded-xl flex items-center justify-center">
                  <PlusCircle className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Add New Service</h2>
                  <p className="text-white/35 text-xs">Fill in the details below</p>
                </div>
              </div>
              <button onClick={() => setShowAddForm(false)} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/08 transition-all">
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Service Category *</label>
                <select value={newService.category} onChange={(e) => setNewService({...newService, category: e.target.value})}
                  className="input-dark w-full px-4 py-3 text-sm">
                  <option value="" className="bg-[#111118]">Select Category</option>
                  {['Plumbing','Electrical','Car Mechanic','Carpentry','Painting','AC Repair','Mobile Repair','Home Cleaning'].map(c => (
                    <option key={c} value={c} className="bg-[#111118]">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Location *</label>
                <input type="text" placeholder="e.g., Karachi, Clifton" value={newService.location}
                  onChange={(e) => setNewService({...newService, location: e.target.value})}
                  className="input-dark w-full px-4 py-3 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Contact Number *</label>
                <input type="tel" placeholder="03001234567" value={newService.contact}
                  onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g,''); if(v.length <= 11) setNewService({...newService, contact: v}); }}
                  maxLength={11} className="input-dark w-full px-4 py-3 text-sm" />
                <p className="text-white/25 text-xs mt-1">11 digits starting with 03</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Experience *</label>
                <input type="text" placeholder="e.g., 5 years" value={newService.experience}
                  onChange={(e) => setNewService({...newService, experience: e.target.value})}
                  className="input-dark w-full px-4 py-3 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Availability *</label>
                <input type="text" placeholder="e.g., 9am - 6pm" value={newService.availability}
                  onChange={(e) => setNewService({...newService, availability: e.target.value})}
                  className="input-dark w-full px-4 py-3 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Price Range (Rs.)</label>
                <input type="text" placeholder="500-1500 or 500" value={newService.price}
                  onChange={(e) => { const v = e.target.value.replace(/[^0-9-]/g,''); setNewService({...newService, price: v}); }}
                  className="input-dark w-full px-4 py-3 text-sm" />
                <p className="text-white/25 text-xs mt-1">Numbers only (e.g., 500 or 500-1500)</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea placeholder="Describe your service and expertise..." value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  rows={3} className="input-dark w-full px-4 py-3 text-sm resize-none" />
              </div>
            </div>

            <button onClick={handleAddService} disabled={submitting}
              className="mt-5 w-full btn-primary py-3.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Submitting...</>
              ) : (
                <><Save size={17} /> Save Service</>
              )}
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Services */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Wrench className="text-emerald-400" size={18} />
                Your Services
              </h2>
              <span className="badge-success">{services.length} Total</span>
            </div>

            {services.length === 0 ? (
              <div className="card-dark rounded-2xl p-14 text-center border-dashed">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Wrench className="text-white/25" size={28} />
                </div>
                <h3 className="font-bold text-white mb-2">No Services Yet</h3>
                <p className="text-white/35 text-sm mb-6">Add your first service to start receiving bookings</p>
                <button onClick={() => setShowAddForm(true)}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
                  <PlusCircle size={16} /> Add Service
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((srv) => (
                  <div key={srv._id} className="card-dark rounded-2xl p-5 hover:border-emerald-500/30 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Wrench className="text-emerald-400" size={22} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{srv.category}</h3>
                          {srv.experience && (
                            <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                              <Award size={12} className="text-amber-400" /> {srv.experience}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(srv.status)}
                        <button onClick={() => handleDeleteService(srv._id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 mb-3">
                      {[
                        { icon: MapPin,     color:'text-blue-400',   bg:'bg-blue-500/08',   val: srv.location },
                        { icon: Phone,      color:'text-green-400',  bg:'bg-green-500/08',  val: srv.contact },
                        { icon: Clock,      color:'text-purple-400', bg:'bg-purple-500/08', val: srv.availability },
                        { icon: DollarSign, color:'text-orange-400', bg:'bg-orange-500/08', val: `Rs. ${srv.price}` },
                      ].map(({ icon: I, color, bg, val }, i) => val ? (
                        <div key={i} className={`flex items-center gap-2 ${bg} rounded-xl px-3 py-2`}>
                          <I className={color} size={14} />
                          <span className="text-white/60 text-xs font-medium">{val}</span>
                        </div>
                      ) : null)}
                    </div>

                    {srv.description && (
                      <p className="text-white/35 text-xs leading-relaxed border-t border-white/[0.05] pt-3">
                        {srv.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Calendar className="text-purple-400" size={18} />
                Bookings
              </h2>
              <span className="badge-indigo">{bookings.length}</span>
            </div>

            {bookings.length === 0 ? (
              <div className="card-dark rounded-2xl p-10 text-center border-dashed">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-white/25" size={24} />
                </div>
                <h3 className="font-bold text-white mb-1 text-sm">No Bookings Yet</h3>
                <p className="text-white/35 text-xs">Bookings will appear here once customers start booking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 6).map((booking) => (
                  <div key={booking._id} className="card-dark rounded-2xl p-4 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/[0.05] border border-white/[0.08] rounded-lg flex items-center justify-center">
                          <User size={14} className="text-white/50" />
                        </div>
                        <p className="font-semibold text-white text-sm">{booking.userName}</p>
                      </div>
                      {getBookingStatusBadge(booking.status)}
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {booking.userPhone && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Phone size={12} /> {booking.userPhone}
                        </div>
                      )}
                      {(booking.serviceCategory || booking.serviceId?.category) && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Wrench size={12} /> {booking.serviceCategory || booking.serviceId?.category}
                        </div>
                      )}
                      {booking.userAddress && (
                        <div className="flex items-center gap-2 text-xs text-white/40 line-clamp-1">
                          <MapPin size={12} className="flex-shrink-0" /> {booking.userAddress}
                        </div>
                      )}
                      {booking.notes && (
                        <div className="flex items-start gap-2 text-xs text-white/35 italic line-clamp-2">
                          <MessageSquare size={12} className="flex-shrink-0 mt-0.5" /> {booking.notes}
                        </div>
                      )}
                    </div>

                    {booking.status === 'Pending' && (
                      <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
                        <button onClick={() => handleBookingStatusUpdate(booking._id, 'Confirmed')}
                          className="flex-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/25 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all">
                          <CheckCircle size={13} /> Confirm
                        </button>
                        <button onClick={() => handleBookingStatusUpdate(booking._id, 'Cancelled')}
                          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all">
                          <XCircle size={13} /> Cancel
                        </button>
                      </div>
                    )}

                    {booking.status === 'Confirmed' && (
                      <button onClick={() => handleBookingStatusUpdate(booking._id, 'Completed')}
                        className="w-full mt-2 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/25 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                        <CheckCircle size={13} /> Mark Complete
                      </button>
                    )}
                  </div>
                ))}

                {bookings.length > 6 && (
                  <div className="glass rounded-xl py-3 text-center text-sm text-white/35 border-dashed">
                    +{bookings.length - 6} more bookings
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
