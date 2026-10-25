import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { formatDate } from '../../utils/formatters';
import { ReportItem } from '../../types';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>(() => dataService.getReports());

  const handleUpdateStatus = (id: string, status: 'resolved' | 'dismissed') => {
    dataService.updateReportStatus(id, status);
    setReports(dataService.getReports());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Content & Profile Moderation Queue</h1>
        <p className="text-xs text-neutral-400">
          Review community reports regarding fraud, impersonation, or copyright issues.
        </p>
      </div>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-950 rounded-2xl border border-neutral-800">
            No reports filed.
          </div>
        ) : (
          reports.map(rep => (
            <div
              key={rep.id}
              className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-bold uppercase text-[10px]">
                    {rep.reportedType}
                  </span>
                  <span className="font-bold text-white text-sm">{rep.reportedTitle}</span>
                  <span className="text-neutral-500">• Filed by {rep.reporterName}</span>
                </div>
                <p className="text-neutral-300 italic">"{rep.reason}"</p>
                <div className="text-[10px] text-neutral-500">Filed {formatDate(rep.createdAt)}</div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                  rep.status === 'resolved'
                    ? 'bg-emerald-900/60 text-emerald-300'
                    : rep.status === 'dismissed'
                    ? 'bg-neutral-800 text-neutral-400'
                    : 'bg-amber-900/60 text-amber-300'
                }`}>
                  {rep.status}
                </span>

                {rep.status === 'pending' && (
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleUpdateStatus(rep.id, 'resolved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(rep.id, 'dismissed')}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-lg"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
