import React from 'react';
import { CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';

export const ClientPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const clientId = user?.id || 'client-1';

  const bookings = dataService.getBookings(clientId, 'client');
  const totalPaid = bookings.reduce((sum, b) => sum + b.advancePaidLkr, 0);
  const totalDue = bookings.reduce((sum, b) => sum + b.outstandingBalanceLkr, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Payment History & Invoices</h1>
        <p className="text-xs text-neutral-500">
          Track advance deposits and remaining balances for your photography sessions in LKR.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Total Deposits Paid</span>
          <div className="text-2xl font-extrabold text-emerald-600">{formatLKR(totalPaid)}</div>
          <span className="text-[11px] text-neutral-400">Verified through CreatorFlow</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-xs text-neutral-500">Remaining Balance Upon Delivery</span>
          <div className="text-2xl font-extrabold text-amber-700">{formatLKR(totalDue)}</div>
          <span className="text-[11px] text-neutral-400">Payable after photo review</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-neutral-900">Shoot Statements</h3>
        <div className="space-y-3">
          {bookings.map(b => (
            <div
              key={b.id}
              className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-neutral-900 text-sm block">{b.eventTitle}</span>
                <span className="text-neutral-500">
                  Studio: {b.photographerStudio} • Date: {formatDate(b.eventDate)}
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Advance Paid</span>
                  <span className="font-bold text-emerald-700">{formatLKR(b.advancePaidLkr)}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Due Balance</span>
                  <span className="font-bold text-neutral-900">{formatLKR(b.outstandingBalanceLkr)}</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold uppercase text-[10px]">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
