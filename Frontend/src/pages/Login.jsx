import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, Wrench, Eye, EyeOff, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { type } = useParams(); // optional — 'admin' | 'vendor' | undefined

  // Determine initial tab from URL param, default to 'vendor'
  const initialTab = type === 'admin' ? 'admin' : 'vendor';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // If URL had a valid type, sync tab; if invalid type, just stay on vendor tab
  useEffect(() => {
    if (type === 'admin') setActiveTab('admin');
    else if (type === 'vendor') setActiveTab('vendor');
  }, [type]);

  // Redirect if already logged in
  useEffect(() => {
    const currentUserType = localStorage.getItem('userType');
    const hasToken = localStorage.getItem('accessToken');
    if (hasToken && currentUserType) {
      navigate(currentUserType === 'admin' ? '/admin-dashboard' : '/vendor-dashboard', { replace: true });
    }
  }, [navigate]);

  // Reset form when tab switches
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFormData({ name: '', email: '', password: '' });
    setError('');
    setShowPassword(false);
    setFocusedField('');
  };

  const isAdmin = activeTab === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isAdmin
        ? `${API_BASE_URL}/admin/login`
        : `${API_BASE_URL}/vendors/login`;

      const bodyData = isAdmin
        ? { name: formData.name, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();

      if (response.ok) {
        ['accessToken', 'userType', 'adminName', 'vendorId', 'vendorName', 'vendorEmail'].forEach(k => localStorage.removeItem(k));
        localStorage.setItem('accessToken', data.accessToken);
        setShowSuccessPopup(true);
        setTimeout(() => {
          if (isAdmin) {
            localStorage.setItem('adminName', data.admin?.name || data.name);
            localStorage.setItem('userType', 'admin');
          } else {
            localStorage.setItem('vendorName', data.vendor?.name || data.name);
            localStorage.setItem('vendorId', data.vendor?._id || data._id);
            localStorage.setItem('userType', 'vendor');
          }
          window.dispatchEvent(new Event('authChange'));
          navigate(isAdmin ? '/admin-dashboard' : '/vendor-dashboard', { replace: true });
        }, 2000);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-10 transition-colors duration-700 ${isAdmin ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
        <div className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10 transition-colors duration-700 ${isAdmin ? 'bg-purple-500' : 'bg-teal-500'}`}></div>
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative glass-strong rounded-3xl p-8 max-w-sm w-full animate-scale-in text-center border border-white/10">
            <div className="relative mb-6 w-20 h-20 mx-auto">
              <div className={`absolute inset-0 rounded-full animate-ping ${isAdmin ? 'bg-indigo-500/20' : 'bg-emerald-500/20'}`}></div>
              <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center animate-bounce-in ${isAdmin ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-emerald-500/20 border-emerald-500/40'}`}>
                <CheckCircle className={isAdmin ? 'text-indigo-400' : 'text-emerald-400'} size={36} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Login Successful!</h3>
            <p className="text-white/50 text-sm mb-5">Redirecting to your dashboard...</p>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full animate-progress ${isAdmin ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full relative z-10">

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl relative bg-indigo-500/10 border border-indigo-500/25">
            <div className="absolute inset-0 rounded-2xl blur-lg bg-indigo-500/15"></div>
            <Wrench className="text-indigo-400 relative z-10" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/40 text-sm">Sign in to your FixKar account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 animate-fade-in-up delay-100">

          {/* Tab Switcher */}
          <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => handleTabSwitch('vendor')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-250 ${
                !isAdmin
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Wrench size={15} />
              Vendor
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-250 ${
                isAdmin
                  ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Shield size={15} />
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm animate-shake">
              <AlertCircle size={17} className="flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError('')} className="text-red-400/60 hover:text-red-400 transition-colors text-lg leading-none">×</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifier field — switches based on tab */}
            {isAdmin ? (
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Admin Username</label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'name' ? 'text-indigo-400' : 'text-white/25'}`} size={17} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    className="input-dark w-full pl-10 pr-4 py-3 text-sm"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'email' ? 'text-emerald-400' : 'text-white/25'}`} size={17} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="input-dark w-full pl-10 pr-4 py-3 text-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? (isAdmin ? 'text-indigo-400' : 'text-emerald-400') : 'text-white/25'}`} size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className="input-dark w-full pl-10 pr-11 py-3 text-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full py-3.5 rounded-xl font-semibold text-white text-sm mt-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden hover:scale-[1.02] active:scale-[0.98] ${
                isAdmin
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isAdmin ? <Shield size={17} /> : <Wrench size={17} />}
                  Sign In as {isAdmin ? 'Admin' : 'Vendor'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {/* Register link — only show on vendor tab */}
            {!isAdmin && (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3.5 text-center">
                <p className="text-white/40 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors hover:underline"
                  >
                    Register as Vendor
                  </button>
                </p>
              </div>
            )}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/35 hover:text-white/70 text-sm transition-colors mx-auto group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/20">
          <div className="flex items-center gap-1.5"><Shield size={13} /><span>Secure Login</span></div>
          <div className="w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-1.5"><Sparkles size={13} /><span>Verified Platform</span></div>
          <div className="w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-1.5"><CheckCircle size={13} /><span>SSL Encrypted</span></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
