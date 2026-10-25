import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, DollarSign, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';
import { useAuth } from '../../features/auth/AuthContext';

export const StudioRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';

  const [locationFilter, setLocationFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const requests = dataService.getBudgetRequests({
    location: locationFilter === 'All' ? undefined : locationFilter,
    category: categoryFilter === 'All' ? undefined : categoryFilter,
  });

  const myOffers = dataService.getOffersByPhotographer(photographerId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Discover Client Budget Requests</h1>
          <p className="text-xs text-neutral-500">
            Bid on open Sri Lankan client photography requests with customized LKR proposals.
          </p>
        </div>
        <Link
          to="/studio/offers"
          className="text-xs font-semibold text-amber-600 hover:text-amber-700"
        >
          View My Sent Offers ({myOffers.length}) →
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-wrap gap-3">
        <select
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          className="p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="All">All Locations (Sri Lanka)</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
          <option value="Negombo">Negombo</option>
        </select>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="All">All Categories</option>
          <option value="Weddings">Weddings</option>
          <option value="Birthdays">Birthdays</option>
          <option value="Portraits">Portraits</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      <div className="space-y-4">
        {requests.map(req => {
          const alreadyOffered = myOffers.some(o => o.requestId === req.id);
          return (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold uppercase">
                    {req.category}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Posted by {req.clientName}
                  </span>
                </div>

                <h3 className="font-bold text-base text-neutral-900">
                  <Link to={`/budget-requests/${req.id}`} className="hover:text-amber-600">
                    {req.title}
                  </Link>
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                  {req.additionalRequirements}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{req.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{req.eventDate ? formatDate(req.eventDate) : 'Date Undecided'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{req.durationHours} Hours</span>
                  </span>
                </div>
              </div>

              <div className="md:w-56 md:border-l md:border-neutral-100 md:pl-6 flex flex-col justify-between shrink-0">
                <div>
                  <div className="text-[11px] text-neutral-400 font-semibold uppercase">Client Budget</div>
                  <div className="text-2xl font-extrabold text-neutral-900 mt-0.5">
                    {formatLKR(req.budgetLkr)}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    {alreadyOffered ? '✓ You submitted an offer' : `${req.offersCount} bids submitted`}
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/budget-requests/${req.id}`}
                    className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl text-center block transition-colors ${
                      alreadyOffered
                        ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    {alreadyOffered ? 'View Your Offer' : 'Submit Binding Offer'}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
