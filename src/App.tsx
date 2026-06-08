import { Routes, Route, Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./layouts/PublicLayout";
import FrontLayout from "./layouts/FrontLayout";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.tsx";
import ResetPassword from "./pages/Auth/ResetPassword.tsx";
import VerifyEmail from "./pages/Auth/VerifyEmail.tsx";
import TermsOfService from "./pages/Legal/TermsOfService.tsx";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/User/Dashboard.tsx";
import AdminLogin from "./pages/Auth/AdminLogin.tsx";
import PaymentSuccess from "./pages/Subscription/PaymentSuccess.tsx";
import BuySubscription from "./pages/Subscription/BuySubscription.tsx";
import AIChat from "./pages/User/AIChat.tsx";
import AIImageGen from "./pages/User/AIImageGen.tsx";
import SocialMediaStudio from "./pages/User/SocialMediaStudio.tsx";
import PostDetails from "./pages/User/PostDetails.tsx";
import AITools from "./pages/User/AITools.tsx";
import {
  AdminRoute,
  ProtectedRoute,
  PublicRoute,
} from "./components/RouteGuards";
import { AuthProvider } from "./hooks/useAuth.tsx";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/landing-page/HomePage.tsx";
import LandingPage from "./pages/landing-page/LandingPage.tsx";
import Settings from "./pages/User/Settings.tsx";
import BillingHistory from "./pages/User/BillingHistory.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";
import UserManagement from "./pages/Admin/UserManagement.tsx";
import APIManagement from "./pages/Admin/APIManagement.tsx";
import BalanceHistory from "./pages/Admin/BalanceHistory.tsx";
import WebBuilder from "./pages/User/WebBuilder.tsx";
import WebsiteBuilderStudio from "./components/web-builder/WebsiteBuilderStudio.tsx";
import SessionExpiredModal from "./components/SessionExpiredModal.tsx";
import UserDetailsPage from "./pages/Admin/UserDetails.tsx";
import PlanManagement from "./pages/Admin/PlanManagement.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import NinjaLegal from "./pages/User/NinjaLegal.tsx";
import NinjaFinance from "./pages/User/NinjaFinance.tsx";
import NinjaOps from "./pages/User/NinjaOps.tsx";
import AllContracts from "./pages/User/NinjaLegal/AllContracts.tsx";
import AuditLogs from "./pages/User/NinjaLegal/AuditLogs.tsx";
import ContractGenerationPage from "./pages/User/NinjaLegal/ContractGenerationPage.tsx";
import NinjaSales from "./pages/User/NinjaSales/NinjaSales.tsx";
import LeadsPage from "./pages/User/NinjaSales/LeadsPage.tsx";
import ManageTeam from "./pages/User/TeamManagement/ManageTeam.tsx";
import MemberDetails from "./pages/User/TeamManagement/MemberDetails.tsx";
import EditMember from "./pages/User/TeamManagement/EditMember.tsx";
import LeadsPipelinePage from "./pages/User/NinjaSales/LeadsPipelinePage.tsx";
import FollowUpsPage from "./pages/User/NinjaSales/FollowUpsPage.tsx";
import ProposalsPage from "./pages/User/NinjaSales/ProposalsPage.tsx";
import LeadDetailsPage from "./pages/User/NinjaSales/LeadDetailsPage.tsx";
import ProjectsPage from "./pages/User/NinjaSales/ProjectsPage.tsx";
import ProjectDetailsPage from "./pages/User/NinjaSales/ProjectDetailsPage.tsx";
import EditLeadPage from "./pages/User/NinjaSales/EditLeadPage.tsx";
import EditProjectPage from "./pages/User/NinjaSales/EditProjectPage.tsx";
import DocumentDetailsPage from "./pages/User/NinjaSales/DocumentDetailsPage.tsx";
import AllActivitiesPage from "./pages/User/NinjaSales/AllActivitiesPage.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
// import LiveChatWidget from "./components/LiveChatWidget.tsx";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0D0D0D]">
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Layout (Restricted to non-authenticated users) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/:page" element={<LandingPage />} />
          </Route>

          {/* Legal Routes (Accessible to everyone) */}
          <Route
            element={
              <FrontLayout>
                <Outlet />
              </FrontLayout>
            }
          >
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Route>

          {/* Auth Routes (No Layout) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            }
          />
          <Route
            path="/admin/login"
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            }
          />
          <Route path="/buy-subscription" element={<BuySubscription />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          {/* Unsubscribe — public, no auth, accessible directly from email links */}
          <Route path="/unsubscribe" element={<Unsubscribe />} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ComingSoon title="Projects" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <ComingSoon title="Templates" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <ComingSoon title="Community Feed" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools"
            element={
              <ProtectedRoute>
                <AITools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/:toolId"
            element={
              <ProtectedRoute>
                <AITools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/chat"
            element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/image-gen"
            element={
              <ProtectedRoute>
                <AIImageGen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/social-pro"
            element={
              <ProtectedRoute>
                <SocialMediaStudio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/social-pro/post/:id"
            element={
              <ProtectedRoute>
                <PostDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/web-builder"
            element={
              <ProtectedRoute>
                <WebBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/legal"
            element={
              <ProtectedRoute>
                <NinjaLegal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales"
            element={
              <ProtectedRoute>
                <NinjaSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/leads"
            element={
              <ProtectedRoute>
                <LeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/leads/:id"
            element={
              <ProtectedRoute>
                <LeadDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/leads/:id/edit"
            element={
              <ProtectedRoute>
                <EditLeadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/activities"
            element={
              <ProtectedRoute>
                <AllActivitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/pipeline"
            element={
              <ProtectedRoute>
                <LeadsPipelinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/follow-ups"
            element={
              <ProtectedRoute>
                <FollowUpsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/proposals"
            element={
              <ProtectedRoute>
                <ProposalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/projects/:id/edit"
            element={
              <ProtectedRoute>
                <EditProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/sales/documents/:kind/:id"
            element={
              <ProtectedRoute>
                <DocumentDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/finance"
            element={
              <ProtectedRoute>
                <NinjaFinance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/legal/all-contracts"
            element={
              <ProtectedRoute>
                <AllContracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/legal/audit-logs"
            element={
              <ProtectedRoute>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/legal/generate"
            element={
              <ProtectedRoute>
                <ContractGenerationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/ops"
            element={
              <ProtectedRoute>
                <NinjaOps />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-team"
            element={
              <ProtectedRoute>
                <ManageTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-team/:memberId"
            element={
              <ProtectedRoute>
                <MemberDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-team/:memberId/edit"
            element={
              <ProtectedRoute>
                <EditMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/web-builder/new-website"
            element={
              <ProtectedRoute>
                <WebsiteBuilderStudio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing-history"
            element={
              <ProtectedRoute>
                <BillingHistory />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/users/:userId"
            element={
              <AdminRoute>
                <UserDetailsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/api-management"
            element={
              <AdminRoute>
                <APIManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/balance-history/:provider"
            element={
              <AdminRoute>
                <BalanceHistory />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/plans"
            element={
              <AdminRoute>
                <PlanManagement />
              </AdminRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster
          position="top-center"
          containerStyle={{ zIndex: 100000 }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1A1A1A",
              color: "#fff",
              border: "1px solid #333",
              fontSize: "12px",
              width: "auto",
              maxWidth: "100%",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <SessionExpiredModal />
        {/* <LiveChatWidget /> */}
      </div>
    </AuthProvider>
  );
}

export default App;
