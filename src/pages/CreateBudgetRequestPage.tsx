import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Layers,
  CheckCircle2,
  Image,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useAuth } from '../features/auth/AuthContext';
import { PhotographyCategory } from '../types';

export const CreateBudgetRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("Daughter's 1st Birthday Celebration in Negombo");
  const [category, setCategory] = useState<PhotographyCategory>('Birthdays');
  const [location, setLocation] = useState('Negombo, Sri Lanka');
  const [budgetLkr, setBudgetLkr] = useState(35000);
  const [eventDate, setEventDate] = useState('2025-04-18');
  const [isDateFlexible, setIsDateFlexible] = useState(false);
  const [durationHours, setDurationHours] = useState(3);
  const [requiredServices, setRequiredServices] = useState('Candid event coverage, family portraits, cake cutting');
  const [expectedDeliverables, setExpectedDeliverables] = useState('120+ Edited High-Res Photos, Online Gallery link');
  const [additionalRequirements, setAdditionalRequirements] = useState(
    'Theme is pastel jungle safari. Event starts at 4 PM in an outdoor lawn venue.'
  );
  const [referenceImage, setReferenceImage] = useState(
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600'
  );

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title || title.trim().length < 5) errs.title = 'Event title must be at least 5 characters';
    if (!location || location.trim().length < 3) errs.location = 'Location is required (e.g. Negombo, Colombo)';
    if (!budgetLkr || budgetLkr < 5000) errs.budgetLkr = 'Minimum budget is Rs. 5,000';
    if (!durationHours || durationHours < 1) errs.durationHours = 'Duration must be at least 1 hour';
    if (!requiredServices || requiredServices.trim().length < 3) errs.requiredServices = 'Please specify needed services';
    if (!expectedDeliverables || expectedDeliverables.trim().length < 3) errs.expectedDeliverables = 'Please specify expected deliverables';
    if (!additionalRequirements || additionalRequirements.trim().length < 10) errs.additionalRequirements = 'Please provide more details (min 10 chars)';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (isDraft: boolean) => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const clientId = user?.id || 'client-1';
      const clientName = user?.fullName || 'Kasun Wickramasinghe';

      const newReq = dataService.createBudgetRequest({
        clientId: clientId,
        clientName: clientName,
        clientAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
        title: title.trim(),
        category: category,
        location: location.trim(),
        budgetLkr: Number(budgetLkr),
        eventDate: isDateFlexible || !eventDate ? null : eventDate,
        isDateFlexible: isDateFlexible,
        durationHours: Number(durationHours),
        requiredServices: requiredServices.split(',').map(s => s.trim()).filter(Boolean),
        expectedDeliverables: expectedDeliverables.split(',').map(s => s.trim()).filter(Boolean),
        additionalRequirements: additionalRequirements.trim(),
        referenceImages: referenceImage ? [referenceImage.trim()] : [],
        status: isDraft ? 'draft' : 'open',
      });

      navigate(`/budget-requests/${newReq.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Post Your Photography Budget Request</span>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Let Verified Photographers Compete for Your Shoot
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Tell us about your event, your location in Sri Lanka, and your target budget in LKR. We’ll notify eligible creators to submit tailored quotes.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Beachfront Wedding Shoot in Galle or 1st Birthday in Negombo"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none font-medium"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Photography Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="Weddings">Weddings & Poruwa</option>
              <option value="Birthdays">Birthdays & Celebrations</option>
              <option value="Portraits">Portraits & Pre-Shoots</option>
              <option value="Events">Corporate & Concerts</option>
              <option value="Commercial">Commercial & Products</option>
              <option value="Videography">Cinematic Video & Drone</option>
              <option value="Fashion">Fashion & Editorial</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Location in Sri Lanka *
            </label>
            <input
              type="text"
              placeholder="e.g. Negombo, Galle Fort, Colombo 07"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Budget & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Your Target Budget (LKR) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-xs font-bold text-neutral-500">Rs.</span>
              <input
                type="number"
                step="1000"
                placeholder="35000"
                value={budgetLkr}
                onChange={e => setBudgetLkr(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            {errors.budgetLkr && <p className="text-xs text-red-500 mt-1">{errors.budgetLkr}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Duration of Coverage (Hours) *
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={durationHours}
              onChange={e => setDurationHours(Number(e.target.value))}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {errors.durationHours && <p className="text-xs text-red-500 mt-1">{errors.durationHours}</p>}
          </div>
        </div>

        {/* Date & Date Flexible */}
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Event Date
            </label>
            <label className="flex items-center space-x-2 text-xs text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isDateFlexible}
                onChange={e => setIsDateFlexible(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="font-medium">Date is undecided / flexible</span>
            </label>
          </div>

          {!isDateFlexible && (
            <input
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              className="w-full p-2.5 bg-white border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
          )}
          {isDateFlexible && (
            <p className="text-xs text-neutral-500 italic">
              Photographers will provide quotes based on general availability. You can confirm the final date before locking the booking.
            </p>
          )}
        </div>

        {/* Required Services & Expected Deliverables */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Required Services (comma separated) *
            </label>
            <input
              type="text"
              placeholder="e.g. Candid coverage, Traditional Poruwa rituals, Aerial Drone footage"
              value={requiredServices}
              onChange={e => setRequiredServices(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {errors.requiredServices && <p className="text-xs text-red-500 mt-1">{errors.requiredServices}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Expected Deliverables (comma separated) *
            </label>
            <input
              type="text"
              placeholder="e.g. 200+ Edited Photos, 1 Wedding Magazine Album, 4K Video Reel"
              value={expectedDeliverables}
              onChange={e => setExpectedDeliverables(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            {errors.expectedDeliverables && <p className="text-xs text-red-500 mt-1">{errors.expectedDeliverables}</p>}
          </div>
        </div>

        {/* Detailed Requirements */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Additional Requirements & Venue Details *
          </label>
          <textarea
            rows={4}
            placeholder="Describe the venue, lighting, schedule, special family shots, or aesthetic preferences..."
            value={additionalRequirements}
            onChange={e => setAdditionalRequirements(e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          />
          {errors.additionalRequirements && <p className="text-xs text-red-500 mt-1">{errors.additionalRequirements}</p>}
        </div>

        {/* Reference Image */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Optional Moodboard / Reference Image URL
          </label>
          <input
            type="text"
            placeholder="https://images.unsplash.com/photo-..."
            value={referenceImage}
            onChange={e => setReferenceImage(e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-3 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-semibold"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center space-x-2"
          >
            <span>Publish Request to Sri Lanka Creators</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
