import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Trash2, Eye } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';
import { BudgetRequest } from '../../types';

export const AdminRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<BudgetRequest[]>(() =>
    dataService.getBudgetRequests()
  );

  const handleClose = (id: string) => {
    dataService.updateBudgetRequest(id, { status: 'closed' });
    setRequests(dataService.getBudgetRequests());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Budget Requests Moderation</h1>
        <p className="text-xs text-neutral-400">
          Monitor public client listings and prevent spam or inappropriate postings.
        </p>
      </div>

      <div className="space-y-3">
        {requests.map(req => (
          <div
            key={req.id}
            className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold uppercase text-[10px]">
                  {req.category}
                </span>
                <span className="font-bold text-white text-sm">{req.title}</span>
                <span className="text-neutral-500">• Client: {req.clientName}</span>
              </div>
              <div className="text-neutral-400">
                Location: {req.location} • Target Budget: {formatLKR(req.budgetLkr)} • Status: {req.status}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/budget-requests/${req.id}`}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold"
              >
                Inspect
              </Link>
              {req.status !== 'closed' && (
                <button
                  onClick={() => handleClose(req.id)}
                  className="px-3 py-1.5 bg-red-950/60 text-red-400 hover:bg-red-900/60 rounded-lg font-semibold border border-red-800/80"
                >
                  Close Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
