import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, ArrowRight, Briefcase, User } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email);
      if (success) {
        const currentUser = dataService.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
        if (currentUser?.role === 'admin' || email.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else if (currentUser?.role === 'photographer') {
          navigate('/studio');
        } else {
          navigate('/client');
        }
      } else {
        setError('Invalid credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userId: string, targetPath: string) => {
    switchDemoUser(userId);
    navigate(targetPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Camera className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-bold text-xl text-neutral-900">LENZXORA</span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold text-neutral-900">Welcome Back</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Sign in to access your photography studio, active bookings, or client requests.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@domain.lk"
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center space-x-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>

        {/* Quick Instant Sign-In — ONLY Photographer & Client */}
        <div className="pt-4 border-t border-neutral-100 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block text-center">
            Instant Test Sign-In
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickLogin('photo-1', '/studio')}
              className="p-2.5 rounded-xl border border-neutral-200 hover:bg-amber-50/50 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs font-bold text-neutral-900">Avantha Perera (Photographer)</div>
                  <div className="text-[11px] text-neutral-500">Lumina Studios Sri Lanka</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 uppercase">Photographer Studio</span>
            </button>

            <button
              onClick={() => handleQuickLogin('client-1', '/client')}
              className="p-2.5 rounded-xl border border-neutral-200 hover:bg-blue-50/50 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-neutral-900">Kasun Wickramasinghe (Client)</div>
                  <div className="text-[11px] text-neutral-500">Event Host & Bookings</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-700 uppercase">Client Portal</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 text-xs text-neutral-500">
          <div>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-neutral-900 hover:underline">
              Register here
            </Link>
          </div>

          <button
            type="button"
            onClick={() => {
              setEmail('admin@lenzxora.lk');
              setPassword('admin123');
            }}
            className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors underline pt-1"
            title="Administrator Sign-In"
          >
            Administrator Access
          </button>
        </div>
      </div>
    </div>
  );
};
