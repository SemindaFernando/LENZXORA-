import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Image,
  Package,
  Inbox,
  Search,
  FileText,
  CalendarDays,
  Film,
  Users,
  MessageSquare,
  DollarSign,
  Settings,
  ExternalLink,
  Menu,
  X,
  Camera,
  ChevronRight,
  LogOut,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';

export const StudioLayout: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const photographer =
    (user?.id ? dataService.getPhotographerById(user.id) : undefined) ||
    (user?.role === 'admin' ? dataService.getPhotographers()[0] : undefined);
  const studioName = photographer?.studioName || user?.fullName || 'Photographer Studio';

  const navLinks = [
    { to: '/studio', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/studio/profile', label: 'My Profile', icon: User },
    { to: '/studio/portfolio', label: 'Portfolio', icon: Image },
    { to: '/studio/packages', label: 'Service Packages', icon: Package },
    { to: '/studio/inquiries', label: 'Inquiries', icon: Inbox },
    { to: '/studio/requests', label: 'Budget Requests', icon: Search },
    { to: '/studio/offers', label: 'Offers & Quotations', icon: FileText },
    { to: '/studio/bookings', label: 'Bookings', icon: CalendarDays },
    { to: '/studio/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/studio/editing', label: 'Editing Workflow', icon: Film },
    { to: '/studio/clients', label: 'Clients CRM', icon: Users },
    { to: '/studio/messages', label: 'Messages', icon: MessageSquare },
    { to: '/studio/finance', label: 'Finance & Payments', icon: DollarSign },
    { to: '/studio/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-100/60 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-900 text-white shrink-0 sticky top-0 h-screen border-r border-neutral-800">
        {/* Brand */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white">LENZXORA</div>
              <div className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">Studio OS</div>
            </div>
          </Link>
        </div>

        {/* Studio Identity Card */}
        <div className="px-4 py-3 bg-neutral-800/40 border-b border-neutral-800/80 flex items-center space-x-3">
          <img
            src={photographer?.avatarUrl || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
            alt={studioName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/30"
          />
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">{studioName}</div>
            <div className="text-[11px] text-neutral-400 truncate">{photographer?.location || 'Colombo, Sri Lanka'}</div>
          </div>
        </div>

        {/* Navigation list */}
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
                      ? 'bg-amber-500/20 text-amber-300 font-semibold border-l-2 border-amber-400'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="p-3 border-t border-neutral-800 space-y-1">
          {user && (
            <Link
              to={`/photographers/${user.id}`}
              target="_blank"
              className="flex items-center justify-between px-3 py-1.5 text-xs text-neutral-400 hover:text-amber-300 rounded-lg hover:bg-neutral-800/40"
            >
              <span className="flex items-center space-x-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Profile</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-neutral-900">
                Studio Management Dashboard
              </h1>
              <p className="text-[11px] text-neutral-500 hidden sm:block">
                Manage your shoots, workflow, contracts, and finances in Sri Lankan Rupees (LKR)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-xs bg-purple-900 text-purple-200 hover:bg-purple-800 px-2.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1 shadow-xs"
              >
                <span>Admin Panel</span>
              </Link>
            )}
            <Link
              to="/"
              className="text-xs text-neutral-600 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 font-medium"
            >
              Marketplace Home
            </Link>
            <Link
              to="/studio/messages"
              className="relative p-2 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
              title="Messages"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
            </Link>
          </div>
        </header>

        {/* Outlet View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Modal */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 bg-neutral-900 text-white p-4 h-full">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="font-bold text-base text-white">Studio OS</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
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
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 font-semibold'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
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
