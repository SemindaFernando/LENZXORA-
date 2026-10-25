import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag,
  DollarSign,
  User,
  ShieldCheck,
  Star,
  MessageSquare,
  ArrowLeft,
  X,
  FileCheck,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { formatLKR, formatDate } from '../utils/formatters';
import { useAuth } from '../features/auth/AuthContext';
import { RequestOffer } from '../types';

export const BudgetRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const request = id ? dataService.getBudgetRequestById(id) : undefined;
  const offers = id ? dataService.getOffersForRequest(id) : [];

  const [submitOfferModalOpen, setSubmitOfferModalOpen] = useState(false);
  const [proposedPrice, setProposedPrice] = useState(request?.budgetLkr || 35000);
  const [durationHours, setDurationHours] = useState(request?.durationHours || 4);
  const [packageDetails, setPackageDetails] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [availabilityConfirmation, setAvailabilityConfirmation] = useState('Confirmed available on your event date.');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerError, setOfferError] = useState('');

  // Acceptance confirmation state
  const [acceptedSuccessBookingId, setAcceptedSuccessBookingId] = useState<string | null>(null);

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900">Request Not Found</h2>
        <p className="text-xs text-neutral-500 mt-2">This budget request may have been removed.</p>
        <Link to="/budget-requests" className="mt-4 inline-block text-xs font-semibold text-amber-600">
          Browse Active Requests
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === request.clientId;
  const isPhotographer = role === 'photographer';

  const photographerExistingOffer = user && isPhotographer
    ? offers.find(o => o.photographerId === user.id)
    : undefined;

  const handleAcceptOffer = (offer: RequestOffer) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const booking = dataService.acceptOfferAndCreateBooking(request.id, offer.id, user.id);
      setAcceptedSuccessBookingId(booking.id);
    } catch (err: any) {
      alert(err.message || 'Failed to accept offer');
    }
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setOfferError('');

    try {
      const photographerProfile = dataService.getPhotographerById(user.id);
      const studioName = photographerProfile?.studioName || user.fullName;

      dataService.submitOffer({
        requestId: request.id,
        photographerId: user.id,
        photographerName: user.fullName,
        photographerStudio: studioName,
        photographerAvatar: user.avatarUrl,
        photographerRating: photographerProfile?.ratingAvg || 5.0,
        photographerLocation: photographerProfile?.location || 'Colombo',
        proposedPriceLkr: Number(proposedPrice),
        packageDetails,
        durationHours: Number(durationHours),
        deliverables: deliverables.split(',').map(d => d.trim()).filter(Boolean),
        additionalCharges: Number(additionalCharges),
        availabilityConfirmation,
        message: offerMessage,
        status: 'pending',
      });

      setSubmitOfferModalOpen(false);
      // reload component state
      window.location.reload();
    } catch (err: any) {
      setOfferError(err.message || 'Error submitting offer');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Link
        to="/budget-requests"
        className="inline-flex items-center space-x-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Budget Requests</span>
      </Link>

      {acceptedSuccessBookingId && (
        <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h3 className="font-bold text-sm">Offer Accepted & Booking Confirmed!</h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                The photographer's calendar has been reserved, and an editing project is initialized.
              </p>
            </div>
          </div>
          <Link
            to="/client/bookings"
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
          >
            View in My Bookings
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Request Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-md text-xs font-bold uppercase tracking-wider">
                {request.category}
              </span>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                request.status === 'accepted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : request.status === 'open'
                  ? 'bg-blue-50 text-blue-800'
                  : 'bg-neutral-100 text-neutral-700'
              }`}>
                Status: {request.status.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              {request.title}
            </h1>

            <div className="flex items-center space-x-3 text-xs text-neutral-500 pb-4 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <img
                  src={request.clientAvatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400'}
                  alt={request.clientName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-semibold text-neutral-800">{request.clientName}</span>
              </div>
              <span>•</span>
              <span>Posted {formatDate(request.createdAt)}</span>
            </div>

            {/* Event Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px] font-semibold">Location</span>
                <span className="font-bold text-neutral-800 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{request.location}</span>
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px] font-semibold">Event Date</span>
                <span className="font-bold text-neutral-800 flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{request.eventDate ? formatDate(request.eventDate) : 'Flexible / Undecided'}</span>
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px] font-semibold">Duration</span>
                <span className="font-bold text-neutral-800 flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{request.durationHours} Hours</span>
                </span>
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
                Event Overview & Requirements
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                {request.additionalRequirements}
              </p>
            </div>

            {/* Services & Deliverables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                <span className="text-xs font-bold text-neutral-900 block">Required Services</span>
                <div className="flex flex-wrap gap-1.5">
                  {request.requiredServices.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white text-neutral-700 border border-neutral-200 text-xs rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                <span className="text-xs font-bold text-neutral-900 block">Expected Deliverables</span>
                <div className="flex flex-wrap gap-1.5">
                  {request.expectedDeliverables.map((d, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white text-neutral-700 border border-neutral-200 text-xs rounded-md">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reference Images */}
            {request.referenceImages && request.referenceImages.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
                  Moodboard / Reference Concept
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {request.referenceImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Reference"
                      className="w-48 h-32 object-cover rounded-xl border border-neutral-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Offers List & Comparison Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">
                Photographer Offers ({offers.length})
              </h2>
              <span className="text-xs text-neutral-500">
                {request.status === 'accepted' ? 'Winner selected' : 'Comparing proposals'}
              </span>
            </div>

            {offers.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-dashed border-neutral-300 text-center space-y-2">
                <Tag className="w-8 h-8 text-neutral-300 mx-auto" />
                <h4 className="font-bold text-sm text-neutral-800">No offers submitted yet</h4>
                <p className="text-xs text-neutral-500">
                  Photographers in {request.location} are reviewing this requirement. Check back soon or submit a pitch!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map(offer => (
                  <div
                    key={offer.id}
                    className={`bg-white rounded-2xl p-6 border transition-all ${
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
                            <h3 className="font-bold text-sm text-neutral-900">
                              {offer.photographerStudio}
                            </h3>
                            <span className="flex items-center text-xs text-amber-500 font-semibold">
                              <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                              {offer.photographerRating}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500">{offer.photographerLocation} • {offer.photographerName}</div>
                        </div>
                      </div>

                      <div className="text-right sm:text-right">
                        <div className="text-xl font-extrabold text-neutral-900">
                          {formatLKR(offer.proposedPriceLkr)}
                        </div>
                        <span className="text-[11px] text-neutral-400">
                          {offer.durationHours} Hours Coverage
                        </span>
                      </div>
                    </div>

                    <div className="py-4 space-y-3 text-xs">
                      <p className="text-neutral-700 leading-relaxed font-medium">
                        "{offer.message}"
                      </p>

                      <div className="p-3 bg-neutral-50 rounded-xl space-y-1.5 border border-neutral-100">
                        <div className="font-semibold text-neutral-800">Proposal Inclusions:</div>
                        <p className="text-neutral-600">{offer.packageDetails}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {offer.deliverables.map((d, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white text-neutral-700 border text-[11px] rounded">
                              ✓ {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-700 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{offer.availabilityConfirmation}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        to={`/photographers/${offer.photographerId}`}
                        className="text-xs font-semibold text-neutral-700 hover:text-amber-600"
                      >
                        View Full Studio Portfolio →
                      </Link>

                      <div className="flex items-center space-x-2">
                        {isOwner && request.status !== 'accepted' && offer.status === 'pending' && (
                          <button
                            onClick={() => handleAcceptOffer(offer)}
                            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                          >
                            Accept Offer & Confirm Booking
                          </button>
                        )}
                        {offer.status === 'accepted' && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold uppercase tracking-wider">
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
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Budget Summary & Pitch CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-5">
            <div>
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                Target Budget (LKR)
              </span>
              <div className="text-3xl font-extrabold text-neutral-900 mt-1">
                {formatLKR(request.budgetLkr)}
              </div>
              <span className="text-[11px] text-neutral-500">
                {request.isDateFlexible ? 'Client is flexible on shoot date' : 'Fixed target event date'}
              </span>
            </div>

            {/* Photographer Actions */}
            {isPhotographer && request.status !== 'accepted' && (
              <div className="pt-2">
                {photographerExistingOffer ? (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2">
                    <div className="font-bold text-amber-900">Your Offer is Pending Review</div>
                    <div className="text-amber-800">
                      You proposed {formatLKR(photographerExistingOffer.proposedPriceLkr)}. The client has been notified.
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSubmitOfferModalOpen(true)}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Offer / Proposal</span>
                  </button>
                )}
              </div>
            )}

            {/* Safe Booking Guarantees */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2 text-xs text-neutral-600">
              <div className="font-bold text-neutral-800 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>LENZXORA Booking Protection</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Accepted offers lock the date automatically in the studio schedule with milestone payment tracking in Sri Lankan Rupees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photographer Submit Offer Modal */}
      {submitOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSubmitOfferModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-xl text-neutral-900">
              Submit Quotation to {request.clientName}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Provide your proposed price in LKR, deliverables, and availability confirmation.
            </p>

            {offerError && (
              <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold">
                {offerError}
              </div>
            )}

            <form onSubmit={handleSubmitOffer} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Proposed Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={proposedPrice}
                    onChange={e => setProposedPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Included Hours *
                  </label>
                  <input
                    type="number"
                    required
                    value={durationHours}
                    onChange={e => setDurationHours(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Package Details & Inclusions *
                </label>
                <textarea
                  required
                  rows={2}
                  value={packageDetails}
                  onChange={e => setPackageDetails(e.target.value)}
                  placeholder="e.g. Lead photographer + 1 lighting assistant, color grading in Lightroom..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Deliverables (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={deliverables}
                  onChange={e => setDeliverables(e.target.value)}
                  placeholder="e.g. 150 Edited Photos, High-Speed Cloud Link, 1 Framed Print"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Availability Confirmation *
                </label>
                <input
                  type="text"
                  required
                  value={availabilityConfirmation}
                  onChange={e => setAvailabilityConfirmation(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Personal Message to Client *
                </label>
                <textarea
                  required
                  rows={3}
                  value={offerMessage}
                  onChange={e => setOfferMessage(e.target.value)}
                  placeholder="Explain why your studio is the ideal choice for their event..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Submit Binding Offer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
