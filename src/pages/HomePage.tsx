import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  Search,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Award,
  Film,
  Users,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { formatLKR } from '../utils/formatters';
import { PhotographyCategory } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<PhotographyCategory | 'All'>('All');

  const featuredPhotographers = dataService.getPhotographers().slice(0, 3);
  const activeRequests = dataService.getBudgetRequests().slice(0, 3);
  const reviews = dataService.getReviews().slice(0, 3);

  const categories: { name: PhotographyCategory; count: string; image: string }[] = [
    {
      name: 'Weddings',
      count: 'Poruwa & Receptions',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Portraits',
      count: 'Editorial & Pre-Shoots',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Birthdays',
      count: 'Milestones & Celebrations',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Events',
      count: 'Corporate & Gatherings',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Commercial',
      count: 'Products & Food Stills',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Videography',
      count: '4K Films & Drone Reels',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity !== 'All') params.set('location', selectedCity);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    navigate(`/photographers?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-neutral-950 text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1800"
            alt="Photography Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700/80 text-amber-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sri Lanka’s Photography Marketplace & Studio OS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Find Your Photographer.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                Manage Every Shoot.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Discover top-rated Sri Lankan wedding, event, and portrait creators with transparent LKR pricing. Or manage your entire photography business with our private studio dashboard.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/photographers"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 text-sm flex items-center justify-center space-x-2"
              >
                <span>Find a Photographer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Join as a Photographer</span>
              </Link>
            </div>
          </div>

          {/* Quick Search Card */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-5 text-neutral-900 shadow-2xl border border-neutral-100">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Location (Sri Lanka)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="All">All Locations (Island-wide)</option>
                    <option value="Colombo">Colombo & Suburbs</option>
                    <option value="Kandy">Kandy & Central Hills</option>
                    <option value="Galle">Galle & Southern Coast</option>
                    <option value="Negombo">Negombo & Western</option>
                    <option value="Matara">Matara & Mirissa</option>
                    <option value="Jaffna">Jaffna & Northern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Photography Category
                </label>
                <div className="relative">
                  <Camera className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value as any)}
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Weddings">Weddings & Poruwa</option>
                    <option value="Portraits">Portraits & Pre-Shoots</option>
                    <option value="Birthdays">Birthdays & Parties</option>
                    <option value="Events">Corporate & Gatherings</option>
                    <option value="Commercial">Commercial & Food</option>
                    <option value="Videography">Cinematic Video & Drone</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-10 sm:h-11 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Explore Portfolios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. PHOTOGRAPHY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Popular Photography Styles
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Find verified creators specialized in your exact ceremony or event style
            </p>
          </div>
          <Link
            to="/photographers"
            className="text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/photographers?category=${cat.name}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-200"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-3.5 text-white">
                <div className="font-bold text-sm tracking-tight">{cat.name}</div>
                <div className="text-[11px] text-neutral-300 font-light truncate">{cat.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. POST YOUR BUDGET REQUEST HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-neutral-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              Client Budget Request System
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Can't find the right package? Let photographers bid on your budget.
            </h2>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              Post your event details, location, and exact budget in LKR. Available photographers review your requirements and submit custom quotes for you to compare.
            </p>
            <div className="flex flex-wrap gap-4 pt-3">
              <Link
                to="/budget-requests/new"
                className="px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-sm hover:bg-neutral-100 transition-colors shadow-md"
              >
                Post Your Budget Request (Free)
              </Link>
              <Link
                to="/budget-requests"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-colors"
              >
                Browse Open Requests
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED REAL PHOTOGRAPHERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Featured Verified Creators
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              Top-reviewed studios across Colombo, Kandy, Galle, and Negombo
            </p>
          </div>
          <Link
            to="/photographers"
            className="text-xs sm:text-sm font-semibold text-neutral-900 hover:underline flex items-center space-x-1"
          >
            <span>Explore All Photographers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPhotographers.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <img
                  src={p.coverUrl}
                  alt={p.studioName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={p.avatarUrl}
                    alt={p.studioName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base leading-snug">
                      {p.studioName}
                    </h3>
                    <div className="flex items-center text-xs text-neutral-500 space-x-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{p.location}, Sri Lanka</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
                  {p.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {p.categories.slice(0, 3).map(cat => (
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
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                  >
                    View Portfolio
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PHOTOGRAPHER STUDIO DASHBOARD PREVIEW */}
      <section className="bg-neutral-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                Photographer Business Management
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Run your entire studio from a single operating system.
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                LENZXORA is more than a directory. Every registered photographer gets a private, secure business studio with full visibility over bookings, editing deadlines, payments in LKR, and client communication.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <div className="font-bold text-sm text-white">Smart Calendar</div>
                  <p className="text-xs text-neutral-400">
                    Conflict detection prevents double booking dates. Automatically syncs confirmed requests.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-2">
                  <Film className="w-5 h-5 text-amber-400" />
                  <div className="font-bold text-sm text-white">Editing Kanban</div>
                  <p className="text-xs text-neutral-400">
                    8-stage post-production pipeline from sorting & selection to album client review & delivery.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <div className="font-bold text-sm text-white">LKR Finance Tracking</div>
                  <p className="text-xs text-neutral-400">
                    Track advance deposits, remaining balances, assistant costs, and monthly income summaries.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <div className="font-bold text-sm text-white">Client CRM</div>
                  <p className="text-xs text-neutral-400">
                    Private client records, custom shoot notes, booking history, and encrypted conversation history.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/studio"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-400 text-neutral-950 font-bold text-sm hover:bg-amber-300 transition-colors shadow-lg"
                >
                  <span>Explore Photographer Studio Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Dashboard UI mockup preview */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-neutral-400 ml-2 font-mono">/studio/overview</span>
                </div>
                <span className="text-[10px] bg-amber-400/20 text-amber-400 font-bold px-2 py-0.5 rounded">
                  Live Studio OS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="text-[11px] text-neutral-400">Monthly Bookings</div>
                  <div className="text-xl font-bold text-white mt-1">Rs. 270,000</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">+18% vs last month</div>
                </div>
                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="text-[11px] text-neutral-400">Active Editing Jobs</div>
                  <div className="text-xl font-bold text-white mt-1">4 Projects</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">2 approaching deadline</div>
                </div>
              </div>

              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2">
                <div className="text-xs font-semibold text-neutral-300">Next Upcoming Shoot</div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">Ananya & Kasun Engagement</div>
                    <div className="text-neutral-400 text-[11px]">Colombo • May 10, 2025</div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] rounded">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            How LENZXORA Works
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            Simple, safe, and transparent for clients and photographers alike
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-extrabold text-lg flex items-center justify-center mx-auto border border-amber-200">
              1
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Discover or Post Budget</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Explore portfolios and published package prices, or post your exact event requirements with your preferred LKR budget.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-extrabold text-lg flex items-center justify-center mx-auto border border-amber-200">
              2
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Compare Quotes & Chat</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Receive competitive offers from experienced photographers, clarify deliverables via private messages, and select the best fit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-neutral-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-extrabold text-lg flex items-center justify-center mx-auto border border-amber-200">
              3
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Confirmed Booking & Delivery</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Accepting an offer automatically books the date, generates calendar schedules, and tracks post-production editing stages to delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 7. GENUINE REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Client Experiences
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            Genuine verified reviews from completed bookings on LENZXORA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 mt-4 border-t border-neutral-100">
                <img
                  src={rev.clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'}
                  alt={rev.clientName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-xs text-neutral-900">{rev.clientName}</div>
                  <div className="text-[11px] text-neutral-400">{rev.eventCategory} Shoot</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
