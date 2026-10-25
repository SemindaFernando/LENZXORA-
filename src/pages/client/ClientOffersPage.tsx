import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, CheckCircle2, Star, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatLKR, formatDate } from '../../utils/formatters';
import { RequestOffer } from '../../types';

export const ClientOffersPage: React.FC = () => {
  const { user } = useAuth();
  const clientId = user?.id || 'client-1';

  const myRequests = dataService.getBudgetRequests({ clientId });
  const allOffers: { offer: RequestOffer; requestTitle: string }[] = [];

  myRequests.forEach(req => {
    const reqOffers = dataService.getOffersForRequest(req.id);
    reqOffers.forEach(o => {
      allOffers.push({ offer: o, requestTitle: req.title });
    });
  });

  const [offersList, setOffersList] = useState(allOffers);

  const handleAcceptOffer = (requestId: string, offerId: string) => {
    try {
      dataService.acceptOfferAndCreateBooking(requestId, offerId, clientId);
      alert('Offer accepted successfully! A confirmed booking has been created.');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to accept offer');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Received Photographer Offers</h1>
        <p className="text-xs text-neutral-500">
          Compare custom quotes, deliverables, and photographer ratings for your events.
        </p>
      </div>

      <div className="space-y-4">
        {offersList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-12 text-center space-y-2">
            <Tag className="w-8 h-8 text-neutral-300 mx-auto" />
            <h4 className="font-bold text-sm text-neutral-800">No offers received yet</h4>
            <p className="text-xs text-neutral-500">
              When photographers bid on your requests, their proposals will appear here.
            </p>
          </div>
        ) : (
          offersList.map(({ offer, requestTitle }) => (
            <div
              key={offer.id}
              className={`bg-white rounded-3xl p-6 border transition-all ${
                offer.status === 'accepted'
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-neutral-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                <div className="flex items-center space-x-3">
                  <img
                    src={offer.photographerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                    alt={offer.photographerStudio}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-neutral-900">{offer.photographerStudio}</h3>
                      <span className="flex items-center text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                        {offer.photographerRating}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      For Request: <strong className="text-neutral-700">{requestTitle}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-neutral-900">{formatLKR(offer.proposedPriceLkr)}</div>
                  <span className="text-[11px] text-neutral-400">{offer.durationHours} Hours Coverage</span>
                </div>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <p className="text-neutral-700 italic">"{offer.message}"</p>
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-neutral-600 space-y-1">
                  <div className="font-semibold text-neutral-800">Deliverables:</div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {offer.deliverables.map((d, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border text-[11px] rounded">
                        ✓ {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <Link
                  to={`/photographers/${offer.photographerId}`}
                  className="text-xs font-semibold text-neutral-700 hover:text-amber-600"
                >
                  View Studio Portfolio →
                </Link>

                <div className="flex items-center space-x-2">
                  {offer.status === 'pending' && (
                    <button
                      onClick={() => handleAcceptOffer(offer.requestId, offer.id)}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Accept Offer & Confirm Booking
                    </button>
                  )}
                  {offer.status === 'accepted' && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold uppercase">
                      Accepted Offer
                    </span>
                  )}
                  {offer.status === 'declined' && (
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-lg text-xs font-medium">
                      Declined
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
