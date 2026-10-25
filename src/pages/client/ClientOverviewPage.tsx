import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileQuestion,
  Tag,
  CalendarCheck,
  Heart,
  PlusCircle,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';

export const ClientOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const clientId = user?.id || 'client-1';

  const myRequests = dataService.getBudgetRequests({ clientId });
  const myBookings = dataService.getBookings(clientId, 'client');
  const conversations = dataService.getConversations(clientId);
  const favorites = dataService.getFavorites();

  const totalSpent = myBookings.reduce((sum, b) => sum + b.totalAmountLkr, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            Welcome, {user?.fullName || 'Client'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Track your custom photography requests, compare incoming quotes, and manage confirmed shoot bookings.
          </p>
        </div>

        <Link
          to="/budget-requests/new"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Budget Request</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <div className="text-xs text-neutral-500 flex justify-between items-center">
            <span>My Budget Requests</span>
            <FileQuestion className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">{myRequests.length}</div>
          <span className="text-[11px] text-neutral-400">
            {myRequests.filter(r => r.status === 'open' || r.status === 'offers_received').length} active
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <div className="text-xs text-neutral-500 flex justify-between items-center">
            <span>Confirmed Shoots</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">{myBookings.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Ready for production</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <div className="text-xs text-neutral-500 flex justify-between items-center">
            <span>Favorite Photographers</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">{favorites.length}</div>
          <span className="text-[11px] text-neutral-400">Saved studios</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <div className="text-xs text-neutral-500 flex justify-between items-center">
            <span>Total Booked Value</span>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900">{formatLKR(totalSpent)}</div>
          <span className="text-[11px] text-neutral-400">In Sri Lankan Rupees</span>
        </div>
      </div>

      {/* Grid: My Open Requests & Upcoming Shoots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Open Requests */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900">My Budget Requests</h3>
            <Link to="/client/requests" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
              View All ({myRequests.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {myRequests.slice(0, 3).map(req => (
              <div
                key={req.id}
                className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {req.category}
                  </span>
                  <span className="font-extrabold text-sm text-neutral-900">
                    {formatLKR(req.budgetLkr)}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-neutral-900">
                  <Link to={`/budget-requests/${req.id}`} className="hover:text-amber-600">
                    {req.title}
                  </Link>
                </h4>
                <div className="flex justify-between items-center text-[11px] text-neutral-500">
                  <span>{req.location} • {formatDate(req.eventDate)}</span>
                  <span className="font-semibold text-blue-600">{req.offersCount} offers received</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmed Shoots */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900">Confirmed Bookings</h3>
            <Link to="/client/bookings" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
              Manage Bookings →
            </Link>
          </div>

          <div className="space-y-3">
            {myBookings.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No confirmed bookings yet</p>
            ) : (
              myBookings.map(b => (
                <div
                  key={b.id}
                  className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-neutral-900">{b.eventTitle}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Studio: {b.photographerStudio} • Date: {formatDate(b.eventDate)}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-700 pt-1">
                    Total: {formatLKR(b.totalAmountLkr)} (Balance: {formatLKR(b.outstandingBalanceLkr)})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
