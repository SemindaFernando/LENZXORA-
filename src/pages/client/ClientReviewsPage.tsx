import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataService } from '../../services/dataService';
import { formatDate } from '../../utils/formatters';
import { Review, PhotographyCategory } from '../../types';

export const ClientReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const clientId = user?.id || 'client-1';

  const [reviews, setReviews] = useState<Review[]>(() =>
    dataService.getReviews().filter(r => r.clientId === clientId)
  );

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photographerId, setPhotographerId] = useState('photo-1');
  const [category, setCategory] = useState<PhotographyCategory>('Weddings');
  const [success, setSuccess] = useState(false);

  const photographers = dataService.getPhotographers();

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev = dataService.addReview({
      bookingId: `book-rev-${Date.now()}`,
      clientId,
      clientName: user?.fullName || 'Client Reviewer',
      clientAvatar: user?.avatarUrl,
      photographerId,
      rating,
      comment,
      eventCategory: category,
    });

    setReviews(dataService.getReviews().filter(r => r.clientId === clientId));
    setComment('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">My Reviews & Testimonials</h1>
        <p className="text-xs text-neutral-500">
          Leave genuine feedback for Sri Lankan photographers after your event shoots.
        </p>
      </div>

      {/* Review Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-5">
        <h3 className="font-bold text-sm text-neutral-900">Write a Review for a Photographer</h3>

        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Review submitted successfully! Thank you for supporting local creators.</span>
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Select Photographer *
              </label>
              <select
                value={photographerId}
                onChange={e => setPhotographerId(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
              >
                {photographers.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.studioName} ({p.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Event Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Weddings">Weddings & Poruwa</option>
                <option value="Birthdays">Birthdays</option>
                <option value="Portraits">Portraits & Pre-Shoots</option>
                <option value="Events">Corporate & Events</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Your Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-neutral-300 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-amber-500 fill-amber-500' : 'text-neutral-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-neutral-700 ml-2">{rating} out of 5</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Feedback & Experience *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell others about their punctuality, creativity, communication, and delivered quality..."
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            Submit Verified Review
          </button>
        </form>
      </div>

      {/* Past Reviews List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-neutral-900">Your Past Reviews ({reviews.length})</h3>
        {reviews.map(r => (
          <div key={r.id} className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <span className="text-[11px] text-neutral-400">{formatDate(r.createdAt)}</span>
            </div>
            <p className="text-xs text-neutral-700 italic">"{r.comment}"</p>
            <span className="text-[11px] text-neutral-500 block">Category: {r.eventCategory}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
