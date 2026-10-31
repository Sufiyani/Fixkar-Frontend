import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { Wrench, Heart, Shield, Award, Clock, Mail, Phone, MapPin, ArrowRight, CheckCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/vendors", label: "Find Services" },
    { to: "/register", label: "Become a Vendor" },
    { to: "/login/vendor", label: "Vendor Login" },
    { to: "/login/admin", label: "Admin Portal" },
  ];

  const services = ["Plumbing", "Electrical", "Carpentry", "Painting", "AC Repair", "Mechanics", "Mobile Repair", "Home Cleaning"];

  const socials = [
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-400 hover:border-blue-400/30" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-sky-400 hover:border-sky-400/30" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:text-pink-400 hover:border-pink-400/30" },
    { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:text-blue-500 hover:border-blue-500/30" },
    { icon: FaWhatsapp, href: "https://wa.me/923001234567", label: "WhatsApp", color: "hover:text-emerald-400 hover:border-emerald-400/30" },
  ];

  return (
    <footer className="relative bg-[#080810] border-t border-white/[0.06] overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/04 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/04 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Feature Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-b border-white/[0.06]">
          {[
            { icon: Clock, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", title: "24/7 Support", sub: "Always here to help you" },
            { icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", title: "Verified Experts", sub: "Background checked pros" },
            { icon: Award, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", title: "Quality Guaranteed", sub: "100% satisfaction promise" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group">
              <div className={`p-3 rounded-xl ${f.bg} border flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <f.icon className={f.color} size={22} />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{f.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/30 rounded-xl blur-md"></div>
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <Wrench className="text-white" size={18} />
                </div>
              </div>
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">FixKar</span>
                <p className="text-[10px] text-white/30 tracking-widest uppercase">Pro Services</p>
              </div>
            </Link>

            <p className="text-sm text-white/45 leading-relaxed mb-6">
              Your trusted platform connecting you with verified, skilled home service professionals across Pakistan.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "500+", lbl: "Experts" },
                { val: "10K+", lbl: "Customers" },
                { val: "4.9★", lbl: "Rating" },
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.04] rounded-xl p-2.5 text-center border border-white/[0.06] hover:border-indigo-500/30 transition-all">
                  <p className="font-bold text-white text-sm">{s.val}</p>
                  <p className="text-white/40 text-[10px]">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              Quick Links
              <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></span>
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-white/45 hover:text-indigo-400 transition-all text-sm flex items-center gap-2 group">
                    <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-400" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              Our Services
              <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></span>
            </h3>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link to="/vendors"
                    className="text-white/45 hover:text-emerald-400 transition-all text-sm flex items-center gap-2 group">
                    <CheckCircle size={12} className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                    <span className="group-hover:translate-x-1 transition-transform">{s}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              Stay Connected
              <span className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></span>
            </h3>

            <form onSubmit={handleSubscribe} className="mb-5">
              <p className="text-xs text-white/40 mb-2.5">Get updates on new services & professionals.</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium py-2">
                  <CheckCircle size={16} /> Subscribed! Thank you.
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-indigo-500/60 focus:bg-indigo-500/08 transition-all"
                  />
                  <button type="submit"
                    className="px-3 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all hover:scale-105 flex-shrink-0">
                    <Mail size={16} />
                  </button>
                </div>
              )}
            </form>

            <div className="space-y-2.5 mb-5 text-sm">
              <a href="tel:+923001234567"
                className="flex items-center gap-3 text-white/45 hover:text-indigo-400 transition-colors group">
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                  <Phone size={14} className="text-indigo-400" />
                </div>
                +92 300 1234567
              </a>
              <a href="mailto:support@fixkar.com"
                className="flex items-center gap-3 text-white/45 hover:text-emerald-400 transition-colors group">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                  <Mail size={14} className="text-emerald-400" />
                </div>
                support@fixkar.com
              </a>
              <div className="flex items-center gap-3 text-white/45">
                <div className="bg-purple-500/10 border border-purple-500/20 p-2 rounded-lg">
                  <MapPin size={14} className="text-purple-400" />
                </div>
                Karachi, Pakistan
              </div>
            </div>

            <div className="flex gap-2">
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/40 transition-all hover:scale-110 ${s.color}`}>
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 py-5 border-t border-white/[0.06] text-xs text-white/30">
          <span>© {currentYear} FixKar. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="text-red-400 fill-red-400 animate-pulse" size={13} />
            <span>in Pakistan</span>
          </div>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
