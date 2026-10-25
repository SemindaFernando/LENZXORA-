import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Camera,
  Layers,
  Search,
  PlusCircle,
  User,
  Shield,
  Briefcase,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const Navbar: React.FC = () => {
  const { user, role, logout, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-sm">
              <Camera className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-neutral-900">
                LENZ<span className="text-amber-600">XORA</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-neutral-100 text-neutral-600 rounded">
                Sri Lanka
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <Link
              to="/photographers"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/photographers')
                  ? 'text-neutral-900 bg-neutral-100'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Explore Photographers
            </Link>
            <Link
              to="/budget-requests"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/budget-requests')
                  ? 'text-neutral-900 bg-neutral-100'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Budget Requests
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/about')
                  ? 'text-neutral-900 bg-neutral-100'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              About
            </Link>
            <Link
              to="/budget-requests/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 rounded-full hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Post Your Budget
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-lg border border-neutral-200 transition-colors"
                title="Switch demo account to test different roles"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="capitalize">{role || 'Select Role'}:</span>
                <span className="font-semibold truncate max-w-[90px]">
                  {user?.fullName.split(' ')[0] || 'Demo'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-neutral-100 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      switchDemoUser('photo-1');
                      setDemoMenuOpen(false);
                      navigate('/studio');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                        Avantha (Photographer)
                      </div>
                      <div className="text-neutral-500 text-[11px]">Lumina Studios (Colombo)</div>
                    </div>
                    {user?.id === 'photo-1' && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">Active</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('client-1');
                      setDemoMenuOpen(false);
                      navigate('/client');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        Kasun (Client)
                      </div>
                      <div className="text-neutral-500 text-[11px]">Event Host & Reviewer</div>
                    </div>
                    {user?.id === 'client-1' && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Active</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('admin-1');
                      setDemoMenuOpen(false);
                      navigate('/admin');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        Platform Admin
                      </div>
                      <div className="text-neutral-500 text-[11px]">Moderation & Statistics</div>
                    </div>
                    {user?.id === 'admin-1' && (
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Active</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Role Dedicated Dashboard Link */}
            {user ? (
              <div className="flex items-center space-x-2">
                {role === 'photographer' && (
                  <Link
                    to="/studio"
                    className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>Studio Dashboard</span>
                  </Link>
                )}
                {role === 'client' && (
                  <Link
                    to="/client"
                    className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>My Dashboard</span>
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm"
                >
                  Join as Photographer
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/photographers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Explore Photographers
          </Link>
          <Link
            to="/budget-requests"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Budget Requests
          </Link>
          <Link
            to="/budget-requests/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 bg-amber-50"
          >
            Post Your Budget
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
          >
            About LENZXORA
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Contact
          </Link>

          {user && (
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              {role === 'photographer' && (
                <Link
                  to="/studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 font-semibold text-white bg-neutral-900 rounded-lg"
                >
                  Go to Photographer Studio
                </Link>
              )}
              {role === 'client' && (
                <Link
                  to="/client"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 font-semibold text-white bg-neutral-900 rounded-lg"
                >
                  Go to Client Dashboard
                </Link>
              )}
              {role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 font-semibold text-white bg-purple-900 rounded-lg"
                >
                  Go to Admin Panel
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
