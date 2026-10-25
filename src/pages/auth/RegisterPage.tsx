import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, User, Briefcase, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>('photographer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studioName, setStudioName] = useState('');
  const [location, setLocation] = useState('Colombo');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await register({
        email,
        fullName,
        role,
        studioName: role === 'photographer' ? studioName : undefined,
        location: role === 'photographer' ? location : undefined,
      });

      if (success) {
        if (role === 'photographer') {
          navigate('/studio');
        } else {
          navigate('/client');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
              <Camera className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-bold text-xl text-neutral-900">LENZXORA</span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold text-neutral-900">Create Your Account</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Join Sri Lanka’s specialized photography marketplace & business dashboard.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setRole('photographer')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              role === 'photographer'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-500" />
            <span>I'm a Photographer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('client')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              role === 'client'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span>I'm a Client / Host</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Kasun Perera"
                className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

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

          {/* Additional fields for photographer */}
          {role === 'photographer' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Studio / Brand Name</label>
                <div className="relative">
                  <Camera className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={studioName}
                    onChange={e => setStudioName(e.target.value)}
                    placeholder="e.g. Ceylon Lens Visuals"
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Primary Base City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                  <select
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Negombo">Negombo</option>
                    <option value="Matara">Matara</option>
                    <option value="Jaffna">Jaffna</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center space-x-2 pt-3"
          >
            <span>{role === 'photographer' ? 'Register Studio & Open Dashboard' : 'Create Client Account'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-neutral-900 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
