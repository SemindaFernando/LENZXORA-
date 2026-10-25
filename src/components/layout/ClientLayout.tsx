import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileQuestion,
  Tag,
  CalendarCheck,
  MessageSquare,
  Heart,
  CreditCard,
  Star,
  Settings,
  Menu,
  X,
  Camera,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const ClientLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/client', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/client/requests', label: 'My Budget Requests', icon: FileQuestion },
    { to: '/client/offers', label: 'Received Offers', icon: Tag },
    { to: '/client/bookings', label: 'My Bookings', icon: CalendarCheck },
    { to: '/client/messages', label: 'Messages', icon: MessageSquare },
    { to: '/client/favorites', label: 'Favorite Photographers', icon: Heart },
    { to: '/client/payments', label: 'Payment Records', icon: CreditCard },
    { to: '/client/reviews', label: 'My Reviews', icon: Star },
    { to: '/client/settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-100/60 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-neutral-200 shrink-0 sticky top-0 h-screen">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Camera className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-neutral-900">CreatorFlow</div>
              <div className="text-[10px] text-blue-600 uppercase font-semibold">Client Portal</div>
            </div>
          </Link>
        </div>

        {/* User preview */}
        <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center space-x-3">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'}
            alt={user?.fullName || 'Client'}
            className="w-9 h-9 rounded-full object-cover border border-neutral-300"
          />
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-neutral-900 truncate">{user?.fullName || 'Client'}</div>
            <div className="text-[11px] text-neutral-500 truncate">{user?.email}</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-neutral-500" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-200 space-y-2">
          <Link
            to="/budget-requests/new"
            className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Post New Budget Request</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-neutral-900">
              Client Management Portal
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/photographers"
              className="text-xs text-neutral-600 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 font-medium"
            >
              Find More Photographers
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 bg-white text-neutral-900 p-4 h-full">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="font-bold text-base">Client Portal</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 space-y-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-neutral-500" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
