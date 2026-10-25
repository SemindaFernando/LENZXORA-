-- LENZXORA Database Schema & Row Level Security Policies
-- Platform: Supabase / PostgreSQL

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('client', 'photographer', 'admin');
CREATE TYPE request_status AS ENUM ('draft', 'open', 'offers_received', 'accepted', 'closed', 'cancelled');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'declined', 'withdrawn', 'expired');
CREATE TYPE booking_status AS ENUM ('tentative', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE calendar_event_type AS ENUM ('booking', 'meeting', 'deadline', 'unavailable', 'personal');
CREATE TYPE editing_stage AS ENUM (
  'shoot_scheduled',
  'shoot_completed',
  'sorting_selection',
  'editing',
  'internal_review',
  'client_review',
  'revisions',
  'final_delivery'
);
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE payment_type AS ENUM ('advance', 'balance', 'full', 'milestone', 'addon');
CREATE TYPE payment_method AS ENUM ('cash', 'bank_transfer', 'card', 'cheque');
CREATE TYPE payment_status AS ENUM ('completed', 'pending');
CREATE TYPE expense_category AS ENUM (
  'equipment',
  'travel',
  'assistant_crew',
  'software_storage',
  'marketing',
  'studio_rent',
  'props_other'
);

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PHOTOGRAPHER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.photographer_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  studio_name TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  location TEXT NOT NULL,
  service_areas TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  starting_price_lkr NUMERIC(12, 2) NOT NULL DEFAULT 15000.00,
  experience_years INT DEFAULT 1,
  website TEXT,
  instagram TEXT,
  phone TEXT,
  equipment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  rating_avg NUMERIC(3, 2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PORTFOLIO ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INT DEFAULT 0,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SERVICE PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.service_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_lkr NUMERIC(12, 2) NOT NULL,
  duration_hours INT NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  includes TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. BUDGET REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.budget_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  budget_lkr NUMERIC(12, 2) NOT NULL,
  event_date DATE,
  is_date_flexible BOOLEAN DEFAULT FALSE,
  duration_hours INT NOT NULL DEFAULT 4,
  required_services TEXT[] DEFAULT '{}',
  expected_deliverables TEXT[] DEFAULT '{}',
  additional_requirements TEXT,
  reference_images TEXT[] DEFAULT '{}',
  status request_status NOT NULL DEFAULT 'open',
  offers_count INT DEFAULT 0,
  accepted_offer_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. REQUEST OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.request_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.budget_requests(id) ON DELETE CASCADE,
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  proposed_price_lkr NUMERIC(12, 2) NOT NULL,
  package_details TEXT NOT NULL,
  duration_hours INT NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  additional_charges NUMERIC(12, 2) DEFAULT 0.00,
  availability_confirmation TEXT NOT NULL,
  message TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  status offer_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_photographer_per_request UNIQUE(request_id, photographer_id)
);

-- Update budget_requests foreign key for accepted_offer_id
ALTER TABLE public.budget_requests 
  ADD CONSTRAINT fk_accepted_offer 
  FOREIGN KEY (accepted_offer_id) 
  REFERENCES public.request_offers(id) 
  ON DELETE SET NULL;

-- 9. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE RESTRICT,
  request_id UUID REFERENCES public.budget_requests(id) ON DELETE SET NULL,
  package_id UUID REFERENCES public.service_packages(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES public.request_offers(id) ON DELETE SET NULL,
  event_title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_amount_lkr NUMERIC(12, 2) NOT NULL,
  advance_paid_lkr NUMERIC(12, 2) DEFAULT 0.00,
  outstanding_balance_lkr NUMERIC(12, 2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'tentative',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. CALENDAR EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_type calendar_event_type NOT NULL DEFAULT 'personal',
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  is_all_day BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. EDITING PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.editing_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  event_date DATE NOT NULL,
  shoot_completed_date DATE,
  expected_deliverables TEXT,
  photo_count INT DEFAULT 0,
  video_count INT DEFAULT 0,
  priority priority_level NOT NULL DEFAULT 'medium',
  stage editing_stage NOT NULL DEFAULT 'shoot_scheduled',
  deadline DATE NOT NULL,
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  notes TEXT,
  delivery_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. EDITING TASKS TABLE
CREATE TABLE IF NOT EXISTS public.editing_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.editing_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. CLIENT CRM RECORDS (Private to Photographer)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  past_bookings_count INT DEFAULT 0,
  upcoming_bookings_count INT DEFAULT 0,
  total_spent_lkr NUMERIC(12, 2) DEFAULT 0.00,
  linked_client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  amount_lkr NUMERIC(12, 2) NOT NULL,
  payment_type payment_type NOT NULL,
  payment_method payment_method NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status payment_status NOT NULL DEFAULT 'completed',
  receipt_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  category expense_category NOT NULL,
  description TEXT NOT NULL,
  amount_lkr NUMERIC(12, 2) NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  related_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  event_category TEXT NOT NULL,
  response_from_photographer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_review_per_booking UNIQUE(booking_id)
);

-- 17. CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  related_type TEXT NOT NULL CHECK (related_type IN ('direct', 'request', 'booking')),
  related_id UUID,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photographer_id UUID NOT NULL REFERENCES public.photographer_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_favorite UNIQUE(client_id, photographer_id)
);

-- 19. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_type TEXT NOT NULL CHECK (reported_type IN ('photographer', 'request', 'portfolio', 'message')),
  reported_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_photographers_location ON public.photographer_profiles(location);
CREATE INDEX IF NOT EXISTS idx_photographers_rating ON public.photographer_profiles(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.budget_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_category ON public.budget_requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_location ON public.budget_requests(location);
CREATE INDEX IF NOT EXISTS idx_offers_request ON public.request_offers(request_id);
CREATE INDEX IF NOT EXISTS idx_bookings_photographer ON public.bookings(photographer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_messages_convo ON public.messages(conversation_id, created_at DESC);

-- 21. FUNCTION: ATOMIC OFFER ACCEPTANCE & BOOKING CREATION
CREATE OR REPLACE FUNCTION public.accept_offer_and_create_booking(
  p_request_id UUID,
  p_offer_id UUID,
  p_client_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_offer RECORD;
  v_request RECORD;
  v_booking_id UUID;
  v_event_date DATE;
BEGIN
  -- 1. Validate request ownership and open status
  SELECT * INTO v_request 
  FROM public.budget_requests 
  WHERE id = p_request_id AND client_id = p_client_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Budget request not found or unauthorized.';
  END IF;

  IF v_request.status = 'accepted' OR v_request.status = 'closed' THEN
    RAISE EXCEPTION 'This budget request has already been accepted or closed.';
  END IF;

  -- 2. Validate offer
  SELECT * INTO v_offer 
  FROM public.request_offers 
  WHERE id = p_offer_id AND request_id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Offer not found for this request.';
  END IF;

  IF v_offer.status != 'pending' THEN
    RAISE EXCEPTION 'This offer is no longer pending.';
  END IF;

  -- Determine event date (fallback to current date + 14 days if undecided)
  v_event_date := COALESCE(v_request.event_date, CURRENT_DATE + INTERVAL '14 days');

  -- 3. Create Booking safely
  INSERT INTO public.bookings (
    client_id,
    photographer_id,
    request_id,
    offer_id,
    event_title,
    category,
    location,
    event_date,
    start_time,
    end_time,
    total_amount_lkr,
    advance_paid_lkr,
    outstanding_balance_lkr,
    status,
    notes
  ) VALUES (
    p_client_id,
    v_offer.photographer_id,
    p_request_id,
    p_offer_id,
    v_request.title,
    v_request.category,
    v_request.location,
    v_event_date,
    '09:00:00'::TIME,
    ('09:00:00'::TIME + (v_offer.duration_hours || ' hours')::INTERVAL)::TIME,
    v_offer.proposed_price_lkr,
    0.00,
    v_offer.proposed_price_lkr,
    'confirmed',
    'Booking confirmed via LENZXORA budget request acceptance.'
  ) RETURNING id INTO v_booking_id;

  -- 4. Update request status and accepted offer
  UPDATE public.budget_requests
  SET status = 'accepted',
      accepted_offer_id = p_offer_id,
      updated_at = NOW()
  WHERE id = p_request_id;

  -- 5. Mark the chosen offer accepted
  UPDATE public.request_offers
  SET status = 'accepted',
      updated_at = NOW()
  WHERE id = p_offer_id;

  -- 6. Mark competing offers declined
  UPDATE public.request_offers
  SET status = 'declined',
      updated_at = NOW()
  WHERE request_id = p_request_id AND id != p_offer_id;

  -- 7. Add automatically to Photographer's Calendar
  INSERT INTO public.calendar_events (
    photographer_id,
    booking_id,
    title,
    event_type,
    start_date,
    start_time,
    end_time,
    notes
  ) VALUES (
    v_offer.photographer_id,
    v_booking_id,
    'Confirmed Shoot: ' || v_request.title,
    'booking',
    v_event_date,
    '09:00:00'::TIME,
    ('09:00:00'::TIME + (v_offer.duration_hours || ' hours')::INTERVAL)::TIME,
    'Auto-scheduled from accepted client request.'
  );

  RETURN v_booking_id;
END;
$$;

-- 22. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photographer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editing_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editing_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Public Profiles: Readable by all authenticated and anon users; editable by profile owner or admin
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Photographer Profiles: Published visible to everyone; editable by photographer or admin
CREATE POLICY "Public read published photographers" ON public.photographer_profiles 
  FOR SELECT USING (published = true OR auth.uid() = id OR public.is_admin());
CREATE POLICY "Photographer can update own profile" ON public.photographer_profiles 
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Photographer can insert own profile" ON public.photographer_profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Portfolio: Public read; manage own items
CREATE POLICY "Public read portfolio" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Photographers manage portfolio" ON public.portfolio_items 
  FOR ALL USING (auth.uid() = photographer_id OR public.is_admin());

-- Packages: Public read; manage own packages
CREATE POLICY "Public read packages" ON public.service_packages FOR SELECT USING (active = true OR auth.uid() = photographer_id);
CREATE POLICY "Photographers manage packages" ON public.service_packages 
  FOR ALL USING (auth.uid() = photographer_id OR public.is_admin());

-- Budget Requests: Public read open requests; clients manage own requests
CREATE POLICY "Public read open requests" ON public.budget_requests 
  FOR SELECT USING (status != 'draft' OR auth.uid() = client_id OR public.is_admin());
CREATE POLICY "Clients create requests" ON public.budget_requests 
  FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients update own requests" ON public.budget_requests 
  FOR UPDATE USING (auth.uid() = client_id OR public.is_admin());

-- Request Offers: Visible to request owner and offer photographer; photographers create/update own offers
CREATE POLICY "View request offers" ON public.request_offers 
  FOR SELECT USING (
    auth.uid() = photographer_id 
    OR auth.uid() IN (SELECT client_id FROM public.budget_requests WHERE id = request_id)
    OR public.is_admin()
  );
CREATE POLICY "Photographers insert offers" ON public.request_offers 
  FOR INSERT WITH CHECK (auth.uid() = photographer_id);
CREATE POLICY "Photographers update own offers" ON public.request_offers 
  FOR UPDATE USING (auth.uid() = photographer_id OR public.is_admin());

-- Bookings: Visible to client and photographer involved
CREATE POLICY "View bookings" ON public.bookings 
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = photographer_id OR public.is_admin());
CREATE POLICY "Manage bookings" ON public.bookings 
  FOR ALL USING (auth.uid() = photographer_id OR auth.uid() = client_id OR public.is_admin());

-- Private Studio Records (Calendar, Projects, Clients, Payments, Expenses): Strictly photographer owner only
CREATE POLICY "Photographer calendar" ON public.calendar_events 
  FOR ALL USING (auth.uid() = photographer_id OR public.is_admin());

CREATE POLICY "Photographer editing projects" ON public.editing_projects 
  FOR ALL USING (auth.uid() = photographer_id OR public.is_admin());

CREATE POLICY "Photographer editing tasks" ON public.editing_tasks 
  FOR ALL USING (
    project_id IN (SELECT id FROM public.editing_projects WHERE photographer_id = auth.uid()) 
    OR public.is_admin()
  );

CREATE POLICY "Photographer private clients" ON public.clients 
  FOR ALL USING (auth.uid() = photographer_id OR public.is_admin());

CREATE POLICY "Photographer payments" ON public.payments 
  FOR ALL USING (auth.uid() = photographer_id OR public.is_admin());

CREATE POLICY "Photographer expenses" ON public.expenses 
  FOR ALL USING (auth.uid() = photographer_id OR public.is_admin());

-- Reviews: Public read; clients insert on own completed bookings
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Clients create reviews" ON public.reviews 
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Conversations & Messages: Participants and Admin only
CREATE POLICY "Conversation participants select" ON public.conversations 
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = photographer_id OR public.is_admin());
CREATE POLICY "Conversation participants insert" ON public.conversations 
  FOR INSERT WITH CHECK (auth.uid() = client_id OR auth.uid() = photographer_id);

CREATE POLICY "Messages participants" ON public.messages 
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM public.conversations 
      WHERE client_id = auth.uid() OR photographer_id = auth.uid()
    ) OR public.is_admin()
  );

-- Favorites: Client's own
CREATE POLICY "Client favorites" ON public.favorites 
  FOR ALL USING (auth.uid() = client_id);

-- Reports: Users create; Admins view and resolve
CREATE POLICY "Users insert reports" ON public.reports 
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins manage reports" ON public.reports 
  FOR ALL USING (public.is_admin());
