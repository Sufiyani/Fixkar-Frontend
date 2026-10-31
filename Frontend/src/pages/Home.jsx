import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Search, Shield, Clock, Award, Star, TrendingUp,
  CheckCircle, Phone, Mail, MapPin, Users, Zap,
  ThumbsUp, ArrowRight, Play, Quote, X, Sparkles,
  ChevronDown
} from 'lucide-react';

// Toast
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  const styles = { success: 'toast toast-success', info: 'toast toast-info', error: 'toast toast-error' };
  const Icon = type === 'success' ? CheckCircle : type === 'info' ? Sparkles : X;
  return (
    <div className="toast-container">
      <div className={styles[type] || 'toast toast-info'}>
        <Icon size={18} className="flex-shrink-0" />
        <p className="flex-1">{message}</p>
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity ml-1"><X size={15} /></button>
      </div>
    </div>
  );
};

// Video Modal
const VideoModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
    <div className="relative glass rounded-2xl p-2 max-w-4xl w-full animate-scale-in">
      <button onClick={onClose}
        className="absolute -top-4 -right-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full p-2 transition-all z-10">
        <X size={22} />
      </button>
      <div className="relative pb-[56.25%] rounded-xl overflow-hidden bg-black">
        <iframe className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/F4sYfuhK5aQ?si=K4IeY1qWGUNIR31v"
          title="FixKar Demo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>
    </div>
  </div>
);

const Home = () => {
  const token = localStorage.getItem('accessToken');
  const userType = localStorage.getItem('userType');
  if (token && userType) {
    return <Navigate to={userType === 'admin' ? '/admin-dashboard' : '/vendor-dashboard'} replace />;
  }

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const showToast = (message, type) => setToast({ message, type });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/vendors?search=${searchTerm}`);
    } else {
      showToast("Please enter a search term", "error");
    }
  };

  const services = [
    { icon: '🔧', name: 'Plumbing',      count: '150+ Experts', color: 'from-blue-500/20 to-blue-600/20',    border: 'hover:border-blue-500/40' },
    { icon: '⚡', name: 'Electrical',    count: '120+ Experts', color: 'from-amber-500/20 to-amber-600/20',  border: 'hover:border-amber-500/40' },
    { icon: '🔨', name: 'Carpentry',     count: '90+ Experts',  color: 'from-orange-500/20 to-orange-600/20',border: 'hover:border-orange-500/40' },
    { icon: '🎨', name: 'Painting',      count: '110+ Experts', color: 'from-purple-500/20 to-purple-600/20',border: 'hover:border-purple-500/40' },
    { icon: '❄️', name: 'AC Repair',     count: '80+ Experts',  color: 'from-cyan-500/20 to-cyan-600/20',    border: 'hover:border-cyan-500/40' },
    { icon: '🚗', name: 'Car Mechanic',  count: '95+ Experts',  color: 'from-red-500/20 to-red-600/20',      border: 'hover:border-red-500/40' },
    { icon: '📱', name: 'Mobile Repair', count: '70+ Experts',  color: 'from-indigo-500/20 to-indigo-600/20',border: 'hover:border-indigo-500/40' },
    { icon: '🏠', name: 'Home Cleaning', count: '130+ Experts', color: 'from-emerald-500/20 to-emerald-600/20',border:'hover:border-emerald-500/40' },
  ];

  const testimonials = [
    { id:1, name:'Ahmed Hassan',  role:'Business Owner', image:'👨‍💼', rating:5, text:'FixKar helped me find an excellent electrician within minutes. The professional was punctual, skilled, and very reasonably priced.', service:'Electrical Work' },
    { id:2, name:'Fatima Khan',   role:'Homemaker',      image:'👩',   rating:5, text:'I was worried about finding a reliable plumber, but FixKar made it so easy. Service was professional and prices were transparent.', service:'Plumbing' },
    { id:3, name:'Ali Raza',      role:'Software Engineer',image:'👨‍💻',rating:5, text:'Best platform for home services in Karachi! The booking process was seamless and the carpenter did amazing work.', service:'Carpentry' },
    { id:4, name:'Sara Ahmed',    role:'Teacher',        image:'👩‍🏫', rating:5, text:'Quick response, verified professionals, excellent service. FixKar has become my go-to platform for all home maintenance.', service:'AC Repair' },
  ];

  const stats = [
    { icon: Users,       value: '10,000+', label: 'Happy Customers', color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { icon: Shield,      value: '500+',    label: 'Verified Experts', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Star,        value: '4.9/5',   label: 'Average Rating',   color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
    { icon: CheckCircle, value: '50,000+', label: 'Jobs Completed',   color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  const howItWorks = [
    { step:'01', title:'Search Service',  desc:'Browse or search for the service you need from our wide range of professional categories.',  icon: Search,      color: 'from-indigo-500 to-indigo-600' },
    { step:'02', title:'Choose Expert',   desc:'View profiles, ratings and reviews to select the perfect professional for your job.',        icon: Users,       color: 'from-purple-500 to-purple-600' },
    { step:'03', title:'Book & Confirm',  desc:'Schedule at your convenience and confirm your booking instantly through our platform.',      icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
    { step:'04', title:'Get It Done',     desc:'Sit back and relax while our verified professional completes your job to perfection.',       icon: ThumbsUp,    color: 'from-amber-500 to-amber-600' },
  ];

  const features = [
    { icon: Shield,      title:'Verified Professionals', desc:'All service providers undergo thorough background checks and skill verification.', color:'text-indigo-400',  bg:'bg-indigo-500/10 border-indigo-500/20' },
    { icon: Clock,       title:'Quick Response Time',    desc:'Get connected with professionals within minutes of placing your booking.',        color:'text-emerald-400', bg:'bg-emerald-500/10 border-emerald-500/20' },
    { icon: Award,       title:'Quality Guaranteed',     desc:'100% satisfaction guarantee on every service — your peace of mind matters.',     color:'text-purple-400',  bg:'bg-purple-500/10 border-purple-500/20' },
    { icon: Star,        title:'Top Rated Service',      desc:'Consistently rated 4.9/5 stars by thousands of verified and satisfied customers.',color:'text-amber-400',   bg:'bg-amber-500/10 border-amber-500/20' },
    { icon: Zap,         title:'Instant Booking',        desc:'Book services instantly with our seamless and easy-to-use platform interface.',   color:'text-orange-400',  bg:'bg-orange-500/10 border-orange-500/20' },
    { icon: Phone,       title:'24/7 Support',           desc:'Round-the-clock customer support to assist you anytime, anywhere you need us.',  color:'text-red-400',     bg:'bg-red-500/10 border-red-500/20' },
  ];

  useEffect(() => {
    const iv = setInterval(() => setActiveTestimonial(p => (p + 1) % 2), 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showVideoModal && <VideoModal onClose={() => setShowVideoModal(false)} />}

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Layered bg */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-[#0a0a0f] to-[#0a0a0f]"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-500/08 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-0 w-80 h-80 bg-purple-500/06 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-0 w-80 h-80 bg-emerald-500/05 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)', backgroundSize: '50px 50px' }}>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 glass border border-white/10 px-4 py-2 rounded-full mb-8 animate-fade-in-up">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-white/60 text-sm font-medium">Trusted by 10,000+ Customers Across Pakistan</span>
              <Sparkles size={14} className="text-indigo-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-[1.08] tracking-tight animate-fade-in-up delay-100">
              Your Trusted Platform
              <span className="block mt-2 gradient-text-primary">for Home Services</span>
            </h1>

            <p className="text-lg md:text-xl text-white/45 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Connect with verified, skilled professionals for all your service needs. Fast, reliable, and affordable — right at your doorstep.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 animate-fade-in-up delay-300">
              <div className="glass-strong rounded-2xl p-1.5 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="text"
                    placeholder="Search plumbers, electricians, mechanics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                  />
                </div>
                <button type="submit"
                  className="btn-primary px-6 py-3.5 text-sm flex items-center justify-center gap-2 rounded-xl">
                  <Search size={17} />
                  Search
                </button>
              </div>
            </form>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16 animate-fade-in-up delay-400">
              <button onClick={() => navigate('/vendors')}
                className="btn-primary px-6 py-3 rounded-xl text-sm flex items-center gap-2">
                Browse Services
                <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/register')}
                className="btn-ghost px-6 py-3 rounded-xl text-sm flex items-center gap-2">
                Become a Provider
              </button>
              <button onClick={() => setShowVideoModal(true)}
                className="flex items-center gap-2 px-5 py-3 text-sm text-white/50 hover:text-white/80 transition-colors">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors">
                  <Play size={14} className="ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-500">
              {stats.map((s, i) => (
                <div key={i} className={`glass rounded-2xl p-5 border ${s.bg} hover:scale-105 transition-all duration-300`}>
                  <div className={`${s.bg} border w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <s.icon className={s.color} size={20} />
                  </div>
                  <div className={`text-2xl font-black ${s.color} mb-1`}>{s.value}</div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <ChevronDown className="text-white" size={24} />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d18] to-[#0a0a0f] pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full mb-4 text-sm font-medium">
              <Sparkles size={14} />
              Popular Services
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">What Are You Looking For?</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Choose from our wide range of professional home services</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((svc, i) => (
              <button key={i} onClick={() => { navigate(`/vendors?category=${svc.name}`); showToast(`Showing ${svc.name} services`, "info"); }}
                className={`group card-dark rounded-2xl p-6 text-left ${svc.border} transition-all duration-300 hover:-translate-y-1`}
                style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`w-14 h-14 bg-gradient-to-br ${svc.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-3xl`}>
                  {svc.icon}
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{svc.name}</h3>
                <p className="text-white/35 text-xs">{svc.count}</p>
              </button>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => navigate('/vendors')}
              className="btn-primary px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2">
              View All Services <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/04 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full mb-4 text-sm font-medium">
              <TrendingUp size={14} />
              Simple Process
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">How FixKar Works</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Get your service done in 4 simple steps</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((s, i) => (
              <div key={i} className="relative group">
                <div className="card-dark rounded-2xl p-6 h-full hover:border-indigo-500/30 transition-all">
                  <div className={`absolute -top-3 left-5 w-8 h-8 bg-gradient-to-r ${s.color} rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg`}>
                    {s.step}
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-5 mt-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <s.icon className="text-white" size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 text-white/20">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[#0d0d18]/60 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full mb-4 text-sm font-medium">
              <Award size={14} />
              Why FixKar
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">Why Choose FixKar?</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">We're committed to delivering the best service experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="card-dark rounded-2xl p-6 hover:border-indigo-500/30 group transition-all">
                <div className={`w-12 h-12 ${f.bg} border rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={f.color} size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/05 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/04 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass border border-white/10 text-white/60 px-4 py-2 rounded-full mb-4 text-sm font-medium">
              <Star className="text-amber-400" size={14} />
              Customer Reviews
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">What Our Customers Say</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Don't just take our word for it</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <div key={t.id} className="card-dark rounded-2xl p-6 hover:border-indigo-500/30 transition-all">
                <Quote className="text-indigo-400/20 mb-4" size={36} />
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="text-amber-400 fill-amber-400" size={15} />
                  ))}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/[0.06] border border-white/10 rounded-full flex items-center justify-center text-2xl">
                    {t.image}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-white/35 text-xs">{t.role}</p>
                    <p className="text-indigo-400 text-xs mt-0.5">{t.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {[0, 1].map(i => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 rounded-full transition-all ${activeTestimonial === i ? 'bg-indigo-500 w-8' : 'bg-white/15 w-1.5'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-6 sm:p-10 md:p-16 overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-indigo-600/20 rounded-3xl"></div>
            <div className="absolute inset-0 border border-indigo-500/25 rounded-3xl"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 glass border border-white/15 px-4 py-2 rounded-full mb-6 text-white/50 text-sm">
                <Sparkles size={14} className="text-indigo-400" />
                Ready to Get Started?
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5">
                Join Thousands of <span className="gradient-text-primary">Happy Customers</span>
              </h2>
              <p className="text-white/45 text-lg mb-10 max-w-2xl mx-auto">
                Find trusted service professionals instantly — or list your services and start earning today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate('/vendors')}
                  className="btn-primary px-8 py-4 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2">
                  Find a Service <ArrowRight size={17} />
                </button>
                <button onClick={() => navigate('/register')}
                  className="btn-ghost px-8 py-4 rounded-xl font-semibold text-sm">
                  Become a Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[#0d0d18]/60 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full mb-4 text-sm font-medium">
              <Phone size={14} />
              Get In Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Contact Us</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Have questions? We're here to help 24/7</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Phone, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', title: 'Call Us', sub: 'Mon–Sun: 24/7', val: '+92 300 1234567', href: 'tel:+923001234567', hoverColor: 'hover:border-indigo-500/40' },
              { icon: Mail,  color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/20', title: 'Email Us', sub: 'Response within 24h', val: 'support@fixkar.com', href: 'mailto:support@fixkar.com', hoverColor: 'hover:border-emerald-500/40' },
              { icon: MapPin,color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20',  title: 'Visit Us', sub: 'Serving all of Karachi', val: 'Karachi, Pakistan', href: null, hoverColor: 'hover:border-purple-500/40' },
            ].map((c, i) => (
              <div key={i} className={`card-dark rounded-2xl p-8 text-center ${c.hoverColor} group transition-all`}>
                <div className={`w-14 h-14 ${c.bg} border rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  <c.icon className={c.color} size={24} />
                </div>
                <h3 className="font-bold text-white mb-1">{c.title}</h3>
                <p className="text-white/35 text-xs mb-3">{c.sub}</p>
                {c.href
                  ? <a href={c.href} className={`${c.color} font-semibold text-sm hover:underline`}>{c.val}</a>
                  : <p className={`${c.color} font-semibold text-sm`}>{c.val}</p>
                }
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
