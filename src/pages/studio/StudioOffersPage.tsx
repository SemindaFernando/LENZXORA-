import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';

export const StudioOffersPage: React.FC = () => {
  const { user } = useAuth();
  const photographerId = user?.id || 'photo-1';
  const offers = dataService.getOffersByPhotographer(photographerId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Submitted Offers & Quotations</h1>
          <p className="text-xs text-neutral-500">
            Track client responses, accepted contracts, and quotation statuses.
          </p>
        </div>
        <Link
          to="/studio/requests"
          className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800"
        >
          Browse Open Requests
        </Link>
      </div>

      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-12 text-center">
            <Tag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-neutral-800">No offers sent yet</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Browse public client budget requests to start bidding on upcoming events.
            </p>
          </div>
        ) : (
          offers.map(offer => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    offer.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : offer.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {offer.status}
                  </span>
                  <span className="text-xs text-neutral-400">
                    Sent {formatDate(offer.createdAt)}
                  </span>
                </div>

                <h3 className="font-bold text-base text-neutral-900">
                  <Link to={`/budget-requests/${offer.requestId}`} className="hover:text-amber-600">
                    Quotation for Request #{offer.requestId.replace('req-', '')}
                  </Link>
                </h3>

                <p className="text-xs text-neutral-600 italic">"{offer.message}"</p>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-600 space-y-1">
                  <div className="font-semibold text-neutral-800">Scope: {offer.packageDetails}</div>
                  <div className="text-[11px] text-neutral-500">
                    Deliverables: {offer.deliverables.join(' • ')}
                  </div>
                </div>
              </div>

              <div className="md:w-52 md:border-l md:border-neutral-100 md:pl-6 flex flex-col justify-between shrink-0">
                <div>
                  <div className="text-[11px] text-neutral-400 font-semibold uppercase">Proposed Price</div>
                  <div className="text-2xl font-extrabold text-neutral-900 mt-0.5">
                    {formatLKR(offer.proposedPriceLkr)}
                  </div>
                  <div className="text-[11px] text-neutral-500">{offer.durationHours} Hours Coverage</div>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/budget-requests/${offer.requestId}`}
                    className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl text-center block"
                  >
                    View Request Thread
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
