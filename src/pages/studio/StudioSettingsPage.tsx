import React, { useState } from 'react';
import { Settings, Bell, Lock, Shield, Database, RotateCcw } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { isSupabaseConfigured } from '../../lib/supabase';

export const StudioSettingsPage: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [resetDone, setResetDone] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Reset local demo data back to clean initial state?')) {
      dataService.resetToDemoData();
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Studio Settings</h1>
        <p className="text-xs text-neutral-500">Configure studio alerts, security, and demo sandbox options.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 flex items-center space-x-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Notification Preferences</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-100 cursor-pointer">
              <div>
                <span className="font-semibold text-neutral-800 block">Instant Inquiries & Messages</span>
                <span className="text-[11px] text-neutral-400">Receive notifications when a client sends an inquiry</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-100 cursor-pointer">
              <div>
                <span className="font-semibold text-neutral-800 block">Shoot & Deadline Reminders</span>
                <span className="text-[11px] text-neutral-400">Alerts 48 hours before confirmed shoots & editing milestones</span>
              </div>
              <input
                type="checkbox"
                checked={bookingReminders}
                onChange={e => setBookingReminders(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 flex items-center space-x-2">
            <Database className="w-4 h-4 text-blue-500" />
            <span>Database & Storage State</span>
          </h3>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Supabase Connection:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isSupabaseConfigured ? 'Connected & Live' : 'Demo Mode (Local Persistence)'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              When Supabase environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) are configured, the app uses real Supabase Auth, PostgreSQL, and Storage.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-neutral-900">Reset Demo Data</div>
            <div className="text-[11px] text-neutral-400">Restore default Sri Lankan photographers, requests, and offers.</div>
          </div>
          <button
            onClick={handleResetData}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};
