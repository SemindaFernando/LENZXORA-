import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Plus, Tag, Calendar, MapPin, Sparkles, Trash2 } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';
import { BudgetRequest } from '../../types';

export const ClientRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const clientId = user?.id || 'client-1';

  const [requests, setRequests] = useState<BudgetRequest[]>(() =>
    dataService.getBudgetRequests({ clientId })
  );

  const handleCancelRequest = (id: string) => {
    if (window.confirm('Cancel this budget request?')) {
      dataService.updateBudgetRequest(id, { status: 'cancelled' });
      setRequests(dataService.getBudgetRequests({ clientId }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">My Budget Requests</h1>
          <p className="text-xs text-neutral-500">
            Manage your open shoot requests, compare offers, or save draft requirements.
          </p>
        </div>
        <Link
          to="/budget-requests/new"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Request</span>
        </Link>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-12 text-center space-y-2">
            <FileQuestion className="w-8 h-8 text-neutral-300 mx-auto" />
            <h4 className="font-bold text-sm text-neutral-800">You haven't posted any requests</h4>
            <p className="text-xs text-neutral-500">
              Post an event with your preferred budget and receive offers from verified photographers.
            </p>
          </div>
        ) : (
          requests.map(req => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold uppercase">
                    {req.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    req.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : req.status === 'offers_received'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {req.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-neutral-400">
                    Posted {formatDate(req.createdAt)}
                  </span>
                </div>

                <h3 className="font-bold text-base text-neutral-900">
                  <Link to={`/budget-requests/${req.id}`} className="hover:text-amber-600">
                    {req.title}
                  </Link>
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                  <span>{req.location}</span>
                  <span>•</span>
                  <span>{req.eventDate ? formatDate(req.eventDate) : 'Date Flexible'}</span>
                  <span>•</span>
                  <span>{req.durationHours} Hours Coverage</span>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-2 pt-1">
                  {req.additionalRequirements}
                </p>
              </div>

              <div className="md:w-56 md:border-l md:border-neutral-100 md:pl-6 flex flex-col justify-between shrink-0">
                <div>
                  <span className="text-[11px] text-neutral-400 font-semibold uppercase">Target Budget</span>
                  <div className="text-2xl font-extrabold text-neutral-900 mt-0.5">
                    {formatLKR(req.budgetLkr)}
                  </div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-1">
                    {req.offersCount} photographer offers
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-2">
                  <Link
                    to={`/budget-requests/${req.id}`}
                    className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold text-center"
                  >
                    Compare Offers
                  </Link>
                  {req.status === 'open' && (
                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 rounded-xl hover:bg-neutral-100"
                      title="Cancel Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
