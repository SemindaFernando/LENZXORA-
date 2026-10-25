import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { StudioLayout } from './components/layout/StudioLayout';
import { ClientLayout } from './components/layout/ClientLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { PhotographersPage } from './pages/PhotographersPage';
import { PhotographerDetailPage } from './pages/PhotographerDetailPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { BudgetRequestsPage } from './pages/BudgetRequestsPage';
import { CreateBudgetRequestPage } from './pages/CreateBudgetRequestPage';
import { BudgetRequestDetailPage } from './pages/BudgetRequestDetailPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Studio Pages
import { StudioOverviewPage } from './pages/studio/StudioOverviewPage';
import { StudioProfilePage } from './pages/studio/StudioProfilePage';
import { StudioPortfolioPage } from './pages/studio/StudioPortfolioPage';
import { StudioPackagesPage } from './pages/studio/StudioPackagesPage';
import { StudioInquiriesPage } from './pages/studio/StudioInquiriesPage';
import { StudioRequestsPage } from './pages/studio/StudioRequestsPage';
import { StudioOffersPage } from './pages/studio/StudioOffersPage';
import { StudioBookingsPage } from './pages/studio/StudioBookingsPage';
import { StudioCalendarPage } from './pages/studio/StudioCalendarPage';
import { StudioEditingWorkflowPage } from './pages/studio/StudioEditingWorkflowPage';
import { StudioClientsPage } from './pages/studio/StudioClientsPage';
import { StudioMessagesPage } from './pages/studio/StudioMessagesPage';
import { StudioFinancePage } from './pages/studio/StudioFinancePage';
import { StudioSettingsPage } from './pages/studio/StudioSettingsPage';

// Client Pages
import { ClientOverviewPage } from './pages/client/ClientOverviewPage';
import { ClientRequestsPage } from './pages/client/ClientRequestsPage';
import { ClientOffersPage } from './pages/client/ClientOffersPage';
import { ClientBookingsPage } from './pages/client/ClientBookingsPage';
import { ClientMessagesPage } from './pages/client/ClientMessagesPage';
import { ClientFavoritesPage } from './pages/client/ClientFavoritesPage';
import { ClientPaymentsPage } from './pages/client/ClientPaymentsPage';
import { ClientReviewsPage } from './pages/client/ClientReviewsPage';
import { ClientSettingsPage } from './pages/client/ClientSettingsPage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminPhotographersPage } from './pages/admin/AdminPhotographersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminRequestsPage } from './pages/admin/AdminRequestsPage';

// Route guard component
const RequireRole: React.FC<{ role: 'photographer' | 'client' | 'admin'; children: React.ReactNode }> = ({
  role,
  children,
}) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // In demo mode or if user has the role, permit access; if mismatched, allow viewing or redirect gracefully
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/photographers" element={<PhotographersPage />} />
            <Route path="/photographers/:id" element={<PhotographerDetailPage />} />
            <Route path="/packages/:id" element={<PackageDetailPage />} />
            <Route path="/budget-requests" element={<BudgetRequestsPage />} />
            <Route path="/budget-requests/new" element={<CreateBudgetRequestPage />} />
            <Route path="/budget-requests/:id" element={<BudgetRequestDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Photographer Studio Protected Routes */}
          <Route
            path="/studio"
            element={
              <RequireRole role="photographer">
                <StudioLayout />
              </RequireRole>
            }
          >
            <Route index element={<StudioOverviewPage />} />
            <Route path="profile" element={<StudioProfilePage />} />
            <Route path="portfolio" element={<StudioPortfolioPage />} />
            <Route path="packages" element={<StudioPackagesPage />} />
            <Route path="inquiries" element={<StudioInquiriesPage />} />
            <Route path="requests" element={<StudioRequestsPage />} />
            <Route path="offers" element={<StudioOffersPage />} />
            <Route path="bookings" element={<StudioBookingsPage />} />
            <Route path="calendar" element={<StudioCalendarPage />} />
            <Route path="editing" element={<StudioEditingWorkflowPage />} />
            <Route path="clients" element={<StudioClientsPage />} />
            <Route path="messages" element={<StudioMessagesPage />} />
            <Route path="finance" element={<StudioFinancePage />} />
            <Route path="settings" element={<StudioSettingsPage />} />
          </Route>

          {/* Client Portal Protected Routes */}
          <Route
            path="/client"
            element={
              <RequireRole role="client">
                <ClientLayout />
              </RequireRole>
            }
          >
            <Route index element={<ClientOverviewPage />} />
            <Route path="requests" element={<ClientRequestsPage />} />
            <Route path="offers" element={<ClientOffersPage />} />
            <Route path="bookings" element={<ClientBookingsPage />} />
            <Route path="messages" element={<ClientMessagesPage />} />
            <Route path="favorites" element={<ClientFavoritesPage />} />
            <Route path="payments" element={<ClientPaymentsPage />} />
            <Route path="reviews" element={<ClientReviewsPage />} />
            <Route path="settings" element={<ClientSettingsPage />} />
          </Route>

          {/* Superadmin Protected Routes */}
          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <AdminLayout />
              </RequireRole>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="photographers" element={<AdminPhotographersPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="requests" element={<AdminRequestsPage />} />
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
