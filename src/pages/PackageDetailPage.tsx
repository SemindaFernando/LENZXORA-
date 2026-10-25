import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Sparkles,
  Clock,
  MapPin,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { formatLKR } from '../utils/formatters';
import { useAuth } from '../features/auth/AuthContext';

export const PackageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const pkg = id ? dataService.getPackageById(id) : undefined;
  const photographer = pkg ? dataService.getPhotographerById(pkg.photographerId) : undefined;

  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!pkg || !photographer) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900">Package Not Found</h2>
        <p className="text-xs text-neutral-500 mt-2">The package you are looking for may have been retired.</p>
        <Link to="/photographers" className="mt-4 inline-block text-xs font-semibold text-amber-600">
          Browse All Creators
        </Link>
      </div>
    );
  }

  const handleBookPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    const convo = dataService.startOrGetConversation(user.id, photographer.id, 'booking', pkg.id);
    const msg = `Hi ${photographer.studioName}, I would like to book the "${pkg.title}" package (${formatLKR(pkg.priceLkr)}) for ${date || 'my event'}. Additional requirements: ${notes || 'None'}`;
    dataService.sendMessage(convo.id, user.id, user.role, msg);
    navigate(user.role === 'photographer' ? '/studio/messages' : '/client/messages');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to={`/photographers/${photographer.id}`}
        className="inline-flex items-center space-x-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to {photographer.studioName} Profile</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md text-xs font-bold uppercase tracking-wider">
                {pkg.category} Package
              </span>
              {pkg.isPopular && (
                <span className="px-2.5 py-1 bg-neutral-900 text-amber-400 rounded-md text-xs font-bold uppercase tracking-wider">
                  Top Choice
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              {pkg.title}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {pkg.description}
            </p>

            <div className="flex items-center space-x-4 py-4 border-y border-neutral-100 text-xs text-neutral-600">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{pkg.durationHours} Hours Coverage</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Creator</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="font-bold text-sm text-neutral-900">Package Features & Coverage</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {pkg.includes.map((inc, i) => (
                  <div key={i} className="flex items-start space-x-2 text-neutral-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <h3 className="font-bold text-sm text-neutral-900">Expected Deliverables</h3>
              <div className="space-y-2 text-xs">
                {pkg.deliverables.map((del, i) => (
                  <div key={i} className="flex items-start space-x-2 text-neutral-700">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Booking Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-md space-y-5">
            <div>
              <span className="text-xs text-neutral-400">Total Package Investment</span>
              <div className="text-3xl font-extrabold text-neutral-900 mt-1">
                {formatLKR(pkg.priceLkr)}
              </div>
              <span className="text-[11px] text-neutral-500">Includes all taxes & standard post-processing</span>
            </div>

            <form onSubmit={handleBookPackage} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Preferred Shoot Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Event Location & Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Specify venue city and timing details..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Inquire & Reserve Date</span>
              </button>
            </form>

            {/* Photographer card preview */}
            <div className="pt-4 border-t border-neutral-100 flex items-center space-x-3">
              <img
                src={photographer.avatarUrl}
                alt={photographer.studioName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-neutral-900 truncate">{photographer.studioName}</div>
                <div className="text-[11px] text-neutral-500">{photographer.location} • {photographer.ratingAvg} ★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
