import {
  UserProfile,
  PhotographerProfile,
  PortfolioItem,
  ServicePackage,
  BudgetRequest,
  RequestOffer,
  Booking,
  CalendarEvent,
  EditingProject,
  ClientRecord,
  PaymentRecord,
  ExpenseRecord,
  Review,
  Conversation,
  Message,
  ReportItem,
  PhotographyCategory,
  BudgetRequestStatus,
  OfferStatus,
  BookingStatus,
  EditingStage,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PHOTOGRAPHERS,
  INITIAL_PORTFOLIO,
  INITIAL_PACKAGES,
  INITIAL_REQUESTS,
  INITIAL_OFFERS,
  INITIAL_BOOKINGS,
  INITIAL_CALENDAR,
  INITIAL_EDITING_PROJECTS,
  INITIAL_CLIENTS,
  INITIAL_PAYMENTS,
  INITIAL_EXPENSES,
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_REPORTS,
} from './mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

// Helper to get / set from LocalStorage for seamless mock persistence
function getStorage<T>(key: string, initial: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return initial;
    const item = localStorage.getItem(`lenzxora_${key}`) || localStorage.getItem(`creatorflow_${key}`);
    return item ? JSON.parse(item) : initial;
  } catch (e) {
    return initial;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(`lenzxora_${key}`, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
}

class DataService {
  private users: UserProfile[];
  private photographers: PhotographerProfile[];
  private portfolio: PortfolioItem[];
  private packages: ServicePackage[];
  private requests: BudgetRequest[];
  private offers: RequestOffer[];
  private bookings: Booking[];
  private calendar: CalendarEvent[];
  private editingProjects: EditingProject[];
  private clients: ClientRecord[];
  private payments: PaymentRecord[];
  private expenses: ExpenseRecord[];
  private reviews: Review[];
  private conversations: Conversation[];
  private messages: Message[];
  private reports: ReportItem[];
  private favorites: string[]; // photographerIds saved by current user

  constructor() {
    this.users = getStorage('users', INITIAL_USERS);
    this.photographers = getStorage('photographers', INITIAL_PHOTOGRAPHERS);
    this.portfolio = getStorage('portfolio', INITIAL_PORTFOLIO);
    this.packages = getStorage('packages', INITIAL_PACKAGES);
    this.requests = getStorage('requests', INITIAL_REQUESTS);
    this.offers = getStorage('offers', INITIAL_OFFERS);
    this.bookings = getStorage('bookings', INITIAL_BOOKINGS);
    this.calendar = getStorage('calendar', INITIAL_CALENDAR);
    this.editingProjects = getStorage('editingProjects', INITIAL_EDITING_PROJECTS);
    this.clients = getStorage('clients', INITIAL_CLIENTS);
    this.payments = getStorage('payments', INITIAL_PAYMENTS);
    this.expenses = getStorage('expenses', INITIAL_EXPENSES);
    this.reviews = getStorage('reviews', INITIAL_REVIEWS);
    this.conversations = getStorage('conversations', INITIAL_CONVERSATIONS);
    this.messages = getStorage('messages', INITIAL_MESSAGES);
    this.reports = getStorage('reports', INITIAL_REPORTS);
    this.favorites = getStorage('favorites', ['photo-1']);
  }

  // --- RESET TO DEFAULTS ---
  public resetToDemoData(): void {
    localStorage.clear();
    this.users = [...INITIAL_USERS];
    this.photographers = [...INITIAL_PHOTOGRAPHERS];
    this.portfolio = [...INITIAL_PORTFOLIO];
    this.packages = [...INITIAL_PACKAGES];
    this.requests = [...INITIAL_REQUESTS];
    this.offers = [...INITIAL_OFFERS];
    this.bookings = [...INITIAL_BOOKINGS];
    this.calendar = [...INITIAL_CALENDAR];
    this.editingProjects = [...INITIAL_EDITING_PROJECTS];
    this.clients = [...INITIAL_CLIENTS];
    this.payments = [...INITIAL_PAYMENTS];
    this.expenses = [...INITIAL_EXPENSES];
    this.reviews = [...INITIAL_REVIEWS];
    this.conversations = [...INITIAL_CONVERSATIONS];
    this.messages = [...INITIAL_MESSAGES];
    this.reports = [...INITIAL_REPORTS];
    this.favorites = ['photo-1'];
    window.location.reload();
  }

  // --- USERS & AUTH ---
  public getUsers(): UserProfile[] {
    return [...this.users];
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.users.find(u => u.id === id);
  }

  public updateUserRole(userId: string, role: UserProfile['role']): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.role = role;
      user.updatedAt = new Date().toISOString();
      setStorage('users', this.users);
    }
  }

  // --- PHOTOGRAPHERS ---
  public getPhotographers(filters?: {
    location?: string;
    category?: PhotographyCategory | 'All';
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    searchQuery?: string;
    sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating';
  }): PhotographerProfile[] {
    let result = [...this.photographers.filter(p => p.published)];

    if (filters?.location && filters.location !== 'All') {
      const loc = filters.location.toLowerCase();
      result = result.filter(
        p => p.location.toLowerCase().includes(loc) ||
             p.serviceAreas.some(area => area.toLowerCase().includes(loc))
      );
    }

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(p => p.categories.includes(filters.category as PhotographyCategory));
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(p => p.startingPriceLkr >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter(p => p.startingPriceLkr <= filters.maxPrice!);
    }

    if (filters?.minRating !== undefined) {
      result = result.filter(p => p.ratingAvg >= filters.minRating!);
    }

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        p => p.studioName.toLowerCase().includes(q) ||
             p.tagline.toLowerCase().includes(q) ||
             p.bio.toLowerCase().includes(q) ||
             p.location.toLowerCase().includes(q)
      );
    }

    if (filters?.sortBy) {
      if (filters.sortBy === 'price_low') {
        result.sort((a, b) => a.startingPriceLkr - b.startingPriceLkr);
      } else if (filters.sortBy === 'price_high') {
        result.sort((a, b) => b.startingPriceLkr - a.startingPriceLkr);
      } else if (filters.sortBy === 'rating') {
        result.sort((a, b) => b.ratingAvg - a.ratingAvg);
      }
    }

    return result;
  }

  public getPhotographerById(id: string): PhotographerProfile | undefined {
    return this.photographers.find(p => p.id === id);
  }

  public updatePhotographerProfile(id: string, updates: Partial<PhotographerProfile>): PhotographerProfile {
    const index = this.photographers.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Photographer profile not found');
    this.photographers[index] = {
      ...this.photographers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorage('photographers', this.photographers);
    return this.photographers[index];
  }

  // --- PORTFOLIO ---
  public getPortfolio(photographerId: string): PortfolioItem[] {
    return this.portfolio
      .filter(item => item.photographerId === photographerId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'createdAt'>): PortfolioItem {
    const newItem: PortfolioItem = {
      ...item,
      id: `port-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.portfolio.push(newItem);
    setStorage('portfolio', this.portfolio);
    return newItem;
  }

  public deletePortfolioItem(id: string): void {
    this.portfolio = this.portfolio.filter(item => item.id !== id);
    setStorage('portfolio', this.portfolio);
  }

  // --- PACKAGES ---
  public getPackages(photographerId?: string): ServicePackage[] {
    if (photographerId) {
      return this.packages.filter(p => p.photographerId === photographerId && p.active);
    }
    return this.packages.filter(p => p.active);
  }

  public getPackageById(id: string): ServicePackage | undefined {
    return this.packages.find(p => p.id === id);
  }

  public createPackage(pkg: Omit<ServicePackage, 'id' | 'createdAt' | 'updatedAt'>): ServicePackage {
    const newPkg: ServicePackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.packages.push(newPkg);
    setStorage('packages', this.packages);
    return newPkg;
  }

  public updatePackage(id: string, updates: Partial<ServicePackage>): ServicePackage {
    const idx = this.packages.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Package not found');
    this.packages[idx] = {
      ...this.packages[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorage('packages', this.packages);
    return this.packages[idx];
  }

  public deletePackage(id: string): void {
    this.packages = this.packages.filter(p => p.id !== id);
    setStorage('packages', this.packages);
  }

  // --- BUDGET REQUESTS ---
  public getBudgetRequests(filters?: {
    category?: string;
    location?: string;
    status?: BudgetRequestStatus | 'All';
    maxBudget?: number;
    clientId?: string;
  }): BudgetRequest[] {
    let result = [...this.requests];

    if (filters?.clientId) {
      result = result.filter(r => r.clientId === filters.clientId);
    } else {
      // In public listing, hide drafts unless requested by the specific client
      result = result.filter(r => r.status !== 'draft');
    }

    if (filters?.status && filters.status !== 'All') {
      result = result.filter(r => r.status === filters.status);
    }

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(r => r.category === filters.category);
    }

    if (filters?.location && filters.location !== 'All') {
      const loc = filters.location.toLowerCase();
      result = result.filter(r => r.location.toLowerCase().includes(loc));
    }

    if (filters?.maxBudget) {
      result = result.filter(r => r.budgetLkr <= filters.maxBudget!);
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }

  public getBudgetRequestById(id: string): BudgetRequest | undefined {
    return this.requests.find(r => r.id === id);
  }

  public createBudgetRequest(request: Omit<BudgetRequest, 'id' | 'offersCount' | 'createdAt' | 'updatedAt'>): BudgetRequest {
    const newReq: BudgetRequest = {
      ...request,
      id: `req-${Date.now()}`,
      offersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.requests.unshift(newReq);
    setStorage('requests', this.requests);
    return newReq;
  }

  public updateBudgetRequest(id: string, updates: Partial<BudgetRequest>): BudgetRequest {
    const idx = this.requests.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Request not found');
    this.requests[idx] = {
      ...this.requests[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorage('requests', this.requests);
    return this.requests[idx];
  }

  // --- OFFERS ---
  public getOffersForRequest(requestId: string): RequestOffer[] {
    return this.offers.filter(o => o.requestId === requestId);
  }

  public getOffersByPhotographer(photographerId: string): RequestOffer[] {
    return this.offers.filter(o => o.photographerId === photographerId);
  }

  public submitOffer(offerData: Omit<RequestOffer, 'id' | 'createdAt' | 'updatedAt'>): RequestOffer {
    // Check for existing offer by this photographer
    const existing = this.offers.find(
      o => o.requestId === offerData.requestId && o.photographerId === offerData.photographerId
    );
    if (existing && existing.status !== 'withdrawn') {
      throw new Error('You have already submitted an offer for this request. You can edit your existing offer instead.');
    }

    const newOffer: RequestOffer = {
      ...offerData,
      id: `off-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.offers.unshift(newOffer);
    setStorage('offers', this.offers);

    // Update request offers count & status
    const req = this.requests.find(r => r.id === offerData.requestId);
    if (req) {
      req.offersCount = (req.offersCount || 0) + 1;
      if (req.status === 'open') {
        req.status = 'offers_received';
      }
      req.updatedAt = new Date().toISOString();
      setStorage('requests', this.requests);
    }

    return newOffer;
  }

  public updateOffer(id: string, updates: Partial<RequestOffer>): RequestOffer {
    const idx = this.offers.findIndex(o => o.id === id);
    if (idx === -1) throw new Error('Offer not found');
    this.offers[idx] = {
      ...this.offers[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorage('offers', this.offers);
    return this.offers[idx];
  }

  // --- CRITICAL WORKFLOW: ACCEPT OFFER & CREATE BOOKING ---
  public acceptOfferAndCreateBooking(requestId: string, offerId: string, clientId: string): Booking {
    const request = this.requests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');
    if (request.clientId !== clientId) throw new Error('Unauthorized: only the request owner can accept an offer');
    if (request.status === 'accepted' || request.status === 'closed') {
      throw new Error('This request has already been accepted or closed.');
    }

    const offer = this.offers.find(o => o.id === offerId && o.requestId === requestId);
    if (!offer) throw new Error('Offer not found');
    if (offer.status !== 'pending') throw new Error('This offer is no longer pending.');

    const eventDate = request.eventDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const startTime = '09:00';
    const duration = offer.durationHours || 4;
    const endHour = 9 + duration;
    const endTime = `${endHour < 10 ? '0' + endHour : endHour}:00`;

    // Check for conflicting confirmed bookings for this photographer on the same date
    const conflicting = this.bookings.find(
      b => b.photographerId === offer.photographerId &&
           b.eventDate === eventDate &&
           b.status === 'confirmed'
    );
    if (conflicting) {
      console.warn(`Photographer already has a confirmed booking on ${eventDate}`);
    }

    // 1. Create Booking
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      clientId: clientId,
      clientName: request.clientName,
      photographerId: offer.photographerId,
      photographerStudio: offer.photographerStudio,
      requestId: requestId,
      offerId: offerId,
      eventTitle: request.title,
      category: request.category,
      location: request.location,
      eventDate: eventDate,
      startTime: startTime,
      endTime: endTime,
      totalAmountLkr: offer.proposedPriceLkr,
      advancePaidLkr: 0,
      outstandingBalanceLkr: offer.proposedPriceLkr,
      status: 'confirmed',
      notes: `Offer accepted from request: ${request.title}. Included: ${offer.deliverables.join(', ')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.bookings.unshift(newBooking);
    setStorage('bookings', this.bookings);

    // 2. Update Request
    request.status = 'accepted';
    request.acceptedOfferId = offerId;
    request.updatedAt = new Date().toISOString();
    setStorage('requests', this.requests);

    // 3. Update Accepted Offer & mark competing offers declined
    this.offers.forEach(o => {
      if (o.requestId === requestId) {
        if (o.id === offerId) {
          o.status = 'accepted';
        } else {
          o.status = 'declined';
        }
        o.updatedAt = new Date().toISOString();
      }
    });
    setStorage('offers', this.offers);

    // 4. Automatically add to Photographer's Calendar
    const newCalEvent: CalendarEvent = {
      id: `cal-${Date.now()}`,
      photographerId: offer.photographerId,
      bookingId: newBooking.id,
      title: `Shoot: ${request.title}`,
      eventType: 'booking',
      startDate: eventDate,
      startTime: startTime,
      endTime: endTime,
      isAllDay: false,
      notes: `Confirmed via accepted offer. Location: ${request.location}`,
      createdAt: new Date().toISOString(),
    };
    this.calendar.push(newCalEvent);
    setStorage('calendar', this.calendar);

    // 5. Automatically create an Editing Workflow project
    const newEditingProject: EditingProject = {
      id: `edit-${Date.now()}`,
      photographerId: offer.photographerId,
      bookingId: newBooking.id,
      clientId: clientId,
      clientName: request.clientName,
      title: `${request.clientName} - ${request.title}`,
      category: request.category,
      eventDate: eventDate,
      expectedDeliverables: offer.deliverables.join('; '),
      priority: 'medium',
      stage: 'shoot_scheduled',
      deadline: new Date(new Date(eventDate).getTime() + 14 * 86400000).toISOString().split('T')[0],
      progressPercentage: 0,
      notes: 'Automatically scheduled from accepted offer.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.editingProjects.unshift(newEditingProject);
    setStorage('editingProjects', this.editingProjects);

    // 6. Ensure Client CRM Record exists for Photographer
    const existingClient = this.clients.find(
      c => c.photographerId === offer.photographerId && c.name === request.clientName
    );
    if (existingClient) {
      existingClient.upcomingBookingsCount += 1;
      existingClient.totalSpentLkr += offer.proposedPriceLkr;
      existingClient.updatedAt = new Date().toISOString();
    } else {
      const newClientRecord: ClientRecord = {
        id: `crm-${Date.now()}`,
        photographerId: offer.photographerId,
        name: request.clientName,
        email: 'client@example.lk',
        phone: '+94 77 000 0000',
        pastBookingsCount: 0,
        upcomingBookingsCount: 1,
        totalSpentLkr: offer.proposedPriceLkr,
        linkedClientId: clientId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.clients.push(newClientRecord);
    }
    setStorage('clients', this.clients);

    return newBooking;
  }

  // --- BOOKINGS ---
  public getBookings(userId: string, role: 'photographer' | 'client' | 'admin'): Booking[] {
    if (role === 'admin') return [...this.bookings];
    if (role === 'photographer') {
      return this.bookings.filter(b => b.photographerId === userId);
    }
    return this.bookings.filter(b => b.clientId === userId);
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  public updateBookingStatus(id: string, status: BookingStatus): Booking {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) throw new Error('Booking not found');
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    setStorage('bookings', this.bookings);
    return booking;
  }

  // --- CALENDAR ---
  public getCalendarEvents(photographerId: string): CalendarEvent[] {
    return this.calendar.filter(e => e.photographerId === photographerId);
  }

  public addCalendarEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'>): CalendarEvent {
    // Conflict check
    if (event.eventType === 'booking') {
      const conflict = this.calendar.find(
        e => e.photographerId === event.photographerId &&
             e.startDate === event.startDate &&
             e.eventType === 'booking'
      );
      if (conflict) {
        console.warn(`Conflict detected with existing event: ${conflict.title}`);
      }
    }

    const newEvent: CalendarEvent = {
      ...event,
      id: `cal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.calendar.push(newEvent);
    setStorage('calendar', this.calendar);
    return newEvent;
  }

  public deleteCalendarEvent(id: string): void {
    this.calendar = this.calendar.filter(e => e.id !== id);
    setStorage('calendar', this.calendar);
  }

  // --- EDITING WORKFLOW ---
  public getEditingProjects(photographerId: string): EditingProject[] {
    return this.editingProjects.filter(p => p.photographerId === photographerId);
  }

  public updateEditingStage(projectId: string, newStage: EditingStage): EditingProject {
    const proj = this.editingProjects.find(p => p.id === projectId);
    if (!proj) throw new Error('Project not found');
    proj.stage = newStage;
    if (newStage === 'final_delivery') {
      proj.progressPercentage = 100;
    } else if (newStage === 'shoot_completed' && proj.progressPercentage < 20) {
      proj.progressPercentage = 20;
    }
    proj.updatedAt = new Date().toISOString();
    setStorage('editingProjects', this.editingProjects);
    return proj;
  }

  public updateEditingProject(id: string, updates: Partial<EditingProject>): EditingProject {
    const idx = this.editingProjects.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Project not found');
    this.editingProjects[idx] = {
      ...this.editingProjects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorage('editingProjects', this.editingProjects);
    return this.editingProjects[idx];
  }

  public addEditingProject(proj: Omit<EditingProject, 'id' | 'createdAt' | 'updatedAt'>): EditingProject {
    const newProj: EditingProject = {
      ...proj,
      id: `edit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.editingProjects.unshift(newProj);
    setStorage('editingProjects', this.editingProjects);
    return newProj;
  }

  // --- CLIENT CRM ---
  public getClients(photographerId: string): ClientRecord[] {
    return this.clients.filter(c => c.photographerId === photographerId);
  }

  public addClientRecord(client: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>): ClientRecord {
    const newClient: ClientRecord = {
      ...client,
      id: `crm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.clients.unshift(newClient);
    setStorage('clients', this.clients);
    return newClient;
  }

  public updateClientRecord(id: string, updates: Partial<ClientRecord>): ClientRecord {
    const idx = this.clients.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Client record not found');
    this.clients[idx] = {
      ...this.clients[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setStorage('clients', this.clients);
    return this.clients[idx];
  }

  // --- FINANCE: PAYMENTS & EXPENSES ---
  public getPayments(photographerId: string): PaymentRecord[] {
    return this.payments.filter(p => p.photographerId === photographerId);
  }

  public addPayment(payment: Omit<PaymentRecord, 'id' | 'createdAt'>): PaymentRecord {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.payments.unshift(newPayment);
    setStorage('payments', this.payments);

    // If linked to a booking, recalculate advance and outstanding balance
    if (payment.bookingId) {
      const booking = this.bookings.find(b => b.id === payment.bookingId);
      if (booking) {
        booking.advancePaidLkr = (booking.advancePaidLkr || 0) + payment.amountLkr;
        booking.outstandingBalanceLkr = Math.max(0, booking.totalAmountLkr - booking.advancePaidLkr);
        booking.updatedAt = new Date().toISOString();
        setStorage('bookings', this.bookings);
      }
    }

    return newPayment;
  }

  public getExpenses(photographerId: string): ExpenseRecord[] {
    return this.expenses.filter(e => e.photographerId === photographerId);
  }

  public addExpense(expense: Omit<ExpenseRecord, 'id' | 'createdAt'>): ExpenseRecord {
    const newExpense: ExpenseRecord = {
      ...expense,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.expenses.unshift(newExpense);
    setStorage('expenses', this.expenses);
    return newExpense;
  }

  // --- REVIEWS ---
  public getReviews(photographerId?: string): Review[] {
    if (photographerId) {
      return this.reviews.filter(r => r.photographerId === photographerId);
    }
    return [...this.reviews];
  }

  public addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.reviews.unshift(newRev);
    setStorage('reviews', this.reviews);

    // Recalculate photographer rating
    const photographer = this.photographers.find(p => p.id === review.photographerId);
    if (photographer) {
      const photoReviews = this.reviews.filter(r => r.photographerId === review.photographerId);
      const total = photoReviews.reduce((sum, r) => sum + r.rating, 0);
      photographer.ratingAvg = parseFloat((total / photoReviews.length).toFixed(2));
      photographer.reviewCount = photoReviews.length;
      setStorage('photographers', this.photographers);
    }

    return newRev;
  }

  // --- CONVERSATIONS & MESSAGING ---
  public getConversations(userId: string): Conversation[] {
    return this.conversations.filter(
      c => c.clientId === userId || c.photographerId === userId || c.participantIds.includes(userId)
    );
  }

  public getMessages(conversationId: string): Message[] {
    return this.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public sendMessage(conversationId: string, senderId: string, senderRole: UserProfile['role'], text: string): Message {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderRole,
      text,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(newMsg);
    setStorage('messages', this.messages);

    // Update conversation
    const convo = this.conversations.find(c => c.id === conversationId);
    if (convo) {
      convo.lastMessageText = text;
      convo.lastMessageAt = newMsg.createdAt;
      if (senderRole === 'client') {
        convo.unreadCountPhotographer = (convo.unreadCountPhotographer || 0) + 1;
      } else {
        convo.unreadCountClient = (convo.unreadCountClient || 0) + 1;
      }
      setStorage('conversations', this.conversations);
    }

    return newMsg;
  }

  public startOrGetConversation(clientId: string, photographerId: string, relatedType: 'direct' | 'request' | 'booking', relatedId?: string): Conversation {
    const existing = this.conversations.find(
      c => c.clientId === clientId && c.photographerId === photographerId
    );
    if (existing) return existing;

    const client = this.users.find(u => u.id === clientId);
    const photo = this.photographers.find(p => p.id === photographerId);

    const newConvo: Conversation = {
      id: `conv-${Date.now()}`,
      participantIds: [clientId, photographerId],
      clientId,
      photographerId,
      clientName: client?.fullName || 'Client',
      clientAvatar: client?.avatarUrl,
      photographerStudio: photo?.studioName || 'Studio',
      photographerAvatar: photo?.avatarUrl,
      relatedType,
      relatedId,
      lastMessageText: 'Conversation started',
      lastMessageAt: new Date().toISOString(),
      unreadCountClient: 0,
      unreadCountPhotographer: 0,
      createdAt: new Date().toISOString(),
    };

    this.conversations.unshift(newConvo);
    setStorage('conversations', this.conversations);
    return newConvo;
  }

  // --- FAVORITES ---
  public getFavorites(): string[] {
    return [...this.favorites];
  }

  public toggleFavorite(photographerId: string): boolean {
    const exists = this.favorites.includes(photographerId);
    if (exists) {
      this.favorites = this.favorites.filter(id => id !== photographerId);
    } else {
      this.favorites.push(photographerId);
    }
    setStorage('favorites', this.favorites);
    return !exists;
  }

  // --- ADMIN REPORTS & USERS ---
  public getReports(): ReportItem[] {
    return [...this.reports];
  }

  public submitReport(report: Omit<ReportItem, 'id' | 'createdAt'>): ReportItem {
    const newReport: ReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.reports.unshift(newReport);
    setStorage('reports', this.reports);
    return newReport;
  }

  public updateReportStatus(id: string, status: 'resolved' | 'dismissed', notes?: string): void {
    const report = this.reports.find(r => r.id === id);
    if (report) {
      report.status = status;
      if (notes) report.notes = notes;
      setStorage('reports', this.reports);
    }
  }
}

export const dataService = new DataService();
