import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  MapPin,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';
import { BookingStatus } from '../../types';

export const StudioBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';

  const [bookings, setBookings] = useState(() =>
    dataService.getBookings(photographerId, 'photographer')
  );

  const handleUpdateStatus = (id: string, status: BookingStatus) => {
    dataService.updateBookingStatus(id, status);
    setBookings(dataService.getBookings(photographerId, 'photographer'));
  };

  // Detect conflicting dates among confirmed bookings
  const dateCounts: Record<string, number> = {};
  bookings.forEach(b => {
    if (b.status === 'confirmed') {
      dateCounts[b.eventDate] = (dateCounts[b.eventDate] || 0) + 1;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Studio Bookings & Contracts</h1>
          <p className="text-xs text-neutral-500">
            Confirmed client assignments, schedule windows, and payment statuses in LKR.
          </p>
        </div>
        <Link
          to="/studio/calendar"
          className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 flex items-center space-x-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>Open Calendar View</span>
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-12 text-center">
            <CalendarCheck className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-neutral-800">No bookings recorded</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Accepted offers and package reservations will generate verified booking records.
            </p>
          </div>
        ) : (
          bookings.map(booking => {
            const hasConflict = dateCounts[booking.eventDate] > 1 && booking.status === 'confirmed';
            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4"
              >
                {/* Conflict Banner */}
                {hasConflict && (
                  <div className="p-3 bg-red-50 text-red-900 rounded-xl border border-red-200 text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>
                      <strong>Schedule Conflict Alert:</strong> Multiple confirmed bookings are assigned to {formatDate(booking.eventDate)}. Please ensure assistant coverage.
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold uppercase">
                        {booking.category}
                      </span>
                      <span className="text-xs font-semibold text-neutral-500">
                        Client: <strong className="text-neutral-900">{booking.clientName}</strong>
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

                  <div className="flex items-center space-x-3">
                    <select
                      value={booking.status}
                      onChange={e => handleUpdateStatus(booking.id, e.target.value as any)}
                      className="p-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="tentative">Tentative</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Financial overview for booking */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Total Contract Value</span>
                    <span className="text-sm font-extrabold text-neutral-900">
                      {formatLKR(booking.totalAmountLkr)}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[11px]">Advance Received</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {formatLKR(booking.advancePaidLkr)}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[11px]">Outstanding Balance</span>
                    <span className="text-sm font-bold text-amber-700">
                      {formatLKR(booking.outstandingBalanceLkr)}
                    </span>
                  </div>
                </div>

                {booking.notes && (
                  <p className="text-xs text-neutral-500 italic">
                    Notes: {booking.notes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
