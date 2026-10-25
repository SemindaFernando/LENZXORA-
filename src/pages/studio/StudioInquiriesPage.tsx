import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox, MessageSquare, ArrowRight, Calendar, User } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatDate } from '../../utils/formatters';

export const StudioInquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';
  const conversations = dataService.getConversations(photographerId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Direct Inquiries & Leads</h1>
        <p className="text-xs text-neutral-500">
          Client conversations initiated from your public profile and package listings.
        </p>
      </div>

      <div className="space-y-3">
        {conversations.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-12 text-center">
            <Inbox className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-neutral-800">No incoming inquiries</h4>
            <p className="text-xs text-neutral-500 mt-1">
              When clients message you or inquire about a package, conversations appear here.
            </p>
          </div>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.id}
              className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <img
                  src={conv.clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'}
                  alt={conv.clientName}
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-neutral-900">{conv.clientName}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {conv.relatedType}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{conv.lastMessageText}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-[11px] text-neutral-400 hidden sm:inline">
                  {formatDate(conv.lastMessageAt)}
                </span>
                <Link
                  to="/studio/messages"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center space-x-1"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reply</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
