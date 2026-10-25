import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileQuestion,
  Search,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign,
  Tag,
  Clock,
  PlusCircle,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { formatLKR, formatDate } from '../utils/formatters';
import { PhotographyCategory } from '../types';

export const BudgetRequestsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PhotographyCategory | 'All'>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(300000);
  const [searchQuery, setSearchQuery] = useState('');

  const categories: (PhotographyCategory | 'All')[] = [
    'All',
    'Weddings',
    'Birthdays',
    'Portraits',
    'Events',
    'Commercial',
    'Videography',
  ];

  const locations = [
    'All',
    'Colombo',
    'Kandy',
    'Galle',
    'Negombo',
    'Matara',
    'Jaffna',
  ];

  const requests = useMemo(() => {
    let list = dataService.getBudgetRequests({
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      location: selectedLocation === 'All' ? undefined : selectedLocation,
      maxBudget: maxBudget,
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        r => r.title.toLowerCase().includes(q) ||
             r.location.toLowerCase().includes(q) ||
             r.additionalRequirements.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, selectedLocation, maxBudget, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Open Client Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Client Budget Requests
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl">
            Browse public event shoot requirements posted by clients. Photographers can review details and pitch custom offers directly.
          </p>
        </div>

        <Link
          to="/budget-requests/new"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Your Own Request</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 mb-8 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search requirements, location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Sri Lanka Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Request Cards Grid */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
            <FileQuestion className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h3 className="font-bold text-neutral-900 text-sm">No matching budget requests</h3>
            <p className="text-xs text-neutral-500 mt-1">Try resetting your filters or post your own event request!</p>
          </div>
        ) : (
          requests.map(req => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
                    {req.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    req.status === 'open'
                      ? 'bg-emerald-50 text-emerald-700'
                      : req.status === 'offers_received'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {req.status === 'offers_received' ? `${req.offersCount} Offers Received` : req.status}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Posted {formatDate(req.createdAt)}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-neutral-900">
                  <Link to={`/budget-requests/${req.id}`} className="hover:text-amber-600">
                    {req.title}
                  </Link>
                </h2>

                <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                  {req.additionalRequirements}
                </p>

                {/* Details Pills */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{req.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{req.eventDate ? formatDate(req.eventDate) : 'Date Undecided (Flexible)'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{req.durationHours} Hours Coverage</span>
                  </span>
                </div>

                {/* Deliverables snippet */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {req.expectedDeliverables.map((del, i) => (
                    <span key={i} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[11px] rounded">
                      {del}
                    </span>
                  ))}
                </div>
              </div>

              {/* Budget & Action Box */}
              <div className="md:w-60 md:border-l md:border-neutral-100 md:pl-6 flex flex-col justify-between shrink-0">
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                    Target Client Budget
                  </div>
                  <div className="text-2xl font-extrabold text-neutral-900 mt-0.5">
                    {formatLKR(req.budgetLkr)}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    {req.offersCount === 0 ? 'Be the first to submit an offer' : `${req.offersCount} bids submitted`}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 md:border-0 md:pt-0">
                  <Link
                    to={`/budget-requests/${req.id}`}
                    className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold text-center block transition-colors"
                  >
                    View Details & Send Offer
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
