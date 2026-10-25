export type UserRole = 'client' | 'photographer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export type PhotographyCategory =
  | 'Weddings'
  | 'Birthdays'
  | 'Portraits'
  | 'Events'
  | 'Commercial'
  | 'Videography'
  | 'Fashion'
  | 'Travel & Wildlife';

export interface PhotographerProfile {
  id: string; // matches user id
  studioName: string;
  tagline: string;
  bio: string;
  location: string; // e.g. "Colombo, Western Province"
  serviceAreas: string[];
  categories: PhotographyCategory[];
  startingPriceLkr: number;
  experienceYears: number;
  website?: string;
  instagram?: string;
  phone?: string;
  equipment?: string;
  isVerified: boolean;
  ratingAvg: number;
  reviewCount: number;
  published: boolean;
  avatarUrl: string;
  coverUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItem {
  id: string;
  photographerId: string;
  title: string;
  category: PhotographyCategory;
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  displayOrder: number;
  description?: string;
  tags?: string[];
  createdAt: string;
}

export interface ServicePackage {
  id: string;
  photographerId: string;
  title: string;
  description: string;
  category: PhotographyCategory;
  priceLkr: number;
  durationHours: number;
  deliverables: string[];
  includes: string[];
  isPopular?: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BudgetRequestStatus =
  | 'draft'
  | 'open'
  | 'offers_received'
  | 'accepted'
  | 'closed'
  | 'cancelled';

export interface BudgetRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  title: string;
  category: PhotographyCategory;
  location: string;
  budgetLkr: number;
  eventDate?: string | null; // null if undecided
  isDateFlexible: boolean;
  durationHours: number;
  requiredServices: string[];
  expectedDeliverables: string[];
  additionalRequirements: string;
  referenceImages?: string[];
  status: BudgetRequestStatus;
  offersCount: number;
  acceptedOfferId?: string;
  createdAt: string;
  updatedAt: string;
}

export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'withdrawn'
  | 'expired';

export interface RequestOffer {
  id: string;
  requestId: string;
  photographerId: string;
  photographerName: string;
  photographerStudio: string;
  photographerAvatar?: string;
  photographerRating?: number;
  photographerLocation?: string;
  proposedPriceLkr: number;
  packageDetails: string;
  durationHours: number;
  deliverables: string[];
  additionalCharges?: number;
  availabilityConfirmation: string;
  message: string;
  expiresAt?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'tentative'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  photographerId: string;
  photographerStudio: string;
  requestId?: string;
  packageId?: string;
  offerId?: string;
  eventTitle: string;
  category: PhotographyCategory;
  location: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  totalAmountLkr: number;
  advancePaidLkr: number;
  outstandingBalanceLkr: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CalendarEventType =
  | 'booking'
  | 'meeting'
  | 'deadline'
  | 'unavailable'
  | 'personal';

export interface CalendarEvent {
  id: string;
  photographerId: string;
  bookingId?: string;
  title: string;
  eventType: CalendarEventType;
  startDate: string; // YYYY-MM-DD or ISO
  endDate?: string;
  startTime?: string; // HH:mm
  endTime?: string;
  isAllDay: boolean;
  notes?: string;
  createdAt: string;
}

export type EditingStage =
  | 'shoot_scheduled'
  | 'shoot_completed'
  | 'sorting_selection'
  | 'editing'
  | 'internal_review'
  | 'client_review'
  | 'revisions'
  | 'final_delivery';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface EditingProject {
  id: string;
  photographerId: string;
  bookingId?: string;
  clientId?: string;
  clientName: string;
  title: string;
  category: PhotographyCategory;
  eventDate: string;
  shootCompletedDate?: string;
  expectedDeliverables: string;
  photoCount?: number;
  videoCount?: number;
  priority: PriorityLevel;
  stage: EditingStage;
  deadline: string; // YYYY-MM-DD
  progressPercentage: number;
  notes?: string;
  deliveryLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRecord {
  id: string;
  photographerId: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  pastBookingsCount: number;
  upcomingBookingsCount: number;
  totalSpentLkr: number;
  linkedClientId?: string; // linked user profile if registered
  createdAt: string;
  updatedAt: string;
}

export type PaymentType = 'advance' | 'balance' | 'full' | 'milestone' | 'addon';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'cheque';
export type PaymentStatus = 'completed' | 'pending';

export interface PaymentRecord {
  id: string;
  photographerId: string;
  bookingId?: string;
  bookingTitle?: string;
  clientId?: string;
  clientName: string;
  amountLkr: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  paymentDate: string; // YYYY-MM-DD
  status: PaymentStatus;
  receiptRef?: string;
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'equipment'
  | 'travel'
  | 'assistant_crew'
  | 'software_storage'
  | 'marketing'
  | 'studio_rent'
  | 'props_other';

export interface ExpenseRecord {
  id: string;
  photographerId: string;
  category: ExpenseCategory;
  description: string;
  amountLkr: number;
  expenseDate: string;
  relatedBookingId?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  photographerId: string;
  rating: number; // 1 to 5
  comment: string;
  eventCategory: PhotographyCategory;
  responseFromPhotographer?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  clientId: string;
  photographerId: string;
  clientName: string;
  clientAvatar?: string;
  photographerStudio: string;
  photographerAvatar?: string;
  relatedType: 'direct' | 'request' | 'booking';
  relatedId?: string;
  lastMessageText: string;
  lastMessageAt: string;
  unreadCountClient: number;
  unreadCountPhotographer: number;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  text: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedType: 'photographer' | 'request' | 'portfolio' | 'message';
  reportedId: string;
  reportedTitle: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  notes?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  clientId: string;
  photographerId: string;
  createdAt: string;
}
