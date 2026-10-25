import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  ShieldCheck,
  Globe,
  Phone,
  Camera,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { formatLKR, formatDate } from '../utils/formatters';
import { useAuth } from '../features/auth/AuthContext';
import { PhotographyCategory, PortfolioItem, ServicePackage } from '../types';

export const PhotographerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const photographer = id ? dataService.getPhotographerById(id) : undefined;
  const portfolio = id ? dataService.getPortfolio(id) : [];
  const packages = id ? dataService.getPackages(id) : [];
  const reviews = id ? dataService.getReviews(id) : [];

  const [activeTab, setActiveTab] = useState<'portfolio' | 'packages' | 'reviews' | 'about'>('portfolio');
  const [selectedPortfolioCategory, setSelectedPortfolioCategory] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Direct Inquiry / Booking modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedPackageForInquiry, setSelectedPackageForInquiry] = useState<ServicePackage | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');

  if (!photographer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">Photographer Not Found</h2>
        <p className="text-sm text-neutral-500 mt-2">
          The requested creator profile does not exist or may have been unpublished.
        </p>
        <Link
          to="/photographers"
          className="mt-6 inline-block px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          Browse Photographers
        </Link>
      </div>
    );
  }

  const filteredPortfolio = selectedPortfolioCategory === 'All'
    ? portfolio
    : portfolio.filter(p => p.category === selectedPortfolioCategory);

  const portfolioCategories = ['All', ...Array.from(new Set(portfolio.map(p => p.category)))];

  const handleToggleFavorite = () => {
    if (photographer.id) {
      const active = dataService.toggleFavorite(photographer.id);
      setIsSaved(active);
    }
  };

  const handleStartChat = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const convo = dataService.startOrGetConversation(user.id, photographer.id, 'direct');
    navigate(user.role === 'photographer' ? '/studio/messages' : '/client/messages');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    const convo = dataService.startOrGetConversation(
      user.id,
      photographer.id,
      selectedPackageForInquiry ? 'booking' : 'direct',
      selectedPackageForInquiry?.id
    );

    const fullText = selectedPackageForInquiry
      ? `Hi ${photographer.studioName}, I am interested in booking the "${selectedPackageForInquiry.title}" package (${formatLKR(selectedPackageForInquiry.priceLkr)}) on ${inquiryDate || 'an upcoming date'}. Note: ${inquiryMessage}`
      : `Hi ${photographer.studioName}, ${inquiryMessage}`;

    dataService.sendMessage(convo.id, user.id, user.role, fullText);
    setInquiryModalOpen(false);
    navigate(user.role === 'photographer' ? '/studio/messages' : '/client/messages');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    dataService.submitReport({
      reporterId: user.id,
      reporterName: user.fullName,
      reportedType: 'photographer',
      reportedId: photographer.id,
      reportedTitle: photographer.studioName,
      reason: reportReason,
      status: 'pending',
    });
    setReportSuccess(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSuccess(false);
      setReportReason('');
    }, 1500);
  };

  return (
    <div className="pb-20">
      {/* Cover Header */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-neutral-900">
        <img
          src={photographer.coverUrl}
          alt={photographer.studioName}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button
            onClick={handleToggleFavorite}
            className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-red-500 text-white'
                : 'bg-white/80 hover:bg-white text-neutral-800'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={() => setReportModalOpen(true)}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white text-neutral-800 backdrop-blur-md"
            title="Report profile"
          >
            <AlertTriangle className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 sm:-mt-24 mb-8 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img
                src={photographer.avatarUrl}
                alt={photographer.studioName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-neutral-100 shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    {photographer.studioName}
                  </h1>
                  {photographer.isVerified && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Verified Creator</span>
                    </span>
                  )}
                </div>

                <p className="text-sm text-neutral-600 font-medium">{photographer.tagline}</p>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500 pt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{photographer.location}, Sri Lanka</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-neutral-900">{photographer.ratingAvg}</span>
                    <span>({photographer.reviewCount} reviews)</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{photographer.experienceYears} Years Experience</span>
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleStartChat}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-neutral-600" />
                <span>Message</span>
              </button>

              <button
                onClick={() => {
                  setSelectedPackageForInquiry(null);
                  setInquiryModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book / Check Date</span>
              </button>
            </div>
          </div>

          {/* Social Links & Service Areas */}
          <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-4">
            <div className="flex items-center space-x-4">
              {photographer.website && (
                <a
                  href={photographer.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 hover:text-amber-600 font-medium"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                </a>
              )}
              {photographer.instagram && (
                <a
                  href={`https://instagram.com/${photographer.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 hover:text-amber-600 font-medium"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{photographer.instagram}</span>
                </a>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-neutral-700">Service Coverage:</span>
              <span className="text-neutral-500">{photographer.serviceAreas.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 mb-8 overflow-x-auto">
          {[
            { key: 'portfolio', label: `Portfolio (${portfolio.length})` },
            { key: 'packages', label: `Service Packages (${packages.length})` },
            { key: 'reviews', label: `Client Reviews (${reviews.length})` },
            { key: 'about', label: 'Biography & Gear' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Portfolio Gallery */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            {/* Gallery Category Filter */}
            {portfolioCategories.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {portfolioCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPortfolioCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedPortfolioCategory === cat
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {filteredPortfolio.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200">
                <Camera className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-500">No portfolio items in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPortfolio.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage(item)}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer shadow-xs hover:shadow-xl transition-all"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      {item.description && (
                        <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5 font-light">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Service Packages */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                  pkg.isPopular
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                    : 'border-neutral-200 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700">
                      {pkg.category}
                    </span>
                    {pkg.isPopular && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-400 text-neutral-950 uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900">{pkg.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{pkg.description}</p>

                  <div className="my-5 pt-4 border-t border-neutral-100">
                    <div className="text-2xl font-extrabold text-neutral-900">
                      {formatLKR(pkg.priceLkr)}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      Estimated duration: {pkg.durationHours} hours
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="font-semibold text-neutral-900 mb-2">What's Included:</div>
                      <ul className="space-y-1.5 text-neutral-600">
                        {pkg.includes.map((inc, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="font-semibold text-neutral-900 mb-2">Deliverables:</div>
                      <ul className="space-y-1.5 text-neutral-600">
                        {pkg.deliverables.map((del, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      setSelectedPackageForInquiry(pkg);
                      setInquiryModalOpen(true);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      pkg.isPopular
                        ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-xs'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    Select & Inquire Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="text-center sm:text-left">
                <div className="text-4xl font-extrabold text-neutral-900">{photographer.ratingAvg}</div>
                <div className="flex items-center justify-center sm:justify-start space-x-1 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <div className="text-xs text-neutral-400">Based on {photographer.reviewCount} verified client shoots</div>
              </div>

              <div className="text-xs text-neutral-500 max-w-md text-center sm:text-right">
                All reviews are collected strictly from confirmed completed bookings on LENZXORA.
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map(rev => (
                <div key={rev.id} className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={rev.clientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400'}
                        alt={rev.clientName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-xs text-neutral-900">{rev.clientName}</div>
                        <div className="text-[11px] text-neutral-400">{rev.eventCategory} Photography • {formatDate(rev.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 leading-relaxed pl-13">
                    "{rev.comment}"
                  </p>

                  {rev.responseFromPhotographer && (
                    <div className="ml-13 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs space-y-1">
                      <div className="font-semibold text-neutral-800">Response from {photographer.studioName}:</div>
                      <p className="text-neutral-600">{rev.responseFromPhotographer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: About & Equipment */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-6">
              <div>
                <h3 className="font-bold text-base text-neutral-900 mb-2">About the Studio</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                  {photographer.bio}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-base text-neutral-900 mb-2">Cameras & Gear</h3>
                <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100 font-mono">
                  {photographer.equipment || 'Sony Alpha full-frame cameras, G Master Prime lenses, professional strobe lighting, and calibrated 4K editing monitors.'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">Service Locations</h4>
                <div className="flex flex-wrap gap-1.5">
                  {photographer.serviceAreas.map(area => (
                    <span key={area} className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-md text-xs font-medium">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">Need a Custom Quote?</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Have unique hours or multi-day destination shoots? Message the studio directly for tailored proposals.
                </p>
                <button
                  onClick={handleStartChat}
                  className="w-full py-2 bg-white text-neutral-950 font-bold text-xs rounded-xl hover:bg-neutral-100"
                >
                  Send Direct Inquiry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] flex items-center justify-center bg-black">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 text-white flex justify-between items-center bg-neutral-900">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {selectedImage.category}
                </span>
                <h3 className="font-bold text-sm">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-xs text-neutral-400 mt-0.5">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry / Booking Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-neutral-900">
              {selectedPackageForInquiry ? `Inquire: ${selectedPackageForInquiry.title}` : `Contact ${photographer.studioName}`}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Direct message to photographer. Check availability and discuss requirements.
            </p>

            <form onSubmit={handleSendInquiry} className="mt-4 space-y-4">
              {selectedPackageForInquiry && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <div className="font-bold text-amber-900">{formatLKR(selectedPackageForInquiry.priceLkr)}</div>
                  <div className="text-amber-800">{selectedPackageForInquiry.durationHours} hours coverage</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Event / Shoot Date
                </label>
                <input
                  type="date"
                  value={inquiryDate}
                  onChange={e => setInquiryDate(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Message / Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={inquiryMessage}
                  onChange={e => setInquiryMessage(e.target.value)}
                  placeholder="Describe your event venue, timeline, and questions..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 shadow-sm transition-colors"
              >
                Send Message & Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full bg-white rounded-2xl p-6 shadow-2xl border border-neutral-200">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-base text-neutral-900">Report Profile</h3>
            <p className="text-xs text-neutral-500 mt-1">
              LENZXORA takes fraud and misleading portfolios seriously. Our moderation team reviews all reports.
            </p>

            {reportSuccess ? (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold text-center">
                Report submitted successfully. Thank you for keeping our platform safe.
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="mt-4 space-y-3">
                <textarea
                  required
                  rows={3}
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder="Explain why this profile violates guidelines (e.g. copyright, false pricing)..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
                >
                  Submit Report to Admin
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
