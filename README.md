# CreatorFlow — Photography Marketplace & Studio Management Platform

[![Built with React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue)](https://react.dev/)
[![Styling with Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38bdf8)](https://tailwindcss.com/)
[![Database & Auth](https://img.shields.io/badge/Backend-Supabase%20%2F%20PostgreSQL-3ecf8e)](https://supabase.com/)
[![Currency](https://img.shields.io/badge/Currency-Sri%20Lankan%20Rupees%20(LKR)-amber)](https://creatorflow.lk/)
[![Deployment Target](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

**CreatorFlow** is a modern, responsive full-stack web application designed for the Sri Lankan photography and videography industry. It connects clients with vetted local photographers through a transparent public marketplace and budget bidding system, while equipping photographers with a private, end-to-end **Studio Operating System** to manage contracts, bookings, calendar availability, post-production editing pipelines, private client CRM records, and LKR cash flow.

---

## 1. Core Platform Experiences

### A. Public Photography Marketplace
- **Island-wide Discovery:** Find photographers in Colombo, Kandy, Galle, Negombo, Matara, and Jaffna.
- **Multi-category Filtering:** Weddings, Poruwa rituals, Birthdays, Portraits & Pre-shoots, Events, Commercial, Fashion, and 4K Videography.
- **Transparent LKR Pricing:** Clear package breakdowns with included coverage hours and deliverables.
- **Client Budget Request System:** Clients can submit custom event specifications with target budgets in LKR. Available photographers review requirements and submit binding bids.
- **Direct Chat & Inquiry:** Contact creators without third-party commission markups.

### B. Private Photographer Studio OS (`/studio`)
- **Studio Dashboard Overview:** Live KPI tracking of gross income, pending receivables, active editing jobs, upcoming deadlines, and recent client inquiries.
- **Smart Shoot Calendar:** Month and agenda views with automatic booking linking and **double-booking conflict warnings**.
- **8-Stage Post-Production Kanban Pipeline:**
  1. Shoot Scheduled
  2. Shoot Completed
  3. Sorting & Selection
  4. In Editing
  5. Internal Review
  6. Client Review
  7. Revisions
  8. Final Delivery (with cloud delivery link)
- **Private Client Directory (CRM):** Track client shoot history, total LKR revenue, and private studio notes.
- **LKR Accounting & Ledger:** Record advance deposits, outstanding balance tracking, and operational overhead (gear rentals, second shooter crew, travel tolls).
- **Service Packages CRUD:** Create, edit, and publish tier packages directly to the public marketplace.
- **Portfolio Showcase Manager:** Upload and curate high-resolution visual stories.

### C. Client Management Portal (`/client`)
- **Budget Requests Management:** Save drafts, publish requests, compare photographer bids, and track status.
- **One-Click Offer Acceptance:** Atomically creates a confirmed booking, reserves the photographer's calendar, marks competing bids declined, and schedules the editing project.
- **Direct Messaging Thread:** Chat with photographers with unread badges and timestamps.
- **Verified Review Submission:** Rate and review completed shoots (1–5 stars) to guide future clients.

### D. Superadmin Panel (`/admin`)
- **Platform Analytics:** Real-time metrics on user accounts, verified studios, open requests, and gross booking volume.
- **Photographer Verification:** Inspect business credentials and toggle verified creator badges.
- **Safety & Content Moderation:** Review and resolve community reports regarding copyright, spam, or misleading portfolios.

---

## 2. Technology Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide React icons
- **State & Data Layer:** Unified service layer supporting both **Supabase PostgreSQL** and **zero-config LocalStorage/Mock Mode**
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Realtime, Storage)
- **Form Validation:** React Hook Form + Zod
- **Data Visualizations:** Recharts (monthly gross revenue vs operational costs)
- **Date Utilities:** date-fns

---

## 3. Project Structure

```text
src/
├── assets/                  # Static assets and icons
├── components/
│   ├── layout/              # Navbar, Footer, StudioLayout, ClientLayout, AdminLayout
│   └── ui/                  # Reusable UI primitives
├── features/
│   └── auth/                # AuthContext, session hooks, role switching
├── lib/
│   └── supabase.ts          # Supabase client initialization & connection checks
├── pages/
│   ├── admin/               # Superadmin overview, users, photographers, reports
│   ├── auth/                # Login and Register pages
│   ├── client/              # Client dashboard, requests, offers, bookings, reviews
│   ├── studio/              # Studio overview, calendar, kanban editing, finance, CRM
│   ├── AboutPage.tsx        # Platform mission and story
│   ├── BudgetRequestDetailPage.tsx # Request inspection, offer comparison, acceptance
│   ├── BudgetRequestsPage.tsx      # Open client request browse & filter
│   ├── ContactPage.tsx             # Contact & support
│   ├── CreateBudgetRequestPage.tsx # Request authoring with validation
│   ├── HomePage.tsx                # Hero, categories, features, testimonials
│   ├── PackageDetailPage.tsx       # Package details & direct booking
│   └── PhotographersPage.tsx       # Search and discover verified creators
├── services/
│   ├── dataService.ts       # Unified data persistence and business logic
│   └── mockData.ts          # Realistic Sri Lankan seed data
├── tests/
│   └── workflow.test.ts     # Automated critical workflow assertions
├── types/
│   └── index.ts             # TypeScript domain entity definitions
└── utils/
    └── formatters.ts        # Currency (LKR) and date formatters
supabase/
└── migrations/
    └── 20250101000000_creatorflow_schema.sql # Complete PostgreSQL DDL & RLS policies
```

---

## 4. Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; tested on v24)
- npm (v9 or higher)

### Installation
```bash
# Clone or navigate to the project directory
cd System

# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 5. Development & Demo Mode

CreatorFlow comes equipped with an **instant Demo Mode**. Even if you have not yet set up a Supabase account, the application runs with realistic pre-seeded Sri Lankan creator data:

- **Quick Persona Switcher:** Click the dropdown badge in the header ("Select Role: Demo") to instantly toggle between:
  1. **Avantha Perera (Photographer):** Owner of *Lumina Studios Sri Lanka* (Colombo) with active bookings, editing kanban tasks, and financial income records.
  2. **Kasun Wickramasinghe (Client):** Event host with active requests, received bids, and confirmed bookings.
  3. **CreatorFlow Admin:** Superadmin with platform statistics and moderation queues.
- **Persistent Local Store:** Any created requests, submitted offers, accepted bookings, calendar dates, or financial entries are saved to your browser's `localStorage` across page reloads.
- **Reset Sandbox:** Click "Reset Demo Store" in Studio Settings anytime to restore initial data.

---

## 6. Supabase Database & Production Setup

To connect to a live Supabase project:

1. Create a new project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Set your Supabase project credentials in `.env`:
   ```ini
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Open your Supabase Dashboard -> **SQL Editor** and execute the migration file:
   `supabase/migrations/20250101000000_creatorflow_schema.sql`
5. The migration creates all 19 relational tables, PostgreSQL enums, indexes, and comprehensive **Row Level Security (RLS)** policies:
   - Private client CRM records, payments, and calendar events are restricted strictly to the photographer owner.
   - Private conversations are restricted strictly to message participants and administrators.
   - Includes the atomic database function `accept_offer_and_create_booking` preventing duplicate bookings and race conditions.

---

## 7. Running Automated Workflow Tests

Run the critical test suite to verify atomic booking creation, duplicate prevention, and balance calculations:

```bash
npm test
```

**Test Coverage Highlights:**
- ✓ Budget request creation & LKR storage
- ✓ Offer submission & duplicate offer rejection
- ✓ Atomic offer acceptance & confirmed booking generation
- ✓ Automatic photographer calendar event scheduling
- ✓ Automatic post-production editing workflow task generation
- ✓ 8-stage editing pipeline transition & 100% completion on delivery
- ✓ Accurate advance payment calculation & outstanding balance settlement

---

## 8. Deployment to Vercel

CreatorFlow is pre-configured for Vercel deployment:

1. Push your repository to GitHub / GitLab.
2. In the Vercel Dashboard, click **Add New Project** and select the repository.
3. Configure the Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 9. Feature Status Matrix

| Feature | Status | Notes |
| :--- | :--- | :--- |
| Public Marketplace Discovery & Filters | ✅ Complete | Location (Colombo, Kandy, Galle, etc.), categories, LKR sliders |
| Photographer Portfolio & Lightbox | ✅ Complete | Category galleries, media previews, package links |
| Client Budget Request System | ✅ Complete | Form validation, date-flexible option, deliverables |
| Photographer Bids & Quotations | ✅ Complete | Binding LKR quotes, duplicate offer prevention |
| Atomic Booking & Conflict Warning | ✅ Complete | Double-booking warnings on identical dates |
| Photographer Studio Dashboard | ✅ Complete | Full overview, KPI cards, Recharts financial trends |
| 8-Stage Editing Kanban Board | ✅ Complete | Progress % sliders, stage transitions, cloud delivery links |
| Calendar Availability Manager | ✅ Complete | Month & agenda views, blackout dates, consultations |
| Client CRM & Private Studio Notes | ✅ Complete | Scoped strictly to photographer owner |
| LKR Finance & Ledger | ✅ Complete | Deposit tracking, operational costs, profit margins |
| Client Portal & Reviews | ✅ Complete | Track shoots, rate photographers (1–5 stars) |
| Superadmin Moderation Panel | ✅ Complete | User roles, studio verification, report resolution |
| Supabase Auth & PostgreSQL Migrations | ✅ Complete | Production DDL in `supabase/migrations/` |
| Real Online Card Payment Gateway | ⚠️ Planned (Phase 2) | Manual bank transfer / cash recording supported |
| Automated SMS / WhatsApp Gateway | ⚠️ Planned (Phase 2) | In-app private messaging fully operational |

---

© 2025 CreatorFlow Sri Lanka. Built for creators and clients.
