import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, MapPin, Calendar, Clock, DollarSign, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';

export const ClientBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const clientId = user?.id || 'client-1';

  const bookings = dataService.getBookings(clientId, 'client');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">My Shoot Bookings</h1>
        <p className="text-xs text-neutral-500">
          Confirmed event dates, coverage hours, and payment records with your chosen photographers.
        </p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-12 text-center space-y-2">
            <CalendarCheck className="w-8 h-8 text-neutral-300 mx-auto" />
            <h4 className="font-bold text-sm text-neutral-800">No bookings yet</h4>
            <p className="text-xs text-neutral-500">
              When you accept an offer or reserve a package, your shoot details will appear here.
            </p>
          </div>
        ) : (
          bookings.map(booking => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold uppercase">
                      {booking.category}
                    </span>
                    <span className="text-xs text-neutral-500">
                      Studio: <strong className="text-neutral-900">{booking.photographerStudio}</strong>
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-900">{booking.eventTitle}</h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formatDate(booking.eventDate)} ({booking.startTime} - {booking.endTime})</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{booking.location}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Financial Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Agreed Total</span>
                  <span className="text-sm font-extrabold text-neutral-900">{formatLKR(booking.totalAmountLkr)}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Advance Paid</span>
                  <span className="text-sm font-bold text-emerald-600">{formatLKR(booking.advancePaidLkr)}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Outstanding Balance</span>
                  <span className="text-sm font-bold text-amber-700">{formatLKR(booking.outstandingBalanceLkr)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  to={`/photographers/${booking.photographerId}`}
                  className="text-xs font-semibold text-neutral-700 hover:text-amber-600"
                >
                  View Studio Details →
                </Link>

                <div className="flex items-center space-x-2">
                  <Link
                    to="/client/messages"
                    className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-semibold flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Message Studio</span>
                  </Link>
                  <Link
                    to="/client/reviews"
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>Review Shoot</span>
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
