import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, Star, Award, Wrench, Filter, CheckCircle, Shield, Briefcase, Wifi, WifiOff, X, Calendar, User, Mail, Phone as PhoneIcon } from 'lucide-react';

const Vendors = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' });
  const [formErrors, setFormErrors] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const karachiAreas = ['All','Clifton','Defence (DHA)','Gulshan-e-Iqbal','North Nazimabad','Nazimabad','FB Area','Saddar','Buffer Zone','Bahadurabad','Numaish','New Karachi','North Karachi','Malir','Korangi','Landhi','Gulistan-e-Jauhar','Scheme 33','Surjani Town','Tariq Road','PECHS','Shahrah-e-Faisal','Soldier Bazaar','Garden','Liaquatabad','Orangi Town','Baldia Town','SITE Area','Kemari','Lyari'];

  const categories = [
    { name: 'All', icon: '🏠' },
    { name: 'Plumbing', icon: '🚰' },
    { name: 'Electrical', icon: '💡' },
    { name: 'Car Mechanic', icon: '🔧' },
    { name: 'Carpentry', icon: '🪵' },
    { name: 'Painting', icon: '🎨' },
    { name: 'AC Repair', icon: '❄️' },
    { name: 'Mobile Repair', icon: '📱' },
    { name: 'Home Cleaning', icon: '🧹' },
  ];

  useEffect(() => { fetchApprovedServices(); }, []);
  useEffect(() => { filterServices(); }, [searchTerm, selectedCategory, selectedLocation, availabilityFilter, services]);

  const fetchApprovedServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/services/approved`);
      const data = await res.json();
      if (res.ok) { setServices(data); setFilteredServices(data); }
      else setError('Failed to fetch services');
    } catch { setError('Failed to connect to server'); }
    finally { setLoading(false); }
  };

  const filterServices = () => {
    let f = [...services];
    if (searchTerm) f = f.filter(s =>
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.vendorId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory !== 'All') f = f.filter(s => s.category === selectedCategory);
    if (selectedLocation !== 'All') f = f.filter(s => s.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    if (availabilityFilter !== 'all') f = f.filter(s => s.vendorId?.availabilityStatus === availabilityFilter);
    setFilteredServices(f);
  };

  const getCategoryIcon = (cat) => ({
    'Plumbing':'🔧','Electrical':'⚡','Car Mechanic':'🚗','Carpentry':'🪚',
    'Painting':'🎨','AC Repair':'❄️','Mobile Repair':'📱','Home Cleaning':'🧹'
  }[cat] || '🔧');

  const handleBookNow = (svc) => {
    setSelectedService(svc);
    setShowBookingModal(true);
    setBookingSuccess(null);
    setFormErrors({});
    setError('');
  };

  const validateForm = () => {
    const e = {};
    if (!bookingForm.name.trim() || bookingForm.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email.trim())) e.email = 'Please enter a valid email address';
    const cleanPhone = bookingForm.phone.replace(/[\s-]/g, '');
    if (!(/^(\+92|0)?3[0-9]{9}$/.test(cleanPhone))) e.phone = 'Enter a valid Pakistani phone (03XX XXXXXXX)';
    if (!bookingForm.address.trim() || bookingForm.address.trim().length < 10) e.address = 'Please provide a complete address';
    return e;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) { setError('Please fix the errors below'); return; }
    setBookingLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookingForm, serviceId: selectedService._id }),
      });
      const data = await res.json();
      if (res.ok) { setBookingSuccess(data); setBookingForm({ name:'',email:'',phone:'',address:'',notes:'' }); setFormErrors({}); }
      else setError(data.message || 'Failed to create booking');
    } catch { setError('Failed to submit booking. Please try again.'); }
    finally { setBookingLoading(false); }
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedService(null);
    setBookingSuccess(null);
    setBookingForm({ name:'',email:'',phone:'',address:'',notes:'' });
    setFormErrors({});
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-2 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Wrench className="text-indigo-400" size={18} />
            </div>
          </div>
          <p className="text-white/50 font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Header */}
      <div className="relative bg-[#0d0d18] border-b border-white/[0.06] py-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-indigo-500/06 rounded-full blur-3xl"></div>
          <div className="absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)', backgroundSize:'40px 40px' }}>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 glass border border-indigo-500/20 px-4 py-2 rounded-full mb-5 text-sm">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-white/55">{filteredServices.length} Verified Professionals Available</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Find Expert Vendors</h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto mb-8">Browse verified professionals for all your home service needs</p>
          <div className="max-w-2xl mx-auto">
            <div className="glass-strong rounded-2xl p-1.5 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={17} />
                <input type="text" placeholder="Search service, location, or vendor name..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm" />
              </div>
              <button onClick={() => {}} className="btn-primary px-5 py-3 rounded-xl text-sm flex items-center gap-1.5">
                <Search size={16} /> Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && !showBookingModal && (
          <div className="mb-6 bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="glass rounded-2xl p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-5">
                <Filter className="text-indigo-400" size={18} />
                <h2 className="font-bold text-white">Filters</h2>
              </div>

              {/* Availability */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Availability</p>
                <div className="space-y-1.5">
                  {[
                    { val:'all', label:'All Vendors', icon: null },
                    { val:'available', label:'Available Now', icon: Wifi, color: 'text-emerald-400' },
                    { val:'busy', label:'Busy', icon: WifiOff, color: 'text-orange-400' },
                  ].map(o => (
                    <button key={o.val} onClick={() => setAvailabilityFilter(o.val)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2 font-medium ${
                        availabilityFilter === o.val
                          ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                      }`}>
                      {o.icon && <o.icon size={14} className={availabilityFilter === o.val ? 'text-indigo-400' : o.color} />}
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Category</p>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {categories.map(c => (
                    <button key={c.name} onClick={() => setSelectedCategory(c.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm flex items-center gap-2 ${
                        selectedCategory === c.name
                          ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                      }`}>
                      <span className="text-base leading-none">{c.icon}</span>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Location</p>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
                  className="input-dark w-full px-3 py-2.5 text-sm">
                  {karachiAreas.map(a => <option key={a} value={a} className="bg-[#111118]">{a}</option>)}
                </select>
              </div>

              {(selectedCategory !== 'All' || selectedLocation !== 'All' || searchTerm || availabilityFilter !== 'all') && (
                <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedLocation('All'); setAvailabilityFilter('all'); }}
                  className="w-full px-4 py-2.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl transition-all text-sm font-medium">
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Main */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">
                {filteredServices.length} <span className="text-white/40 font-normal">{filteredServices.length === 1 ? 'Service' : 'Services'} Found</span>
              </h2>
            </div>

            {filteredServices.length === 0 ? (
              <div className="card-dark rounded-2xl p-16 text-center border-dashed">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Search className="text-white/30" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Services Found</h3>
                <p className="text-white/40 text-sm mb-6">Try adjusting your search filters</p>
                <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedLocation('All'); setAvailabilityFilter('all'); }}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((svc) => (
                  <div key={svc._id} className="card-dark rounded-2xl p-6 hover:border-indigo-500/30 transition-all">
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* Icon + badges */}
                      <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-start gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl">
                          {getCategoryIcon(svc.category)}
                        </div>
                        <div className="flex flex-row md:flex-col gap-1.5">
                          <span className="badge-success"><CheckCircle size={11} /> Verified</span>
                          {svc.vendorId?.availabilityStatus && (
                            <span className={svc.vendorId.availabilityStatus === 'available' ? 'badge-success' : 'badge-warning'}>
                              {svc.vendorId.availabilityStatus === 'available'
                                ? <><Wifi size={11} /> Available</>
                                : <><WifiOff size={11} /> Busy</>
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-white">{svc.vendorId?.name}</h3>
                              <span className="badge-indigo"><Shield size={10} /> Pro</span>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-white/45">
                              <span className="flex items-center gap-1.5"><Briefcase size={13} /> {svc.category}</span>
                              <span className="flex items-center gap-1.5"><MapPin size={13} /> {svc.location}</span>
                              {svc.experience && <span className="flex items-center gap-1.5"><Award size={13} /> {svc.experience}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="text-amber-400 fill-amber-400" size={15} />
                            <span className="text-white font-bold text-sm">4.8</span>
                            <span className="text-white/30 text-xs">(50+)</span>
                          </div>
                        </div>

                        {svc.description && (
                          <div className="glass rounded-xl p-3.5 mb-4 border border-white/[0.05]">
                            <p className="text-sm text-white/50 leading-relaxed">{svc.description}</p>
                          </div>
                        )}

                        <div className="grid sm:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Clock className="text-purple-400" size={14} />
                            </div>
                            <div>
                              <p className="text-xs text-white/35">Availability</p>
                              <p className="text-sm font-semibold text-white">{svc.availability}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <DollarSign className="text-emerald-400" size={14} />
                            </div>
                            <div>
                              <p className="text-xs text-white/35">Price Range</p>
                              <p className="text-sm font-bold text-emerald-400">Rs. {svc.price}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/[0.06]">
                          <button
                            onClick={() => handleBookNow(svc)}
                            disabled={svc.vendorId?.availabilityStatus === 'busy'}
                            className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                              svc.vendorId?.availabilityStatus === 'busy'
                                ? 'bg-white/[0.05] text-white/30 cursor-not-allowed border border-white/[0.06]'
                                : 'btn-primary'
                            }`}>
                            <Calendar size={15} />
                            {svc.vendorId?.availabilityStatus === 'busy' ? 'Currently Busy' : 'Book Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-strong rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.07]">
              <div>
                <h2 className="text-xl font-bold text-white">Book Service</h2>
                <p className="text-white/40 text-sm mt-0.5">Fill in your details to confirm</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/08 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {!bookingSuccess ? (
                <>
                  {/* Service info */}
                  <div className="glass rounded-xl p-4 mb-5 border border-indigo-500/15">
                    <p className="text-xs font-semibold text-indigo-400/70 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Briefcase size={12} /> Service Details
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <p className="text-white/50"><span className="text-white/70 font-medium">Vendor:</span> {selectedService.vendorId?.name}</p>
                      <p className="text-white/50"><span className="text-white/70 font-medium">Service:</span> {selectedService.category}</p>
                      <p className="text-white/50"><span className="text-white/70 font-medium">Location:</span> {selectedService.location}</p>
                      <p className="text-white/50"><span className="text-white/70 font-medium">Price:</span> <span className="text-emerald-400 font-bold">Rs. {selectedService.price}</span></p>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                      <X size={16} /> {error}
                    </div>
                  )}

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    {[
                      { key:'name', label:'Your Name', type:'text', icon: User, placeholder:'Enter your full name' },
                      { key:'email', label:'Email Address', type:'email', icon: Mail, placeholder:'your.email@example.com' },
                      { key:'phone', label:'Phone Number', type:'tel', icon: PhoneIcon, placeholder:'03XX XXXXXXX' },
                      { key:'address', label:'Service Address', type:'text', icon: MapPin, placeholder:'House no, street, area, Karachi' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{f.label} *</label>
                        <div className="relative">
                          <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" size={15} />
                          <input type={f.type} value={bookingForm[f.key]}
                            onChange={(e) => { setBookingForm({...bookingForm, [f.key]: e.target.value}); if(formErrors[f.key]) setFormErrors({...formErrors, [f.key]:''}); }}
                            className={`input-dark w-full pl-10 pr-4 py-3 text-sm ${formErrors[f.key] ? 'border-red-500/50' : ''}`}
                            placeholder={f.placeholder} />
                        </div>
                        {formErrors[f.key] && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><X size={11} /> {formErrors[f.key]}</p>}
                      </div>
                    ))}

                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Additional Notes (Optional)</label>
                      <textarea value={bookingForm.notes}
                        onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                        rows={3} placeholder="Any special requirements or details..."
                        className="input-dark w-full px-4 py-3 text-sm resize-none" />
                    </div>

                    <button type="submit" disabled={bookingLoading}
                      className="w-full btn-primary py-3.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                      {bookingLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Confirming Booking...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Calendar size={16} /> Confirm Booking
                        </span>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Booking Success */
                <div className="text-center py-8">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-emerald-500/15 rounded-full animate-ping"></div>
                    <div className="w-20 h-20 bg-emerald-500/15 border-2 border-emerald-500/40 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-emerald-400" size={36} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                  <p className="text-white/45 text-sm mb-6">Your booking has been placed. The vendor will contact you shortly.</p>
                  {bookingSuccess && (
                    <div className="glass rounded-xl p-4 mb-6 text-left text-sm space-y-1.5">
                      <p className="text-white/50"><span className="text-white/70">Booking ID:</span> <span className="text-indigo-400 font-mono text-xs">{bookingSuccess._id || bookingSuccess.bookingId}</span></p>
                      <p className="text-white/50"><span className="text-white/70">Service:</span> {selectedService.category}</p>
                      <p className="text-white/50"><span className="text-white/70">Vendor:</span> {selectedService.vendorId?.name}</p>
                    </div>
                  )}
                  <button onClick={closeModal} className="btn-primary px-8 py-3 rounded-xl text-sm font-semibold">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
