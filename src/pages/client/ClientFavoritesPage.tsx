import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, ArrowRight } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { formatLKR } from '../../utils/formatters';

export const ClientFavoritesPage: React.FC = () => {
  const favoriteIds = dataService.getFavorites();
  const allPhotographers = dataService.getPhotographers();
  const favorites = allPhotographers.filter(p => favoriteIds.includes(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Saved Favorite Photographers</h1>
        <p className="text-xs text-neutral-500">
          Bookmarked creator studios to consider for your upcoming celebrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-dashed border-neutral-300 p-12 text-center space-y-2">
            <Heart className="w-8 h-8 text-neutral-300 mx-auto" />
            <h4 className="font-bold text-sm text-neutral-800">No saved favorites yet</h4>
            <p className="text-xs text-neutral-500">
              Browse photographer profiles and tap the heart icon to save studios here.
            </p>
          </div>
        ) : (
          favorites.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10]">
                  <img src={p.coverUrl} alt={p.studioName} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/95 backdrop-blur-xs rounded-full text-xs font-semibold flex items-center space-x-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{p.ratingAvg}</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-neutral-900">{p.studioName}</h3>
                  <div className="flex items-center space-x-1 text-xs text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{p.location}, Sri Lanka</span>
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2">{p.bio}</p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Starting at</span>
                  <span className="font-extrabold text-sm text-neutral-900">{formatLKR(p.startingPriceLkr)}</span>
                </div>
                <Link
                  to={`/photographers/${p.id}`}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
