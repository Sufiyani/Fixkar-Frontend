import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Briefcase, AlertCircle, CheckCircle, X, ArrowLeft, Sparkles, Shield } from "lucide-react";
import { vendorAPI } from "../utils/api";

// Toast
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  const styles = {
    success: 'toast toast-success',
    error: 'toast toast-error',
  };
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  return (
    <div className="toast-container">
      <div className={styles[type] || 'toast toast-info'}>
        <Icon size={18} className="flex-shrink-0" />
        <p className="flex-1">{message}</p>
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity ml-1">
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

// Success Modal
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
    <div className="relative glass-strong rounded-3xl p-8 max-w-sm w-full animate-scale-in text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center">
          <CheckCircle className="text-emerald-400" size={36} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
      <p className="text-white/45 text-sm mb-6">
        Your vendor account has been created. You can now login and start managing your services.
      </p>
      <button onClick={onClose}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25">
        Continue to Login
      </button>
    </div>
  </div>
);

const fields = [
  { name: 'name',     label: 'Full Name',         type: 'text',  icon: User,     placeholder: 'Your full name' },
  { name: 'email',    label: 'Email Address',      type: 'email', icon: Mail,     placeholder: 'you@example.com' },
  { name: 'phone',    label: 'Phone Number',       type: 'tel',   icon: Phone,    placeholder: '03001234567' },
  { name: 'category', label: 'Service Category',   type: 'text',  icon: Briefcase,placeholder: 'e.g. Plumber, Electrician' },
  { name: 'location', label: 'Service Area',       type: 'text',  icon: MapPin,   placeholder: 'e.g. Karachi, Clifton' },
];

const VendorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", category: "", location: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const showToast = (message, type) => setToast({ message, type });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, phone, category, location, password } = formData;
    if (!name || !email || !phone || !category || !location || !password) {
      setError("Please fill in all fields.");
      showToast("Please fill in all required fields", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      showToast("Invalid email address", "error");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      showToast("Password too short", "error");
      return;
    }
    setLoading(true);
    try {
      await vendorAPI.register(formData);
      showToast("Registration successful!", "success");
      setShowSuccessModal(true);
    } catch (err) {
      const msg = err.message || "Registration failed. Please try again.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-500/06 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-indigo-500/06 rounded-full blur-3xl"></div>
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      <div className="w-full max-w-lg relative z-10">

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 relative bg-emerald-500/15 border border-emerald-500/30">
            <div className="absolute inset-0 rounded-2xl blur-lg bg-emerald-500/15"></div>
            <Briefcase className="text-emerald-400 relative z-10" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Vendor Registration</h1>
          <p className="text-white/40 text-sm">Join FixKar and grow your business with verified customers</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 animate-fade-in-up delay-100">

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-6 pb-6 border-b border-white/[0.07]">
            {[
              { icon: Shield, text: 'Verified Platform' },
              { icon: Sparkles, text: 'Free to Join' },
              { icon: CheckCircle, text: 'Quick Approval' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-white/35 text-xs">
                <b.icon size={12} className="text-emerald-400/60" />
                {b.text}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm animate-shake">
              <AlertCircle size={17} className="flex-shrink-0" />
              <span className="flex-1">{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {fields.map(({ name, label, type, icon: Icon, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <Icon
                    className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === name ? 'text-emerald-400' : 'text-white/25'}`}
                    size={17}
                  />
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField(null)}
                    disabled={loading}
                    className="input-dark w-full pl-10 pr-4 py-3 text-sm disabled:opacity-50"
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'password' ? 'text-emerald-400' : 'text-white/25'}`}
                  size={17}
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  className="input-dark w-full pl-10 pr-11 py-3 text-sm disabled:opacity-50"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="group relative w-full mt-2 py-3.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : 'Create Vendor Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.07] flex flex-col items-center gap-3">
            <p className="text-sm text-white/40">
              Already have an account?{' '}
              <button onClick={() => navigate('/login/vendor')}
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors hover:underline">
                Login Here
              </button>
            </p>
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/25 hover:text-white/60 text-xs transition-colors group">
              <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showSuccessModal && <SuccessModal onClose={() => { setShowSuccessModal(false); navigate('/login/vendor'); }} />}
    </div>
  );
};

export default VendorSignup;
