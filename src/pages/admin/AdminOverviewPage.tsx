import React from 'react';
import { Shield, Users, Camera, FileQuestion, CalendarCheck, AlertTriangle, DollarSign } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { formatLKR } from '../../utils/formatters';

export const AdminOverviewPage: React.FC = () => {
  const users = dataService.getUsers();
  const photographers = dataService.getPhotographers();
  const requests = dataService.getBudgetRequests();
  const bookings = dataService.getBookings('', 'admin');
  const reports = dataService.getReports();

  const totalBookingVolume = bookings.reduce((sum, b) => sum + b.totalAmountLkr, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform Administration & Oversight</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Monitor platform metrics, user growth, verified photography studios, and content moderation queues.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{users.length}</div>
          <span className="text-[11px] text-neutral-400">
            {users.filter(u => u.role === 'photographer').length} photographers, {users.filter(u => u.role === 'client').length} clients
          </span>
        </div>

        <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>Verified Studios</span>
            <Camera className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {photographers.filter(p => p.isVerified).length} / {photographers.length}
          </div>
          <span className="text-[11px] text-amber-400 font-semibold">Verified badge active</span>
        </div>

        <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>Active Budget Requests</span>
            <FileQuestion className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{requests.length}</div>
          <span className="text-[11px] text-neutral-400">Open client requests</span>
        </div>

        <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>Gross Contract Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{formatLKR(totalBookingVolume)}</div>
          <span className="text-[11px] text-neutral-400">Across {bookings.length} confirmed bookings</span>
        </div>
      </div>

      {/* Reports Alert Box */}
      <div className="bg-neutral-950 rounded-3xl p-6 border border-neutral-800 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
          <h3 className="font-bold text-sm text-white flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Pending Flagged Reports ({reports.filter(r => r.status === 'pending').length})</span>
          </h3>
          <span className="text-xs text-neutral-400">Safety & Compliance</span>
        </div>

        <div className="space-y-3">
          {reports.map(rep => (
            <div
              key={rep.id}
              className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-400 mr-2">
                  {rep.reportedType}
                </span>
                <span className="font-bold text-white">{rep.reportedTitle}</span>
                <p className="text-neutral-400 mt-1">Reason: {rep.reason}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-bold uppercase text-[10px] rounded">
                  {rep.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
