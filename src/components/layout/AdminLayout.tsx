import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Camera,
  AlertTriangle,
  FileQuestion,
  Settings,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/admin', label: 'Platform Statistics', icon: Shield, end: true },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/photographers', label: 'Photographer Moderation', icon: Camera },
    { to: '/admin/reports', label: 'Reported Content', icon: AlertTriangle },
    { to: '/admin/requests', label: 'Budget Requests Moderation', icon: FileQuestion },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-900/60 text-purple-400 flex items-center justify-center border border-purple-700/50">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">LENZXORA</div>
              <div className="text-[10px] text-purple-400 font-semibold uppercase">Superadmin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
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
                      ? 'bg-purple-900/40 text-purple-300 font-semibold border-l-2 border-purple-500'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-800 space-y-1">
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Site</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40 rounded-lg text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-900">
        <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-neutral-300">Live Administration Environment</span>
          </div>
          <div className="text-xs text-neutral-400">
            Logged in as <strong className="text-white">{user?.fullName || 'Superadmin'}</strong>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
