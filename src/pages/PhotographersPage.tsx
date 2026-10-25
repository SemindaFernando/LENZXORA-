import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  ShieldCheck,
  Camera,
  ArrowUpDown,
  Filter,
  Check,
  X,
  Layers,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { formatLKR } from '../utils/formatters';
import { PhotographyCategory } from '../types';

export const PhotographersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All');
  const [selectedCategory, setSelectedCategory] = useState<PhotographyCategory | 'All'>(
    (searchParams.get('category') as PhotographyCategory) || 'All'
  );
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating'>('relevance');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories: (PhotographyCategory | 'All')[] = [
    'All',
    'Weddings',
    'Portraits',
    'Birthdays',
    'Events',
    'Commercial',
    'Videography',
    'Fashion',
    'Travel & Wildlife',
  ];

  const locations = [
    'All',
    'Colombo',
    'Kandy',
    'Galle',
    'Negombo',
    'Matara',
    'Jaffna',
    'Kurunegala',
  ];

  const photographers = useMemo(() => {
    return dataService.getPhotographers({
      searchQuery,
      location: selectedLocation === 'All' ? undefined : selectedLocation,
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      maxPrice: maxPrice,
      minRating: minRating > 0 ? minRating : undefined,
      sortBy: sortBy,
    });
  }, [searchQuery, selectedLocation, selectedCategory, maxPrice, minRating, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setSelectedCategory('All');
    setMaxPrice(300000);
    setMinRating(0);
    setSortBy('relevance');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Discover Sri Lankan Photographers & Filmmakers
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Explore vetted portfolios, transparent starting packages in LKR, and verified client ratings.
        </p>
      </div>

      {/* Main Search & Control Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by studio name, style, equipment, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-neutral-100 text-neutral-800 rounded-xl text-xs font-semibold"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs text-neutral-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="relevance">Most Relevant</option>
                <option value="rating">Top Rated (4.9+)</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Category Badges */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-3 mt-3 border-t border-neutral-100 pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                Refine Search
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'Island-wide (All Sri Lanka)' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-neutral-700">Max Starting Price</span>
                <span className="font-bold text-neutral-900">{formatLKR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="300000"
                step="5000"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>Rs. 20,000</span>
                <span>Rs. 300,000+</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">Minimum Rating</label>
              <div className="space-y-1.5">
                {[4.9, 4.8, 4.5, 0].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                      minRating === rating ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      {rating > 0 ? (
                        <>
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{rating}+ and above</span>
                        </>
                      ) : (
                        <span>Any Rating</span>
                      )}
                    </div>
                    {minRating === rating && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Verified Only */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
              <div className="flex items-center space-x-2 text-xs text-amber-900 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Verified Portfolios</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                All listed photographers maintain authentic Sri Lankan identity and verified past client reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>
              Showing <strong className="text-neutral-900">{photographers.length}</strong> photographers
            </span>
          </div>

          {photographers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-neutral-300 p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base">No photographers found</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                  Try adjusting your filters, budget slider, or searching for another location.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {photographers.map(p => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Cover banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img
                      src={p.coverUrl}
                      alt={p.studioName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-full text-xs font-semibold text-neutral-900 flex items-center space-x-1 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{p.ratingAvg}</span>
                      <span className="text-neutral-400 font-normal">({p.reviewCount})</span>
                    </div>
                    {p.isVerified && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-neutral-900 text-amber-400 rounded-md text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={p.avatarUrl}
                        alt={p.studioName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <div>
                        <h2 className="font-bold text-neutral-900 text-base leading-snug">
                          {p.studioName}
                        </h2>
                        <div className="flex items-center text-xs text-neutral-500 space-x-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{p.location}, Sri Lanka</span>
                          <span>•</span>
                          <span>{p.experienceYears} yrs exp</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
                      {p.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.categories.map(cat => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-700"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-neutral-400">Starting from</div>
                        <div className="text-sm font-bold text-neutral-900">
                          {formatLKR(p.startingPriceLkr)}
                        </div>
                      </div>
                      <Link
                        to={`/photographers/${p.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xs"
                      >
                        View Profile & Packages
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
