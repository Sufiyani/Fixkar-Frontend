import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, LogOut, User, Shield, Wrench, Zap, ChevronRight } from 'lucide-react';

const Navbar = ({ notifications = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');
  const userType = localStorage.getItem('userType');
  const isLoggedIn = !!(accessToken && userType);

  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [location.pathname]);

  useEffect(() => {
    const handleAuth = () => setForceUpdate(prev => prev + 1);
    window.addEventListener('storage', handleAuth);
    window.addEventListener('authChange', handleAuth);
    return () => {
      window.removeEventListener('storage', handleAuth);
      window.removeEventListener('authChange', handleAuth);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('adminName');
    localStorage.removeItem('vendorId');
    localStorage.removeItem('vendorName');
    localStorage.removeItem('vendorEmail');
    window.dispatchEvent(new Event('authChange'));
    setMobileMenuOpen(false);
    setForceUpdate(prev => prev + 1);
    navigate('/', { replace: true });
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/40'
          : 'bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/40 rounded-xl blur-md group-hover:bg-indigo-500/60 transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Wrench className="text-white" size={18} />
              </div>
            </div>
            <div>
              <div className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                FixKar
              </div>
              <div className="text-[10px] font-semibold text-white/30 tracking-widest uppercase -mt-0.5">
                Pro Services
              </div>
            </div>
          </Link>

          {/* Desktop — Not Logged In */}
          {!isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center gap-1.5">
                <Link
                  to="/"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/')
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/06'
                  }`}
                >
                  <Home size={15} />
                  Home
                </Link>

                <Link
                  to="/vendors"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/vendors')
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/06'
                  }`}
                >
                  <Zap size={15} />
                  Services
                </Link>

                <div className="w-px h-5 bg-white/10 mx-1"></div>

                <Link
                  to="/login"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/05 transition-all duration-200 ${
                    location.pathname.startsWith('/login') ? 'bg-white/10 text-white border-white/20' : ''
                  }`}
                >
                  <User size={15} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 ml-1"
                >
                  Join Now
                  <ChevronRight size={14} />
                </Link>
              </div>

              <button
                className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/08 transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          ) : (
            /* Logged In */
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 bg-white/05 border border-white/08 rounded-lg px-3 py-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${userType === 'admin' ? 'bg-purple-400' : 'bg-emerald-400'} animate-pulse`}></div>
                <span className="text-xs font-semibold text-white/70">
                  {userType === 'admin' ? 'Admin Panel' : 'Vendor Panel'}
                </span>
              </div>

              <Link
                to={userType === 'admin' ? '/admin-dashboard' : '/vendor-dashboard'}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/06 transition-all"
              >
                <Home size={15} />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all duration-200"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <button
                className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/08 transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/06 bg-[#0d0d16]/98 backdrop-blur-xl animate-slide-in-down">
          <div className="px-4 py-4 space-y-1">
            {!isLoggedIn ? (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${isActive('/') ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/06'}`}>
                  <Home size={18} /> Home
                </Link>
                <Link to="/vendors" onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${isActive('/vendors') ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/06'}`}>
                  <Zap size={18} /> Services
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${location.pathname.startsWith('/login') ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/06'}`}>
                  <User size={18} /> Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm mt-2">
                  Join Now <ChevronRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/05 border border-white/08 mb-2">
                  <div className={`w-2 h-2 rounded-full ${userType === 'admin' ? 'bg-purple-400' : 'bg-emerald-400'} animate-pulse`}></div>
                  <span className="font-semibold text-white/80 text-sm">
                    {userType === 'admin' ? 'Admin Panel' : 'Vendor Panel'}
                  </span>
                </div>
                <Link
                  to={userType === 'admin' ? '/admin-dashboard' : '/vendor-dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white/70 hover:text-white hover:bg-white/06 transition-all text-sm">
                  <Home size={18} /> Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-400 hover:bg-red-500/10 transition-all w-full text-sm mt-1">
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
