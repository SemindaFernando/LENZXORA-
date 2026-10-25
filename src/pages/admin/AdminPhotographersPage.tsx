import React, { useState } from 'react';
import { Camera, ShieldCheck, Check, X, Star, MapPin } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { formatLKR } from '../../utils/formatters';
import { PhotographerProfile } from '../../types';

export const AdminPhotographersPage: React.FC = () => {
  const [photographers, setPhotographers] = useState<PhotographerProfile[]>(() =>
    dataService.getPhotographers()
  );

  const toggleVerify = (id: string, currentStatus: boolean) => {
    dataService.updatePhotographerProfile(id, { isVerified: !currentStatus });
    setPhotographers(dataService.getPhotographers());
  };

  const togglePublish = (id: string, currentStatus: boolean) => {
    dataService.updatePhotographerProfile(id, { published: !currentStatus });
    setPhotographers(dataService.getPhotographers());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Photographer Studios Moderation</h1>
        <p className="text-xs text-neutral-400">
          Review credentials, grant verified creator badges, or suspend profiles.
        </p>
      </div>

      <div className="space-y-3">
        {photographers.map(p => (
          <div
            key={p.id}
            className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-3">
              <img
                src={p.avatarUrl}
                alt={p.studioName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-white">{p.studioName}</h3>
                  {p.isVerified ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-400">
                      Unverified
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-400">
                  {p.location} • Starting {formatLKR(p.startingPriceLkr)} • Rating: {p.ratingAvg} ★
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleVerify(p.id, p.isVerified)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  p.isVerified
                    ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    : 'bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400'
                }`}
              >
                {p.isVerified ? 'Revoke Verified Badge' : 'Grant Verified Badge'}
              </button>

              <button
                onClick={() => togglePublish(p.id, p.published)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  p.published ? 'bg-red-950/60 text-red-400 border border-red-800/80' : 'bg-emerald-900/60 text-emerald-300'
                }`}
              >
                {p.published ? 'Unpublish / Suspend' : 'Reactivate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
